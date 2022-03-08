/**
 * This file has been generated automatically, do not edit manually.
 * Run ./src/schema/slack/events/_scripts/generate to regenerate
 */

import { TriggerEventTypes, TriggerEventTypeValues } from "../../base-types.ts";

import {
  SlackEventReactionAddedContext,
  SlackEventReactionAddedContextDefinition,
} from "./reaction_added.ts";

import {
  SlackEventMessageMetadataPostedContext,
  SlackEventMessageMetadataPostedContextDefinition,
} from "./message_metadata_posted.ts";

import {
  SlackEventUserJoinedChannelContext,
  SlackEventUserJoinedChannelContextDefinition,
} from "./user_joined_channel.ts";

import {
  SlackEventUserJoinedTeamContext,
  SlackEventUserJoinedTeamContextDefinition,
} from "./user_joined_team.ts";

import {
  SlackEventChannelCreatedContext,
  SlackEventChannelCreatedContextDefinition,
} from "./channel_created.ts";

import {
  SlackEventDndUpdatedContext,
  SlackEventDndUpdatedContextDefinition,
} from "./dnd_updated.ts";

// Mapping Event Trigger Type => the context definition
export const EventTriggerContextMap = {
  [TriggerEventTypes.ReactionAdded]: SlackEventReactionAddedContextDefinition,
  [TriggerEventTypes.MessageMetadataPosted]:
    SlackEventMessageMetadataPostedContextDefinition,
  [TriggerEventTypes.UserJoinedChannel]:
    SlackEventUserJoinedChannelContextDefinition,
  [TriggerEventTypes.UserJoinedTeam]: SlackEventUserJoinedTeamContextDefinition,
  [TriggerEventTypes.ChannelCreated]: SlackEventChannelCreatedContextDefinition,
  [TriggerEventTypes.DndUpdated]: SlackEventDndUpdatedContextDefinition,
};

export type EventTriggerContext<
  TriggerEventType extends TriggerEventTypeValues,
> = TriggerEventType extends typeof TriggerEventTypes.ReactionAdded
  ? SlackEventReactionAddedContext
  : TriggerEventType extends typeof TriggerEventTypes.MessageMetadataPosted
    ? SlackEventMessageMetadataPostedContext
  : TriggerEventType extends typeof TriggerEventTypes.UserJoinedChannel
    ? SlackEventUserJoinedChannelContext
  : TriggerEventType extends typeof TriggerEventTypes.UserJoinedTeam
    ? SlackEventUserJoinedTeamContext
  : TriggerEventType extends typeof TriggerEventTypes.ChannelCreated
    ? SlackEventChannelCreatedContext
  : TriggerEventType extends typeof TriggerEventTypes.DndUpdated
    ? SlackEventDndUpdatedContext
  : never;
