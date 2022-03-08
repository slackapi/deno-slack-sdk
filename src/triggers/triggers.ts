import {
  ParameterDefinition,
  ParameterPropertiesDefinition,
  ParameterSetDefinition,
} from "../parameters/mod.ts";
import { TypedObjectParameterDefinition } from "../parameters/types.ts";
import { createTriggerContext, TriggerContext } from "./context.ts";
import { WorkflowDefinition } from "../workflows.ts";
import {
  IExportableTrigger,
  TriggerConfig,
  TriggerDefinition,
} from "./types.ts";
import {
  Trigger,
  TriggerAccess,
  TriggerEventTypeValues,
  TriggerTypes,
  TriggerTypeValues,
} from "./base-types.ts";
import {
  normalizeTriggerFilterDefinition,
  TriggerFilter,
  TriggerFilterDefinition,
} from "./trigger-filter.ts";

// This is a templated reference that the CLI turns into the current app's collabs when triggers are syncd
export const TRIGGER_VIZ_COLLABS = "{{collaborators}}" as const;

export class BaseTrigger<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
> {
  protected access?: TriggerAccess;

  protected channelIds?: string[];
  protected filter?: TriggerFilter;

  protected key: string;
  protected config: TriggerConfig<TriggerType, TriggerEventType>;

  protected disabled = false;

  constructor(opts: TriggerOptions<TriggerType, TriggerEventType>) {
    this.key = opts.key;
    this.config = opts.config;
    this.filter = opts.filter;

    this.disabled = opts.disabled === true;
    // We want Trigger access to default to the collaborators if not specified
    if ("access" in opts) {
      this.access = opts.access;
    }
  }

  disable() {
    this.disabled = true;

    return this;
  }

  enable() {
    this.disabled = false;

    return this;
  }

  // Creates a higher-level Trigger that is typed with the connected workflow
  runs<
    WorkflowInputs extends ParameterSetDefinition,
    WorkflowOutputs extends ParameterSetDefinition,
    WorkflowInputsObject extends ParameterPropertiesDefinition<WorkflowInputs>,
    WorkflowOutputsObject extends ParameterPropertiesDefinition<
      WorkflowOutputs
    >,
  >(
    workflow: WorkflowDefinition<
      WorkflowInputs,
      WorkflowOutputs
    >,
  ): TypedTriggerWithWorkflow<
    TriggerType,
    TriggerEventType,
    WorkflowInputs,
    WorkflowOutputs,
    WorkflowInputsObject,
    WorkflowOutputsObject
  > {
    if (isCommandTrigger(this.config.type)) {
      return new CommandTrigger(
        {
          key: this.key,
          config: this.config,
          disabled: this.disabled,
          access: this.access,
          channelIds: this.channelIds,
          filter: this.filter,
        },
        workflow,
      ) as TypedTriggerWithWorkflow<
        TriggerType,
        TriggerEventType,
        WorkflowInputs,
        WorkflowOutputs,
        WorkflowInputsObject,
        WorkflowOutputsObject
      >;
    } else if (this.config.type === TriggerTypes.Webhook) {
      // Webhook trigger
      return new WebhookTrigger({
        key: this.key,
        config: this.config,
        disabled: this.disabled,
        access: this.access,
        channelIds: this.channelIds,
        filter: this.filter,
      }, workflow) as TypedTriggerWithWorkflow<
        TriggerType,
        TriggerEventType,
        WorkflowInputs,
        WorkflowOutputs,
        WorkflowInputsObject,
        WorkflowOutputsObject
      >;
    }

    // Default to event triggers
    return new EventTrigger({
      key: this.key,
      config: this.config,
      disabled: this.disabled,
      access: this.access,
      channelIds: this.channelIds,
      filter: this.filter,
    }, workflow) as TypedTriggerWithWorkflow<
      TriggerType,
      TriggerEventType,
      WorkflowInputs,
      WorkflowOutputs,
      WorkflowInputsObject,
      WorkflowOutputsObject
    >;
  }
}

// Trigger w/ connected workflow, typed to that workflow's inputs and trigger type
export abstract class TriggerWithWorkflow<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
  WorkflowInputs extends ParameterSetDefinition,
  WorkflowOutputs extends ParameterSetDefinition,
  WorkflowInputsObject extends ParameterPropertiesDefinition<WorkflowInputs>,
  WorkflowOutputsObject extends ParameterPropertiesDefinition<WorkflowOutputs>,
