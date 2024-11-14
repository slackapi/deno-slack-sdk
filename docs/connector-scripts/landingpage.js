const fs = require('node:fs');
const path = require('node:path');

const connectorsDir = path.join(__dirname, '../static/connectors');

// Output Markdown file and its directory
const outputDir = path.join(__dirname, '../content/reference/connectors');
const outputFile = path.join(outputDir, 'connectors.md');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Initialize an empty string to build the Markdown content
let markdownContent = `# Connectors reference\n\n`;

// Function to process each connector and function
const processConnector = (connectorFolder) => {
    return new Promise((resolve, reject) => {
        const connectorPath = path.join(connectorsDir, connectorFolder);

        // Check if it's a directory (each connector has its own directory)
        fs.stat(connectorPath, (err, stats) => {
            if (err) {
                reject(`Error reading directory for ${connectorFolder}: ${err}`);
                return;
            }

            if (stats.isDirectory()) {
                // Start writing the connector's name as a subheading
                let connectorMarkdown = `## ${connectorFolder}\n\n`;
                connectorMarkdown += '| Connector | Description |\n';
                connectorMarkdown += '|----------------|---------------------|\n';

                // Read each function file within the connector's folder
                fs.readdir(connectorPath, (err, functionFiles) => {
                    if (err) {
                        reject(`Error reading directory for ${connectorFolder}: ${err}`);
                        return;
                    }

                    if (!functionFiles || functionFiles.length === 0) {
                        console.log(`No function files found in ${connectorFolder}`);
                    }

                    let functionPromises = functionFiles.map((functionFile) => {
                        return new Promise((resolveFunc, rejectFunc) => {
                            const functionFilePath = path.join(connectorPath, functionFile);

                            // Ensure the file is a .json before attempting to parse it
                            if (functionFile.endsWith('.json')) {
                                // Read each function JSON file
                                fs.readFile(functionFilePath, 'utf8', (err, data) => {
                                    if (err) {
                                        rejectFunc(`Error reading file ${functionFile}: ${err}`);
                                        return;
                                    }

                                    try {
                                        const functionData = JSON.parse(data);
                                        const functionName = functionData.callback_id || path.basename(functionFile, '.json');
                                        const functionDescription = functionData.title || 'No description available';

                                        // Create a link to the function
                                        const functionLink = `/reference/connectors/${connectorFolder}/${functionName}`;

                                        // Add the function details to the table, making the title linkable
                                        connectorMarkdown += `| [**${functionName}**](${functionLink}) | ${functionDescription} |\n`;

                                        resolveFunc(); // Resolve after processing function
                                    } catch (error) {
                                        rejectFunc(`Error parsing JSON in ${functionFile}: ${error}`);
                                    }
                                });
                            } else {
                                resolveFunc(); // Skip non-JSON files
                            }
                        });
                    });

                    // Wait for all functions to be processed
                    Promise.all(functionPromises)
                        .then(() => {
                            markdownContent += connectorMarkdown;
                            resolve(); // Resolve after all functions are processed
                        })
                        .catch(reject);
                });
            } else {
                resolve(); // Skip non-directory folders
            }
        });
    });
};

// Main function to process all connectors
const processAllConnectors = () => {
    return new Promise((resolve, reject) => {
        // Read the connectors directory
        fs.readdir(connectorsDir, (err, connectorFolders) => {
            if (err) {
                reject('Error reading connectors directory:', err);
                return;
            }

            if (!connectorFolders || connectorFolders.length === 0) {
                resolve('No connectors found in the directory.');
                return;
            }

            console.log(`Found connectors: ${connectorFolders.join(', ')}`);

            let connectorPromises = connectorFolders.map(processConnector);

            // Wait for all connectors to be processed
            Promise.all(connectorPromises)
                .then(() => {
                    // After all connectors are processed, write the markdown content to the file
                    fs.writeFile(outputFile, markdownContent, 'utf8', (err) => {
                        if (err) {
                            reject('Error writing Markdown file:', err);
                        } else {
                            console.log(`Markdown file created at ${outputFile}`);
                            resolve();
                        }
                    });
                })
                .catch(reject);
        });
    });
};

// Start the process
processAllConnectors()
    .then(() => {
        console.log('Process completed successfully.');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
