#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Symbol, Env, log};

const T: Symbol = symbol_short!("TIME");

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn t_watch(env: Env) {
      let t = env.ledger().timestamp();
      let ot = env.storage().instance().get(&T).unwrap_or(t);
        
      log!(&env, "::ELAPSED:: {} seconds", t - ot);
      env.storage().instance().set(&T, &t);
      env.storage().instance().extend_ttl(100, 100)
    }
}