> extends BaseTrigger<TriggerType, TriggerEventType>
  implements IExportableTrigger {
  public workflow: WorkflowDefinition<
    WorkflowInputs,
    WorkflowOutputs
  >;

  private inputs: OptionalInputParameterMapping<WorkflowInputs> = {};

  private teams: {
    [team: string]: TypedTriggerWithWorkflow<
      TriggerType,
      TriggerEventType,
      WorkflowInputs,
      WorkflowOutputs,
      WorkflowInputsObject,
      WorkflowOutputsObject
    >;
  } = {};

  constructor(
    opts: TriggerOptionsWithInputs<
      TriggerType,
      TriggerEventType,
      WorkflowInputs
    >,
    workflow: WorkflowDefinition<
      WorkflowInputs,
      WorkflowOutputs
    >,
  ) {
    super(opts);
    if (opts.inputs) {
      this.inputs = opts.inputs;
    }
    this.workflow = workflow;
  }

  withInputs(
    inputsFn: TriggerWithInputsFn<
      TriggerType,
      TriggerEventType,
      WorkflowInputs
    >,
  ) {
    let eventType: TriggerEventTypeValues | undefined = undefined;
    if (this.config.type === TriggerTypes.Event) {
      eventType = this.config.event_type;
    }

    const ctx = createTriggerContext(
      this.config.type,
      eventType,
    ) as TriggerContext<TriggerType, TriggerEventType>;
    this.inputs = inputsFn(ctx);

    return this;
  }

  private templatizeInputs() {
    const templatizedInputs: Trigger["inputs"] = {};

    for (const [inputName, inputValue] of Object.entries(this.inputs)) {
      // Only add inputs that are defined on the workflow itself
      if (this.workflow.inputs[inputName]) {
        if (inputValue != undefined) {
          if (isTriggerInputVisibilityConfigurable(inputValue)) {
            const transformed = {
              value: inputValue.value,
              hidden: inputValue.hidden ?? false,
              locked: inputValue.locked ?? false,
            };
            // Force a serialization of the value - this helps resolve any parameter variable references
            templatizedInputs[inputName] = JSON.parse(
              JSON.stringify(transformed),
            );
          } else {
            const transformed = {
              value: inputValue,
              hidden: false,
              locked: false,
            };
            templatizedInputs[inputName] = JSON.parse(
              JSON.stringify(transformed),
            );
          }
        }
      }
    }

    return templatizedInputs;

    function isTriggerInputVisibilityConfigurable(
      param: InputParameterBase<WorkflowInputs[string]>,
    ): param is ConfiguredInputParameterMappingValue<
      WorkflowInputs[string]
    > {
      return Object.prototype.hasOwnProperty.call(param, "value");
    }
  }

  // Alias to newer "workspace" nomenclature - will remove in future version
  environment(
    teamId: string,
    callback: TeamTriggerCallback<
      TriggerType,
      TriggerEventType,
      WorkflowInputs,
      WorkflowOutputs,
      WorkflowInputsObject,
      WorkflowOutputsObject
    >,
  ) {
    return this.workspace(teamId, callback);
  }

  workspace(
    teamId: string,
    callback: TeamTriggerCallback<
      TriggerType,
      TriggerEventType,
      WorkflowInputs,
      WorkflowOutputs,
      WorkflowInputsObject,
      WorkflowOutputsObject
    >,
  ) {
    // Use an existing team trigger if it exists, otherwise setup a new one
    let teamTrigger = this.teams[teamId];
    if (!teamTrigger) {
      if (isCommandTrigger(this.config.type)) {
        teamTrigger = new CommandTrigger(
          {
            key: this.key,
            config: this.config,
            disabled: this.disabled,
            access: this.access,
            channelIds: this.channelIds,
            inputs: this.inputs,
            filter: this.filter,
          },
          this.workflow,
        ) as TypedTriggerWithWorkflow<
          TriggerType,
          TriggerEventType,
          WorkflowInputs,
          WorkflowOutputs,
          WorkflowInputsObject,
          WorkflowOutputsObject
        >;
      } else if (this.config.type === TriggerTypes.Webhook) {
        // Webhook trigger
        teamTrigger = new WebhookTrigger({
          key: this.key,
          config: this.config,
          disabled: this.disabled,
          access: this.access,
          channelIds: this.channelIds,
          inputs: this.inputs,
          filter: this.filter,
        }, this.workflow) as TypedTriggerWithWorkflow<
          TriggerType,
          TriggerEventType,
          WorkflowInputs,
          WorkflowOutputs,
          WorkflowInputsObject,
          WorkflowOutputsObject
        >;
      } else {
        // Default to event triggers for now
        teamTrigger = new EventTrigger({
          key: this.key,
          config: this.config,
          disabled: this.disabled,
          access: this.access,
          channelIds: this.channelIds,
          inputs: this.inputs,
          filter: this.filter,
        }, this.workflow) as TypedTriggerWithWorkflow<
          TriggerType,
          TriggerEventType,
          WorkflowInputs,
          WorkflowOutputs,
          WorkflowInputsObject,
          WorkflowOutputsObject
        >;
      }
    }

    callback(teamTrigger);

    this.teams[teamId] = teamTrigger;

    return this;
  }

  export(teamId?: string): TriggerDefinition | null {
    // If we have a matching team-specific trigger, export it
    if (teamId && this.teams[teamId]) {
      return this.teams[teamId].export();
    }

    if (this.disabled) {
      return null;
    }

    const trigger: Trigger = {
      ...this.config,
      // TODO: this may need to account for non-local workflows at some point
      "function_reference": `#/workflows/${this.workflow.id}`,
      inputs: this.templatizeInputs(),
    };
    if (this.channelIds && this.channelIds.length > 0) {
      trigger.channel_ids = this.channelIds;
    }
    if (this.filter) {
      trigger.filter = this.filter;
    }

    return {
      key: this.key,
      trigger,
      access: this.access || {},
    };
  }
}

