import SlackEvents from "../schema/slack/events/mod.ts";
import { TriggerFilter } from "../triggers/trigger-filter.ts";

export const TriggerTypes = {
  Shortcut: "shortcut",
  MessageShortcut: "message_shortcut",
  Event: "event",
  Webhook: "webhook",
  Scheduled: "scheduled",
} as const;

export type TriggerTypeValues = typeof TriggerTypes[keyof typeof TriggerTypes];

export type Trigger = {
  // This will ensure it's one of the string values of TriggerTypes
  type: TriggerTypeValues;
  "function_reference": string;
  inputs?: {
    [key: string]: {
      value: unknown;
    };
  };
  filter?: TriggerFilter;
  "channel_ids"?: string[];
  // This accounts for a bunch of trigger-specific props that can be present
  // TODO: decide if we should create explicit types for each trigger type and their structures, or keep it flexible/generic like this
  [key: string]: unknown;
};

export type TriggerAccess = {
  "user_ids"?: string[];
};

export type BaseTriggerConfig<T extends TriggerTypeValues> = {
  type: T;
};

// Alias this here, and then from here out we reference TriggerEventTypes to allow us to expand this in the future
export const TriggerEventTypes = SlackEvents;

export type TriggerEventTypeValues =
  typeof TriggerEventTypes[keyof typeof TriggerEventTypes];

export type EventTriggerConfig<
  T extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
> =
  & BaseTriggerConfig<T>
  & {
    type: typeof TriggerTypes.Event;
    event_type: TriggerEventType;
  };
