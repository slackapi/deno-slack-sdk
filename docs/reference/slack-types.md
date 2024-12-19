---
slug: /deno-slack-sdk/reference/slack-types
---

import ChoicesProperty from '/content/deno-slack-sdk/guides/datatypes/_choices-property-snippet.md';

# Slack types 

The examples of declaring a type are shown below in both TypeScript, as they would appear in an app built using the Deno SDK, and in JSON, as they would be defined in a manifest. All manifests can be written in JSON; however, declaring types in an app using the Deno SDK is done differently, requiring a reference to the `Schema.slack` package for non-primitive types.

| Name | Type | Description |
| :--- | :--- | :--- |
| [`array`](#array) | Array | An array of items (based on a type that you specify).
| [`blocks`](#blocks) | Array of Slack Blocks | An array of objects that contain layout and style information about your message. |
| [`boolean`](#boolean) | Boolean | A logical value, must be either `true` or `false`. |
| [`canvas_id`](#canvasid) | String | A Slack canvas ID, such as `F123456AB`. |
| [`canvas_template_id`](#canvastemplateid) | String | A Slack canvas template ID, such as `T5678ABC`. |
| [`channel_id`](#channelid) | String | A Slack channel ID, such as `C123ABC456` or `D123ABC456`. |
| [`date`](#date) | String | A string containing a date, format is displayed as `YYYY-MM-DD`. |
| [`expanded_rich_text`](#expandedrichtext) | Object | A way to nicely format messages in your app. This type cannot convert other message types, e.g. blocks or strings, and is explicitly for use with canvases. |
| [`file_id`](#fileid) | Object | A file ID, such as `F123ABC456`. |
| [`integer`](#integer) | Integer | A whole number, such as `-1`, `0`, or `31415926535`. |
| [`interactivity`](#interactivity) | Object | An object that contains context about the interactive event that led to opening of the form. |
| [`list_id`](#list-id) | String | A Slack list ID, such as `F123456ABC`. | 
| [`message_context`](#message-context) | Object | An individual instance of a message. |
| [`message_ts`](#message-ts) | String | A Slack-specific hash/timestamp necessary for referencing events like messages in Slack. |
| [`number`](#number) | Number | A number that allows decimal points such as `13557523.0005`. |
| [`oauth2`](#oauth2) | Object | The OAuth2 context created after authenticating with [external auth](/deno-slack-sdk/guides/integrating-with-services-requiring-external-authentication). |
| [`object`](#object) | Object | A custom Javascript object, like `{"site": "slack.com"}`. |
| [`rich_text`](#rich-text) | Object | A way to nicely format messages in your app. This type cannot convert other message types e.g. blocks, strings. |
| [`string`](#string) | String | UTF-8 encoded string, up to 4000 bytes. |
| [`team_id`](#team_id) | String | A Slack team ID, such as `T1234567890`. |
| [`timestamp`](#timestamp) | Integer | A Unix timestamp in seconds. Not compatible with Slack message timestamps - use [string](#string) instead. |
| [`user_context`](#usercontext) | Object | Represents a user who interacted with a workflow at runtime. |
| [`user_id`](#userid) | String | A Slack user ID, such as `U123ABC456` or `W123ABC456`. |
| [`usergroup_id`](#usergroupid) | String | A Slack usergroup ID, such as `S123ABC456`. |


## Slack types for datastores {#datastores}
When defining a [datastore](/deno-slack-sdk/guides/using-datastores), you can use certain Slack types for its attributes. Attributes accept only a single `type` property in the definition, instead of all the common properties listed above. The following is a list of the Slack types supported for use with datastores:

* [`channel_id`](#channelid)
* [`date`](#date)
* [`message_ts`](#message-ts)
* [`rich_text`](#rich-text)
* [`timestamp`](#timestamp)
* [`user_id`](#userid)
* [`usergroup_id`](#usergroupid)

Here's a sample datastore definition using Slack types for attributes:

```javascript
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const MyDatastore = DefineDatastore({
  name: "my_datastore",
  primary_key: "id",
  attributes: {
    id: { type: Schema.types.string },
    channel: { type: Schema.slack.types.channel_id },
    message: { type: Schema.types.string },
    author: { type: Schema.slack.types.user_id },
    isMember: { type: Schema.types.boolean },
  },
});
```

---

## Array {#array}

Type: `array`

| Property | Type | Description |
| -------- | --------- | ----------- |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `items` | object | The type of items in the array. Can be one of the following types: [`channel_id`](#channelid), [`user_id`](#userid), [`usergroup_id`](#usergroupid), [`timestamp`](#timestamp), [`string`](#string), [`integer`](#integer), [`number`](#number), [`boolean`](#boolean), [`list_id`](#list-id), [`canvas_id`](#canvasid), [`canvas_template_id`](#canvastemplateid), `channel_canvas_id`, [`team_id`](#team_id), [`file_id`](#fileid). |
| `minItems` | integer | Minimum number of items allowed. |
| `maxItems` | integer | Maximum number of items allowed. |


Declare an `array` of types:

<Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
{
  name: "departments",
  title: "Your department",
  type: Schema.types.array,
  items: {
    type: Schema.types.string,
    enum: ["marketing", "design", "sales", "engineering"],
  },
  default: ["sales", "engineering"],
}
// ...
```

</TabItem>
<TabItem value="json" label="JSON Manifest">

```json
// ...
"departments": {
  "title": "Your department",
  "type": "array",
  "items": {
    "type": "string",
    "enum": [
      "marketing", "design", "sales", "engineering"
    ]
  }
}
// ...
```

  </TabItem>
</Tabs>

:::warning[Arrays and object types]

Be sure to define the array's properties in the `items` object. Untyped objects are not currently supported. In addition, you can only use an object as the item type of array if it's a custom object. Otherwise, you may receive the following error:

`Unexpected schema encountered for array type: failed to match exactly one allowed schema for items - {"type":"one_of"} (failed_constraint).`

:::

<details>
<summary>Array example</summary>

In this example function, we have an array of the [custom type](/deno-slack-sdk/guides/creating-a-custom-type) `ChannelType` as both an `input_parameter` and `output_parameter`. See this custom type and array in action in the [Deno Archive Channel](https://github.com/slack-samples/deno-archive-channel) sample app.

```javascript
const ChannelType = DefineType(...)

export const FilterStaleChannelsDefinition = DefineFunction({
  callback_id: "filter_stale_channels",
  title: "Filter Stale Channels",
  description:
    "Filter out any channels that have received messages within the last 6 months",
  source_file: "functions/filter_stale_channels.ts",
  input_parameters: {
    properties: {
      channels: {
        type: Schema.types.array,
        description: "The list of Channel IDs to filter",
        items: {
          type: ChannelType,
        },
      },
    },
    required: ["channels"],
  },
  output_parameters: {
    properties: {
      filtered_channels: {
        type: Schema.types.array,
        description: "The list of stale Channel IDs",
        items: {
          type: ChannelType,
        },
      },
    },
    required: [],
  },
});
```
</details>

---

## Blocks {#blocks}
Type: `slack#/types/blocks`

| Property | Type | Description |
| -------- | --------- | ----------- |
| `default` | The type that is being described.| An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |

Declare an array of [Block Kit](https://api.slack.com/block-kit) JSON objects.

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
properties: {
  forecast: {
    type: Schema.slack.types.blocks,
  },
},
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ... 
"input_parameters": {
  "forecast": {
  "type": "slack#/types/blocks"
  }
}
// ... 
```


  </TabItem>
</Tabs>

If you use [Block Kit builder](https://api.slack.com/tools/block-kit-builder) to build your Block Kit objects, be sure to _only_ grab the `blocks` array. For example:

```json
[
  {
    "type": "section",
    "text": {
      "type": "plain_text",
      "text": "This is a plain text section block.",
      "emoji": true
    }
  },
  {
    "type": "image",
    "image_url": "example.com/png"
    "alt_text": "inspiration"
  }
]
```



<details>
<summary>Blocks example</summary>

In this example function, we get the current weather forecast.

```javascript
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const ForecastFunctionDefinition = DefineFunction({
  callback_id: "get_forecast",
  title: "Weather forecast",
  description: "A function to get the weather forecast",
  source_file: "functions/weather_forecast.ts",
  input_parameters: {
    properties: {
      city: {
        type: Schema.types.string,
        description: "City",
      },
      country: {
        type: Schema.types.string,
        description: "Country",
      },
      state: {
        type: Schema.types.string,
        description: "State",
      },
    },
    required: ["city"],
  },
  output_parameters: {
    properties: {
      forecast: {
        type: Schema.slack.types.blocks,
        description: "Weather forecast",
      },
    },
    required: ["forecast"],
  },
});
```
</details>


---

## Boolean {#boolean}
Type: `boolean`

| Property | Type | Description |
| -------- | --------- | ----------- |
| `default` | The type that is being described. For a `boolean` it would be `true` or `false`.| An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |

Declare a `boolean` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
isMember: {
  type: Schema.types.boolean,
}
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"isMember": {
  "type": "boolean"
}
// ...
```

  </TabItem>
</Tabs>

<details>
<summary>Boolean example</summary>

In this example datastore definition, we use a `boolean` type to capture whether the message author holds membership in our club.

```javascript
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const MyDatastore = DefineDatastore({
  name: "my_datastore",
  primary_key: "id",
  attributes: {
    id: { type: Schema.types.string },
    channel: { type: Schema.slack.types.channel_id },
    message: { type: Schema.types.string },
    author: { type: Schema.slack.types.user_id },
    isMember: { type: Schema.types.boolean },
  },
});
```
</details>



---

## Channel ID {#channelid}
Type: `slack#/types/channel_id`

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described.| An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `choices` | EnumChoice[] | Defines labels that correspond to the `enum` values. See below. |

<ChoicesProperty/>


Declare a `channel_id` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
  },
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"input_parameters": {
  "channel": {
    "type": "slack#/types/channel_id"
  }
}
// ...
```

  </TabItem>
</Tabs>

---

## Canvas ID {#canvasid}
Type: `slack#/types/canvas_id`

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `choices` | EnumChoice[] | Defines labels that correspond to the `enum` values. See below |
| `render_condition` | Object | The `render_condition` property contains three properties of its own: the `operator` property is a string logical operator which acts on the conditions; the `is_required` property is a boolean indicating if the property is required, and the `conditions` property is an array of object conditions which specify if the field should be rendered.

<ChoicesProperty/>

Declare a `canvas_id` type: 

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
{
  name: "project_canvas",
  title: "Project Canvas",
  type: Schema.slack.types.canvas_id
}
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"project_canvas": {
  "title": "Project Canvas",
  "type": "slack#/types/canvas_id"
}
// ...
```

  </TabItem>
</Tabs>

<details>
<summary>Canvas ID example</summary>

In this example workflow, we get a canvas ID and information to update it.

```javascript
import { Schema } from "deno-slack-sdk/mod.ts";
import { CanvasWorkflow } from "../workflows/canvas.ts";

const inputForm = CanvasWorkflow.addStep(
  Schema.slack.functions.OpenForm, 
  {
    title: "Provide info to update a canvas",
    interactivity: CanvasWorkflow.inputs.interactivity,
    submit_label: "Submit",
    fields: {
      elements: [
        {
          name: "canvas",
          title: "Canvas to update",
          type: Schema.slack.types.canvas_id
        },
        {
          name: "content",
          title: "Content",
          type: Schema.slack.types.expanded_rich_text,
        }
      ],
      required: ["canvas", "content"],
    },
  },
);
```
</details>



---

## Canvas Template ID {#canvastemplateid}
Type: `slack#/types/canvas_template_id`

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `choices` | EnumChoice[] | Defines labels that correspond to the `enum` values. See below |

<ChoicesProperty/>

Declare a `canvas_template_id` type: 

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
{
  name: "onboarding_template",
  title: "Onboarding Canvas Template",
  type: Schema.slack.types.canvas_template_id
}
// ...
```
  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"onboarding_template": {
  "title": "Onboarding Canvas Template",
  "type": "slack#/types/canvas_template_id"
}
// ...
```
  </TabItem>
</Tabs>

<details>
<summary>Canvas Template ID example</summary>

In this example workflow, we receive a `canvas_template_id` for creating a new canvas.

```javascript
import { Schema } from "deno-slack-sdk/mod.ts";
import { CanvasWorkflow } from "../workflows/canvas.ts";

const inputForm = CanvasWorkflow.addStep(
  Schema.slack.functions.OpenForm, 
  {
    title: "Provide a template your canvas from",
    interactivity: CanvasWorkflow.inputs.interactivity,
    submit_label: "Submit",
    fields: {
      elements: [
        {
          name: "template",
          title: "Canvas template",
          type: Schema.slack.types.canvas_template_id
        },
        {
          name: "title",
          title: "Canvas title",
          type: Schema.types.string,
        },
        {
          name: "owner_id",
          title: "Owner ID",
          type: Schema.slack.types.user_id
        }
      ],
      required: ["template", "title", "owner_id"],
    },
  },
);
```
</details>



---

## Date {#date}
Type: `slack#/types/date`

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `choices` | EnumChoice[] | Defines labels that correspond to the `enum` values. See below. |

<ChoicesProperty/>

Declare a `date` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
fields: {
  elements: [
    {
      name: "date",
      title: "Date Posted",
      type: Schema.slack.types.date,
    },
  ],
},
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"fields": {
  "elements": [
    {
      "date_posted": {
      "type": "slack#/types/date"
      }
    }
  ]
}
// ...
```
  </TabItem>
</Tabs>

<details>
<summary>Date example</summary>

In this example workflow, a form requires a `date` as input, which is printed along with the message after the form is submitted.

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const TestReverseWorkflow = DefineWorkflow({
  callback_id: "test_reverse",
  title: "Test reverse",
  input_parameters: {
    properties: {
      channel: { type: Schema.slack.types.channel_id },
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["interactivity"],
  },
});

const formData = TestReverseWorkflow.addStep(Schema.slack.functions.OpenForm, {
  title: "Reverse string form",
  submit_label: "Submit form",
  description: "Submit a string to reverse",
  interactivity: TestReverseWorkflow.inputs.interactivity,
  fields: {
    required: ["channel", "stringInput", "date"],
    elements: [
      {
        name: "stringInput",
        title: "String input",
        type: Schema.types.string,
      },
      {
        name: "date",
        title: "Date Posted",
        type: Schema.slack.types.date,
      },
      {
        name: "channel",
        title: "Post in",
        type: Schema.slack.types.channel_id,
        default: TestReverseWorkflow.inputs.channel,
      },
    ],
  },
});

import { ReverseFunction } from "../functions/reverse.ts";
const reverseStep = TestReverseWorkflow.addStep(ReverseFunction, {
  input: formData.outputs.fields.stringInput,
});

// Add the date parameter as a step in your workflow. The message and date will be printed side by side.
TestReverseWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: formData.outputs.fields.channel,
  message: reverseStep.outputs.reverseString + " " +
    formData.outputs.fields.date,
});
```
</details>



---

## Expanded Rich Text {#expandedrichtext}
Type: `slack#/types/expanded_rich_text`

The `expanded_rich_text` type is a superset of the [`rich_text`](#rich-text) type, and is explicitly for use with canvases. It accepts all elements that `rich_text` provides and behaves in the same way as `rich_text`, except that it also accepts the following additional sub-elements:

| Property | Type | Description |
| -------- | --------- | ----------- |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `rich_text_header` | object | The text for the header, in the form of a `plain_text` [text object](https://api.slack.com/reference/block-kit/composition-objects#text). |
| `rich_text_divider` | object | Creates a divider to place between text. |
| `rich_text_list` | object | This is an expanded version of the [`rich_text_list`](https://api.slack.com/reference/block-kit/blocks#rich_text_list) element used in `rich_text` blocks. It behaves the same, except that it accepts two new style fields: `checked` and `unchecked`. This allows for the creation of checklists. |

Declare an `expanded_rich_text` type: 

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
{
  name: "canvas_content",
  title: "Canvas Content",
  type: Schema.slack.types.expanded_rich_text
}
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"canvas_content": {
  "title": "Canvas Content",
  "type": "slack#/types/expanded_rich_text"
}
// ...
```

  </TabItem>
</Tabs>

<details>
<summary>Expanded rich text example</summary>

Here is an example payload that shows the `expanded_rich_text` type and all of its sub-elements:

```javascript
[
    {
        "type": "expanded_rich_text",
        "elements": [
            {
                "type": "rich_text_header",
                "elements": [
                    {
                        "type": "text",
                        "text": "Hello world"
                    }
                ],
                "level": 1
            },
            {
                "type": "rich_text_list",
                "style": "unchecked",
                "indent": 0,
                "elements": [
                    {
                        "type": "rich_text_section",
                        "elements": [
                            {
                                "type": "text",
                                "text": "one"
                            }
                        ]
                    }
                ],
                "border": 0
            },
            {
                "type": "rich_text_list",
                "style": "checked",
                "indent": 1,
                "elements": [
                    {
                        "type": "rich_text_section",
                        "elements": [
                            {
                                "type": "text",
                                "text": "two"
                            }
                        ]
                    }
                ],
                "border": 0
            },
            {
                "type": "rich_text_divider"
            }
        ]
    }
]
```

</details>



---

## File ID {#fileid}
Type: `slack#/types/file_id`

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `allowed_filetypes_group` | string | If provided, a predefined subset of filetypes will be restricted for file upload when this type is used in an OpenForm function. Can either be `ALL` or `IMAGES_ONLY`. |
| `allowed_filetypes` | string[] | If provided, only these filetypes are allowed for file upload in an `OpenForm` function. Empty arrays are not allowed. Filetypes defined here will override any restrictions set in `allowed_filetypes_group`. |

Declare a `file_id` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
fields: {
  elements: [
    {
      title: "Enter a file",
      name: "image-123",
      type: Schema.types.array,
      maxItems: 1,
      description: "",
      items: {
        type: Schema.slack.types.file_id,
        allowed_filetypes_group: "ALL"
      }
    },
  ],
},
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"file": {
  "type": "slack#/types/file_id",
  "allowed_filetypes_group": "ALL"
}
// ...
```

  </TabItem>
</Tabs>

### OpenForm parameters {#openform-parameters}

When using the `file_id` type in an OpenForm function, there are two additional parameters that can be utilized.

| Parameter | Type | Description |
|---|---|---|
| `allowed_filetypes_group` | `string` | Can be either `ALL` or `IMAGES_ONLY`. If provided, specifies allowed predefined subset of filetypes for file in an OpenForm function. |
| `allowed_filetypes` | `array` of `strings` | If provided, specifies allowed filetypes for file upload in an OpenForm function. Overrides any restrictions set in `allowed_filetypes_group`. |

<details>
<summary>File ID example</summary>

In this example workflow, we collect a file from the user.

```js
import { Schema } from "deno-slack-sdk/mod.ts";
import { ImageWorkflow } from "../workflows/ImageWorkflow.ts";

const getImageStep = ImageWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Submit this form",
    interactivity: ImageWorkflow.inputs.interactivity,
    fields:{
      elements: [
        {
        title: "Enter a file",
        name: "image-123",
        type: Schema.types.array,
        maxItems: 1,
        description: "",
        items: {
          type: Schema.slack.types.file_id,
          allowed_filetypes_group: "ALL"
        },
      }
      ],
      required: ["image-123"],
    }
  },
);
```
</details>



---

## Integer {#integer}
Type: `integer`

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `minimum` | number | Absolute minimum acceptable value for the integer. |
| `maximum` | number | Absolute maximum acceptable value for the integer. |
| `enum` | number[] | Constrain the available integer options to just the list of integers denoted in the `enum` property. Usage of `enum` also instructs any UI that collects a value for this parameter to render a dropdown select input rather than a free-form text input.|
| `choices` | EnumChoice[] | Defines labels that correspond to the `enum` values. See below. |

<ChoicesProperty/>

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

Declare an `integer` type:

```javascript
// ...
  name: "meetings",
  title: "Number of meetings",
  type: Schema.types.integer,
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"meetings": {
  "title": "Number of meetings",
  "type": "integer"
}
// ...
```

  </TabItem>
</Tabs>

<details>
<summary>Integer example</summary>

In this example workflow, we check the number of meetings we have scheduled for the day.

```javascript
import { Schema } from "deno-slack-sdk/mod.ts";
import { MeetingsWorkflow } from "../workflows/meetings.ts";

const inputForm = MeetingsWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Number of meetings",
    interactivity: MeetingsWorkflow.inputs.interactivity,
    submit_label: "Check meetings",
    fields: {
      elements: [
        {
          name: "channel",
          title: "Channel to send results to",
          type: Schema.slack.types.channel_id,
          default: MeetingsWorkflow.inputs.channel,
        },
        {
          name: "meetings",
          title: "Number of meetings",
          description: "meetings",
          type: Schema.types.integer,
          minimum: -1,
          maximum: 5,
        },
        {
          name: "meetingdate",
          title: "Meeting date",
          type: Schema.slack.types.date,
        },
      ],
      required: ["channel", "meetings", "meetingdate"],
    },
  },
);
```
</details>



---

## Interactivity {#interactivity}
Type: `slack#/types/interactivity`

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `interactivity_pointer` | string | A pointer used to confirm user-initiated interactivity in a function. |
| `interactor` | `user_context` | Context information of the user who initiated the interactivity. |

Declare the `interactivity` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
properties: {
  interactivity: {
    type: Schema.slack.types.interactivity,
  },
},
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"input_parameters": {
  "interactivity": {
  "type": "slack#/types/interactivity"
  }
}
// ...
```
  </TabItem>
</Tabs>

<details>
<summary>Interactivity example</summary>

In this example workflow, we specify that it is an interactive workflow.

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const GreetingWorkflow = DefineWorkflow({
  callback_id: "greeting_workflow",
  title: "Send a greeting",
  description: "Send a greeting to channel",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      channel: { type: Schema.slack.types.channel_id },
    },
    required: ["interactivity"],
  },
});
```
</details>



---

## List ID {#list-id}

Type: `slack#/types/list_id`

| Property | Type | Description |
| -------- | --------- | ----------- |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |

Declare the `list_id` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
  name: "current_bugs",
  title: "Current Bug List",
  type: Schema.slack.types.list_id,
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"current_bugs": {
  "title": "Current Bug List",
  "type": "slack#/types/list_id"
}
// ...
```
  </TabItem>
</Tabs>

<details>
<summary>List ID example</summary>

In this example workflow, we disseminate meeting information.

```javascript
import { Schema } from "deno-slack-sdk/mod.ts";
import { MeetingsWorkflow } from "../workflows/meetings.ts";

const inputForm = MeetingsWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Meeting follow-up",
    interactivity: MeetingsWorkflow.inputs.interactivity,
    submit_label: "Meeting follow-up",
    fields: {
      elements: [
        {
          name: "channel",
          title: "Channel to send info to",
          type: Schema.slack.types.channel_id,
          default: MeetingsWorkflow.inputs.channel,
        },
        {
          name: "meetingdate",
          title: "Meeting date",
          type: Schema.slack.types.date,
        },
        {
          name: "notes",
          title: "Meeting notes",
          type: Schema.slack.types.canvas_id
        },
        {
          name: "actions",
          title: "Meeting to-dos",
          description: "Action items from the meeting",
          type: Schema.slack.types.list_id
        }
      ],
      required: ["channel", "meetingdate","notes", "actions"],
    },
  },
);
```
</details>


---

## Message Context {#message-context}
Type: `slack#/types/message_context`

| Property | Type | Description |
| -------- | --------- | ----------- |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |

The `message_context` type is used in the [`ReplyInThread`](/deno-slack-sdk/reference/slack-functions/reply_in_thread) Slack function as the target message you want to reply to.

For example, let's say you have a workflow step that uses the [`SendMessage`](/deno-slack-sdk/reference/slack-functions/send_message) function. If you want to send a reply to that message in a follow-on
step that calls the [`ReplyInThread`](/deno-slack-sdk/reference/slack-functions/reply_in_thread) function, pass
the return value from the first step into the `message_context` parameter of `ReplyInThread`.

Here's a brief example:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// Send a message to channel with ID C123456
const msgStep = GreetingWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: "C123456",
  message: "This is a message to the channel.",
});

// Send a message as an in-thread reply to the above message by passing
// the outputs' message_context property
GreetingWorkflow.addStep(Schema.slack.functions.ReplyInThread, {
  message_context: msgStep.outputs.message_context,
  message: "This is a threaded reply to the above message.",
});
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"message_context": {
  "type": "slack#/types/message_context"
}
// ...
```

  </TabItem>
</Tabs>

You can also construct and deconstruct the `message_context` as you see fit in your app. Here is what comprises `message_context`:

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `message_ts` | [Schema.slack.types.message_ts](#message-ts) | A Slack-specific hash/timestamp necessary for referencing events like messages in Slack. | Required |
| `channel_id` | [Schema.slack.types.channel_id](#channelid) | The ID of the channel where the message is posted. | Optional |

Any individual property on message_context could be referenced too. See the below example where we pass `message_context.message_ts` to the `trigger_ts` property:

```javascript
//...

const message = CreateSurveyWorkflow.addStep(
  Schema.slack.functions.ReplyInThread,
  {
    message_context: {
      channel_id: CreateSurveyWorkflow.inputs.channel_id,
      message_ts: CreateSurveyWorkflow.inputs.parent_ts,
    },
    message:
      `Your feedback is requested – <${trigger.outputs.trigger_url}|survey now>!`,
  },
);

CreateSurveyWorkflow.addStep(SaveSurveyFunctionDefinition, {
  channel_id: CreateSurveyWorkflow.inputs.channel_id,
  parent_ts: CreateSurveyWorkflow.inputs.parent_ts,
  reactor_id: CreateSurveyWorkflow.inputs.reactor_id,
  trigger_ts: message.outputs.message_context.message_ts, //Here we reference message_ts from message_context
  trigger_id: trigger.outputs.trigger_id,
  survey_stage: "SURVEY",
});

//...
```



---

## Message Timestamp {#message-ts}
Type: `slack#/types/message_ts`

| Property | Type | Description |
| -------- | --------- | ----------- |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |

Declare a `message_ts` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
//...
input_parameters: {
  properties: {
    message_ts : {
      type: Schema.slack.types.message_ts,
      description: "The ts value of a message"
    },
  },
},
//...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"input_parameters": {
  "message_ts": {
  "type": "slack#/types/message_ts",
  "description": "The ts value of a message"
  }
}
// ...
```

  </TabItem>
</Tabs>

<details>
<summary>Message Timestamp example</summary>

In this example workflow from the [Simple Survey sample app](https://github.com/slack-samples/deno-simple-survey), a `message_ts` is used as an input parameter in two functions.

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

import { CreateGoogleSheetFunctionDefinition } from "../functions/create_google_sheet.ts";
import { CreateTriggerFunctionDefinition } from "../functions/create_survey_trigger.ts";
import { SaveSurveyFunctionDefinition } from "../functions/save_survey.ts";
import { RemoveThreadTriggerFunctionDefintion } from "../functions/remove_thread_trigger.ts";

const CreateSurveyWorkflow = DefineWorkflow({
  callback_id: "create_survey",
  title: "Create a survey",
  description: "Add a request for feedback to a message",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "The channel containing the reacted message",
      },
      parent_ts: {
        type: Schema.types.string,
        description: "Message timestamp of the reacted message",
      },
      parent_url: {
        type: Schema.types.string,
        description: "Permalink to the reacted message",
      },
      reactor_id: {
        type: Schema.slack.types.user_id,
        description: "User that added the reacji",
      },
    },
    required: ["channel_id", "parent_ts", "parent_url", "reactor_id"],
  },
});

// Step 1: Create a new Google spreadsheet
const sheet = CreateSurveyWorkflow.addStep(
  CreateGoogleSheetFunctionDefinition,
  {
    google_access_token_id: {},
    title: CreateSurveyWorkflow.inputs.parent_ts,
  },
);

// Step 2: Create a link trigger for the survey
const trigger = CreateSurveyWorkflow.addStep(CreateTriggerFunctionDefinition, {
  google_spreadsheet_id: sheet.outputs.google_spreadsheet_id,
  reactor_access_token_id: sheet.outputs.reactor_access_token_id,
});

// Step 3: Delete the prompt message and metadata
CreateSurveyWorkflow.addStep(RemoveThreadTriggerFunctionDefintion, {
  channel_id: CreateSurveyWorkflow.inputs.channel_id,
  parent_ts: CreateSurveyWorkflow.inputs.parent_ts,
  reactor_id: CreateSurveyWorkflow.inputs.reactor_id,
});

// Step 4: Notify the reactor of the survey spreadsheet
CreateSurveyWorkflow.addStep(Schema.slack.functions.SendDm, {
  user_id: CreateSurveyWorkflow.inputs.reactor_id,
  message:
    `Feedback for <${CreateSurveyWorkflow.inputs.parent_url}|this message> is being <${sheet.outputs.google_spreadsheet_url}|collected here>!`,
});

// Step 5: Send the survey into the reacted thread
const message = CreateSurveyWorkflow.addStep(
  Schema.slack.functions.ReplyInThread,
  {
    message_context: {
      channel_id: CreateSurveyWorkflow.inputs.channel_id,
      message_ts: CreateSurveyWorkflow.inputs.parent_ts, //used here as part of the message_context object
    },
    message:
      `Your feedback is requested – <${trigger.outputs.trigger_url}|survey now>!`,
  },
);

// Step 6: Store new survey metadata
CreateSurveyWorkflow.addStep(SaveSurveyFunctionDefinition, {
  channel_id: CreateSurveyWorkflow.inputs.channel_id,
  parent_ts: CreateSurveyWorkflow.inputs.parent_ts,
  reactor_id: CreateSurveyWorkflow.inputs.reactor_id,
  trigger_ts: message.outputs.message_context.message_ts, //Referenced here individually
  trigger_id: trigger.outputs.trigger_id,
  survey_stage: "SURVEY",
});

export default CreateSurveyWorkflow;


```
</details>



---

## Number {#number}
Type: `number`

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `minimum` | number | Absolute minimum acceptable value for the number.|
| `maximum` | number | Absolute maximum acceptable value for the number. |
| `enum` | number[] | Constrain the available number options to just the list of numbers denoted in the `enum` property. Usage of `enum` also instructs any UI that collects a value for this parameter to render a dropdown select input rather than a free-form text input.|
| `choices` | EnumChoice[] | Defines labels that correspond to the `enum` values. See below. |

<ChoicesProperty/>

Declare a `number` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
{
  name: "distance",
  title: "race distance",
  type: Schema.types.number,
}
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"distance": {
  "title": "race distance",
  "type": "number"
}
// ...
```

  </TabItem>
</Tabs>

<details>
<summary>Number example</summary>

In this example workflow, we collect a runner's distance and date of their last run.

```javascript
import { Schema } from "deno-slack-sdk/mod.ts";
import { LogRunWorkflow } from "../workflows/log_run.ts";

const inputForm = LogRunWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Log a run",
    interactivity: LogRunWorkflow.inputs.interactivity,
    submit_label: "Log run",
    fields: {
      elements: [
        {
          name: "channel",
          title: "Channel to send logged run to",
          type: Schema.slack.types.channel_id,
          default: LogRunWorkflow.inputs.channel,
        },
        {
          name: "distance",
          title: "Distance (in miles)",
          type: Schema.types.number,
          description: "race distance (in miles)",
          minimum: 0,
          maximum: 26.2,
        },
        {
          name: "rundate",
          title: "Run date",
          type: Schema.slack.types.date,
        },
      ],
      required: ["channel", "distance", "rundate"],
    },
  },
);
```
</details>



---

## OAuth2 {#oauth2}
Type: `slack#/types/credential/oauth2`

| Property | Type | Description |
| -------- | --------- | ----------- |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |

Declare an `oauth2` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
  githubAccessTokenId: {
    type: Schema.slack.types.oauth2,
    oauth2_provider_key: "github",
  },
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"github_access_token_id": {
  "type": "slack#/types/credential/oauth2",
  "oauth2_provider_key": "github"
}
// ...
```

  </TabItem>
</Tabs>

<details>
<summary>OAuth2 example</summary>

In this example, we use the `oauth2` type for an input parameter in a [custom function](/deno-slack-sdk/guides/creating-custom-functions). To read more about a full implementation of `oauth2`, check out [External authentication](/deno-slack-sdk/guides/integrating-with-services-requiring-external-authentication).

```javascript
export const CreateIssueDefinition = DefineFunction({
  callback_id: "create_issue",
  title: "Create GitHub issue",
  description: "Create a new GitHub issue in a repository",
  source_file: "functions/create_issue.ts",
  input_parameters: {
    properties: {
      githubAccessTokenId: {
        type: Schema.slack.types.oauth2,
        oauth2_provider_key: "github",
      },
      url: {
        type: Schema.types.string,
        description: "Repository URL",
      },

// ...

  },
  output_parameters: {
    properties: {
      GitHubIssueNumber: {
        type: Schema.types.number,
        description: "Issue number",
      },
      GitHubIssueLink: {
        type: Schema.types.string,
        description: "Issue link",
      },
    },
    required: ["GitHubIssueNumber", "GitHubIssueLink"],
  },
});
```
</details>



---

## Object {#object}
Type: `object`

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `choices` | EnumChoice[] | Defines labels that correspond to the `enum` values. See below. |

<ChoicesProperty/>
	
:::warning[Object types are not supported within Workflow Builder at this time]

If your function will be used within Workflow Builder, we suggest not using the Object types at this time.
  
:::


Objects can be typed or untyped. Here we have examples of both.

### Typed Object {#typed-object}

Refer to [custom types](/deno-slack-sdk/guides/creating-a-custom-type) for more information about typed objects, including properties and how to use  [`DefineProperty`](/deno-slack-sdk/guides/creating-a-custom-type#define-property) to enforce required properties.

Declare a custom `object` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
properties: {
  reviewer: DefineProperty({
    type: Schema.types.object,
    properties: {
      login: { type: "string" },
    },
  }),
},
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"input_parameters": {
  "reviewer": {
    "type": "object",
    "properties": {
      "login": { "type": "string" }
    }
  } 
}

//...
```

  </TabItem>
</Tabs>

<details>
<summary>Object example</summary>

In this example workflow, we notify authors about updates to their file review status.

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

export const ReviewStatusWorkflow = DefineWorkflow({
  callback_id: "review_status_workflow",
  title: "Review status",
  description: "Review status",
  input_parameters: {
    properties: {
      action: {
        type: Schema.types.string,
      },
      review_request: {
        type: Schema.types.object,
        properties: {
          number: { type: "integer" },
          title: { type: "string" },
          body: { type: "string" },
          changed_files: { type: "integer" },
        },
      },
      author: {
        type: Schema.types.object,
        properties: {
          login: { type: "string" },
        },
      },
      reviewer: {
        type: Schema.types.object,
        properties: {
          login: { type: "string" },
        },
      },
    },
    required: ["action", "review_request", "author", "reviewer"],
  },
});
```
</details>

### Untyped Object {#untyped-object}
Untyped objects do not have properties defined on them. They are malleable; you can assign any kind of properties to them. In TypeScript lingo, these objects are typed as [`any`](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any).

Declare an untyped `object` type:

```javascript
properties: {
  flexibleObject: {
    type: Schema.types.object,
  }
},
```


---

## Rich text {#rich-text}
Type: `slack#/types/rich_text`

| Property | Type | Description |
| -------- | --------- | ----------- |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |

Declare a `rich_text` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
elements: [
  {
    name: "formattedStringInput",
    title: "String input",
    type: Schema.slack.types.rich_text,
  },
],
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"elements": {
  "formattedStringInput": {
    "title": "String input",
    "type": "slack#/types/rich_text"
}
}
// ...
```

  </TabItem>
</Tabs>

<details>
<summary>Rich text example</summary>

In this example workflow, we collect a formatted message from the user using the `rich_text` type.

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const TestWorkflow = DefineWorkflow({
  callback_id: "test",
  title: "Test",
  input_parameters: {
    properties: {
      channel: { type: Schema.slack.types.channel_id },
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["interactivity"],
  },
});

const formData = TestWorkflow.addStep(Schema.slack.functions.OpenForm, {
  title: "Send Message Form",
  submit_label: "Send Message form",
  interactivity: TestWorkflow.inputs.interactivity,
  fields: {
    required: ["channel", "formattedStringInput"],
    elements: [
      {
        name: "formattedStringInput",
        title: "String input",
        type: Schema.slack.types.rich_text,
      },
      {
        name: "channel",
        title: "Post in",
        type: Schema.slack.types.channel_id,
        default: TestWorkflow.inputs.channel,
      },
    ],
  },
});

// To share this message object with other users, embed it into a Slack function such as SendMessage.
TestWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: formData.outputs.fields.channel,
  message: formData.outputs.fields.formattedStringInput,
});
```
</details>



---

## String {#string}
Type: `string`

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `minLength` | number | Minimum number of characters comprising the string. |
| `maxLength` | number | Maximum number of characters comprising the string. |
| `enum` | string[] | Constrain the available string options to just the list of strings denoted in the `enum` property. Usage of `enum` also instructs any UI that collects a value for this parameter to render a dropdown select input rather than a free-form text input.|
| `choices` | EnumChoice[] | Defines labels that correspond to the `enum` values. See below. |
| `format` | string | Define accepted format of the string. Valid options include `url` or `email`. |

<ChoicesProperty/>

Declare a `string` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
{
  name: "notes",
  title: "Notes",
  type: Schema.types.string,
},
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"notes": {
  "type": "string",
  "title": "notes"
}
// ...
```

  </TabItem>
</Tabs>

<details>
<summary>String example</summary>

In this example workflow, we use a `string` type to allow a user to add notes about their time off request.

```javascript
import { Schema } from "deno-slack-sdk/mod.ts";
import { CreateFTOWorkflow } from "../workflows/create_fto_workflow.ts";

const ftoRequestData = CreateFTOWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Request dates off",
    description: "Hooray for vacay!",
    interactivity: CreateFTOWorkflow.inputs.interactivity,
    submit_label: "Submit request",
    fields: {
      elements: [
        {
          name: "start_date",
          title: "Start date",
          type: Schema.slack.types.date,
        },
        {
          name: "end_date",
          title: "End date",
          type: Schema.slack.types.date,
        },
        {
          name: "notes",
          title: "Notes",
          description: "Anything to note?",
          type: Schema.types.string,
          long: true, // renders the input box as a multi-line text box on the form
        },
      ],
      required: ["start_date", "end_date"],
    },
  },
);
```
</details>



---

## Team ID {#team_id}
Type: `slack#/types/team_id`

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `choices` | EnumChoice[] | Defines labels that correspond to the `enum` values. See below. |

<ChoicesProperty/>

:::warning

This type is not supported for use in the [OpenForm](/deno-slack-sdk/reference/slack-functions/open_form) Slack function.

:::


Declare a `team_id` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
attributes: {
  team_id: {
    type: Schema.slack.types.team_id,
  },
},
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"team_id": {
  "type": "slack#/types/team_id"
}
// ...
```

  </TabItem>
</Tabs>

---

## Timestamp {#timestamp}
Type: `slack#/types/timestamp`

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described.| An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `choices` | EnumChoice[] | Defines labels that correspond to the `enum` values. See below. |

<ChoicesProperty/>

Declare a `timestamp` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
inputs: {
  currentTime: {
    value: "{{data.trigger_ts}}",
    type: Schema.slack.types.timestamp,
  },
},
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"input_parameters": {
  "current_time": {
  "type": "slack#/types/timestamp"
  }
}

// ...
```
  </TabItem>
</Tabs>

<details>
<summary>Timestamp example</summary>

In this example trigger, we call a workflow that logs an incident and the time it occurred.

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { Trigger } from "deno-slack-api/types.ts";

export const MyWorkflow = DefineWorkflow({
  callback_id: "my_workflow",
  title: "My workflow",
  input_parameters: {
    properties: {
      currentTime: { type: Schema.slack.types.timestamp },
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: [],
  },
});

export const incidentTrigger: Trigger<typeof MyWorkflow.definition> = {
  type: "shortcut",
  name: "Log an incident",
  workflow: `#/workflows/${MyWorkflow.definition.callback_id}`,
  inputs: {
    currentTime: { value: "{{data.trigger_ts}}" },
    interactivity: { value: "{{data.interactivity}}" },
  },
};
```
</details>

---

## User context {#usercontext}

Type: `slack#/types/user_context`

<details>
<summary>Using <code>user_context</code> in Workflow Builder</summary>

In Workflow Builder, this input type will not have a visible input field and cannot be set manually by a builder

Instead, the way the value is set is dependent on the situation:

* **If the workflow starts from an explicit user action (with a link trigger, for example),** then the `user_context` will be passed from the trigger to the function input. If the workflow contains a step that alters the `user_context` value (like a message with a button), then the altered `user_context` value is passed to the function input.

* **If the workflow starts from something _other_ than an explicit user action (from a scheduled trigger, for example),** then the builder of the workflow must place a step that sets the `user_context` value (like a message with a button). This value will then be passed to the input of the function.

If a workflow step requires `user_context` and there is no way to ascertain the value within Workflow Builder, the workflow cannot be published.

</details>

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `id` | string | The `user_id` of the person to which the `user_context` belongs. |
| `secret` | string | A hash used internally by Slack to validate the authenticity of the `id` in the `user_context`. This can be safely ignored, since it's only used by us at Slack to avert malicious actors! |

Declare the `user_context` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
input_parameters: {
  properties: {
    person_reporting_bug: {
      type: Schema.slack.types.user_context,
      description: "Which user?",
    },
  },
},
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"input_parameters": {
  "person_reporting_bug": {
  "type": "slack#/types/user_context",
  "description": "Which user?"
  }
}
// ...
```

  </TabItem>
</Tabs>

<details>
<summary>User context example</summary>

In this example workflow, we use the `Schema.slack.types.user_context` type to report a bug in a system and to collect the reporter's information.

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const ReportBugWorkflow = DefineWorkflow({
  callback_id: "report_bug",
  title: "Report a Bug",
  description: "Report a bug",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "Which channel?",
      },
      person_reporting_bug: {
        type: Schema.slack.types.user_context,
        description: "Which user?",
      },
    },
    required: ["person_reporting_bug"],
  },
});

import { CreateBugFunction } from "../functions/create_bug.ts";

ReportBugWorkflow.addStep(
  CreateBugFunction,
  {
    title: "title",
    summary: "summary",
    urgency: "S0",
    channel_id: ReportBugWorkflow.inputs.channel_id,
    creator: ReportBugWorkflow.inputs.person_reporting_bug,
  },
);
```
</details>



---

## User ID {#userid}
Type: `slack#/types/user_id`

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described.| An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `choices` | EnumChoice[] | Defines labels that correspond to the `enum` values. See below. |

<ChoicesProperty/>

Declare a `user_id` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
{
  name: "runner",
  title: "Runner",
  type: Schema.slack.types.user_id,
}
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"runner": {
  "title": "Runner",
  "type": "slack#/types/user_id"
}
// ...
```
  </TabItem>
</Tabs>

<details>
<summary>User ID example</summary>

In this example workflow, we get a runner's ID and the distance of their logged run.

```javascript
import { Schema } from "deno-slack-sdk/mod.ts";
import { RunWorkflow } from "../workflows/run.ts";

const inputForm = RunWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Log your run",
    interactivity: RunWorkflow.inputs.interactivity,
    submit_label: "Submit",
    fields: {
      elements: [
        {
          name: "channel",
          title: "Channel to send entry to",
          type: Schema.slack.types.channel_id,
          default: RunWorkflow.inputs.channel,
        },
        {
          name: "runner",
          title: "Runner",
          type: Schema.slack.types.user_id,
        },
        {
          name: "distance",
          title: "Distance (in miles)",
          type: Schema.types.number,
        },
      ],
      required: ["channel", "runner", "distance"],
    },
  },
);
```
</details>



---

## Usergroup ID {#usergroupid}
Type: `slack#/types/usergroup_id`

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described. | An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `choices` | EnumChoice[] | Defines labels that correspond to the `enum` values. See below. |

<ChoicesProperty/>

Declare a `usergroup_id` type:

  <Tabs groupId="code-format">
  <TabItem value="deno" label="Deno SDK">

```javascript
// ...
attributes: {
  usergroup_id: {
    type: Schema.slack.types.usergroup_id,
  },
},
// ...
```

  </TabItem>
  <TabItem value="json" label="JSON manifest">

```json
// ...
"usergroup_id": {
  "type": "slack#/types/usergroup_id"
}
// ...
```

</TabItem>
</Tabs>

<details>
<summary>Usergroup ID example</summary>

In this example datastore definition, we store work shift details for a team.

```javascript
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const MyShifts = DefineDatastore({
  name: "shifts",
  primary_key: "id",
  attributes: {
    id: { type: Schema.types.string },
    team_id: { type: Schema.types.team_id },
    channel: { type: Schema.slack.types.channel_id },
    usergroup_id: { type: Schema.slack.types.usergroup_id },
    shiftRotation: { type: Schema.types.string },
  },
});
```
</details>