import * as t from "io-ts";

import { OpCondition } from "./op";

export interface PicoConditionLike extends OpCondition {
  op: "like";
  token: string;
  value: string;
}
export const PicoConditionLike: t.Type<PicoConditionLike> = t.intersection([
  OpCondition,
  t.type(
    {
      op: t.literal("like"),
      token: t.string,
      value: t.string,
    },
    "PicoConditionLike"
  ),
]);
