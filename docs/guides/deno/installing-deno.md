---
slug: /deno-slack-sdk/guides/installing-deno
---

# Installing Deno

<PaidPlanBanner />

Deno is a runtime that you'll need for developing automations apps.

## First things first — what is Deno? {#what-deno}

[Deno](https://deno.land) is a runtime that allows you to execute code written using [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [TypeScript](https://www.typescriptlang.org/), and [WebAssembly](https://webassembly.org/). It uses the open source [V8 JavaScript and WebAssembly engine](https://v8.dev/), is written in a programming language called [Rust](https://www.rust-lang.org/), and is built on another runtime called [Tokio](https://tokio.rs/). So, if you know how to write apps in one of those languages (or would like to!) Deno is how you will execute your app.

### Deno runtime {#deno-runtime}

To understand what a runtime is, first let's take a look at the software programming lifecycle to get some context. At a basic level, the lifecycle is as follows:

* **Develop**: source code is written and edited and an application or program is created.
* **Compile**: the source code is compiled into a machine code executable.
* **Link**: all of the machine code components of the application or program are connected together, including external libraries.
* **Distribute**: the application or program is copied to the computers of other users; for example, via an executable.
* **Install**: the user downloads the executable on their computer; their operating system places it in storage.
* **Load**: the user's operating system places the executable into active memory in order to begin execution of the application or program.
* **Run**: the distributed machine code is executed on the user's computer.

We're interested in that last phase of this lifecycle, the _runtime_. However, it's important to note there are two concepts here that are related, but different: runtime as part of the lifecycle, and a runtime environment. Some confusion can occur since people sometimes shorten "runtime environment" to just "runtime" &mdash; but what we're talking about when we say _Deno is a runtime_ is really _Deno is a runtime environment._

So, what's a runtime environment? Essentially, it's a framework of all the hardware and software required to execute, or run, your code. A runtime environment accesses system resources, loads your application or program, and executes it, all of which is done independently of your operating system (which is also technically a runtime environment!).

Why use a runtime environment? Well, because operating systems can differ significantly from one another, or even from one version to the next. Runtime environments enable cross-platform functionality for your applications or programs, allowing your code to run as smoothly as possible in a a variety of conditions.

### Why Deno? {#why-deno}

Where did Deno come from? Well, for a long time, JavaScript was used almost exclusively by web browsers to add interactivity to web pages. A clever programmer named Ryan Dahl [created a way to run JavaScript on servers](https://www.youtube.com/watch?v=ztspvPYybIY). He called it Node.js, and it was built on the JavaScript engine that powered Google's web browser. Because there are a lot of JavaScript programmers in the world, Node.js grew incredibly quickly, and soon added a way to package libraries of code called the [Node Package Manager](https://www.npmjs.com/) (npm for short).

Dahl soon realized the original Node.js implementation had some problems. Security wasn't built-in, and the npm ecosystem that had grown so quickly introduced vulnerabilities that were affecting millions of developers. JavaScript continued to evolve and [Dahl decided he wanted to try again with a new runtime](https://www.youtube.com/watch?v=M3BM9TB-8yA) that was secure by default, adopted modern web standards for features like including libraries of code, and came with a standard library of functionality. Enter Deno.

### Differences with Node.js {#node-differences}

The biggest reason you may not want to move your existing Node.js-based applications to Deno is npm modules aren't yet fully supported. The vast ecosystem of modules that have been built over the years aren't guaranteed to work with your application by default. The Deno team is [working on some approaches to allowing npm modules](https://deno.land/manual@v1.12.2/npm_nodejs), including [the built-in standard library that should obviate the need for many npm modules](https://deno.land/manual@v1.12.2/npm_nodejs/std_node.md), and [CDNs that host npm modules](https://deno.land/manual@v1.12.2/npm_nodejs/cdns.md) in a way that Deno can use. That said, not every npm module will work with Deno automatically, particularly more complex libaries, so you may need to wait on a rewrite or roll your own.

## Installing Deno {#install}

If you've written JavaScript for web browsers before, everything will feel very familiar. If you've written JavaScript or TypeScript for web _servers_ before, probably using Node.js as your runtime, most things will feel familiar with a [few key differences](#node-differences).

Deno ships as a single executable with no external dependencies. Versions are available for macOS (both Intel and Apple silicon architectures), Linux, and Windows (64-bit support only for Linux and Windows).

The easiest way to install is to call the [`deno_install` script](https://github.com/denoland/deno_install) remotely.

On macOS and Linux:

```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

On Windows:

```bash
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

[The official installation guide](https://deno.land/manual/getting_started/installation) provides details for various other platforms. As Deno is open source, you are free to [compile from source](https://deno.land/manual/contributing/building_from_source) as well.

Once installed, run `deno --version` to verify the installation was successful. The output should look something like the following:

```bash
$ deno --version
deno 1.37.0* (release, x86_64-apple-darwin)
v8 10.*
typescript 4.*
```

The minimum version of Deno runtime required for developing workflow apps is currently at version 1.37.0

## Installing the Deno extension for VSCode {#vscode}

The installation script from our [Getting started](/deno-slack-sdk/guides/getting-started#install-cli) should cover everything for you, but if you want to manually install the `vscode_deno` extension, follow these steps:

1. Within VSCode, select **Extensions** from the sidebar.
1. Enter **Deno** in the search bar.
1. Select **Deno** (a language server client for Deno, published by deno.land) and **Install**.

Alternatively, you can download and install the extension from [here](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno).

Once installed, you should see a splash screen welcoming you to the extension. For additional information about configuring the extension, refer to [Using Visual Studio Code](https://docs.deno.com/runtime/manual/references/vscode_deno).

## Onward {#onward}

Ready to dive into development? [Let's go](/deno-slack-sdk/guides/developing-with-deno)!