export class CommandTrigger<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
  WorkflowInputs extends ParameterSetDefinition,
  WorkflowOutputs extends ParameterSetDefinition,
  WorkflowInputsObject extends ParameterPropertiesDefinition<WorkflowInputs>,
  WorkflowOutputsObject extends ParameterPropertiesDefinition<WorkflowOutputs>,
> extends TriggerWithWorkflow<
  TriggerType,
  TriggerEventType,
  WorkflowInputs,
  WorkflowOutputs,
  WorkflowInputsObject,
  WorkflowOutputsObject
> {
  constructor(
    opts: TriggerOptionsWithInputs<
      TriggerType,
      TriggerEventType,
      WorkflowInputs
    >,
    workflow: WorkflowDefinition<
      WorkflowInputs,
      WorkflowOutputs
    >,
  ) {
    super(opts, workflow);
  }

  availableToChannel(channelId: string, userIds?: string[]) {
    this.channelIds = [channelId];
    if (userIds) {
      this.access = {
        user_ids: userIds,
      };
    }

    return this;
  }

  availableToWorkspaceUsers(userIds?: string[]) {
    this.channelIds = undefined;
    if (userIds) {
      this.access = {
        user_ids: userIds,
      };
    }

    return this;
  }

  export(teamId?: string): TriggerDefinition | null {
    const definition = super.export(teamId);
    if (
      definition && !this.channelIds &&
      (this.access?.user_ids ?? []).length === 0
    ) {
      definition.access = {
        user_ids: [TRIGGER_VIZ_COLLABS],
      };
    }

    return definition;
  }
}

export class WebhookTrigger<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
  WorkflowInputs extends ParameterSetDefinition,
  WorkflowOutputs extends ParameterSetDefinition,
  WorkflowInputsObject extends ParameterPropertiesDefinition<WorkflowInputs>,
  WorkflowOutputsObject extends ParameterPropertiesDefinition<WorkflowOutputs>,
> extends TriggerWithWorkflow<
  TriggerType,
  TriggerEventType,
  WorkflowInputs,
  WorkflowOutputs,
  WorkflowInputsObject,
  WorkflowOutputsObject
