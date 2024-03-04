import { ManifestWidgetSchema } from "../manifest/manifest_schema.ts";
import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../parameters/types.ts";
import {
  ISlackWidget,
  SlackWidgetDataMode,
  SlackWidgetDefinitionArgs,
  SlackWidgetView
} from "./types.ts";

export const DefineWidget = <
  CallbackID extends string,
  Title extends string,
  Description extends string,
  DataMode extends SlackWidgetDataMode,
  WorkflowID extends string,
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInputs extends PossibleParameterKeys<InputParameters>,
  RequiredOutputs extends PossibleParameterKeys<OutputParameters>,
  View extends SlackWidgetView,
>(
  definition: SlackWidgetDefinitionArgs<
    CallbackID,
    Title,
    Description,
    DataMode,
    WorkflowID,
    InputParameters,
    OutputParameters,
    RequiredInputs,
    RequiredOutputs,
    View
  >,
) => {
  return new WidgetDefinition(definition);
};

export class WidgetDefinition<
  CallbackID extends string,
  Title extends string,
  Description extends string,
  DataMode extends SlackWidgetDataMode,
  WorkflowID extends string,
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInputs extends PossibleParameterKeys<InputParameters>,
  RequiredOutputs extends PossibleParameterKeys<OutputParameters>,
> implements ISlackWidget {
  public id: string;
  public definition: SlackWidgetDefinitionArgs<
    CallbackID,
    Title,
    Description,
    DataMode,
    WorkflowID,
    InputParameters,
    OutputParameters,
    RequiredInputs,
    RequiredOutputs
  >;

  constructor(
    definition: SlackWidgetDefinitionArgs<
      CallbackID,
      Title,
      Description,
      DataMode,
      WorkflowID,
      InputParameters,
      OutputParameters,
      RequiredInputs,
      RequiredOutputs
    >,
  ) {
    this.id = definition.callback_id;
    this.definition = definition;
  }

  export(): ManifestWidgetSchema {
    return {
      title: this.definition.title,
      description: this.definition.description,
      data_mode: this.definition.data_mode,
      workflow_callback_id: this.definition.workflow_callback_id,
      input_parameters: this.definition.input_parameters,
      output_parameters: this.definition.output_parameters,
      dependencies: this.definition.dependencies,
      view: this.definition.view,
    };
  }

  toJSON() {
    return this.export();
  }
}
