import { ParameterSetDefinition } from "../../../parameters/mod.ts";
import Schema from "../../../schema/mod.ts";
import { pascalCase } from "https://deno.land/x/case@v2.1.0/mod.ts";

export class EventTypeConfig {
  public className: string;
  public fileName: string;

  constructor(
    public eventTypeName: string,
    public payloadShape: ParameterSetDefinition,
    public isMetadataEvent: boolean = false,
  ) {
    this.className = this.getClassName();
    this.fileName = this.getFileName();
  }

  // Get the file name to use for this event
  private getFileName(): string {
    return this.eventTypeName.replace("slack#/events/", "");
  }

  // Get the classname to use for
  private getClassName(): string {
    return pascalCase(this.eventTypeName.replace("slack#/events/", ""));
  }
}

export const EventTypesConfig: Array<EventTypeConfig> = [
  new EventTypeConfig("slack#/events/reaction_added", {
    user_id: {
      type: Schema.slack.types.user_id,
      description: "The user who reacted to the message",
    },
    reaction: {
      type: Schema.types.string,
      description: "The reaction added",
    },
    channel_id: {
      type: Schema.slack.types.channel_id,
    },
    message_ts: {
      type: Schema.types.string,
    },
  }),

  new EventTypeConfig("slack#/events/message_metadata_posted", {
    channel_id: {
      type: Schema.slack.types.channel_id,
      description: "The channel where the reaction happened",
    },
    user_id: {
      type: Schema.slack.types.user_id,
      description: "The user who posted the message",
    },
    message_ts: {
      type: Schema.slack.types.timestamp,
      description: "The message timestamp",
    },
    metadata: {
      type: Schema.types.object,
      description: "The message metadata",
      properties: {
        event_type: {
          type: Schema.types.string,
        },
        event_payload: {
          type: Schema.types.object,
        },
      },
    },
  }, true),

  new EventTypeConfig("slack#/events/user_joined_channel", {
    user_id: {
      type: Schema.slack.types.user_id,
      description: "The user who joined the channel",
    },
    channel_id: {
      type: Schema.slack.types.channel_id,
    },
    inviter_id: {
      type: Schema.slack.types.user_id,
      description: "The user who invited the joining user",
    },
    channel_type: {
      type: Schema.types.string,
    },
  }),

  new EventTypeConfig("slack#/events/user_joined_team", {
    user: {
      type: Schema.types.object,
      description: "The user who joined the team",
      properties: {
        user_id: {
          type: Schema.slack.types.user_id,
        },
        team_id: {
          type: Schema.types.string,
        },
        name: {
          type: Schema.types.string,
        },
        display_name: {
          type: Schema.types.string,
        },
        real_name: {
          type: Schema.types.string,
        },
        timezone: {
          type: Schema.types.string,
        },
        is_bot: {
          type: Schema.types.boolean,
        },
      },
    },
  }),

  new EventTypeConfig("slack#/events/channel_created", {
    channel: {
      type: Schema.types.object,
      description: "The channel",
      properties: {
        id: {
          type: Schema.slack.types.channel_id,
        },
        name: {
          type: Schema.types.string,
        },
        created: {
          type: Schema.types.integer,
        },
        creator_id: {
          type: Schema.slack.types.user_id,
        },
      },
    },
  }),

  new EventTypeConfig("slack#/events/dnd_updated", {
    user_id: {
      type: Schema.slack.types.user_id,
    },
    dnd_status: {
      type: Schema.types.object,
      description: "The dnd status",
      properties: {
        dnd_enabled: {
          type: Schema.types.boolean,
        },
        next_dnd_start_ts: {
          type: Schema.types.integer,
        },
        next_dnd_end_ts: {
          type: Schema.types.integer,
        },
      },
    },
  }),
];
