/**
 * This file has been generated automatically, do not edit manually.
 * Run ./src/schema/slack/events/_scripts/generate to regenerate
 */

import { ParameterVariableType } from "../../../parameters/mod.ts";
import {
  EventTriggerConfig,
  TriggerEventTypes,
  TriggerEventTypeValues,
  TriggerTypeValues,
} from "../../base-types.ts";
import { WrapTriggerContextDataPayload } from "../../context-helper.ts";

export type SlackDndUpdatedEventTriggerConfig<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
> =
  & EventTriggerConfig<TriggerType, TriggerEventType>
  & {
    "event_type": typeof TriggerEventTypes.DndUpdated;
  };

export const SlackEventDndUpdatedContextDefinition =
  WrapTriggerContextDataPayload({
    "user_id": { "type": "slack#/types/user_id" },
    "dnd_status": {
      "type": "object",
      "description": "The dnd status",
      "properties": {
        "dnd_enabled": { "type": "boolean" },
        "next_dnd_start_ts": { "type": "integer" },
        "next_dnd_end_ts": { "type": "integer" },
      },
    },
  }, false);

export type SlackEventDndUpdatedContext = {
  [key in keyof typeof SlackEventDndUpdatedContextDefinition]:
    ParameterVariableType<
      typeof SlackEventDndUpdatedContextDefinition[key]
    >;
};
