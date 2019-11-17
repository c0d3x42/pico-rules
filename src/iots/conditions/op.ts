import * as t from "io-ts";
import { PicoAndCondition, PicoOrCondition, PicoConditionEquality, PicoConditionLike } from ".";

export interface OpCondition {
  op: string;
}

export const OpCondition = t.type({
  op: t.string,
});

export interface OpConditions {
  op: string;
  conditions: Array<PicoAndCondition | PicoOrCondition | PicoConditionEquality | PicoConditionLike>;
}

export type AllConditionTypes = Array<PicoAndCondition | PicoOrCondition | PicoConditionEquality | PicoConditionLike>;

export const AllConditionTypes: t.Type<AllConditionTypes> = t.recursion("AllConditionTypes", () =>
  t.array(t.union([PicoAndCondition, PicoOrCondition, PicoConditionEquality, PicoConditionLike]))
);
