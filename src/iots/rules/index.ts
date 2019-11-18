import * as t from "io-ts";
import { UUID } from "io-ts-types/lib/UUID";

import { PicoIfCondition } from "../conditions";
import { PicoActionCollection } from "../actions";

export interface Rule {
  uuid: (UUID | string) | undefined;
  label: string;
  if: PicoIfCondition;
  then: PicoActionCollection;
  else: PicoActionCollection;
}

export const Rule: t.Type<Rule> = t.recursion("Rule", () =>
  t.interface({
    //uuid: t.union([UUID, t.string]),
    uuid: t.union([t.union([UUID, t.string]), t.undefined]),
    label: t.string,
    if: PicoIfCondition,
    then: PicoActionCollection,
    else: PicoActionCollection
  })
);

export type RuleType = t.TypeOf<typeof Rule>;
