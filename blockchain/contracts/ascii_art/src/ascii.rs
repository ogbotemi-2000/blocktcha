#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, String, Address, Map, log};

fn convert_to_ascii(mut number: u32) -> [u8; 4] {
    let mut buffer = [b'-'; 4];

    for i in (0..4).rev() {
        buffer[i] = (number % 10) as u8 + b'0';
        number /= 10;
        if number == 0 {
            break;
        }
    }

    buffer
}

#[derive(Clone)]
#[contracttype]
pub struct Picture {
    pub number: u32,
    pub author: String,
    pub canvas: String,
}

#[contracttype]
pub enum Key {
    Cursor,
    Owner(u32),
    Author(String),
    Authors,
    Picture(u32),
}

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn mint(env: Env, canvas: String, owner: Address, author: String) -> Option<String> {
        // owner.require_auth();

        if env.storage().persistent().has(&Key::Author(author.clone())) {
            log!(&env, "Author {} can only mint 1 picture.", author);

            return None;
        }
        
        let number: u32 = env.storage().instance().get(&Key::Cursor).unwrap_or(1);

        log!(&env, "Minting canvas as picture #{} by {}.", number, author.clone());
        
        let mut cells: [u8; 30] = [0; 30];
        canvas.copy_into_slice(&mut cells);

        let canvas_length = 9;
        let mut canvas: [u8; 81] = [0; 81];
        let mut framed_canvas: [u8; 91] = [b'#'; 91];

        // 
        for y in 0..9 {
            framed_canvas[y * (canvas_length + 1)] = b'\n';
            
            match y {
                0 | 1 | 7 | 8 => {
                    let fill = match y {
                        0 | 8 => "+-------+".as_bytes(),
                        1 | 7 => "|       |".as_bytes(),
                        _ => panic!("Never going to happen!"),
                    };
                    
                    canvas[
                        (y * canvas_length)..((y + 1) * canvas_length)
                    ].copy_from_slice(fill);
                    framed_canvas[
                        (y * canvas_length + (y + 1) * 1)..((y + 1) * canvas_length + (y + 1) * 1)
                    ].copy_from_slice(fill);
                }
                _ => {
                    for x in 0..9 {
                        let index = y * 9 + x;
                        match x {
                            0 | 8 => canvas[index] = b'|',
                            1 | 7 => canvas[index] = b' ',
                            _ => {
                                let cell = cells[(y - 2) * 6 + x - 2];

                                canvas[index] = match cell {
                                    b'.' => b' ',
                                    _ => cell,
                                }
                            },
                        }
                        framed_canvas[y * 10 + x + 1] = canvas[index];
                    }
                },
            }
        }

        framed_canvas[86..90].copy_from_slice(&convert_to_ascii(number));
        framed_canvas[90] = b'\n';
        
        let framed_canvas = String::from_bytes(&env, &framed_canvas);

        let picture = Picture {
            number: number,
            author: author,
            canvas: framed_canvas.clone(),
        };
        
        // Store picture.
        env.storage().persistent().set(&Key::Picture(picture.number), &picture);
        env.storage().persistent().set(&Key::Owner(picture.number), &owner);
        env.storage().persistent().set(&Key::Author(picture.author.clone()), &picture.number);

        // Add it to the list of authors.
        let mut authors: Map<u32, String> = env.storage().persistent().get(&Key::Authors)
            .unwrap_or(Map::new(&env));
        authors.set(picture.number, picture.author.clone());
        env.storage().persistent().set(&Key::Authors, &authors);

        // Increment cursor for next mint.
        env.storage().instance().set(&Key::Cursor, &(number + 1));

        Some(framed_canvas)
    }
    pub fn get_list(env: Env) -> Map<u32, String> {
        env.storage().persistent().get(&Key::Authors)
            .unwrap_or(Map::new(&env))
    }
    pub fn get_owner(env: Env, picture: u32) -> Option<Address> {
        env.storage().persistent().get(&Key::Owner(picture))
    }
    pub fn get_picture(env: Env, picture: u32) -> Option<Picture> {
        env.storage().persistent().get(&Key::Picture(picture))
    }
    pub fn get_picture_by(env: Env, author: String) -> Option<Picture> {
        let number: Option<u32> = env.storage().persistent().get(&Key::Author(author));
        
        if let Some(number) = number {
            env.storage().persistent().get(&Key::Picture(number))
        } else {
            None
        }
    }
}
