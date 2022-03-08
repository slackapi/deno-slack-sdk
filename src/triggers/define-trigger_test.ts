import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { FrequencyType } from "../mod.ts";
import { TriggerTypes } from "../mod.ts";
import Schema from "../schema/mod.ts";
import { DefineWorkflow } from "../workflows.ts";
import { TriggerEventTypes } from "./base-types.ts";
import { DefineTrigger } from "./define-trigger.ts";

Deno.test("DefineTrigger Event SlackReactionAdded", () => {
  const workflow = DefineWorkflow("test", {
    title: "test",
    input_parameters: {
      required: [],
      properties: {
        string: {
          type: Schema.types.string,
        },
        channel_id: {
          type: Schema.slack.types.channel_id,
        },
        user_id: {
          type: Schema.slack.types.user_id,
        },
      },
    },
  });

  const trigger = DefineTrigger("reaction_added_test", {
    type: TriggerTypes.Event,
    event_type: TriggerEventTypes.ReactionAdded,
  }).runs(workflow).withInputs((ctx) => ({
    string: ctx.data.reaction,
    channel_id: ctx.data.channel_id,
    user_id: ctx.data.user_id,
  }));

  const triggerDef = trigger.export()?.trigger;

  assertEquals(triggerDef?.type, TriggerTypes.Event);
  assertEquals(
    triggerDef?.event_type,
    TriggerEventTypes.ReactionAdded,
  );
  assertEquals(triggerDef?.inputs, {
    string: {
      value: "{{data.reaction}}",
      hidden: false,
      locked: false,
    },
    channel_id: {
      value: "{{data.channel_id}}",
      hidden: false,
      locked: false,
    },
    user_id: {
      value: "{{data.user_id}}",
      hidden: false,
      locked: false,
    },
  });
});

Deno.test("DefineTrigger Webhook", () => {
  const workflow = DefineWorkflow("test", {
    title: "test",
    input_parameters: {
      required: [],
      properties: {
        favorite_animal: {
          type: Schema.types.string,
        },
        channel_id: {
          type: Schema.slack.types.channel_id,
        },
      },
    },
  });

  const trigger = DefineTrigger("favorite_animal_test", {
    type: TriggerTypes.Webhook,
  }).runs(workflow).withInputs((ctx) => ({
    favorite_animal: ctx.data.webhook_payload.favorite_animal,
    channel_id: ctx.data.webhook_payload.channel_id,
  }));

  const triggerDef = trigger.export()?.trigger;

  assertEquals(triggerDef?.type, TriggerTypes.Webhook);
  assertEquals(triggerDef?.inputs, {
    favorite_animal: {
      value: "{{data.webhook_payload.favorite_animal}}",
      hidden: false,
      locked: false,
    },
    channel_id: {
      value: "{{data.webhook_payload.channel_id}}",
      hidden: false,
      locked: false,
    },
  });
});

Deno.test("DefineTrigger Event SlackMessageMetadataPosted", () => {
  const workflow = DefineWorkflow("test", {
    title: "test",
    input_parameters: {
      required: [],
      properties: {
        string: {
          type: Schema.types.string,
        },
        string2: {
          type: Schema.types.string,
        },
        channel_id: {
          type: Schema.slack.types.channel_id,
        },
        user_id: {
          type: Schema.slack.types.user_id,
        },
        timestamp: {
          type: Schema.slack.types.timestamp,
        },
      },
    },
  });

  const trigger = DefineTrigger("reaction_added_test", {
    type: TriggerTypes.Event,
    event_type: TriggerEventTypes.MessageMetadataPosted,
    metadata_event_type: "ticket_created",
  }).runs(workflow).withInputs((ctx) => ({
    string: ctx.data.metadata.event_type,
    string2: ctx.data.metadata.event_payload.foo.bar.bizz.bazz,
    channel_id: ctx.data.channel_id,
    user_id: ctx.data.user_id,
    timestamp: ctx.data.message_ts,
  }));

  const triggerDef = trigger.export()?.trigger;

  assertEquals(triggerDef?.type, TriggerTypes.Event);
  assertEquals(
    triggerDef?.event_type,
    TriggerEventTypes.MessageMetadataPosted,
  );
  assertEquals(
    triggerDef?.metadata_event_type,
    "ticket_created",
  );
  assertEquals(triggerDef?.inputs, {
    timestamp: {
      value: "{{data.message_ts}}",
      hidden: false,
      locked: false,
    },
    channel_id: {
      value: "{{data.channel_id}}",
      hidden: false,
      locked: false,
    },
    user_id: {
      value: "{{data.user_id}}",
      hidden: false,
      locked: false,
    },
    string: {
      value: "{{data.metadata.event_type}}",
      hidden: false,
      locked: false,
    },
    string2: {
      value: "{{data.metadata.event_payload.foo.bar.bizz.bazz}}",
      hidden: false,
      locked: false,
    },
  });
});

