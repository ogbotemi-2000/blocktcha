#![cfg(test)]

use super::*;
use soroban_sdk::{symbol_short, Env, Bytes};

#[test]
fn test() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Contract);
    let client = ContractClient::new(&env, &contract_id);


    // assert_eq!(
    //     (),
    //     client.test(&Bytes::from_slice(&env, address.as_bytes()), &Bytes::from_slice(&env, author.as_bytes()), &true)
    // );
}
