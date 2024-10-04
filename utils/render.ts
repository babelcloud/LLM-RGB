import * as Table from 'cli-table3';
import * as chalk from 'chalk';
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const score = fs.readFileSync(path.join(os.homedir(), '.promptfoo/output/latest-score.json')).toString();
const structure = fs.readFileSync(path.join(os.homedir(), '.promptfoo/output/latest-stats.json')).toString();

const scoreData = JSON.parse(score);
const structureData = JSON.parse(structure)
const maxColumnWidth = 25;
const repeat = scoreData[0].scores[0].repeat || 1;

let maxScores = {
    total_score: structureData.max_total_score,
    context_length: structureData.max_context_length,
    reasoning_depth: structureData.max_reasoning_depth,
    instruction_compliance: structureData.max_instruction_compliance
};

structureData.testcases.forEach((testcase: any) => {
    maxScores[testcase.name] = testcase.max_score;
});

let scoresTable = new Table({
    head: ['LLM ID', 'Total Score', 'Context Length', 'Reasoning Depth', 'Instruction Compliance'].map(header => chalk.blue(header))
});

let testCasesTable = new Table({
    head: ['LLM ID', 'Total Score'].concat(structureData.testcases.map((testcase: any) => testcase.name)).map(header => chalk.blue(header))
});

let verticalTestCasesTable = new Table({
    head: ['Test Case / LLM ID'].concat(structureData.llms).map(header => chalk.blue(header))
});

let verticalRows: any[] = [[`Total Score (repeat: ${repeat})`]];

structureData.testcases.forEach((testcase: any) => {
    verticalRows.push([testcase.name]);
});

scoreData.forEach((item: any) => {
    let row = [item.llm_id, createBar(item.total_score, maxScores.total_score)];

    for (let key in item.aggregated_scores) {
        row.push(createBar(item.aggregated_scores[key], maxScores[key]));
    }

    scoresTable.push(row);

    let testCaseRow = [item.llm_id, createBar(item.total_score, maxScores.total_score)];

    item.scores.forEach((scoreItem: any) => {
        testCaseRow.push(createBar(scoreItem.test_score, maxScores[scoreItem.test_name]));
    });

    testCasesTable.push(testCaseRow);

    verticalRows[0].push(createBar(item.total_score, maxScores.total_score));

    item.scores.forEach((scoreItem: any, index: number) => {
        verticalRows[index + 1].push(createBar(scoreItem.test_score, maxScores[scoreItem.test_name]));
    });
});

verticalRows.forEach((row: any) => {
    verticalTestCasesTable.push(row);
});

console.log(scoresTable.toString());
//console.log(testCasesTable.toString());
console.log(verticalTestCasesTable.toString());

function createBar(score: number, maxScore: number) {
    let percentage = score / maxScore;
    let bar = (score.toString().padEnd(5, " ")).padEnd(percentage * maxColumnWidth, '█');

    if (percentage < 0.3) {
        return chalk.red(bar);
    } else if (percentage < 0.6) {
        return chalk.yellow(bar);
    } else {
        return chalk.green(bar);
    }
}