Deno.test("DefineTrigger with typed object input parameter", () => {
  const workflow = DefineWorkflow("test", {
    title: "Test",
    input_parameters: {
      required: [],
      properties: {
        user_id: {
          type: Schema.slack.types.user_id,
        },
        incident: {
          type: Schema.types.object,
          properties: {
            id: {
              type: Schema.types.integer,
            },
            name: {
              type: Schema.types.string,
            },
            description: {
              type: Schema.types.string,
            },
          },
        },
      },
    },
  });

  const trigger = DefineTrigger("object_input_test", {
    type: TriggerTypes.Shortcut,
    name: "Test Object Inputs",
  }).runs(workflow).withInputs((ctx) => ({
    user_id: ctx.data.user_id,
    incident: {
      id: 1234,
      name: `Submitted by <@${ctx.data.user_id}>`,
      description: "Hard-coded description",
    },
  }));

  const triggerDef = trigger.export()?.trigger;

  assertEquals(triggerDef?.type, TriggerTypes.Shortcut);
  assertEquals(
    triggerDef?.inputs,
    {
      user_id: {
        hidden: false,
        locked: false,
        value: "{{data.user_id}}",
      },
      incident: {
        hidden: false,
        locked: false,
        value: {
          id: 1234,
          name: `Submitted by <@{{data.user_id}}>`,
          description: "Hard-coded description",
        },
      },
    },
  );
});

Deno.test("DefineTrigger with untyped object input parameter", () => {
  const workflow = DefineWorkflow("test", {
    title: "Test",
    input_parameters: {
      required: [],
      properties: {
        incident: {
          type: Schema.types.object,
        },
      },
    },
  });

  const trigger = DefineTrigger("object_input_test", {
    type: TriggerTypes.Shortcut,
    name: "Test Object Inputs",
  }).runs(workflow).withInputs((ctx) => ({
    incident: {
      id: 1234,
      name: `Submitted by <@${ctx.data.user_id}>`,
      description: "Hard-coded description",
    },
  }));

  const triggerDef = trigger.export()?.trigger;

  assertEquals(triggerDef?.type, TriggerTypes.Shortcut);
  assertEquals(
    triggerDef?.inputs,
    {
      incident: {
        hidden: false,
        locked: false,
        value: {
          id: 1234,
          name: `Submitted by <@{{data.user_id}}>`,
          description: "Hard-coded description",
        },
      },
    },
  );
});

Deno.test("DefineTrigger with typed array", () => {
  const workflow = DefineWorkflow("test", {
    title: "Test",
    input_parameters: {
      required: [],
      properties: {
        strings: {
          type: Schema.types.array,
          items: {
            type: Schema.types.string,
          },
        },
        val: {
          type: Schema.types.string,
        },
      },
    },
  });

  const trigger = DefineTrigger("array_input_test", {
    type: TriggerTypes.Shortcut,
    name: "Test Array Inputs",
  }).runs(workflow).withInputs((ctx) => ({
    strings: [
      "one",
      "two",
      "three",
      ctx.data.channel_id,
      ctx.data.user_id,
    ],
  }));

  const triggerDef = trigger.export()?.trigger;

  assertEquals(triggerDef?.type, TriggerTypes.Shortcut);
  assertEquals(
    triggerDef?.inputs,
    {
      strings: {
        value: [
          "one",
          "two",
          "three",
          "{{data.channel_id}}",
          "{{data.user_id}}",
        ],
        hidden: false,
        locked: false,
      },
    },
  );
});

Deno.test("DefineTrigger with nested type array in new format", () => {
  const workflow = DefineWorkflow("test", {
    title: "Test",
    input_parameters: {
      required: [],
      properties: {
        strings: {
          type: Schema.types.array,
          items: {
            type: Schema.types.string,
          },
        },
        val: {
          type: Schema.types.string,
        },
      },
    },
  });

  const trigger = DefineTrigger("array_input_test", {
    type: TriggerTypes.Shortcut,
    name: "Test Array Inputs",
  }).runs(workflow).withInputs((ctx) => ({
    strings: {
      value: [
        "one",
        ["two", "three"],
        "four",
        ctx.data.channel_id,
        ctx.data.user_id,
      ],
    },
  }));

  const triggerDef = trigger.export()?.trigger;

  assertEquals(triggerDef?.type, TriggerTypes.Shortcut);
  assertEquals(
    triggerDef?.inputs,
    {
      strings: {
        value: [
          "one",
          ["two", "three"],
          "four",
          "{{data.channel_id}}",
          "{{data.user_id}}",
        ],
        hidden: false,
        locked: false,
      },
    },
  );
});

Deno.test("DefineTrigger for Command Trigger with partial inputs", () => {
  const workflow = DefineWorkflow("test", {
    title: "Test",
    input_parameters: {
      required: [],
      properties: {
        string: {
          type: Schema.types.string,
        },
        user: {
          type: Schema.slack.types.user_id,
        },
      },
    },
  });

  const trigger = DefineTrigger("array_input_test", {
    type: TriggerTypes.Shortcut,
    name: "Test Array Inputs",
  }).runs(workflow).withInputs((ctx) => ({
    user: ctx.data.user_id,
  }));

  const triggerDef = trigger.export()?.trigger;

  assertEquals(triggerDef?.type, TriggerTypes.Shortcut);
  assertEquals(
    triggerDef?.inputs,
    {
      user: {
        hidden: false,
        locked: false,
        value: "{{data.user_id}}",
      },
    },
  );
});

