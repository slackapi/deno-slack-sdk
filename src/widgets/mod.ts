import { ManifestWidgetSchema } from "../manifest/manifest_schema.ts";
import {
  ISlackWidget,
  SlackWidgetDataMode,
  SlackWidgetDefinitionArgs,
} from "./types.ts";

export const DefineWidget = <
  CallbackID extends string,
  Title extends string,
  Description extends string,
  DataMode extends SlackWidgetDataMode,
  WorkflowID extends string,
>(
  definition: SlackWidgetDefinitionArgs<
    CallbackID,
    Title,
    Description,
    DataMode,
    WorkflowID
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
> implements ISlackWidget {
  public id: string;
  public definition: SlackWidgetDefinitionArgs<
    CallbackID,
    Title,
    Description,
    DataMode,
    WorkflowID
  >;

  constructor(
    definition: SlackWidgetDefinitionArgs<
      CallbackID,
      Title,
      Description,
      DataMode,
      WorkflowID
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
    };
  }

  toJSON() {
    return this.export();
  }
}
