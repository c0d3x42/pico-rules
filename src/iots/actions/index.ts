import * as t from "io-ts";
import { PicoActionSetVar } from "./setvar";
import { PicoActionRule } from "./rule";

export { PicoActionSetVar, PicoActionRule };

//export const PicoAction = t.union([PicoActionRule, PicoActionSetVar]);
export const PicoAction: t.Type<PicoActionRule | PicoActionSetVar> = t.recursion("PicoAction", () =>
  t.union([PicoActionRule, PicoActionSetVar])
);

export type PicoActionCollection = Array<PicoActionRule | PicoActionSetVar>;

export const PicoActionCollection: t.Type<PicoActionCollection> = t.recursion("PicoActionCollection", () =>
  t.array(t.union([PicoActionRule, PicoActionSetVar]))
);
