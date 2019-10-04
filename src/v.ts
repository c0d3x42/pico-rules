import { PicoValidator } from "./pico/validator";

const p = new PicoValidator("/home/vince/Panther/pico-rules/src/pico/schemas");

const r = require("../rules.json");
p.validateMe(r);
