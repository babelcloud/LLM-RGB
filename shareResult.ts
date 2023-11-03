import * as fs from 'fs';
import * as os from "os";
import * as path from "path";
import fetch from 'node-fetch';

async function uploadJsonFiles(filePaths: string[]): Promise<void> {
    try {
        const fileContents = filePaths.map(filePath => {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        });

        const response = await fetch('https://llm-rgb.babel.run/share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fileContents)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        console.log(`View results: https://llm-rgb.babel.run/view/testId/${responseText}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}
const scoreFileName = path.join(os.homedir(), '.promptfoo/output/latest-score.json');
const statsFileName = path.join(os.homedir(), '.promptfoo/output/latest-stats.json');
const rawFileName = path.join(os.homedir(), '.promptfoo/output/latest-raw.json');
// the items order in the array matters
const filePaths = [rawFileName, scoreFileName, statsFileName];
uploadJsonFiles(filePaths);