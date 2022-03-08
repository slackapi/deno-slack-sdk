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

export type SlackUserJoinedTeamEventTriggerConfig<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
> =
  & EventTriggerConfig<TriggerType, TriggerEventType>
  & {
    "event_type": typeof TriggerEventTypes.UserJoinedTeam;
  };

export const SlackEventUserJoinedTeamContextDefinition =
  WrapTriggerContextDataPayload({
    "user": {
      "type": "object",
      "description": "The user who joined the team",
      "properties": {
        "user_id": { "type": "slack#/types/user_id" },
        "team_id": { "type": "string" },
        "name": { "type": "string" },
        "display_name": { "type": "string" },
        "real_name": { "type": "string" },
        "timezone": { "type": "string" },
        "is_bot": { "type": "boolean" },
      },
    },
  }, false);

export type SlackEventUserJoinedTeamContext = {
  [key in keyof typeof SlackEventUserJoinedTeamContextDefinition]:
    ParameterVariableType<
      typeof SlackEventUserJoinedTeamContextDefinition[key]
    >;
};
