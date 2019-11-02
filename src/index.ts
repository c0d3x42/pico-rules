import "reflect-metadata";

import { inspect } from "util";

import { EngineManager } from "./pico";
import { Context } from "./pico/context";
import { FsProvider } from "./providers";
import { interval, from } from "rxjs";

const fsp = new FsProvider({ filepath: "rules.json" });

const m = new EngineManager(fsp.emit());
m.load().subscribe(
  ctxOut => {
    // @ts-ignore
    if (ctxOut.tokens.get("counter") % 10 === 0) {
      console.log("OUTPUT ", ctxOut.tokens.get("counter"));
      console.log("OUTPUT ", ctxOut.tokens);
      console.log("marker " + new Date().toTimeString());
    }
    ctxOut.dump();
  },
  err => {
    console.log("ERRRR", inspect(err, false, 15));
  }
);

let context = new Context();
context.tokens.set("node", "localhost");
context.tokens.set("summary", "hello world");
/*
const i$ = interval(1);
i$.pipe(
  map(i => {
    context.tokens.set("counter", "" + i);
    m.exec(context);
  })
).subscribe();
*/
//const source = interval(200);
const source = from([1, 2, 3]);
source.subscribe(t => {
  console.log("START " + new Date().toTimeString());

  for (let i = 1; i < 2; i++) {
    context.tokens.clear();
    context.tokens.set("node", "localhost");
    context.tokens.set("summary", "hello world");
    context.tokens.set("counter", "" + i);
    m.exec(context);
    context.dump();
  }
  console.log("end " + new Date().getTime());
});