> {
  constructor(
    opts: TriggerOptionsWithInputs<
      TriggerType,
      TriggerEventType,
      WorkflowInputs
    >,
    workflow: WorkflowDefinition<
      WorkflowInputs,
      WorkflowOutputs
    >,
  ) {
    super(opts, workflow);
  }

  availableToChannel(channelId: string) {
    this.channelIds = [channelId];

    return this;
  }

  withFilter(
    filterFn: TriggerWithFilterFn<
      TriggerType,
      TriggerEventType
    >,
  ) {
    // TODO: This is just copied from the withInputs logic. Generalize this for re-use
    let eventType: TriggerEventTypeValues | undefined = undefined;
    if (this.config.type === TriggerTypes.Event) {
      eventType = this.config.event_type;
    }

    const ctx = createTriggerContext(
      this.config.type,
      eventType,
    ) as TriggerContext<TriggerType, TriggerEventType>;

    this.filter = normalizeTriggerFilterDefinition(filterFn(ctx));

    return this;
  }
}

export class EventTrigger<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
  WorkflowInputs extends ParameterSetDefinition,
  WorkflowOutputs extends ParameterSetDefinition,
  WorkflowInputsObject extends ParameterPropertiesDefinition<WorkflowInputs>,
  WorkflowOutputsObject extends ParameterPropertiesDefinition<WorkflowOutputs>,
> extends TriggerWithWorkflow<
  TriggerType,
  TriggerEventType,
  WorkflowInputs,
  WorkflowOutputs,
  WorkflowInputsObject,
  WorkflowOutputsObject
> {
  constructor(
    opts: TriggerOptionsWithInputs<
      TriggerType,
      TriggerEventType,
      WorkflowInputs
    >,
    workflow: WorkflowDefinition<
      WorkflowInputs,
      WorkflowOutputs
    >,
  ) {
    super(opts, workflow);
  }

  availableToChannel(channelId: string) {
    this.channelIds = [channelId];

    return this;
  }

  withFilter(
    filterFn: TriggerWithFilterFn<
      TriggerType,
      TriggerEventType
    >,
  ) {
    // TODO: This is just copied from the withInputs logic. Generalize this for re-use
    let eventType: TriggerEventTypeValues | undefined = undefined;
    if (this.config.type === TriggerTypes.Event) {
      eventType = this.config.event_type;
    }

    const ctx = createTriggerContext(
      this.config.type,
      eventType,
    ) as TriggerContext<TriggerType, TriggerEventType>;

    this.filter = normalizeTriggerFilterDefinition(filterFn(ctx));

    return this;
  }

  export(teamId?: string): TriggerDefinition | null {
    const definition = super.export(teamId);
    if (
      definition && !this.channelIds &&
      (this.access?.user_ids ?? []).length === 0
    ) {
      definition.access = {
        user_ids: [TRIGGER_VIZ_COLLABS],
      };
    }

    return definition;
  }
}

const isCommandTrigger = (type: TriggerTypeValues) => {
  return ([
    TriggerTypes.MessageShortcut,
    TriggerTypes.Shortcut,
  ] as string[]).includes(type);
};

type InputParameterMapping<
  TriggerType extends TriggerTypeValues,
  Params extends ParameterSetDefinition,
> = TriggerType extends typeof TriggerTypes.Event
  ? StrictInputParameterMapping<Params>
  : OptionalInputParameterMapping<Params>;

// Creates a type that includes keys from another type and they're all optional
// Worth noting, this puts the type into a "weak type" classifier, where TS will only
// error if no properties from the referenced type are supplied, but will still allow extraneous properties
type OptionalInputParameterMapping<Params extends ParameterSetDefinition> = {
  [name in keyof Params]?: InputParameterBase<Params[name]>;
};

type StrictInputParameterMapping<Params extends ParameterSetDefinition> = {
  [name in keyof Params]: InputParameterBase<Params[name]>;
};

// This creates the new parameter type, that includes the value + visibility
// and continues to allow for the "old" format.
// so both a) `param: {value: "123", locked: true, hidden: true}`
// and b) `param: "123"` are allowed.
// this wrapper type is the union of a and b.
type InputParameterBase<Param extends ParameterDefinition> =
  | InputParameterMappingValue<Param>
  | ConfiguredInputParameterMappingValue<Param>;

