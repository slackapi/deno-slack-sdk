#### The `choices` property

The `choices` property is an array of `EnumChoice` objects. Here is a closer look at the properties of the `EnumChoice` object:

| Property | Type | Description |
| ---- | --------- | ------------------ |
| `default` | The type that is being described. For example, the default for a `boolean` would be `true` or `false`.| An optional parameter default value. |
| `description` | string |An optional parameter description. |
| `examples` | An array of the type being described. | An optional list of examples.
| `hint` | string | An optional parameter hint. |
| `title` | string |An optional parameter title. |
| `type` | string |String that defines the parameter type. |
| `value` | the type that the `EnumChoice` object corresponds to — in the example below, it is `string` | The value of the corresponding choice, which must map to the values present in the sibling `enum` property. |
| `title` | string | The label to display for this `EnumChoice`. |
| `description` | string | An optional description for this `EnumChoice`. |

<details>
<summary> A `choices` example using the [`string`](#string) Slack type, </summary>

In the following example for the [`string`](#string) Slack type, defining the `choices` property allows us to have the label on the input form be capitalized, but the data we're going to save be lowercase.

```javascript
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

// ...

const inputForm = LogFruitWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Tell us your favorite fruit",
    interactivity: LogFruitWorkflow.inputs.interactivity,
    submit_label: "Submit",
    fields: {
      elements: [{
          name: "Fruit",
          title: "The three best fruits",
          type: Schema.types.string,
          enum: ['mango', 'strawberry', 'plum'],
          choices: [
            {value: 'mango', title: 'Mango!', description: 'Wonderfully tropical'},
            {value: 'strawberry', title: 'Strawberry!', description: 'Absolutely fantastic'},
            {value: 'plum', title: 'Plum!', description: 'Tart, just the way I like em'},
          ]
      }]
      required: ["Fruit"],
    },
  },
);

// ...
```

</details>