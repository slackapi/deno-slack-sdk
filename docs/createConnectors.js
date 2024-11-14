const fs = require("node:fs");
const path = require("node:path");

// JSON connectors source
const sourceFile = path.join(__dirname, "connector-scripts/connectors.json");

// Output directory for folders & JSON files
const outputDirectory = path.join(__dirname, "/static/connectors");

// The alternate path for Markdown files
const markdownDirectory = path.join(__dirname, "/content/reference/connectors");

// Ensure the main output directory exists
if (!fs.existsSync(outputDirectory)) {
	fs.mkdirSync(outputDirectory);
}

// Ensure the markdown output directory exists
if (!fs.existsSync(markdownDirectory)) {
	fs.mkdirSync(markdownDirectory);
}

// Read the connectors JSON file
fs.readFile(sourceFile, "utf8", (err, data) => {
	if (err) {
		console.error("Error reading source file:", err);
		return;
	}

	try {
		const jsonData = JSON.parse(data);

		// Loop through each connector in 'apps' array
		for (const connector of jsonData.apps) {
			const connectorFolder = path.join(
				outputDirectory,
				connector.namespace || "unknown_connector",
			);
			const connectorMarkdownFolder = path.join(
				markdownDirectory,
				connector.namespace || "unknown_connector",
			);

			// Create a folder for each connector (JSON folder)
			if (!fs.existsSync(connectorFolder)) {
				fs.mkdirSync(connectorFolder);
			}

			// Create a folder for each connector (Markdown folder)
			if (!fs.existsSync(connectorMarkdownFolder)) {
				fs.mkdirSync(connectorMarkdownFolder);
			}

			// Loop through each function in connector's 'functions' array
			for (const func of connector.functions) {
				const functionFile = path.join(
					connectorFolder,
					`${func.callback_id || "unknown_function"}.json`,
				);
				const markdownFile = path.join(
					connectorMarkdownFolder,
					`${func.callback_id || "unknown_function"}.md`,
				);

				// Write function object to separate JSON file within connector's folder
				fs.writeFile(functionFile, JSON.stringify(func, null, 2), (err) => {
					if (err) {
						console.error(
							`Error writing file for ${func.callback_id || "unknown_function"}:`,
							err,
						);
					} else {
						console.log(`JSON file created: ${functionFile}`);
					}
				});

				// Only create the markdown file if it doesn't already exist
				if (fs.existsSync(markdownFile)) {
					const jsonFilePath = `/${connector.namespace || "unknown_connector"}/${func.callback_id || "unknown_function"}.json`;
					// Prepare the markdown content with the import statement and the component
					const markdownContent = `---
pagination_next: null
pagination_prev: null
---

import ConnectorFunctionPage from '@site/src/components/ConnectorFunctionPage';

## Facts

<ConnectorFunctionPage jsonFilePath="${jsonFilePath}" />`;

					fs.writeFile(markdownFile, markdownContent, (err) => {
						if (err) {
							console.error(
								`Error writing markdown file for ${func.callback_id || "unknown_function"}:`,
								err,
							);
						} else {
							console.log(`Markdown file created: ${markdownFile}`);
						}
					});
				} else {
					console.log(`Markdown file already exists: ${markdownFile}`);
				}
			}
		}
	} catch (error) {
		console.error("Error parsing JSON data:", error);
	}
});
