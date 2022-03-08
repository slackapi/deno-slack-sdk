import { assertExists } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { TriggerTypes } from "../mod.ts";
import { TriggerEventTypes } from "./base-types.ts";
import { createTriggerContext } from "./context.ts";

Deno.test("Webhook trigger context", () => {
  const ctx = createTriggerContext(TriggerTypes.Webhook);
  assertExists(ctx.data);
  assertExists(ctx.data.sample_property);
  assertExists(ctx.data.sample_property.nested);
});

Deno.test("Shortcut trigger context", () => {
  const ctx = createTriggerContext(TriggerTypes.Shortcut);

  assertExists(ctx.type);
  assertExists(ctx.data);
  assertExists(ctx.data.channel_id);
  assertExists(ctx.data.user_id);
});
Deno.test("Message Action trigger context", () => {
  const ctx = createTriggerContext(TriggerTypes.MessageShortcut);

  assertExists(ctx.type);
  assertExists(ctx.data.channel_id);
  assertExists(ctx.data.user_id);
  assertExists(ctx.data.message.ts);
  assertExists(ctx.data.message.text);
  assertExists(ctx.data.message.user_id);
});

Deno.test("Slack Event reaction_added context", () => {
  const ctx = createTriggerContext(
    TriggerTypes.Event,
    TriggerEventTypes.ReactionAdded,
  );

  assertExists(ctx.type);
  assertExists(ctx.data.user_id);
  assertExists(ctx.data.reaction);
  assertExists(ctx.data.channel_id);
  assertExists(ctx.data.message_ts);
});

Deno.test("Slack Event message_metadata_posted context", () => {
  const ctx = createTriggerContext(
    TriggerTypes.Event,
    TriggerEventTypes.MessageMetadataPosted,
  );

  assertExists(ctx.type);
  assertExists(ctx.data.channel_id);
  assertExists(ctx.data.metadata);
  assertExists(ctx.data.message_ts);
  assertExists(ctx.data.metadata.event_type);
  assertExists(ctx.data.metadata.event_payload);
  assertExists(ctx.data.metadata.event_payload.ticket.id);
});

Deno.test("Schedule trigger context", () => {
  const ctx = createTriggerContext(TriggerTypes.Scheduled);

  assertExists(ctx.type);
  assertExists(ctx.data);
  assertExists(ctx.data.user_id);
});

Deno.test("Slack Event user_joined_channel context", () => {
  const ctx = createTriggerContext(
    TriggerTypes.Event,
    TriggerEventTypes.UserJoinedChannel,
  );

  assertExists(ctx.type);
  assertExists(ctx.data.channel_id);
  assertExists(ctx.data.channel_type);
  assertExists(ctx.data.inviter_id);
  assertExists(ctx.data.user_id);
});

Deno.test("Slack Event channel_created context", () => {
  const ctx = createTriggerContext(
    TriggerTypes.Event,
    TriggerEventTypes.ChannelCreated,
  );

  assertExists(ctx.type);
  assertExists(ctx.data.channel.id);
  assertExists(ctx.data.channel.name);
  assertExists(ctx.data.channel.created);
  assertExists(ctx.data.channel.creator_id);
});

Deno.test("Slack Event dnd_updated context", () => {
  const ctx = createTriggerContext(
    TriggerTypes.Event,
    TriggerEventTypes.DndUpdated,
  );

  assertExists(ctx.type);
  assertExists(ctx.data.dnd_status.dnd_enabled);
  assertExists(ctx.data.dnd_status.next_dnd_start_ts);
  assertExists(ctx.data.dnd_status.next_dnd_end_ts);
  assertExists(ctx.data.user_id);
});
