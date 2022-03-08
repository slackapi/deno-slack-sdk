import { EventTypeConfig, EventTypesConfig } from "./event_type_config.ts";

try {
  Deno.removeSync("../events", { recursive: true });
} catch (_e) {
  // This will fail if the directory is already missing, but that's fine
  console.log("triggers/slack/events directory not found, creating...");
}
Deno.mkdirSync("../events");

const CODEGEN_HEADER = `/**
 * This file has been generated automatically, do not edit manually.
 * Run ./src/schema/slack/events/_scripts/generate to regenerate
 **/
`;

// Write ./src/schema/slack/events/mod.ts
console.log(`Generating src/schema/slack/events/mod.ts`);
await Deno.writeTextFile(
  "../../../schema/slack/events/mod.ts",
  generateEventModFile(EventTypesConfig),
);

console.log(`Generating src/triggers/context-events.ts`);
await Deno.writeTextFile(
  "../events/context-events.ts",
  generateContextFile(EventTypesConfig),
);

console.log(`Generating src/triggers/types-events.ts`);
await Deno.writeTextFile(
  "../events/types-events.ts",
  generateTypesFile(EventTypesConfig),
);

await Promise.all(EventTypesConfig.map((eventTypeToGenerate) => {
  console.log(`Generating ${eventTypeToGenerate.eventTypeName}`);
  Deno.writeTextFile(
    `../events/${eventTypeToGenerate.fileName}.ts`,
    generateTypeFile(eventTypeToGenerate),
  );
}));

function generateEventModFile(typesToGen: Array<EventTypeConfig>): string {
  const eventDefs = typesToGen.map((event) =>
    `  ${event.className}: "${event.eventTypeName}"`
  ).join(",\n");
  return `${CODEGEN_HEADER}
const SlackEvents = {
${eventDefs}
} as const;

export default SlackEvents;
`;
}

function generateTypesFile(typesToGen: Array<EventTypeConfig>): string {
  const importStatements = typesToGen.map((event) => {
    return `
    import { Slack${event.className}EventTriggerConfig } from "./${event.fileName}.ts";
  `;
  }).join("\n");

  let typeConfigMap = typesToGen.map((event) =>
    `TriggerEventType extends typeof TriggerEventTypes.${event.className} ? Slack${event.className}EventTriggerConfig<TriggerType, TriggerEventType>`
  ).join(" : \n");
  typeConfigMap += " : never";

  return `${CODEGEN_HEADER}
import {
  TriggerEventTypes,
  TriggerEventTypeValues,
  TriggerTypeValues,
} from "../../base-types.ts";

${importStatements}


export type TriggerConfigEvents<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
> = ${typeConfigMap}
  `;
}

function generateContextFile(typesToGen: Array<EventTypeConfig>): string {
  const contextMap = typesToGen.map((event) =>
    `[TriggerEventTypes.${event.className}]: SlackEvent${event.className}ContextDefinition`
  ).join(",\n");

  let eventTriggerContextTypeDefs = typesToGen.map((event) =>
    `TriggerEventType extends typeof TriggerEventTypes.${event.className} ? SlackEvent${event.className}Context`
  ).join(" : \n");
  eventTriggerContextTypeDefs += " : never;";

  const importStatements = typesToGen.map((event) => {
    return `
  import {
    SlackEvent${event.className}Context,
    SlackEvent${event.className}ContextDefinition,
  } from "./${event.fileName}.ts";
  `;
  }).join("\n");

  return `${CODEGEN_HEADER}
  import {
    TriggerEventTypes,
    TriggerEventTypeValues,
  } from "../../base-types.ts";

  ${importStatements}


  // Mapping Event Trigger Type => the context definition
  export const EventTriggerContextMap = {
    ${contextMap}
  };

  export type EventTriggerContext<TriggerEventType extends TriggerEventTypeValues> =
    ${eventTriggerContextTypeDefs}
  `;
}

// Generate the actual type file
function generateTypeFile(typeToGen: EventTypeConfig): string {
  // TODO- If we eventually need more per-event custom logic, we should expand this into something more generic
  const isMetadataEvent = typeToGen.isMetadataEvent ?? false;
  return `${CODEGEN_HEADER}
import { ParameterVariableType } from "../../../parameters/mod.ts";
import {
  EventTriggerConfig,
  TriggerEventTypes,
  TriggerEventTypeValues,
  TriggerTypeValues,
} from "../../base-types.ts";
import { WrapTriggerContextDataPayload } from "../../context-helper.ts";


export type Slack${typeToGen.className}EventTriggerConfig<
TriggerType extends TriggerTypeValues,
TriggerEventType extends TriggerEventTypeValues,
> =
& EventTriggerConfig<TriggerType, TriggerEventType>
& {
  "event_type": typeof TriggerEventTypes.${typeToGen.className};
  ${isMetadataEvent ? '"metadata_event_type": string;' : ""}
};


export const SlackEvent${typeToGen.className}ContextDefinition =
  WrapTriggerContextDataPayload(${
    JSON.stringify(typeToGen.payloadShape)
  }, false);

export type SlackEvent${typeToGen.className}Context = {
  [key in keyof typeof SlackEvent${typeToGen.className}ContextDefinition]:
    ParameterVariableType<
      typeof SlackEvent${typeToGen.className}ContextDefinition[key]
    >;
};
`;
}
