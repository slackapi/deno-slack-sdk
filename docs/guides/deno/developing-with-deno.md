---
slug: /deno-slack-sdk/guides/developing-with-deno
---

# Developing with Deno

<PaidPlanBanner />

Now that we've [installed Deno](/deno-slack-sdk/guides/installing-deno), lets create our first app to get the hang of our new environment.

## Running your first Deno app {#run}

Using a plain text editor, create a new file called `app.js`. In that file, include the following:

```javascript
console.log(`Hello, world!`); 
```

In your terminal, change to the directory where you wrote that file. Then execute the following command:

```bash
deno run app.js
```

It should respond with `Hello, world!` and then finish. Wohoo, you just wrote your first app and executed it using the Deno runtime!

### Watching your app for changes {#run-watch}

During development, you'll often find you are making lots of small changes in order to get everything in tip-top shape. It's annoying to get out of your developer flow because you have to constantly stop and restart your app, which is why it's great that Deno has a built in `watch` function that will constantly check for updates to a file and automatically reload it for you. 

First, tell Deno to watch your `app.js` file by appending the `--watch` flag to the `run` command as follows:

```bash
deno run --watch app.js
```

Now, update `app.js` by adding a second line after the first `console.log`:

```javascript
console.log(`What's up?`);
```

As soon as you save the file, you should see the output of **both** lines. 

### So fetch {#fetch}

Just about any web app you could think to build is going to want to pull in data from somewhere else &mdash; it's pretty much how the whole digital economy works. Deno natively supports the [Fetch API that replaced `XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) in modern browsers, so it's pretty easy to make fetch happen.

The `fetch()` method is asynchronous and [Promises-based](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). This is one of the key differences between Deno and Node.js. Since Promises allow asynchronous functions to behave like synchronous functions, this can make life easier for developers. Whereas synchronous functions run and return a value, *asynchronous* functions return a Promise to return a value (or an error) once it's finished calling the API, querying the database, or making a calculation.

You don't need to worry about all of the particulars of the asynchronous function running in the background, you just need to write the code that gets executed once the Promise is fulfilled. Use the [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) expression for this. When the Promise returns successfully, it resolves to a [Response object](https://developer.mozilla.org/en-US/docs/Web/API/Response). The Response comes as a stream of bytes, which another `await` function that calls the [`Response.text()` method](https://developer.mozilla.org/en-US/docs/Web/API/Response/text) can finally return as a string of the body of the HTTP response. 

Let's see how it works by replacing the code in your `app.js` file with the following:

```javascript
const response = await fetch('https://example.com');

const body = await response.text();
console.log(body);
```

