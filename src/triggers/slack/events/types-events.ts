/**
 * This file has been generated automatically, do not edit manually.
 * Run ./src/schema/slack/events/_scripts/generate to regenerate
 */

import {
  TriggerEventTypes,
  TriggerEventTypeValues,
  TriggerTypeValues,
} from "../../base-types.ts";

import { SlackReactionAddedEventTriggerConfig } from "./reaction_added.ts";

import { SlackMessageMetadataPostedEventTriggerConfig } from "./message_metadata_posted.ts";

import { SlackUserJoinedChannelEventTriggerConfig } from "./user_joined_channel.ts";

import { SlackUserJoinedTeamEventTriggerConfig } from "./user_joined_team.ts";

import { SlackChannelCreatedEventTriggerConfig } from "./channel_created.ts";

import { SlackDndUpdatedEventTriggerConfig } from "./dnd_updated.ts";

export type TriggerConfigEvents<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
> = TriggerEventType extends typeof TriggerEventTypes.ReactionAdded
  ? SlackReactionAddedEventTriggerConfig<TriggerType, TriggerEventType>
  : TriggerEventType extends typeof TriggerEventTypes.MessageMetadataPosted
    ? SlackMessageMetadataPostedEventTriggerConfig<
      TriggerType,
      TriggerEventType
    >
  : TriggerEventType extends typeof TriggerEventTypes.UserJoinedChannel
    ? SlackUserJoinedChannelEventTriggerConfig<TriggerType, TriggerEventType>
  : TriggerEventType extends typeof TriggerEventTypes.UserJoinedTeam
    ? SlackUserJoinedTeamEventTriggerConfig<TriggerType, TriggerEventType>
  : TriggerEventType extends typeof TriggerEventTypes.ChannelCreated
    ? SlackChannelCreatedEventTriggerConfig<TriggerType, TriggerEventType>
  : TriggerEventType extends typeof TriggerEventTypes.DndUpdated
    ? SlackDndUpdatedEventTriggerConfig<TriggerType, TriggerEventType>
  : never;
