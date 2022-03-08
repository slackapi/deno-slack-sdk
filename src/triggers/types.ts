import { WorkflowDefinition } from "../workflows.ts";
import {
  Trigger,
  TriggerAccess,
  TriggerEventTypeValues,
  TriggerTypes,
  TriggerTypeValues,
} from "./base-types.ts";
import { MessageShortcutConfig } from "./slack/message-shortcut.ts";
import { ScheduleConfig } from "./slack/scheduled.ts";
import { ShortcutConfig } from "./slack/shortcut.ts";
import { WebhookConfig } from "./slack/webhook.ts";
import { TriggerConfigEvents } from "./slack/events/types-events.ts";

export type TriggerConfig<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
> = TriggerType extends typeof TriggerTypes.Shortcut
  ? ShortcutConfig<TriggerType>
  : TriggerType extends typeof TriggerTypes.Webhook ? WebhookConfig<TriggerType>
  : TriggerType extends typeof TriggerTypes.MessageShortcut
    ? MessageShortcutConfig<TriggerType>
  : TriggerType extends typeof TriggerTypes.Scheduled
    ? ScheduleConfig<TriggerType>
  : TriggerType extends typeof TriggerTypes.Event
    ? TriggerConfigEvents<TriggerType, TriggerEventType>
  : never;

// These are the types for the actual JSON objects returned to the CLI for each trigger
export type TriggerDefinition = {
  key: string;
  trigger: Trigger;
  access?: TriggerAccess;
};

// This type is intended to allow for manually defining triggers that are unknown,
// or in development, but not fully supported by the SDK
export type UnknownTriggerDefinition = {
  key: string;
  // deno-lint-ignore no-explicit-any
  trigger: any;
  access?: TriggerAccess;
};

export interface IExportableTrigger {
  export: (teamId?: string) => TriggerDefinition | null;
  // deno-lint-ignore no-explicit-any
  workflow: WorkflowDefinition<any, any>;
}
