#![no_std]

extern crate eng_wasm;
extern crate eng_wasm_derive;
extern crate serde;

use eng_wasm::*;
use eng_wasm_derive::pub_interface;
use serde::{Serialize, Deserialize};

static DATASETS: &str = "datasets";

#[derive(Serialize, Deserialize)]
pub struct Dataset {
    phone: String,
    email: String,
}

pub struct Contract;

// Private functions accessible only by the secret contract
impl Contract {
    fn get_datasets() -> Vec<Dataset> { read_state!(DATASETS).unwrap_or_default() }
}

// Public trait defining public-facing secret contract functions
#[pub_interface]
pub trait ContractInterface {
    fn add_dataset(phone: String, email: String) -> bool;
}

impl ContractInterface for Contract {
    #[no_mangle]
    fn add_dataset(phone: String, email: String) -> bool {
        let mut datasets = Self::get_datasets();
        let mut result = false;

        if datasets.len() > 0 {
            let dataset = &datasets[datasets.len() - 1];
            if dataset.phone == phone && dataset.email == email {
                result = true;
            }
        }

        datasets.push(Dataset {
            phone,
            email,
        });
        write_state!(DATASETS => datasets);

        result
    }
}
