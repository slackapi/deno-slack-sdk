import { ParameterVariableType } from "../../parameters/mod.ts";
import Schema from "../../schema/mod.ts";
import {
  BaseTriggerConfig,
  TriggerTypes,
  TriggerTypeValues,
} from "../base-types.ts";
import { WrapTriggerContextDataPayload } from "../context-helper.ts";

export type MessageShortcutConfig<T extends TriggerTypeValues> =
  & BaseTriggerConfig<T>
  & {
    type: typeof TriggerTypes.MessageShortcut;
    name: string;
    description?: string;
  };

export const MessageShortcutContextDefinition = WrapTriggerContextDataPayload({
  "channel_id": {
    type: Schema.slack.types.channel_id,
    description: "The channel the shortcut was run in",
  },
  "user_id": {
    type: Schema.slack.types.user_id,
    description: "The user who ran the shortcut",
  },
  message: {
    type: Schema.types.object,
    properties: {
      ts: {
        type: Schema.types.string,
      },
      text: {
        type: Schema.types.string,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      },
    },
  },
}, false);

export type MessageShortcutContext = {
  [key in keyof typeof MessageShortcutContextDefinition]: ParameterVariableType<
    typeof MessageShortcutContextDefinition[key]
  >;
};
