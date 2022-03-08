import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { DefineTrigger } from "./define-trigger.ts";
import { DefineWorkflow } from "../workflows.ts";
import { TRIGGER_VIZ_COLLABS } from "./triggers.ts";
import Schema from "../schema/mod.ts";
import { TriggerTypes } from "../mod.ts";

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

Deno.test("Command Trigger w/ workspace() calls", () => {
  const channelId = "C111111";
  const devChannelId = "C222222";
  const devUserIds = ["U111111", "U222222"];

  const trigger = DefineTrigger("test", {
    type: TriggerTypes.Shortcut,
    name: "Test",
  })
    .runs(testWorkflow)
    .withInputs((ctx) => ({
      channel: ctx.data.channel_id,
      name: "default name",
    }))
    .availableToChannel(channelId)
    .workspace("dev", (devTrigger) => {
      devTrigger.availableToChannel(devChannelId, devUserIds).withInputs(
        (ctx) => ({
          channel: ctx.data.channel_id,
          name: "dev name",
        }),
      );
    })
    .workspace("prod", (prodTrigger) => {
      prodTrigger.availableToWorkspaceUsers().withInputs((ctx) => ({
        channel: ctx.data.channel_id,
        name: "prod name",
      }));
    });

  const { access, trigger: triggerDef } = trigger.export() || {};

  assertEquals(triggerDef?.inputs, {
    channel: {
      hidden: false,
      locked: false,
      value: "{{data.channel_id}}",
    },
    name: {
      hidden: false,
      locked: false,
      value: "default name",
    },
  });
  assertEquals(
    access,
    {},
  );
  assertEquals(
    triggerDef?.channel_ids,
    [channelId],
  );

  const { access: devAccess, trigger: devTriggerDef } = trigger.export("dev") ||
    {};

  assertEquals(devTriggerDef?.inputs, {
    channel: {
      hidden: false,
      locked: false,
      value: "{{data.channel_id}}",
    },
    name: {
      hidden: false,
      locked: false,
      value: "dev name",
    },
  });
  assertEquals(
    devAccess,
    {
      user_ids: devUserIds,
    },
  );
  assertEquals(
    devTriggerDef?.channel_ids,
    [devChannelId],
  );

  const { access: prodAccess, trigger: prodTriggerDef } =
    trigger.export("prod") ||
    {};

  assertEquals(prodTriggerDef?.inputs, {
    channel: {
      hidden: false,
      locked: false,
      value: "{{data.channel_id}}",
    },
    name: {
      hidden: false,
      locked: false,
      value: "prod name",
    },
  });
  assertEquals(
    prodAccess,
    {
      user_ids: [TRIGGER_VIZ_COLLABS],
    },
  );
  assertEquals(
    prodTriggerDef?.channel_ids,
    undefined,
  );
});

Deno.test("Event Trigger w/ workspace() calls", () => {
  const channelId = "C111111";
  const devChannelId = "C222222";
  const prodChannelId = "C333333";
  const filterDef = {
    version: 1,
    root: {
      statement: "{{data.reaction}} == eyes",
    },
  };

  const trigger = DefineTrigger("test", {
    type: TriggerTypes.Event,
    event_type: Schema.slack.events.ReactionAdded,
  })
    .runs(testWorkflow)
    .withInputs((ctx) => ({
      channel: ctx.data.channel_id,
      name: "default name",
    }))
    .withFilter((ctx) => ({
      statement: `${ctx.data.reaction} == eyes`,
    }))
    .availableToChannel(channelId)
    .workspace("dev", (devTrigger) => {
      devTrigger.availableToChannel(devChannelId).withInputs(
        (ctx) => ({
          channel: ctx.data.channel_id,
          name: "dev name",
        }),
      );
    })
    .workspace("prod", (prodTrigger) => {
      prodTrigger.availableToChannel(prodChannelId).withInputs((ctx) => ({
        channel: ctx.data.channel_id,
        name: "prod name",
      }));
    });

  const { access, trigger: triggerDef } = trigger.export() || {};

  assertEquals(triggerDef?.inputs, {
    channel: {
      hidden: false,
      locked: false,
      value: "{{data.channel_id}}",
    },
    name: {
      hidden: false,
      locked: false,
      value: "default name",
    },
  });
  assertEquals(
    access,
    {},
  );
  assertEquals(
    triggerDef?.channel_ids,
    [channelId],
  );
  assertEquals(triggerDef?.filter, filterDef);

  const { access: devAccess, trigger: devTriggerDef } = trigger.export("dev") ||
    {};

  assertEquals(devTriggerDef?.inputs, {
    channel: {
      hidden: false,
      locked: false,
      value: "{{data.channel_id}}",
    },
    name: {
      hidden: false,
      locked: false,
      value: "dev name",
    },
  });
  assertEquals(
    devAccess,
    {},
  );
  assertEquals(
    devTriggerDef?.channel_ids,
    [devChannelId],
  );
  assertEquals(devTriggerDef?.filter, filterDef);

  const { access: prodAccess, trigger: prodTriggerDef } =
    trigger.export("prod") ||
    {};

  assertEquals(prodTriggerDef?.inputs, {
    channel: {
      hidden: false,
      locked: false,
      value: "{{data.channel_id}}",
    },
    name: {
      hidden: false,
      locked: false,
      value: "prod name",
    },
  });
  assertEquals(
    prodAccess,
    {},
  );
  assertEquals(
    prodTriggerDef?.channel_ids,
    [prodChannelId],
  );
  assertEquals(prodTriggerDef?.filter, filterDef);
});
