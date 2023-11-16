
import init, { greet } from "./pkg/wasm_rust.js";
init().then(() => {

  greet("WebAssembly");
});
