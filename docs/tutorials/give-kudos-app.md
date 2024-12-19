# Give kudos app

<PaidPlanBanner />

import SlackMessage from '@site/src/components/SlackMessage';

<SlackMessage pfp="img/give-kudos/pirate-parrot.png" name="Kudo" message="Ahoy matey! Welcome aboard the Give Kudos App Tutorial!" />

This app will allow users to give kudos and share kind words with anyone in your workspace.

We're setting sail on our maiden voyage – creating and deploying a workflow app – and would love to show you the ropes. By the end of the expedition, we'll have an app to parrot personal "kudos" throughout a workspace. Nothing is more important than a crew's morale, after all!

A curiosity of the waters is not the only thing you need to sail the open seas, so ensure you have the following prerequisites completed, then climb aboard to discover what it takes to be captain of your own ship – that is, developing your own Slack app!

Before we begin, ensure you have the following prerequisites completed:
* Install the [Slack CLI](/deno-slack-sdk/guides/getting-started).
* Run `slack auth list` and ensure your workspace is listed.
* If your workspace is not listed, address any issues by following along with the [Getting started](/deno-slack-sdk/guides/getting-started), then come on back.

## Choose your heading

How much guidance would you like on this journey?

## Use a blank app

If you're ready to take the helm yourself, you can create a blank app with the Slack CLI. Don't worry, we'll be right beside you. 

```
slack create give-kudos-app --template https://github.com/slack-samples/deno-blank-template
```
## Use a pre-built app

If you'd like to follow along without steering the ship, use the pre-built [Give Kudos app](https://github.com/slack-samples/deno-give-kudos):

```
slack create give-kudos-app --template https://github.com/slack-samples/deno-give-kudos
```

Once you have your new project ready to go, change into your project directory.

## Comprehend the manifest

