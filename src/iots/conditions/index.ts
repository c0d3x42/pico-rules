import * as t from "io-ts";

import { PicoConditionEquality } from "./equality";
import { PicoConditionLike } from "./like";
import { PicoConditionList } from "./list";

import { PicoAndCondition } from "./and";
import { PicoOrCondition } from "./or";

import { PicoIfCondition } from "./if";

export {
  PicoConditionEquality,
  PicoConditionLike,
  PicoConditionList,
  PicoAndCondition,
  PicoOrCondition,
  PicoIfCondition
};

export const PicoCondition = t.union([PicoConditionEquality, PicoConditionLike, PicoConditionList]);
export const PicoConditionCollection = t.array(PicoCondition);
