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

export type SlackReactionAddedEventTriggerConfig<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
> =
  & EventTriggerConfig<TriggerType, TriggerEventType>
  & {
    "event_type": typeof TriggerEventTypes.ReactionAdded;
  };

export const SlackEventReactionAddedContextDefinition =
  WrapTriggerContextDataPayload({
    "user_id": {
      "type": "slack#/types/user_id",
      "description": "The user who reacted to the message",
    },
    "reaction": { "type": "string", "description": "The reaction added" },
    "channel_id": { "type": "slack#/types/channel_id" },
    "message_ts": { "type": "string" },
  }, false);

export type SlackEventReactionAddedContext = {
  [key in keyof typeof SlackEventReactionAddedContextDefinition]:
    ParameterVariableType<
      typeof SlackEventReactionAddedContextDefinition[key]
    >;
};