Before setting sail, we'll need to take inventory of our ship's cargo. The [manifest](/deno-slack-sdk/guides/using-the-app-manifest) is essentially an overview summary in a file at the root of your project. It is created automatically when you create a project using the Slack CLI. An inspection of the `manifest.ts` of the [sample app](https://github.com/slack-samples/deno-give-kudos) reveals a collection of workflows, functions, and other app-related attributes.

```javascript
// manifest.ts

import { Manifest } from "deno-slack-sdk/mod.ts";
import { FindGIFFunction } from "./functions/find_gif.ts";
import { GiveKudosWorkflow } from "./workflows/give_kudos.ts";

export default Manifest({
  name: "Kudo",
  description: "Brighten someone's day with a heartfelt thank you",
  icon: "assets/icon.png",
  functions: [FindGIFFunction],
  workflows: [GiveKudosWorkflow],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
```

The details of this expedition’s manifest are soon to follow, but first let's shine a light through the fog and get a bearing on the three fundamentals of a Slack app: [workflows](/deno-slack-sdk/guides/creating-workflows), [functions](/deno-slack-sdk/guides/creating-slack-functions), and [triggers](/deno-slack-sdk/guides/using-triggers).


## Define the app building blocks

A [workflow](/deno-slack-sdk/guides/creating-workflows) is a collection of processes, executed in response to certain events. In nautical terms, repairing the hull is a common workflow that happens when yours truly runs the ship aground.

The processes that make up a workflow are known as [functions](/deno-slack-sdk/guides/creating-slack-functions). Functions can be built-in, everyday actions such as sending a message or opening a form - or made [custom](/deno-slack-sdk/guides/creating-custom-functions), defined by your own logic with various inputs and outputs.

On the sea, raising the sails and scrubbing the decks are oft run functions.

[Triggers](/deno-slack-sdk/guides/using-triggers) act as inspiration for the actions of a workflow, defining when a workflow is invoked. Certain events in Slack (such as a clicked link or reaction added) or a schedule of specified time intervals can serve as triggers for a workflow.

After taking in the view from the mast, we’re ready to set sail!

## Weave a workflow

The goal of our expedition is to build an app that can perform the task of parroting a personalized message. To do so, a workflow called "Give kudos" is created in `workflows/give_kudos.ts`. This workflow will contain all the actions our app needs to complete that task. 


```javascript
// workflows/give_kudos.ts
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const GiveKudosWorkflow = DefineWorkflow({
  callback_id: "give_kudos_workflow",
  title: "Give kudos",
  description: "Acknowledge the impact someone had on you",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

// your steps go here

export { GiveKudosWorkflow };
```

This workflow doesn't do anything - yet. For now, just note that it'll contain steps that require user interactivity. 


## Sketch the steps

Our task of sharing kudos can be accomplished with three actions:

* collecting information about a message,
* finding the right GIF, 
* then sharing the love in the form of a message (bottle not included).

Let's look at how these actions are added as steps to a workflow. Each step is composed of a function definition as well as the input object. The input object allows the outputs of one step to become inputs to another in a chain of functions.

The first step is composed of a [Slack function](/deno-slack-sdk/guides/creating-slack-functions), [`OpenForm`](/deno-slack-sdk/reference/slack-functions/open_form), that will, as hinted, open a form for the user. This lets our app collect the kudos users want to give. 


```javascript
// workflows/give_kudos.ts

...

/* Step 1. Collect message information */
const kudo = GiveKudosWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Give someone kudos",
    interactivity: GiveKudosWorkflow.inputs.interactivity,
    submit_label: "Share",
    description: "Continue the positive energy through your written word",
    fields: {
      elements: [{
        name: "doer_of_good_deeds",
        title: "Whose deeds are deemed worthy of a kudo?",
        description: "Recognizing such deeds is dazzlingly desirable of you!",
        type: Schema.slack.types.user_id,
      }, {
        name: "kudo_channel",
        title: "Where should this message be shared?",
        type: Schema.slack.types.channel_id,
      }, {
        name: "kudo_message",
        title: "What would you like to say?",
        type: Schema.types.string,
        long: true,
      }, {
        name: "kudo_vibe",
        title: 'What is this kudo\'s "vibe"?',
        description: "What sorts of energy is given off?",
        type: Schema.types.string,
        enum: [
          "Appreciation for someone 🫂",
          "Celebrating a victory 🏆",
          "Thankful for great teamwork ⚽️",
          "Amazed at awesome work ☄️",
          "Excited for the future 🎉",
          "No vibes, just plants 🪴",
        ],
      }],
      required: ["doer_of_good_deeds", "kudo_channel", "kudo_message"],
    },
  },
);

...
```

The form will look like this for the user wanting to give kudos.

![The form within slack](/img/give-kudos/give-kudos-open-form.png)

The second step is composed of a [custom function](/deno-slack-sdk/guides/creating-custom-functions), `FindGIFFunction`. This is a function built specifically for this app. It'll find a GIF related to the "vibe" someone gives a message. 

```javascript
// workflows/give_kudos.ts
import { FindGIFFunction } from "../functions/find_gif.ts";

...

/* Step 2. Find the right GIF */
const gif = GiveKudosWorkflow.addStep(FindGIFFunction, {
  vibe: kudo.outputs.fields.kudo_vibe,
});

...
```

Notice how the `OpenForm` step contains the `interactivity` context of the workflow and `FindGIFFunction` uses `kudo_vibe`, an output parameter of the `OpenForm` step.

The third step is composed of a Slack function, [`SendMessage`](/deno-slack-sdk/reference/slack-functions/send_message), that will send a message to a specific channel. It'll combine the user's words and the chosen GIF into one spectacular message fit for even the most seasoned sailors. That message will be sent to the channel the user specified within the form from step one. 

```javascript
// workflows/give_kudos.ts

...

/* Step 3. Share the love */
GiveKudosWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: kudo.outputs.fields.kudo_channel,
  message:
    `*Hey <@${kudo.outputs.fields.doer_of_good_deeds}>!* Someone wanted to share some kind words with you :otter:\n` +
    `> ${kudo.outputs.fields.kudo_message}\n` +
    `${gif.outputs.URL}`,
});

export { GiveKudosWorkflow };
...
```

And that's all you need to do for Slack functions! `FindGIFFunction` is a custom function, however. We'll have to roll up our sleeves and build that out ourselves. 


## Define the custom function

The `FindGIFFunction` function, unique to our app, is defined in `functions/find_gif.ts`, where inputs, outputs, and other attributes are described. This definition allows `FindGIFFunction` to be used within workflows, as when sharing a kudo!

```javascript
// functions/find_gif.ts
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const FindGIFFunction = DefineFunction({
  callback_id: "find_gif",
  title: "Find a GIF",
  description: "Search for a GIF that matches the vibe",
  source_file: "functions/find_gif.ts",
  input_parameters: {
    properties: {
      vibe: {
        type: Schema.types.string,
        description: "The energy for the GIF to match",
      },
    },
    required: [],
  },
  output_parameters: {
    properties: {
      URL: {
        type: Schema.types.string,
        description: "GIF URL",
      },
      alt_text: {
        type: Schema.types.string,
        description: "description of the GIF",
      },
    },
    required: ["URL"],
  },
});
```


## Find a GIF

With the `FindGIFFunction` function defined, it can then be implemented, where input from the form is parsed and converted into a random GIF that's obtained from the GIF catalog.

```javascript
// functions/find_gif.ts
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import gifs from "../assets/gifs.json" assert { type: "json" };

...

const getEnergy = (vibe: string): string => {
  if (vibe === "Appreciation for someone 🫂") return "appreciation";
  if (vibe === "Celebrating a victory 🏆") return "celebration";
  if (vibe === "Thankful for great teamwork ⚽️") return "thankful";
  if (vibe === "Amazed at awesome work ☄️") return "amazed";
  if (vibe === "Excited for the future 🎉") return "excited";
  if (vibe === "No vibes, just plants 🪴") return "plants";
  return "otter"; // 🦦
};

interface GIF {
  URL: string;
  alt_text?: string;
  tags: string[];
}

const matchVibe = (vibe: string): GIF => {
  const energy = getEnergy(vibe);
  const matches = gifs.filter((g: GIF) => g.tags.includes(energy));
  const randomGIF = Math.floor(Math.random() * matches.length);
  return matches[randomGIF];
};

export default SlackFunction(FindGIFFunction, ({ inputs }) => {
  const { vibe } = inputs;
  const gif = matchVibe(vibe ?? "");
  return { outputs: gif };
});
```


## A collection of GIFs

The GIF catalog – the treasure of this expedition – is listed in `assets/gifs.json`, but could safely be stored in a [datastore](/deno-slack-sdk/guides/using-datastores). To do that, you would create a [datastore](/deno-slack-sdk/guides/using-datastores) and use the [CLI command](/slack-cli/reference/commands/slack_datastore_put) to save all of the GIFs to it. Think of datastores as your very own treasure chests.

For readability, we've only included a portion of the GIFs in the snippet below. If you want the full treasure trove, [grab it from the GitHub repo](https://github.com/slack-samples/deno-give-kudos/blob/main/assets/gifs.json). 

```javascript
// assets/gifs.json
[
  {
    "URL": "https://media2.giphy.com/media/3oEjHWXddcCOGZNmFO/giphy.gif",
    "alt_text": "A person wearing a banana hat says thanks a bunch",
    "tags": ["thankful"]
  },
  {
    "URL": "https://media.giphy.com/media/3fBVaRM2c79TtXbyi6/giphy.gif",
    "alt_text": "The future king of the pirates smiles at you",
    "tags": ["amazed"]
  },
  {
    "URL": "https://media.giphy.com/media/WKdPOVCG5LPaM/giphy.gif",
    "alt_text": "A cheerful high-five from the newsroom",
    "tags": ["celebration", "excited"]
  },
  {
    "URL": "https://media1.giphy.com/media/Lcn0yF1RcLANG/giphy-downsized.gif",
    "alt_text": "Wow! A feeling of wild disbelief overwhelms the senses",
    "tags": ["amazed"]
  },
  {
    "URL": "https://media0.giphy.com/media/rgIdiNjWC933y/giphy.gif",
    "alt_text": "A kingly racoon nodding over many subjects",
    "tags": ["excited", "amazed"]
  },
  {
    "URL": "https://media0.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif",
    "alt_text": "Elmo dances in celebration",
    "tags": ["celebration"]
  },
  {
  "URL": "https://media2.giphy.com/media/3ohs7NuHL3gjbe2uGI/giphy-downsized.gif",
  "alt_text": "You're noticed and appreciated <3",
  "tags": ["appreciation"]
  },
  {
  "URL": "https://media1.giphy.com/media/xUA7aOIFDR4ZgqLy8w/giphy.gif",
  "alt_text": "Fern having a messy hair day",
  "tags": ["plants"]
  },
  "URL": "https://media1.giphy.com/media/MbAlP79yMRysHKUyHV/giphy-downsized.gif",
  "alt_text": "Sleepy otter rubs checks and yawns",
  "tags": ["otter"]
  }
]
```

## Invoke with a trigger

The workflows and functions discussed above cannot be invoked until a trigger is created, similar to how a sailor needs an order from their captain to carry out tasks.

To create an entry point into our app's "Give kudos" workflow, a [link trigger](/deno-slack-sdk/guides/creating-link-triggers) is defined in `triggers/give_kudos.ts`.

```javascript
// triggers/give_kudos.ts
import { Trigger } from "deno-slack-api/types.ts";

const trigger: Trigger = {
  type: "shortcut",
  name: "Give some kudos",
  description: "Broadcast your appreciation with kind words and a GIF",
  workflow: "#/workflows/give_kudos_workflow",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
  },
};

export default trigger;
```

The trigger is then created using the Slack CLI with the [`slack trigger create`](/slack-cli/reference/commands/slack_trigger_create) command, generating a Shortcut URL that can be clicked from a channel:

```bash
slack trigger create --trigger-def triggers/give_kudos.ts
```

You'll be prompted to install your app to a workspace. Select your desired workspace, and then select a `Local` app environment. When you want to [deploy](/deno-slack-sdk/guides/deploying-to-slack) your app later on, you would repeat this step and select a `Deployed` app environment. 

## Run your app

With the Shortcut URL in hand, our destination is near. Run the app in development mode to test it out on your local machine.

```bash
slack run
```

Use the Shortcut URL within Slack to kick off the workflow. Play around and test the waters yourself. Once you're ready to deploy to other sailors, read on!


## Deploy your app

When you're ready to welcome others aboard, you'll `deploy` your app instead of `run` it. Run the following command in your terminal:

```bash
slack deploy
```

And then create the trigger again, but choose the _Deployed_ option this time: 

```bash
slack trigger create --trigger-def triggers/give_kudos.ts
```

There's no X, but rest assured you've found the ultimate treasure - the experience of building your very own _Give Kudos_ app. 

<SlackMessage pfp="img/give-kudos/pirate-parrot.png" name="Kudo" message="Hey @You! Someone wanted to share some kind words with you: <blockquote> Congratulations on finishing the tutorial! </blockquote>"/>

## End your expedition 

Returning back to harbor, we can reminisce about the journey of sharing a kudo, recalling that functions compose workflows and workflows are invoked by triggers.

With these ropes, you're ready to take the seas yourself! There are many more knots to learn while on these waters, but you'll stay afloat just fine with what you now know.

### The next adventure

The next time you set sail, perhaps consider creating [a bot to welcome users to your workspace](/deno-slack-sdk/tutorials/welcome-bot). Bon voyage, captain!



