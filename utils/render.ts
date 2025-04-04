import * as Table from 'cli-table3';
import * as chalk from 'chalk';
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import {
    LLMEval,
    TestStats,
    resultsType,
    TestCase,
    TestCaseReport,
    TestScore,
    getTestStats,
} from "./generateEvalScore";

const args = process.argv.slice(2);
const folderPath = args[0] || undefined;

const getScoreAndStructureData = (folderPath: string | undefined) => {
    let scoreData: LLMEval[] = [];
    let structureData: TestStats;
    if (folderPath) {
        // check if the folder exists
        if (!fs.existsSync(folderPath)) {
            console.error("Folder does not exist", folderPath);
            process.exit(1);
        }

        // find all the files in the folder
        const llmIds = fs.readdirSync(folderPath);

        const testcases: { [key: string]: TestCase } = {};

        llmIds.forEach((llmId) => {
            const reportPath = path.join(folderPath, llmId, "report.json");
            if (fs.existsSync(reportPath)) {
                const report = JSON.parse(
                    fs.readFileSync(reportPath).toString()
                ) as resultsType;

                scoreData.push({
                    llm_id: llmId,
                    scores: report["testcases"].map(
                        (testcase: TestCaseReport) => {
                            const testScore = {
                                test_name: testcase["test_name"],
                                assertion_score: testcase["assertion_score"],
                                test_score: testcase["test_score"],
                                repeat: testcase["repeat"],
                                latencyMs: testcase["latencyMs"] || 0,
                            } as TestScore;

                            if (!testcases[testcase["test_name"]]) {
                                testcases[testcase["test_name"]] = {
                                    name: testcase["test_name"],
                                    difficulties: testcase["difficulty"],
                                };
                            }

                            return testScore;
                        }
                    ),
                    aggregated_scores: report["aggregated_scores"],
                    total_score: report["total_score"],
                });
            }
        });

        // sort the scoreData by total_score
        scoreData.sort((a, b) => b.total_score - a.total_score);

        structureData = getTestStats(
            scoreData,
            Object.values(testcases),
            "start_time",
            "end_time"
        );
    } else {
        const score: string = fs.readFileSync(path.join(os.homedir(), '.promptfoo/output/latest-score.json')).toString();
        scoreData = JSON.parse(score) as LLMEval[];
        const stats: string = fs.readFileSync(path.join(os.homedir(), '.promptfoo/output/latest-stats.json')).toString();
        structureData = JSON.parse(stats) as TestStats;
    }

    return {
        scoreData,
        structureData,
    };
};

const { scoreData, structureData } = getScoreAndStructureData(folderPath);

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

let timeTable = new Table({
    head: ['Test Case / LLM ID'].concat(structureData.llms).map(header => chalk.blue(header))
});

let timeRows: any[] = [['Time (ms)']];

structureData.testcases.forEach((testcase: any) => {
    timeRows.push([testcase.name]);
});

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

    timeRows[0].push(item.llm_id);

    item.scores.forEach((scoreItem: any, index: number) => {
        timeRows[index + 1].push(scoreItem.latencyMs || 'N/A');
    });
});

verticalRows.forEach((row: any) => {
    verticalTestCasesTable.push(row);
});

timeRows.forEach((row: any) => {
    timeTable.push(row);
});

console.log(scoresTable.toString());
//console.log(testCasesTable.toString());
console.log(verticalTestCasesTable.toString());
console.log('\nTime spent per test case (ms):');
console.log(timeTable.toString());

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
