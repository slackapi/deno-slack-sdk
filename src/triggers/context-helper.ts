import { ParameterSetDefinition } from "../parameters/mod.ts";
import Schema from "../schema/mod.ts";

export type TriggerContextEnvelope<
  TriggerDataPayload extends ParameterSetDefinition,
  AdditionalProperties extends boolean,
> = {
  type: {
    type: typeof Schema.types.string;
  };
  data: {
    type: typeof Schema.types.object;
    properties: TriggerDataPayload;
    additionalProperties: AdditionalProperties;
  };
};

// Wraps a Trigger data payload with the common envelope
export const WrapTriggerContextDataPayload = <
  TriggerDataPayload extends ParameterSetDefinition,
  AdditionalProperties extends boolean,
>(
  triggerDataPayload: TriggerDataPayload,
  additionalProperties: AdditionalProperties,
): TriggerContextEnvelope<TriggerDataPayload, AdditionalProperties> => {
  return {
    type: {
      type: Schema.types.string,
    },
    data: {
      type: Schema.types.object,
      properties: triggerDataPayload,
      additionalProperties,
    },
  };
};
