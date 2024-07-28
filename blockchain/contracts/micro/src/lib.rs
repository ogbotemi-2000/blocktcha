#![no_std]

use soroban_sdk::{contracttype, contract, contractimpl, Env, Address, Vec, vec};
use crate::extend_ttl::{extend_high, extend};
use crate::store::{read_balance, write_balance, Store};

#[derive(Clone)]
#[contracttype]
pub struct AccountData {
    pub balance: i128,
    pub trxes: i128,
    pub t_stamps: Vec<u64>,
}

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {

    pub fn register(env: Env, addr: Address) -> (Address, Option<AccountData>) {
        let account : Option<AccountData> = env.storage().persistent().get(&addr);
        match &account {
          Some(_ac) =>{

          }
          None =>{
            env.storage().persistent().set(&addr, &AccountData {
              balance: 0,
              trxes: 0,
              t_stamps: vec![&env, env.ledger().timestamp()],
            });
          }
        };
        (addr, account)
    }
    pub fn receive(env: Env, addr: Address, amount: i128) { 
        if amount < 0 {
            panic!("Negative amounts are disallowed {}", amount)
        }
        addr.require_auth();
        extend(&env);
        read_balance(&env, &addr, &amount, |env: &Env, addr: &Address, balance: &i128| {
            write_balance(env, addr, balance);
            extend_high(env, addr)
        });
    }
    
    pub fn store(env: Env, addr: Address) -> bool {
        Store::has(&env, &addr)
    }
}

mod test;

mod extend_ttl;

mod store;