const fs = require('node:fs');
const path = require('node:path');

// JSON connectors source
const sourceFile = path.join(__dirname, 'connectors.json');

// Output directory for folders & JSON files
const outputDirectory = path.join(__dirname, 'apps');

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

        // Loop through each app in 'apps' array
        for (const app of jsonData.apps) {
            const appFolder = path.join(outputDirectory, app.namespace || 'unknown_app');

            // Create a folder for each app
            if (!fs.existsSync(appFolder)) {
                fs.mkdirSync(appFolder);
            }

            // Loop through each function in app's 'functions' array
            for ( const func of app.functions { 
                const functionFile = path.join(appFolder, `${func.callback_id || 'unknown_function'}.json`);

                // Write function object to separate JSON file within app's folder
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