If `deno run --watch app.js` is still running, it will detect the change and return a warning. This is part of [Deno's security model at work](https://deno.land/manual/getting_started/permissions), where by default, no app is allowed access to external resources like the filesystem, network access, or even sub-process and environment variables &mdash; access to these resources must be explicitly allowed when you run your app. 

This focus on security is one reason why [many projects](https://deno.land/showcase) are increasingly exploring Deno!

You can answer `yes` to the prompt every time you run the app, or include the `--allow-net` flag when you execute the `deno run` command. If you want to limit the domains that the app has access to, include a comma-separated list of domains, such as `--allow-net=example.com` or `--allow-net=example.com,api.slack.com` as follows:

```bash
deno run --watch --allow-net=example.com app.js
```

You should see the source code of `example.com` in your terminal. Parsing web page source code isn't very exciting, though. How about random photos of cats and dogs? Let's try replacing all the contents of our `app.js` with the following:

```javascript
const cat_or_dog = Deno.args[0];
let url = "";

switch (cat_or_dog) {
  case 'cat':
    console.log(`Meow, you're a kitty!`);

    const cat_response = await fetch('https://api.thecatapi.com/v1/images/search');
    const cat_json = await cat_response.json();
    url = cat_json[0].url;

    break;
  case 'dog':
    console.log(`Who's a good dog?`);

    const dog_response = await fetch('https://dog.ceo/api/breeds/image/random');
    const dog_json = await dog_response.json();
    url = dog_json.message;

    break;
}

console.log(url);
```

This script takes a single argument at runtime, assigns it to the `cat_or_dog` variable, and then retrieves a random cat or dog picture. Run it with one of the following:

```bash
deno run --allow-net=api.thecatapi.com,dog.ceo app.js cat
```

or 

```bash
deno run --allow-net=api.thecatapi.com,dog.ceo app.js dog
```

Notice that the `--allow-net` flag includes the domain names to both APIs, separated by a comma.

## Third-party libraries {#third-party}

Just like browsers, Deno can [import and execute scripts from remote locations](https://deno.land/manual/examples/manage_dependencies), making it possible to not only use third party libraries, but to load them from any URL. 

Let's say we wanted to actually load the random cat or dog pic in the user's default browser. The [Opener module](https://deno.land/x/opener/README.md) does exactly that, and it's cross-platform to boot. Import the Opener module's `open` function at the top of your script, then call it at the bottom: 

```javascript
import { open } from "https://deno.land/x/opener@v1.0.1/mod.ts";

// the rest of the logic of the cat/dog random imager

await open(url);
```

When you run the script, you'll again see a warning that Deno needs permission to run the `open` command &mdash; that's because the [source code of the Opener module](https://deno.land/x/opener@v1.0.1/mod.ts) calls the `Deno.run()` method, which executes local commands on behalf of the user executing the script. Once again, Deno's security design requires explicit permission to run another command; passing the `--allow-run` flag will allow the user to run any sub-command, and passing a comma-separated list will only allow those specific commands to run.

Deno will cache third party modules locally, but you aren't required to include a `package.json` file or the equivalent of a `node_modules` directory. In fact, your working directory is kept completely clean.

## The standard library {#std-lib}

Now that you've built an app and explored how to import modules, let's explore the ecosystem of third party modules and the [Deno standard library](#std-lib). Every programming language has a mechanism for allowing code to be easily shared and reused, Deno does this by leveraging [JavaScript's standard way of importing and exporting code](https://deno.land/manual/examples/manage_dependencies).

The Deno project maintains a hosting service for open source modules at [deno.land/x/](https://deno.land/x). All of these modules are hosted on public GitHub repos and cached by the Deno project &mdash; in fact, every time a module is updated and tagged with a new version, that specific version is cached. This allows you to follow best practices for versioning the modules your application depends on.

In addition to hosting a repository of open source modules, the Deno project also maintains a [standard library of common utilities](https://github.com/denoland/deno_std) that developers can use. Common programming tasks such as figuring out a date or time, running tests on code, writing to the filesystem, or launching an HTTP server are all part of the standard library, and these modules are audited by the Deno team to ensure they are up-to-date and do not require any other external dependencies. The standard library is located at `https://deno.land/std`, but you'll reference a specific version of the library in your apps, such as `https://deno.land/std@0.193.0`

:::warning[Under development]

The Deno standard library is still under development and parts are considered unstable. This means that if you use certain modules from the standard library, such as the [filesystem modules](https://deno.land/std/fs), you'll need to execute `deno run` with the `--unstable` flag.

As the standard library matures, the plan is to version the modules alongside updates to the Deno runtime itself so it will be easier to know which version of a module to use with the version of the Deno runtime you are using.

:::

The standard library contains dozens of submodules, which are what you'll actually load for your app; you won't often import the entire standard library. For example, if your app needs to format dates, there's [the `format` submodule](https://deno.land/std/datetime#format), part of the `datetime` submodule, a part of the standard library. You would load it as follows:

```javascript
import { format } from "https://deno.land/std@0.140.0/datetime/mod.ts";
```

Then, you can call the `format` function:

```javascript
// 🎈 February 12 Happy birthday, Slackbot! 🎈
// That's not an error, the JavaScript Date constructor uses a zero-based `monthIndex` for months
// whereas days begin with 1.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
format(new Date(2014, 01, 12), "yyyy-MM-dd"); // 2014-02-12
```

## Managing versions {#versioning}

The content at any URL on the web can change at any time; often, this is a powerful feature of the web and allows web sites to stay fresh. However, when you're loading, say, a block of code to be used as a dependency in an application, you want that code to be consistent and _immutable_. **Forever**.

Pretty much every runtime that allows for external modules has run into this problem at some point. While there is great power in being able to load libraries, what happens if the developer makes a change that suddenly breaks your code? Or worse, what if a bad actor were to somehow gain access to where that module is hosted and [insert some malicious code](https://arstechnica.com/information-technology/2021/12/malicious-packages-sneaked-into-npm-repository-stole-discord-tokens/) that would allow the attacker access to your app?

By caching every new version and making it immutable, Deno's hosted modules avoid this problem &mdash; but you have to make sure to include the version tag in the URL, like so: `https://deno.land/x/feathers@v5.0.0-pre.3/mod.ts`. If you omit the tag, you will automatically be redirected to whatever the latest version is:

```javascript
// 🚯 will always import the latest version. AVOID.
import { feathers } from "https://deno.land/x/feathers/mod.ts";

// 😎 imports a specific version, DO THIS INSTEAD
import { feathers } from "https://deno.land/x/feathers@v5.0.0-pre.3/mod.ts";
```

## Managing dependencies {#deps}
As your project grows in complexity, you may want to include a list of dependencies in a single place that can be tagged to a specific version. Deno uses the convention of a `deps.js` file to store this list.

Let's say we want to take our dog/cat script to the next level, with internationalization and robust testing. We're going to use the [i18next library](https://deno.land/x/i18next@v21.8.1/index.js) for managing translations and the `asserts` functionality from the standard library. Our `deps.js` file might look like this:

```javascript
export{
	assert,
	assertEquals,
} from "https://deno.land/std@0.138.0/testing/asserts.js";

export { i18next } from "https://deno.land/x/i18next@v21.8.1/index.js";
```

The URL includes a specific version number &mdash; this is the recommended way to import libraries, instead of pulling them from the main branch and hoping nothing breaks when the library gets updated.

In our script, we import them from our local `deps.js` file as follows:

```javascript
import {assertEquals, runTests, test } from "./deps.js"
import {i18next} from "./deps.js"
```

If we need to update the version or add additional libraries, we can do so from a single place.

## Onward {#onward}

Ready to dive into developing automations? Head over to our [getting started guide](/deno-slack-sdk/guides/getting-started) to start building a workflow app, or check out our [developing with TypeScript guide](/deno-slack-sdk/guides/developing-with-typescript) to learn more about the language you'll be developing with.