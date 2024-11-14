const fs = require('node:fs');
const path = require('node:path');

// JSON connectors source
const sourceFile = path.join(__dirname, 'connectors.json');

// Output directory for folders & JSON files
const outputDirectory = path.join(__dirname, 'connectors');

// Ensure the main output directory exists
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
}

// Read the connectors JSON file
fs.readFile(sourceFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading source file:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);

        // Loop through each connector in 'connector' array
        for (const connector of jsonData.connectors) {
            const connectorFolder = path.join(outputDirectory, connector.namespace || 'unknown_connector');

            // Create a folder for each connector
            if (!fs.existsSync(connectorFolder)) {
                fs.mkdirSync(connectorFolder);
            }

            // Loop through each function in connector's 'functions' array
            for ( const func of connector.functions) { 
                const functionFile = path.join(connectorFolder, `${func.callback_id || 'unknown_function'}.json`);

                // Write function object to separate JSON file within connector's folder
                fs.writeFile(functionFile, JSON.stringify(func, null, 2), (err) => {
                    if (err) {
                        console.error(`Error writing file for ${func.callback_id || 'unknown_function'}:`, err);
                    } else {
                        console.log(`File created: ${functionFile}`);
                    }
                });
            };
        };

    } catch (error) {
        console.error('Error parsing JSON data:', error);
    }
});
