import { ParameterVariableType } from "../../parameters/mod.ts";
import Schema from "../../schema/mod.ts";
import {
  BaseTriggerConfig,
  TriggerTypes,
  TriggerTypeValues,
} from "../base-types.ts";
import { WrapTriggerContextDataPayload } from "../context-helper.ts";

export const FrequencyType = {
  Weekly: "weekly",
  Daily: "daily",
  Monthly: "monthly",
  Yearly: "yearly",
} as const;

export const Weekday = {
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday",
} as const;

export type FrequencyTypeValues =
  typeof FrequencyType[keyof typeof FrequencyType];
export type WeekdayValues = keyof typeof Weekday;

export type ScheduleConfig<T extends TriggerTypeValues> =
  & BaseTriggerConfig<T>
  & {
    type: typeof TriggerTypes.Scheduled;
    schedule: {
      start_time: string;
      timezone?: string;
      occurrence_count?: number;
      end_time?: string;
      frequency?: {
        type: FrequencyTypeValues;
        on_days?: WeekdayValues[];
        repeats_every?: number;
        on_week_num?: number;
      };
    };
  };

// These define the trigger-specific context objects/types used in a trigger's withInputs function
export const ScheduleContextDefinition = WrapTriggerContextDataPayload({
  "user_id": {
    type: Schema.slack.types.user_id,
    description: "The user who scheduled the trigger",
  },
}, false);

export type ScheduleContext = {
  [key in keyof typeof ScheduleContextDefinition]: ParameterVariableType<
    typeof ScheduleContextDefinition[key]
  >;
};
