import "reflect-metadata";

import { inspect } from "util";

import { EngineManager } from "./pico";
import { Context } from "./pico/context";
import { FsProvider } from "./providers";
import { interval, timer } from "rxjs";
import { map, switchMap } from "rxjs/operators";

const ruleDoc = {
  label: "some rule",
  if: [
    { op: "like", token: "summary", value: "(?<first>[a-z]+) (?<second>[a-z]+)" },
    { op: "eq", token: "node", value: "localhost", lop: 1 },
    {
      op: "list",
      conditions: [{ op: "list", traversal: "and", conditions: [{ op: "eq", token: "group", value: "production" }] }],
    },
  ],
  then: [
    { act: "setvar", varName: "pop", varValue: "john" },
    { act: "template", varName: "popppy", template: "from node {{node}}" },
    {
      act: "rule",
      rule: { label: "subrule", if: [{ op: "eq", token: "customer", value: "GM" }], then: [], else: [] },
    },
  ],
  else: [],
};

const picoRules = { main: [ruleDoc] };

const fsp = new FsProvider({ filepath: "rules.json" });

const m = new EngineManager(fsp.emit());
m.load().subscribe(ctxOut => {
  // @ts-ignore
  if (ctxOut.tokens.get("counter") % 1000000 === 0) {
    console.log("OUTPUT ", ctxOut.tokens.get("counter"));
    console.log("OUTPUT ", ctxOut.tokens);
    console.log("marker " + new Date().toTimeString());
  }
});

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
const source = interval(20);
source.subscribe(t => {
  console.log("START " + new Date().toTimeString());
  for (let i = 1; i < 10000000; i++) {
    context.tokens.set("counter", "" + i);
    m.exec(context);
  }
  console.log("end " + new Date().getTime());
});

//em.load(picoRules).then(engine => {
/*
em.loadFromFile("rules.json").subscribe(
  engine => {
    let context = new Context();
    context.tokens.set("node", "localhost");
    context.tokens.set("summary", "hello world");

    engine.exec(context);
    console.log("CTX tokens: ", Object.fromEntries(context.tokens));
    console.log("CTX locals: ", Object.fromEntries(context.locals));
  },
  err => {
    console.log("failure", err);
  },
  () => {
    console.log("COMPLETED");
  }
);
*/
/*
const fp = new FsProvider("rules.json");

fp.emit().subscribe(f => {
  console.log("loaded file", f);
});
*/
