import { readAll } from "https://deno.land/std@0.99.0/io/util.ts";
import { SlackAPIClient } from "./client.ts";
import { handleFunction } from "./handlers/handle-function.ts";
import { handleAction } from "./handlers/handle-block-action.ts";
import { handleViewSubmission } from "./handlers/handle-view_submission.ts";
import {
  InvocationPayload,
  ISlackProject,
  ManifestSchema,
  ProjectFunction,
  SlackProjectType,
} from "./types.ts";
import { ParameterSetDefinition } from "./parameters/mod.ts";
import { ICustomType } from "./types/types.ts";

// Creates a new Project and kicks it off in the right mode
// either receiving an incoming event to route
// or generating a manifest
export const Project = (definition: SlackProjectType) => {
  const project = new SlackProject(definition);

  // Check for cli args
  const outputManifest = Deno.args.indexOf("--manifest") >= 0;
  if (outputManifest) {
    // Forcing a serialization/deserialization to ensure it can serialize into yaml successfully
    // otherwise some object references can serialize into yaml in an odd way
    const manifest = JSON.stringify(project.export(), null, 2);
    console.log(manifest);
    return;
  }

  // Run the project
  project.run();
};
export class SlackProject implements ISlackProject {
  constructor(private definition: SlackProjectType) {
    this.definition = definition;
    this.registerFeatures();
  }

  runtime() {
    return this.definition.runtime;
  }

  private registerFeatures() {
    // Loop through functions to automatically register any referenced types
    this.definition.functions?.forEach((func) => {
      func.registerParameterTypes(this);
    });

    // Loop through types to automatically register any referenced sub-types
    const registeredTypes = this.definition.types || [];
    for (let i = 0; i < registeredTypes.length; i++) {
      this.definition.types?.[i].registerParameterTypes(this);
    }
  }

  registerFunction(func: ProjectFunction) {
    if (!this.definition.functions) this.definition.functions = [];
    // Check to make sure function doesn't already exist on project
    else if (this.definition.functions.some((f) => func.id === f.id)) return;
    // Add function to project
    this.definition.functions.push(func);
  }

  // Loop through a ParameterSetDefinition to register each individual type
  registerTypes(parameterSet: ParameterSetDefinition) {
    Object.values(parameterSet ?? {}).forEach((param) => {
      if (param.type instanceof Object) {
        this.registerType(param.type);
      }
    });
  }

  registerType(customType: ICustomType) {
    if (!this.definition.types) this.definition.types = [];
    // Check to make sure type doesn't already exist on project
    if (this.definition.types.some((type) => type.id === customType.id)) {
      return;
    }
    // Add type to project
    this.definition.types.push(customType);
  }

  // Reads event in over stdin
  // TODO: pull this out of the class into some kind of receiver fn? would we ever have other receiver types?
  private async receiveEvent() {
    const stdinContent = await readAll(Deno.stdin);
    const stdin = new TextDecoder().decode(stdinContent);
    // deno-lint-ignore no-explicit-any
    const payload: InvocationPayload<any> = JSON.parse(stdin);

    return payload;
  }

  // deno-lint-ignore no-explicit-any
  private async routeEvent(payload: InvocationPayload<any>) {
    // Need to pluck out the right value to help us route the event, not always in the same place
    const eventType = payload?.body?.event?.type || payload?.body?.type;

    // This can represent any payload received from a slack event
    // eventually we could type all of these
    // deno-lint-ignore no-explicit-any
    let body: any = {};
    const env = payload.context.variables || {};

    const baseURL = env["SLACK_API_URL"] || "https://slack.com/api/";
    const client = new SlackAPIClient(
      payload.context.bot_access_token,
      baseURL,
    );

    switch (eventType) {
      case "function_executed": {
        // TODO: update this once we move calls to functions.completeSuccess out of runtime and into SDK
        body = await handleFunction({
          payload,
          client,
          project: this.definition,
          env,
        });
        break;
      }
      case "block_actions": {
        body = await handleAction({
          payload,
          client,
          actions: this.definition?._actions ?? [],
          env,
        });
        break;
      }
      case "view_submission": {
        body = await handleViewSubmission({
          payload,
          client,
          project: this.definition,
          env,
        });
        break;
      }
      default:
        throw Error(`unsupported event: ${eventType}`);
    }

    return body;
  }

  async run() {
    const payload = await this.receiveEvent();
    const body = await this.routeEvent(payload);

    // The last line should be the returned object set to the body property
    console.log(JSON.stringify(body));
    Deno.exit();
  }

  private ensureBotScopes(): string[] {
    const includedScopes = this.definition.botScopes || [];

    // Tables need tables:read and tables:write scopes
    if (Object.keys(this.definition.tables || {}).length > 0) {
      if (!includedScopes.includes("tables:read")) {
        includedScopes.push("tables:read");
      }
      if (!includedScopes.includes("tables:write")) {
        includedScopes.push("tables:write");
      }
    }

    return includedScopes;
  }

  checkDupTableNames() {
    const tables = this.definition.tables || [];
    const names: string[] = [];
    tables.forEach((t) => {
      if (names.indexOf(t.name) >= 0) {
        const msg = `Duplicate entry found for table where name=${t.name}`;
        throw new Error(msg);
      }
      names.push(t.name);
    });
  }

  export() {
    const def = this.definition;

    const manifest: ManifestSchema = {
      "_metadata": {
        // todo: is there a more idiomatic way of defining this? constant file?
        "major_version": 2,
      },
      "display_information": {
        background_color: def.backgroundColor,
        name: def.name,
        long_description: def.longDescription,
        short_description: def.description,
      },
      icon: def.icon,
      "oauth_config": {
        scopes: {
          bot: this.ensureBotScopes(),
        },
      },
      features: {
        bot_user: {
          display_name: def.displayName || def.name,
        },
      },
      runtime: def.runtime,
      "outgoing_domains": def.outgoingDomains || [],
    };

    if (def.functions) {
      manifest.functions = def.functions?.reduce((acc = {}, fn) => {
        acc[fn.id] = fn.export();
        return acc;
      }, {} as ManifestSchema["functions"]);
    }

    if (def.tables) {
      this.checkDupTableNames();
      manifest.tables = def.tables?.reduce((acc = {}, table) => {
        acc[table.name] = table.export();
        return acc;
      }, {} as ManifestSchema["tables"]);
    }

    if (def.types) {
      manifest.types = def.types?.reduce((acc = {}, customType) => {
        acc[customType.id] = customType.definition;
        return acc;
      }, {} as ManifestSchema["types"]);
    }

    return manifest;
  }
}
