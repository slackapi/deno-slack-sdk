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

export type SlackUserJoinedChannelEventTriggerConfig<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
> =
  & EventTriggerConfig<TriggerType, TriggerEventType>
  & {
    "event_type": typeof TriggerEventTypes.UserJoinedChannel;
  };

export const SlackEventUserJoinedChannelContextDefinition =
  WrapTriggerContextDataPayload({
    "user_id": {
      "type": "slack#/types/user_id",
      "description": "The user who joined the channel",
    },
    "channel_id": { "type": "slack#/types/channel_id" },
    "inviter_id": {
      "type": "slack#/types/user_id",
      "description": "The user who invited the joining user",
    },
    "channel_type": { "type": "string" },
  }, false);

export type SlackEventUserJoinedChannelContext = {
  [key in keyof typeof SlackEventUserJoinedChannelContextDefinition]:
    ParameterVariableType<
      typeof SlackEventUserJoinedChannelContextDefinition[key]
    >;
};
