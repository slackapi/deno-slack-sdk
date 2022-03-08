import { TriggerConfig } from "./types.ts";
import { BaseTrigger } from "./triggers.ts";
import { TriggerEventTypeValues, TriggerTypeValues } from "./base-types.ts";
export const DefineTrigger = <
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
>(
  key: string,
  config: TriggerConfig<TriggerType, TriggerEventType>,
): BaseTrigger<TriggerType, TriggerEventType> => {
  return new BaseTrigger({ key, config });
};
