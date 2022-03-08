import {
  ISlackTable,
  ManifestTableSchema,
  SlackTableColumns,
  SlackTableDefinition,
} from "./types.ts";
import { ISlackAPIClient } from "../types.ts";
import { SlackTableApi } from "./api.ts";

export const DefineTable = <Columns extends SlackTableColumns>(
  name: string,
  definition: SlackTableDefinition<Columns>,
) => {
  return new SlackTable(name, definition);
};

class SlackTable<Columns extends SlackTableColumns>
  implements ISlackTable<Columns> {
  public name: string;

  private definition: SlackTableDefinition<Columns>;

  constructor(name: string, definition: SlackTableDefinition<Columns>) {
    this.name = name;
    this.definition = definition;
  }

  api(client: ISlackAPIClient): SlackTableApi<Columns> {
    return new SlackTableApi(client, this.name, this.definition);
  }

  export(): ManifestTableSchema {
    return {
      primary_key: this.definition.primary_key as string,
      columns: this.definition.columns,
    };
  }
}
