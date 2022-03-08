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

export type SlackChannelCreatedEventTriggerConfig<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
> =
  & EventTriggerConfig<TriggerType, TriggerEventType>
  & {
    "event_type": typeof TriggerEventTypes.ChannelCreated;
  };

export const SlackEventChannelCreatedContextDefinition =
  WrapTriggerContextDataPayload({
    "channel": {
      "type": "object",
      "description": "The channel",
      "properties": {
        "id": { "type": "slack#/types/channel_id" },
        "name": { "type": "string" },
        "created": { "type": "integer" },
        "creator_id": { "type": "slack#/types/user_id" },
      },
    },
  }, false);

export type SlackEventChannelCreatedContext = {
  [key in keyof typeof SlackEventChannelCreatedContextDefinition]:
    ParameterVariableType<
      typeof SlackEventChannelCreatedContextDefinition[key]
    >;
};
