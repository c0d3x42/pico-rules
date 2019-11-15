import "reflect-metadata";

import { FsProvider } from "./providers";
import { SyncManager } from "./pico/sync.manager";
import { interval } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { Context } from "./pico/context";

const fsp = new FsProvider({ filepath: "rules.json" });

fsp
  .load()
  .then(jsonRules => {
    const manager = new SyncManager();
    return manager.load(jsonRules).then(_ => {
      return manager;
    });
  })
  .then(manager => {
    manager.events$.subscribe(managerEvent => {
      console.log("Got manager event", managerEvent);
    });

    const ctx = new Context();
    ctx.tokens.set("counter", "");
    ctx.tokens.set("summary", "one two");
    ctx.tokens.set("customer", "GM");

    const ctxOut = manager.exec(ctx);

    console.log("CTXOUT = ", ctxOut.tokensToJson());
  });
