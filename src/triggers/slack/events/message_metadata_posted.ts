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

export type SlackMessageMetadataPostedEventTriggerConfig<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
> =
  & EventTriggerConfig<TriggerType, TriggerEventType>
  & {
    "event_type": typeof TriggerEventTypes.MessageMetadataPosted;
    "metadata_event_type": string;
  };

export const SlackEventMessageMetadataPostedContextDefinition =
  WrapTriggerContextDataPayload({
    "channel_id": {
      "type": "slack#/types/channel_id",
      "description": "The channel where the reaction happened",
    },
    "user_id": {
      "type": "slack#/types/user_id",
      "description": "The user who posted the message",
    },
    "message_ts": {
      "type": "slack#/types/timestamp",
      "description": "The message timestamp",
    },
    "metadata": {
      "type": "object",
      "description": "The message metadata",
      "properties": {
        "event_type": { "type": "string" },
        "event_payload": { "type": "object" },
      },
    },
  }, false);

export type SlackEventMessageMetadataPostedContext = {
  [key in keyof typeof SlackEventMessageMetadataPostedContextDefinition]:
    ParameterVariableType<
      typeof SlackEventMessageMetadataPostedContextDefinition[key]
    >;
};
