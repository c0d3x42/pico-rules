import "reflect-metadata";

import { inspect } from "util";

import { EngineManager } from "./pico";
import { Context } from "./pico/context";
import { FsProvider } from "./providers/fs-provider";

const ruleDoc = {
  label: "some rule",
  if: [
    { op: "like", token: "summary", value: "(?<first>[a-z]+) (?<second>[a-z]+)" },
    { op: "eq", token: "node", value: "localhost", lop: 1 },
    {
      op: "list",
      conditions: [{ op: "list", traversal: "and", conditions: [{ op: "eq", token: "group", value: "production" }] }]
    }
  ],
  then: [
    { act: "setvar", varName: "pop", varValue: "john" },
    { act: "template", varName: "popppy", template: "from node {{node}}" },
    {
      act: "rule",
      rule: { label: "subrule", if: [{ op: "eq", token: "customer", value: "GM" }], then: [], else: [] }
    }
  ],
  else: []
};

const picoRules = { main: [ruleDoc] };

const em = new EngineManager();
//em.load(picoRules).then(engine => {
em.loadFromFile("rules.json")
  .then(engine => {
    let context = new Context();
    context.tokens.set("node", "localhost");
    context.tokens.set("summary", "hello world");

    engine.exec(context);
    console.log("CTX tokens: ", Object.fromEntries(context.tokens));
    console.log("CTX locals: ", Object.fromEntries(context.locals));
  })
  .catch(err => {
    console.log("Errors ", err);
  });
/*
const fp = new FsProvider("rules.json");

fp.emit().subscribe(f => {
  console.log("loaded file", f);
});
*/