Deno.test("DefineTrigger for Command Trigger with hidden input", () => {
  const workflow = DefineWorkflow("test", {
    title: "Test",
    input_parameters: {
      required: [],
      properties: {
        string: {
          type: Schema.types.string,
        },
      },
    },
  });

  const trigger = DefineTrigger("array_input_test", {
    type: TriggerTypes.Shortcut,
    name: "Test Array Inputs",
  }).runs(workflow).withInputs((ctx) => ({
    string: {
      value: ctx.data.user_id,
      hidden: true,
      locked: true,
    },
  }));

  const triggerDef = trigger.export()?.trigger;

  assertEquals(triggerDef?.type, TriggerTypes.Shortcut);
  assertEquals(
    triggerDef?.inputs,
    {
      string: {
        hidden: true,
        locked: true,
        value: "{{data.user_id}}",
      },
    },
  );
});

Deno.test("DefineTrigger for Command Trigger with locked input", () => {
  const workflow = DefineWorkflow("test", {
    title: "Test",
    input_parameters: {
      required: [],
      properties: {
        string: {
          type: Schema.types.string,
        },
      },
    },
  });

  const trigger = DefineTrigger("array_input_test", {
    type: TriggerTypes.Shortcut,
    name: "Test Array Inputs",
  }).runs(workflow).withInputs((_ctx) => ({
    string: {
      value: "1234",
      hidden: false,
      locked: true,
    },
  }));

  const triggerDef = trigger.export()?.trigger;

  assertEquals(triggerDef?.type, TriggerTypes.Shortcut);
  assertEquals(
    triggerDef?.inputs,
    {
      string: {
        hidden: false,
        locked: true,
        value: "1234",
      },
    },
  );
});

Deno.test("DefineTrigger for Shortcut Trigger with visibility configured input and non configured format for input", () => {
  const workflow = DefineWorkflow("test", {
    title: "Test",
    input_parameters: {
      required: [],
      properties: {
        string: {
          type: Schema.types.string,
        },
        string2: {
          type: Schema.types.string,
        },
      },
    },
  });

  const trigger = DefineTrigger("array_input_test", {
    type: TriggerTypes.Shortcut,
    name: "Test Array Inputs",
  }).runs(workflow).withInputs((_ctx) => ({
    string: {
      value: "1234",
      hidden: false,
      locked: true,
    },
    string2: "12345",
  }));

  const triggerDef = trigger.export()?.trigger;

  assertEquals(triggerDef?.type, TriggerTypes.Shortcut);
  assertEquals(
    triggerDef?.inputs,
    {
      string: {
        hidden: false,
        locked: true,
        value: "1234",
      },
      string2: {
        hidden: false,
        locked: false,
        value: "12345",
      },
    },
  );
});

Deno.test("DefineTrigger for Shortcut Trigger with typed object input", () => {
  const workflow = DefineWorkflow("test", {
    title: "Test",
    input_parameters: {
      required: [],
      properties: {
        anobject: {
          type: Schema.types.object,
          properties: {
            name: {
              type: Schema.types.string,
            },
          },
        },
      },
    },
  });

  const trigger = DefineTrigger("test", {
    type: TriggerTypes.Shortcut,
    name: "Test Object Inputs",
  }).runs(workflow).withInputs((_ctx) => ({
    anobject: {
      value: { name: "hi" },
      hidden: false,
      locked: true,
    },
  }));

  const triggerDef = trigger.export()?.trigger;

  assertEquals(triggerDef?.type, TriggerTypes.Shortcut);
  assertEquals(
    triggerDef?.inputs,
    {
      anobject: {
        hidden: false,
        locked: true,
        value: {
          name: "hi",
        },
      },
    },
  );
});

Deno.test("DefineTrigger Schedule", () => {
  const workflow = DefineWorkflow("test", {
    title: "test",
    input_parameters: {
      required: [],
      properties: {
        channel_id: {
          type: Schema.slack.types.channel_id,
        },
        user_id: {
          type: Schema.slack.types.user_id,
        },
      },
    },
  });

  const trigger = DefineTrigger("schedule_trigger_test", {
    type: TriggerTypes.Scheduled,
    schedule: {
      start_time: "2022-03-01T14:00:00Z",
      timezone: "asia/kolkata",
      frequency: {
        type: FrequencyType.Daily,
      },
    },
  }).runs(workflow).withInputs((ctx) => ({
    user_id: ctx.data.user_id,
    channel_id: "C123",
  }));

  const triggerDef = trigger.export()?.trigger;

  assertEquals(triggerDef?.type, TriggerTypes.Scheduled);
  assertEquals(triggerDef?.inputs, {
    channel_id: {
      value: "C123",
      hidden: false,
      locked: false,
    },
    user_id: {
      value: "{{data.user_id}}",
      hidden: false,
      locked: false,
    },
  });
});
