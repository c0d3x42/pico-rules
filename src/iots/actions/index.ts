import * as t from "io-ts";
import { PicoActionSetVar } from "./setvar";
import { PicoActionRule } from "../rules";

export { PicoActionSetVar, PicoActionRule };

//export const PicoAction = t.union([PicoActionRule, PicoActionSetVar]);
export const PicoAction: t.Type<PicoActionRule | PicoActionSetVar> = t.recursion("PicoAction", () =>
  t.union([PicoActionRule, PicoActionSetVar])
);
export type PicoAction = t.TypeOf<typeof PicoAction>;

export const PicoActionCollection = t.array(PicoAction);
export type PicoActionCollection = t.TypeOf<typeof PicoActionCollection>;