type ConfiguredInputParameterMappingValue<Param extends ParameterDefinition> =
  Param extends TypedObjectParameterDefinition ? {
    value: {
      [name in keyof Param["properties"]]?: InputParameterMappingValue<
        Param["properties"][name]
      >;
    };
    hidden?: boolean;
    locked?: boolean;
  }
    : {
      // TODO: currently this doesn't restrict that ONLY these properties are present
      // so something like
      // {value: 123, visibility: hidden: true, locked: true, whatever: 123} is allowed
      // but {whatever: 123} is silently dropped.
      // better would be to restrict this type to ONLY this properties (preferable)
      // or to fail in export and have the cli handle this and output an error.
      value: ConfiguredInputParameterInternalValue;
      // even in the new format, hidden and locked are not required
      // `{value: "123"}` is ok and is equivalent to `{value: "123", hidden: false, locked: false}`
      hidden?: boolean;
      locked?: boolean;
    };

type InputParameterInternalValue =
  | string
  | boolean
  | number
  | InputParameterInternalValue[]
  | UserDefinedObject;

type ConfiguredInputParameterInternalValue =
  | string
  | boolean
  | number
  | InputParameterInternalValue[]
  | ConfiguredInputUserDefinedObject;

// this type is an object, with the only restriction
// that it cannot contain the values `visibility` or `value`
// this is so that we can distinguish between `old` type and `new` type.
type UserDefinedObject = Record<string, unknown> & {
  hidden?: never;
  locked?: never;
  value?: never;
};

// once we declare an object inside the `value`, we don't have collision anymore
// and we can allow the properties.
type ConfiguredInputUserDefinedObject = Record<string, unknown>;

type InputParameterMappingValue<Param extends ParameterDefinition> =
  Param extends TypedObjectParameterDefinition ? {
    [name in keyof Param["properties"]]?: InputParameterMappingValue<
      Param["properties"][name]
    >;
  }
    : InputParameterInternalValue;

type TriggerWithFilterFn<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
> = {
  (
    ctx: TriggerContext<TriggerType, TriggerEventType>,
  ): TriggerFilter | TriggerFilterDefinition;
};

type TriggerWithInputsFn<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
  WorkflowInputs extends ParameterSetDefinition,
> = {
  (
    ctx: TriggerContext<TriggerType, TriggerEventType>,
  ): InputParameterMapping<TriggerType, WorkflowInputs>;
};

type TeamTriggerCallback<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
  WorkflowInputs extends ParameterSetDefinition,
  WorkflowOutputs extends ParameterSetDefinition,
  WorkflowInputsObject extends ParameterPropertiesDefinition<WorkflowInputs>,
  WorkflowOutputsObject extends ParameterPropertiesDefinition<WorkflowOutputs>,
> = {
  (
    trigger: TypedTriggerWithWorkflow<
      TriggerType,
      TriggerEventType,
      WorkflowInputs,
      WorkflowOutputs,
      WorkflowInputsObject,
      WorkflowOutputsObject
    >,
  ): void;
};

type TypedTriggerWithWorkflow<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
  WorkflowInputs extends ParameterSetDefinition,
  WorkflowOutputs extends ParameterSetDefinition,
  WorkflowInputsObject extends ParameterPropertiesDefinition<WorkflowInputs>,
  WorkflowOutputsObject extends ParameterPropertiesDefinition<WorkflowOutputs>,
> = TriggerType extends typeof TriggerTypes.Event ? (EventTrigger<
  TriggerType,
  TriggerEventType,
  WorkflowInputs,
  WorkflowOutputs,
  WorkflowInputsObject,
  WorkflowOutputsObject
>)
  : (TriggerType extends typeof TriggerTypes.Webhook ? (WebhookTrigger<
    TriggerType,
    TriggerEventType,
    WorkflowInputs,
    WorkflowOutputs,
    WorkflowInputsObject,
    WorkflowOutputsObject
  >)
    : CommandTrigger<
      TriggerType,
      TriggerEventType,
      WorkflowInputs,
      WorkflowOutputs,
      WorkflowInputsObject,
      WorkflowOutputsObject
    >);

type TriggerOptions<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
> = {
  key: string;
  disabled?: boolean;
  config: TriggerConfig<TriggerType, TriggerEventType>;
  access?: TriggerAccess;
  channelIds?: string[];
  filter?: TriggerFilter;
};
type TriggerOptionsWithInputs<
  TriggerType extends TriggerTypeValues,
  TriggerEventType extends TriggerEventTypeValues,
  WorkflowInputs extends ParameterSetDefinition,
> = TriggerOptions<TriggerType, TriggerEventType> & {
  inputs?: OptionalInputParameterMapping<WorkflowInputs>;
};
