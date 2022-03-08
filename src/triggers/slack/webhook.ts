import { ParameterVariableType } from "../../parameters/mod.ts";
import {
  BaseTriggerConfig,
  TriggerTypes,
  TriggerTypeValues,
} from "../base-types.ts";
import { WrapTriggerContextDataPayload } from "../context-helper.ts";

export type WebhookConfig<T extends TriggerTypeValues> =
  & BaseTriggerConfig<T>
  & {
    type: typeof TriggerTypes.Webhook;
  };

export const WebhookContextDefinition = WrapTriggerContextDataPayload({}, true);

export type WebhookContext = {
  [key in keyof typeof WebhookContextDefinition]: ParameterVariableType<
    typeof WebhookContextDefinition[key]
  >;
};
