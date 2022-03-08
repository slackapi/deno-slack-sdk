import { ParameterDefinition, ParameterVariable } from "../parameters/mod.ts";
import {
  TriggerEventTypeValues,
  TriggerTypes,
  TriggerTypeValues,
} from "./base-types.ts";

import {
  MessageShortcutContext,
  MessageShortcutContextDefinition,
} from "./slack/message-shortcut.ts";

import {
  ScheduleContext,
  ScheduleContextDefinition,
} from "./slack/scheduled.ts";
import {
  ShortcutContext,
  ShortcutContextDefinition,
} from "./slack/shortcut.ts";
import { WebhookContext, WebhookContextDefinition } from "./slack/webhook.ts";
import {
  EventTriggerContext,
  EventTriggerContextMap,
} from "./slack/events/context-events.ts";

// Mapping Trigger Type => the context definition
const TriggerContextMap = {
  [TriggerTypes.Shortcut]: ShortcutContextDefinition,
  [TriggerTypes.MessageShortcut]: MessageShortcutContextDefinition,
  [TriggerTypes.Webhook]: WebhookContextDefinition,
  [TriggerTypes.Scheduled]: ScheduleContextDefinition,
  [TriggerTypes.Event]: EventTriggerContextMap, // Event map comes from codegen'ed files
};

export type TriggerContext<
  TriggerType extends TriggerTypeValues,
  EventType extends TriggerEventTypeValues,
> = TriggerType extends typeof TriggerTypes.Shortcut ? ShortcutContext
  : TriggerType extends typeof TriggerTypes.Webhook ? WebhookContext
  : TriggerType extends typeof TriggerTypes.MessageShortcut
    ? MessageShortcutContext
  : TriggerType extends typeof TriggerTypes.Event
    ? EventTriggerContext<EventType>
  : TriggerType extends typeof TriggerTypes.Scheduled ? ScheduleContext
  : never;

export const createTriggerContext = <
  T extends TriggerTypeValues,
  TE extends TriggerEventTypeValues,
>(
  triggerType: T,
  triggerEventType?: TE,
): TriggerContext<T, TE> => {
  // TODO: would like to make this typed as TriggerContext<T>
  // but not able to assign a ParameterVariable to it
  // deno-lint-ignore no-explicit-any
  const ctx = {} as any;
  if (triggerType === TriggerTypes.Event && triggerEventType === undefined) {
    throw new Error(
      "Event trigger types must have a trigger event_type defined",
    );
  }

  const ctxDef =
    triggerType === TriggerTypes.Event && triggerEventType !== undefined
      ? TriggerContextMap[TriggerTypes.Event][triggerEventType]
      : TriggerContextMap[triggerType];

  for (
    const [ctxName, ctxOptions] of Object.entries(
      ctxDef,
    )
  ) {
    ctx[ctxName] = ParameterVariable(
      "",
      ctxName,
      ctxOptions as ParameterDefinition,
    );
  }
  return ctx as TriggerContext<T, TE>;
};
