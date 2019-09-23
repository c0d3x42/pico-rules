import "reflect-metadata";

import { container } from "./pico/inversify.config";

import { classToPlain, plainToClassFromExist } from "class-transformer";
import { inspect } from "util";
import { validate } from "class-validator";

import { EngineManager } from "./pico";
import { Context } from "./pico/context";
import { TYPES } from "./pico/types";
import { Engine } from "./pico/interfaces";

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
em.load(picoRules).then(engine => {
  let context = new Context();
  context.tokens.set("node", "localhost");
  context.tokens.set("summary", "hello world");

  engine.exec(context);
  console.log("CTX tokens: ", Object.fromEntries(context.tokens));
  console.log("CTX locals: ", Object.fromEntries(context.locals));
});
