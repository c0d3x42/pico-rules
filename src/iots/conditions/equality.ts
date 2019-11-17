import * as t from "io-ts";

import { OpCondition } from "./op";

export interface PicoConditionEquality extends OpCondition {
  op: "eq";
  token: string;
  value: string;
}

export const PicoConditionEquality: t.Type<PicoConditionEquality> = t.intersection([
  OpCondition,
  t.type(
    {
      op: t.literal("eq"),
      token: t.string,
      value: t.string,
    },
    "PicoConditionEquality"
  ),
]);
