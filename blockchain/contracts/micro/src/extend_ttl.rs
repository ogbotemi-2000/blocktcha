
use soroban_sdk::{Address, Env};

/*  From the documentation: https://developers.stellar.org/docs/build/smart-contracts/getting-started/storing-data#managing-contract-data-ttls-with-extend_ttl

    Ledger extended by | TTL (Approximate)
  ------------------------------------
    100 Ledgers        | 500 seconds

  The above is equivalent to 1 Ledger for every 5 seconds

            | How many in 1 day
  --------------------------------
  1 second  | 24 * 60 * 60
  5 seconds | (24*60*60)/5 = 17280

  Therefore, an approximate TTL of a day is obtained by extending the contract data by 17280 Ledgers
*/

const DAY_IN_LEDGERS: u32 = 17280;
const INSTANCE_BUMP_AMOUNT: u32 = 7 * DAY_IN_LEDGERS;
const INSTANCE_LIFETIME_THRESHOLD: u32 = INSTANCE_BUMP_AMOUNT - DAY_IN_LEDGERS;

const BALANCE_BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS;
const BALANCE_LIFETIME_THRESHOLD: u32 = BALANCE_BUMP_AMOUNT - DAY_IN_LEDGERS;

pub fn extend(env: &Env) {
  env.storage()
  .instance()
  .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT)
}

pub fn extend_high(env: &Env, key: &Address) {
  env.storage().persistent()
  .extend_ttl(&key, BALANCE_LIFETIME_THRESHOLD, BALANCE_BUMP_AMOUNT)
}