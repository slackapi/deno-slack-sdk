import type { BlockAction, BlockElement } from "./block_kit_types.ts";

// TODO: lots of duplication here with block_actions_types.ts
/**
 * @description Block Suggestion-specific type for the `body` property of a `block_suggestion` event
 */
export type BlockSuggestionBody =
  & BlockAction // adds block_id and action_id properties
  & {
    /**
     * @description The encoded application ID the event was dispatched to, e.g. A123456.
     */
    api_app_id: string;
    /**
     * @description If applicable, the channel the Block Suggestion interaction originated from.
     */
    channel?: {
      /**
       * @description Encoded channel ID, e.g. C123456.
       */
      id: string;
      /**
       * @description Channel name, without the "#" prefix.
       */
      name: string;
    };
    /**
     * @description If applicable, the enterprise associated with the workspace the Block Suggestion interaction originated from. If not applicable, will be null.
     */
    enterprise: {
      /**
       * @description Encoded enterprise ID, e.g. E123456.
       */
      id: string;
      /**
       * @description Enterprise name.
       */
      name: string;
    } | null;
    /**
     * @description Information about the source message this Block Suggestion interaction originated from.
     * This may be optional in the case that the Block Suggestion interaction originated from a view rather than a message.
     */
    message?: {
      /**
       * @description The encoded application ID the event was dispatched to, e.g. A123456.
       */
      app_id: string;
      /**
       * @description The {@link https://api.slack.com/block-kit Block Kit} elements included in the message.
       */
      blocks: BlockElement[];
      /**
       * @description Whether the {@link https://api.slack.com/messaging/managing#threading thread} has been locked.
       */
      is_locked: boolean;
      /**
       * @description If the {@link https://api.slack.com/messaging/managing#threading thread} has at least one reply, points to the most recent reply's `ts` value.
       */
      latest_reply?: string;
      /**
       * @description {@link https://api.slack.com/metadata Message metadata}, if any was attached to the message.
       */
      metadata?: {
        event_type: string;
        event_payload: {
          // deno-lint-ignore no-explicit-any
          [key: string]: any;
        };
      };
      /**
       * @description Total number of replies in the {@link https://api.slack.com/messaging/managing#threading thread}.
       */
      reply_count: number;
      /**
       * @description Array of up to 5 encoded user IDs (i.e. U12345) that replied in the {@link https://api.slack.com/messaging/managing#threading thread}.
       */
      reply_users: string[];
      /**
       * @description Total number of users that replied in the {@link https://api.slack.com/messaging/managing#threading thread}.
       */
      reply_users_count: number;
      /**
       * @description Encoded team ID, e.g. T123456.
       */
      team: string;
      /**
       * @description The text in the message. If the message was composed of Block Kit elements, this property would
       * contain the fallback text to display in constrained UIs (like notifications) or in screenreaders. See
       * {@link https://api.slack.com/methods/chat.postMessage#blocks_and_attachments the API documentation for use of text, blocks and attachments in messages}.
       */
      text: string;
      /**
       * @description Timestamp of the parent message. If the message is already a parent message, then this value will equal the `ts` value. Use this value if you want to post a message as a {@link https://api.slack.com/messaging/managing#threading threaded reply} to a particular message.
       */
      thread_ts: string;
      /**
       * @description Timestamp of the message.
       */
      ts: string;
      /**
       * @description The type of message. This is always "message."
       */
      type: "message";
      /**
       * @description Encoded user ID of the user that posted the message, e.g. U123456.
       */
      user: string;
    };
    /**
     * @description The workspace, or team, details the Block Kit interaction originated from.
     */
    team: {
      /**
       * @description The subdomain of the team, e.g. domain.slack.com
       */
      domain: string;
      /**
       * @description Encoded team ID, e.g. T123456.
       */
      id: string;
    };
    /**
     * @description Details for the user that initiated the Block Suggestion interaction.
     */
    user: {
      /**
       * @description Encoded user ID, e.g. U123456.
       */
      id: string;
      /**
       * @description User's handle as seen in the Slack client when e.g. at-notifying the user.
       */
      name: string;
      /**
       * @description The encoded team ID for the workspace, or team, where the Block Suggestion originated from.
       */
      team_id: string;
    };
    /**
     * @description The value the user entered into the select menu.
     */
    value: string;
    // deno-lint-ignore no-explicit-any
    [key: string]: any;
    /* TODO: Other properties seen on this type that should be added at some point:
   * container: {}; // should be a reference to message or view, depending on the container for the block kit interactive componenet
   * message container looks like:
   *  "container": {
        "type": "message",
        "message_ts": "1663103912.870299",
        "channel_id": "C03DS3P5ED6",
        "is_ephemeral": false
      },
      view container looks like:
      container: { type: "view", view_id: "V041UDW806B" }
   * view: {}; // if the block kit interactive component was part of a view, details for the view are here
   */
  };
