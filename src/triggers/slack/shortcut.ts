import { ParameterVariableType } from "../../parameters/mod.ts";
import Schema from "../../schema/mod.ts";
import {
  BaseTriggerConfig,
  TriggerTypes,
  TriggerTypeValues,
} from "../base-types.ts";
import { WrapTriggerContextDataPayload } from "../context-helper.ts";

export type ShortcutConfig<T extends TriggerTypeValues> =
  & BaseTriggerConfig<T>
  & {
    type: typeof TriggerTypes.Shortcut;
    name: string;
    description?: string;
  };

// These define the trigger-specific context objects/types used in a trigger's withInputs function
export const ShortcutContextDefinition = WrapTriggerContextDataPayload({
  "channel_id": {
    type: Schema.slack.types.channel_id,
    description: "The channel the shortcut was run in",
  },
  "user_id": {
    type: Schema.slack.types.user_id,
    description: "The user who ran the shortcut",
  },
}, false);

export type ShortcutContext = {
  [key in keyof typeof ShortcutContextDefinition]: ParameterVariableType<
    typeof ShortcutContextDefinition[key]
  >;
};
