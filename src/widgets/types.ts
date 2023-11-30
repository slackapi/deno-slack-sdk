import type { ManifestWidgetSchema } from "../manifest/manifest_schema.ts";

export interface ISlackWidget {
  id: string;
  export: () => ManifestWidgetSchema;
}

export enum SlackWidgetDataMode {
  PER_INSTALLER = "per_installer",
  PER_USER = "per_user",
}

export type SlackWidgetDefinition<Definition> = Definition extends
  SlackWidgetDefinitionArgs<
    infer I,
    infer T,
    infer D,
    infer DM,
    infer WFID
  > ? SlackWidgetDefinitionArgs<I, T, D, DM, WFID>
  : never;

export type SlackWidgetDefinitionArgs<
  CallbackID extends string,
  Title extends string,
  Description extends string,
  DataMode extends SlackWidgetDataMode,
  WorkflowID extends string,
> = {
  callback_id: CallbackID;
  title: Title;
  description: Description;
  data_mode: DataMode;
  workflow_id: WorkflowID;
};
