use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
  pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str){
  alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Universe {
    k: f64,
    electronQ: f64,
}

#[wasm_bindgen]
impl Universe {
    pub fn coulomb(distance: f64, q1: f64, q2: f64) -> f64 {
        let k: f64 = 8.9876;
        let electronQ: f64 = 1.602;
        (k.powf(9.0)*(q1*electronQ.powf(-19.0))*(q2*electronQ.powf(-19.0)))/distance.powf(2.0)
    }
}
