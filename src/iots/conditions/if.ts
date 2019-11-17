import * as t from "io-ts";
import { PicoAndCondition } from "./and";
import { PicoOrCondition } from "./or";
import { PicoConditionEquality, PicoConditionLike } from ".";

export const PicoIfConditionMany = t.union([PicoOrCondition, PicoAndCondition]);
export const PicoIfConditionSingle = t.union([PicoConditionEquality, PicoConditionLike]);

export const PicoIfCondition = t.union([PicoIfConditionMany, PicoIfConditionSingle]);

export type PicoIfCondition = t.TypeOf<typeof PicoIfCondition>;
