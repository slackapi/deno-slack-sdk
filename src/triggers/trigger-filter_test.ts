import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { DefineWorkflow } from "../workflows.ts";
import { TriggerTypes } from "./base-types.ts";
import { DefineTrigger } from "./define-trigger.ts";
import {
  normalizeTriggerFilterDefinition,
  TRIGGER_FILTER_VERSION_DEFAULT,
  TriggerFilter,
  TriggerFilterOperatorType,
} from "./trigger-filter.ts";

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

Deno.test("Trigger with filter operator", () => {
  const trigger = DefineTrigger("favorite_animal_test", {
    type: TriggerTypes.Webhook,
  }).runs(testWorkflow);

  const configToWrite: TriggerFilter = {
    version: 1,
    root: {
      operator: TriggerFilterOperatorType.OR,
      inputs: [
        {
          statement: "1 == 2",
        },
        {
          statement: "5 == 5",
        },
      ],
    },
  };

  trigger.withFilter((_ctx) => configToWrite);

  const triggerDef = trigger.export()?.trigger;

  assertEquals(triggerDef?.filter, configToWrite);
});

Deno.test("Trigger Filter with Context Variable access", () => {
  const channelId = "C111111";

  const trigger = DefineTrigger("test", {
    type: TriggerTypes.Event,
    event_type: "slack#/events/reaction_added",
  })
    .runs(testWorkflow)
    .withFilter((ctx) => ({
      version: 1,
      root: {
        operator: TriggerFilterOperatorType.OR,
        inputs: [
          { statement: `${ctx.data.channel_id} == ${channelId}` },
          { statement: `${ctx.data.reaction} == eyes` },
        ],
      },
    }))
    .availableToChannel(channelId);

  const { trigger: triggerDef } = trigger.export() || {};

  assertEquals(
    triggerDef?.filter,
    {
      version: 1,
      root: {
        operator: TriggerFilterOperatorType.OR,
        inputs: [
          { statement: `{{data.channel_id}} == C111111` },
          { statement: `{{data.reaction}} == eyes` },
        ],
      },
    },
  );
});

Deno.test("normalizeTriggerFilterDefinition with full definition", () => {
  const filter = {
    version: 1,
    root: {
      statement: "1 == 2",
    },
  };

  const normalizeFilter = normalizeTriggerFilterDefinition(filter);

  assertEquals(normalizeFilter, filter);
});

Deno.test("normalizeTriggerFilterDefinition with full definition no version", () => {
  const filter = {
    root: {
      statement: "1 == 2",
    },
  };

  const normalizeFilter = normalizeTriggerFilterDefinition(filter);

  assertEquals(normalizeFilter.version, TRIGGER_FILTER_VERSION_DEFAULT);
  assertEquals(normalizeFilter.root, filter.root);
});

Deno.test("normalizeTriggerFilterDefinition with only root", () => {
  const filter = {
    statement: "1 == 2",
  };

  const normalizeFilter = normalizeTriggerFilterDefinition(filter);

  assertEquals(normalizeFilter.version, TRIGGER_FILTER_VERSION_DEFAULT);
  assertEquals(normalizeFilter.root, filter);
});
