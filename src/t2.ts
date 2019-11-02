import "reflect-metadata";

import { FsProvider } from "./providers";
import { Manager } from "./pico/manager";
import { interval } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { Context } from "./pico/context";

const fsp = new FsProvider({ filepath: "rules.json" });
const manager = new Manager(fsp.emit());

const source = interval(1000);

const ctxs$ = source.pipe(
  map(num => {
    const ctx = new Context();
    ctx.tokens.set("counter", "" + num);
    ctx.tokens.set("summary", "one two");
    ctx.tokens.set("customer", "GM");
    return ctx;
  })
);

manager.run(ctxs$);
