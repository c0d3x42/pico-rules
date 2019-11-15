import "reflect-metadata";

import { FsProvider } from "./providers";
import { SyncManager } from "./pico/sync.manager";
import { interval } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { Context } from "./pico/context";

const fsp = new FsProvider({ filepath: "rules.json" });
const manager = new SyncManager();

const start = async () => {
  const jsonRules = await fsp.load();
  await manager.load(jsonRules);

  return manager;
};

start().then(manager => {
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
