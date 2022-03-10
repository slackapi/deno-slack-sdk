import { ParameterSetDefinition } from "./parameters/mod.ts";
import {
  ManifestFunction,
  ManifestSchema,
  SlackManifestType,
} from "./types.ts";
import { ICustomType } from "./types/types.ts";

export const Manifest = (definition: SlackManifestType) => {
  const manifest = new SlackManifest(definition);
  return manifest.export();
};

export class SlackManifest {
  constructor(private definition: SlackManifestType) {
    this.registerFeatures();
  }

  export() {
    const def = this.definition;
    const manifest = {
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
          display_name: def.displayName ||
            def.name,
        },
      },
      runtime: def.runtime,
      "outgoing_domains": def.outgoingDomains || [],
    } as ManifestSchema;

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

  registerFunction(func: ManifestFunction) {
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
}
