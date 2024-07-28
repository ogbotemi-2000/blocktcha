use soroban_sdk::{Env, Address};
use crate::extend_ttl::extend_high;


pub fn read_balance(env: &Env, addr: &Address, amount: &i128, upon_read:fn(&Env, &Address, &i128)) {
    let balance = env.storage().persistent().get(&addr).unwrap_or(0);
    if balance > 0 {
        /* only consider extending the TTL if a balance exists */
        extend_high(env, &addr)
    }
    let new = balance + amount;
    upon_read(env, addr, &new);
}

pub fn write_balance(env: &Env, addr: &Address, amount: &i128) {
  env.storage().persistent().set(addr, amount) 
}

/** The struct below defaults to using temporary storage over persistent,
 * the latter which is only checked if the data to be checked, gotten or stored
 * has been cleared when the maximum TTL of a day is exceeded in the ledger for the
 * stored data
 */
pub struct Store;

impl Store {

    pub fn has(env: &Env, addr: &Address) -> bool {
        if env.storage().temporary().has(&addr) {
            return true;
        } else {
           if env.storage().persistent().has(&addr) {
             return true;
           } else {
            // totally absent
            return false;
           }
        }
    }
    pub fn get(env: Env, addr: Address) {
        
    }
    pub fn set(env: Env, addr: Address) {

    }
}