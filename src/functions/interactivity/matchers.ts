import type {
  BasicConstraintField,
  BlockActionConstraintObject,
} from "./types.ts";
import type { BlockAction } from "./block_kit_types.ts";
import type { View } from "./view_types.ts";

export function normalizeConstraintToArray(constraint: BasicConstraintField) {
  if (typeof constraint === "string") {
    constraint = [constraint];
  }
  return constraint;
}

export function matchBasicConstraintField(
  constraint: BasicConstraintField,
  field: keyof BlockActionConstraintObject | "callback_id",
  payload: BlockAction | View,
) {
  if (constraint instanceof RegExp) {
    if (payload[field].match(constraint)) {
      return true;
    }
  } else if (constraint instanceof Array) {
    for (let j = 0; j < constraint.length; j++) {
      const c = constraint[j];
      if (payload[field] === c) {
        return true;
      }
    }
  }
  return false;
}
