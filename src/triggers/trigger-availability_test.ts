import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { DefineTrigger } from "./define-trigger.ts";
import { DefineWorkflow } from "../workflows.ts";
import { TRIGGER_VIZ_COLLABS } from "./triggers.ts";
import Schema from "../schema/mod.ts";
import { TriggerTypes } from "./base-types.ts";

const testWorkflow = DefineWorkflow("test", {
  title: "Dino Me",
  description: "Turns a name into a dinosaur name",
  input_parameters: {
    required: [],
    properties: {
      name: {
        type: "string",
        description: "The provided name",
      },
      channel: {
        type: "string",
        description: "Channel to send message with dino name",
      },
    },
  },
});

Deno.test("Command Triggers default to workspace collaborators only", () => {
  const trigger = DefineTrigger("test", {
    type: TriggerTypes.Shortcut,
    name: "Test",
  }).runs(testWorkflow);

  const { access, trigger: triggerDef } = trigger.export() || {};
  assertEquals(
    access,
    { user_ids: [TRIGGER_VIZ_COLLABS] },
  );
  assertEquals(
    triggerDef?.channel_ids,
    undefined,
    "channel_ids should not be set",
  );
});

Deno.test("Command Triggers .availableToWorkspaceUsers() w/o users", () => {
  const trigger = DefineTrigger("test", {
    type: TriggerTypes.Shortcut,
    name: "Test",
  }).runs(testWorkflow).availableToWorkspaceUsers();

  const { access, trigger: triggerDef } = trigger.export() || {};
  assertEquals(
    access,
    { user_ids: [TRIGGER_VIZ_COLLABS] },
    "access should be set to collabs only",
  );
  assertEquals(
    triggerDef?.channel_ids,
    undefined,
    "channel_ids should not be set",
  );
});

Deno.test("Command Triggers .availableToWorkspaceUsers() w/ users", () => {
  const users = ["U123456", "U343435", "U234234"];

  const trigger = DefineTrigger("test", {
    type: TriggerTypes.Shortcut,
    name: "Test",
  }).runs(testWorkflow).availableToWorkspaceUsers(users);

  const { access, trigger: triggerDef } = trigger.export() || {};
  assertEquals(
    access,
    { user_ids: users },
    "access should be set to collabs only",
  );
  assertEquals(
    triggerDef?.channel_ids,
    undefined,
    "channel_ids should not be set",
  );
});

Deno.test("Command Triggers .availableToChannel() w/o users", () => {
  const channelId = "C123456";

  const trigger = DefineTrigger("test", {
    type: TriggerTypes.Shortcut,
    name: "Test",
  }).runs(testWorkflow).availableToChannel("C123456");

  const { access, trigger: triggerDef } = trigger.export() || {};
  assertEquals(
    access,
    {},
  );
  assertEquals(
    triggerDef?.channel_ids,
    [channelId],
    "channel_ids should have one channel",
  );
});

Deno.test("Command Triggers w/ a workspace() call", () => {
  const channel1Id = "C111111";
  const channel2Id = "C222222";
  const userIds = ["U111111", "U222222"];

  const trigger = DefineTrigger("test", {
    type: TriggerTypes.Shortcut,
    name: "Test",
  })
    .runs(testWorkflow)
    .availableToChannel(channel1Id)
    .workspace("dev", (devTrigger) => {
      devTrigger.availableToChannel(channel2Id, userIds);
    });

  const { access, trigger: triggerDef } = trigger.export() || {};
  assertEquals(
    access,
    {},
  );
  assertEquals(
    triggerDef?.channel_ids,
    [channel1Id],
  );

  const { access: devAccess, trigger: devTriggerDef } = trigger.export("dev") ||
    {};
  assertEquals(
    devAccess,
    {
      user_ids: userIds,
    },
  );
  assertEquals(
    devTriggerDef?.channel_ids,
    [channel2Id],
  );
});

Deno.test("Command Triggers .availableToChannel() w/ users", () => {
  const channelId = "C123456";
  const users = ["U12345", "U34434"];

  const trigger = DefineTrigger("test", {
    type: TriggerTypes.Shortcut,
    name: "Test",
  }).runs(testWorkflow).availableToChannel("C123456", users);

  const { access, trigger: triggerDef } = trigger.export() || {};
  assertEquals(
    access,
    { user_ids: users },
  );
  assertEquals(
    triggerDef?.channel_ids,
    [channelId],
    "channel_ids should have one channel",
  );
});

Deno.test("Event Triggers .availableToChannel()", () => {
  const channelId = "C123456";

  const trigger = DefineTrigger("test", {
    type: TriggerTypes.Event,
    event_type: Schema.slack.events.ReactionAdded,
  }).runs(testWorkflow).availableToChannel("C123456");

  const { access, trigger: triggerDef } = trigger.export() || {};
  assertEquals(
    access,
    {},
  );
  assertEquals(
    triggerDef?.channel_ids,
    [channelId],
    "channel_ids should have one channel",
  );
});

Deno.test("Event Triggers without calling availableToChannel()", () => {
  const trigger = DefineTrigger("test", {
    type: TriggerTypes.Event,
    event_type: Schema.slack.events.ReactionAdded,
  }).runs(testWorkflow);

  const { access, trigger: triggerDef } = trigger.export() || {};
  assertEquals(
    access,
    {
      user_ids: ["{{collaborators}}"],
    },
  );
  // this will be undefined, which should cause the API to return a validation error
  assertEquals(
    triggerDef?.channel_ids,
    undefined,
  );
});

Deno.test("Schedule Triggers to workspace collaborators", () => {
  const trigger = DefineTrigger("test_schedule", {
    type: TriggerTypes.Scheduled,
    schedule: {
      start_time: "2022-02-04T10:04:16Z",
    },
  }).runs(testWorkflow);

  const { access, trigger: triggerDef } = trigger.export() || {};
  assertEquals(
    access,
    {
      user_ids: ["{{collaborators}}"],
    },
  );

  assertEquals(
    triggerDef?.channel_ids,
    undefined,
  );
});
