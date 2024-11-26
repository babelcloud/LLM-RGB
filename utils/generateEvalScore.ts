import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const resultFileName = path.join(os.homedir(), '.promptfoo/output/latest.json');
const scoreFileName = path.join(os.homedir(), '.promptfoo/output/latest-score.json');
const statsFileName = path.join(os.homedir(), '.promptfoo/output/latest-stats.json');
const rawFileName = path.join(os.homedir(), '.promptfoo/output/latest-raw.json');

if (require.main === module) {
    fs.readFile(resultFileName, 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file from disk:", err);
            return;
        }
        try {
            const raw = JSON.parse(jsonString);
            const startTime = Date.parse(raw.createdAt);
            const endTime = Date.now();
            const result = raw.results;
            console.log("Data loaded from JSON file:", resultFileName);
            resultLaundry(result);
            const extractedProviders = extractLLMs(result);
            const extractedTestcases = extractTestcases(result);

        const scores = evaluationScore(extractedProviders, extractedTestcases, result);
        const testStats = getTestStats(scores, extractedTestcases, startTime, endTime);

            // Write testStats to testStats.json
            fs.writeFile(statsFileName, JSON.stringify(testStats), (err) => {
                if (err) {
                    console.log('Error writing testStats to file:', err);
                } else {
                    console.log('Successfully wrote testStats to ' + statsFileName);
                }
            });

            // Write scores to scores.json
            fs.writeFile(scoreFileName, JSON.stringify(scores), (err) => {
                if (err) {
                    console.log('Error writing scores to file:', err);
                } else {
                    console.log('Successfully wrote scores to ' + scoreFileName);
                }
            });

            // Write raw result
            fs.writeFile(rawFileName, JSON.stringify(result), (err) => {
                if (err) {
                    console.log("Error writing scores to file:", err);
                } else {
                    console.log("Successfully wrote scores to " + rawFileName);
                }
            });

            // Generate response logs
            generateResponseLogs(raw, scores, testStats, extractedTestcases);
        } catch(err) {
            console.log('Error parsing JSON string:', err);
        }
    });
}

function resultLaundry(result) {
    delete result.table;
    delete result.stats;
    result.results.forEach(result => {
        if (result.vars && result.vars._conversation) {
            delete result.vars.prompt;
            delete result.vars._conversation;
        }
    });
}

function extractLLMs(result) {
    const providers = new Set();
    result.results.forEach(result => {
        providers.add(result.provider.id);
    });

    return Array.from(providers).sort();
}
export interface TestCase {
    name: string;
    difficulties: DifficultyType;
    max_score?: number;
}

function extractTestcases(result: any): TestCase[] {
    const testcases: { [key: string]: TestCase } = {};
    result.results.forEach(result => {
        if (!testcases[result.vars.name]) {
            testcases[result.vars.name] = {
                "name": result.vars.name,
                "difficulties": result.vars.difficulties
            };
        }
    });

    return Object.values(testcases).sort((a, b) => a.name.localeCompare(b.name));
}

export function getTestStats(scores, tests, startTime, endTime) {
    var llms: any[] = [];
    var max_total_score = 0;
    var max_context_length = 0;
    var max_reasoning_depth = 0;
    var max_instruction_compliance = 0;
    var testcases: any[] = [];
    
    for (const score of scores){
        llms.push(score.llm_id);
    }

    for (const test of tests) {
        var testcase: any = {};
        testcase.name = test.name;
        testcase.max_score = test.difficulties["context-length"] + test.difficulties["reasoning-depth"] + test.difficulties["instruction-compliance"];
        testcase.difficulties = test.difficulties;
        testcases.push(testcase);
        // calculate max values
        max_total_score += testcase.max_score;
        max_context_length += testcase.difficulties["context-length"];
        max_reasoning_depth += testcase.difficulties["reasoning-depth"];
        max_instruction_compliance += testcase.difficulties["instruction-compliance"];
    }
    return { llms, max_total_score, max_context_length, max_reasoning_depth, max_instruction_compliance, testcases, startTime, endTime };
}

function evaluationScore(providers, tests, result) {
    var llms: LLMEval[] = [];
    // Build LLMEval for each provider
    for (const provider of providers) {
        // get the scores of all testcases about current provider
        const scores = getLLMScores(provider, result.results, tests);
        const aggregated_scores = getAggregatedScores(scores, tests);
        const llm: LLMEval = {
            llm_id: provider,
            scores: scores,
            aggregated_scores: aggregated_scores,
            total_score: calculateTotalScore(aggregated_scores)
        }
        llms.push(llm);
    }
    llms.sort((a, b) => b.total_score - a.total_score);
    return llms;
}

function calculateTotalScore(aggregated_scores) {
    var total_score = 0;
    total_score = aggregated_scores.context_length + aggregated_scores.reasoning_depth + aggregated_scores.instruction_compliance;

    return parseFloat(total_score.toFixed(1));
}

/**
 * Calculate the aggregated scores of a given llm's test scores.
 */

function getAggregatedScores(scores: TestScore[], tests) {
    var context_length = 0;
    var reasoning_depth = 0;
    var instruction_compliance = 0;
    for (const score of scores) {
        const diffculties = findDifficulties(score.test_name, tests);
        context_length = context_length + score.assertion_score * diffculties["context-length"];
        reasoning_depth = reasoning_depth + score.assertion_score * diffculties["reasoning-depth"];
        instruction_compliance = instruction_compliance + score.assertion_score * diffculties["instruction-compliance"];
    }
    return {
        context_length: parseFloat(context_length.toFixed(1)),
        reasoning_depth: parseFloat(reasoning_depth.toFixed(1)),
        instruction_compliance: parseFloat(instruction_compliance.toFixed(1))
    };
}

/**
 * Return the difficulties values of given test
 */

function findDifficulties(name: string, tests) {
    for (const test of tests) {
        if (test.name == name) {
            return test.difficulties;
        }
    }
    return null;
}

/**
 * Find all results of provided llm and extract the scores
 */

function getLLMScores(llm_id: string, results, tests) {
    var scoreMap = new Map<string, TestScore[]>();
    for (const result of results) {
        if (result.provider.id == llm_id) {
            const test_difficulties = findDifficulties(result.vars.name, tests);
            const test_score = result.score.toFixed(1) * (test_difficulties["context-length"] + test_difficulties["reasoning-depth"] + test_difficulties["instruction-compliance"]);
            var score: TestScore = {
                test_name: result.vars.name,
                assertion_score: result.score,
                test_score: test_score,
                repeat: 1
            }

            if(!scoreMap.has(score.test_name)){
                scoreMap.set(score.test_name, []);
            }
            scoreMap.get(score.test_name).push(score);
        }
    }
    
    // calculate the average score
    const scores: TestScore[] = Array.from(scoreMap.values()).map(scoreList => {
        let assertion_score_sum = scoreList.map(s => s.assertion_score).reduce((pre, cur) => pre + cur);
        let test_score_sum = scoreList.map(s => s.test_score).reduce((pre, cur) => pre + cur);
        
        return {
            test_name: scoreList[0].test_name,
            assertion_score: parseFloat((assertion_score_sum/scoreList.length).toFixed(1)),
            test_score: parseFloat((test_score_sum/scoreList.length).toFixed(1)),
            repeat: scoreList.length
        };
    });

    return scores.sort((a, b) => a.test_name.localeCompare(b.test_name));
}

function generateResponseLogs(rawResp: resultsType, scores: LLMEval[], testStats: TestStats, extractedTestcases: TestCase[]) {
    const resultsObj = rawResp.results;
    const timestamp = resultsObj.timestamp.replace(/[:.]/g, "-");
    const rootFolder = path.join(path.dirname(__dirname), "experiments");
    const enableLog = false;

    // Initialize a dictionary to store the current index for each file
    const fileIndices: { [key: string]: number } = {};
    const llmTestCaseReports: { [key: string]: {[key: string]: TestCaseReport} } = {};

    resultsObj.results.forEach((result) => {
        const providerId = result.provider.id;
        const testId = result.vars.name;

        // Uppdate llmTestCaseReports
        if (!llmTestCaseReports[providerId]) {
            llmTestCaseReports[providerId] = {};
        }
        if (!llmTestCaseReports[providerId][testId]) {
            const testCaseScore = scores.find(score => score.llm_id === providerId).scores.find(score => score.test_name === testId);
            llmTestCaseReports[providerId][testId] = {
                test_name: testId,
                repeat: testCaseScore.repeat,
                difficulty: extractedTestcases.find(test => test.name === testId).difficulties,
                assertion_score: testCaseScore.assertion_score,
                test_score: testCaseScore.test_score,
                details: {}
            };
        }

        // Set log file path
        const key = `${providerId}-${testId}`;
        if (fileIndices[key] === undefined) {
            fileIndices[key] = 1;
        } else {
            fileIndices[key]++;
        }

        const fileName = `${testId}-${fileIndices[key]}.md`;

        const logPath = path.join(rootFolder, timestamp, providerId, fileName);
        fs.mkdirSync(path.dirname(logPath), { recursive: true }); // Create the directory if it doesn't exist

        // Write the log file
        const prompt = result.prompt.raw;
        const response = result.response?.output ?? "[no response]";

        const logContent = `# ${testId}\n\n## Prompt\n\n${prompt}\n\n## Response\n\n${response}\n\n`;

        fs.writeFile(logPath, logContent, (err) => {
            if (enableLog) {
                if (err) {
                    console.log(
                        `✗ log ${providerId}  ${fileName} failed!`,
                        err
                    );
                } else {
                    console.log(`● log ${providerId}  ${fileName} created!`);
                }
            }
        });

        // Update llmTestCaseReports
        const testCaseDifficulties = llmTestCaseReports[providerId][testId].difficulty;
        llmTestCaseReports[providerId][testId].details[fileName.replace(".md", "")] = {
            assertion_score: result.score,
            test_score: result.score.toFixed(1) * (testCaseDifficulties["context-length"] + testCaseDifficulties["reasoning-depth"] + testCaseDifficulties["instruction-compliance"])
        }
    });

    // Write llmTestCaseReports to file
    Object.entries(llmTestCaseReports).forEach(([llmId, llm]) => {
        const llmPath = path.join(rootFolder, timestamp, llmId, "report.json");
        fs.mkdirSync(path.dirname(llmPath), { recursive: true }); // Create the directory if it doesn't exist

        fs.writeFile(llmPath, JSON.stringify({
            llm_id: llmId,
            timestamp: timestamp,
            aggregated_scores: scores.find(score => score.llm_id === llmId).aggregated_scores,
            total_score: scores.find(score => score.llm_id === llmId).total_score,
            testcases: Object.values(llm).sort((a, b) => a.test_name.localeCompare(b.test_name))
        }), (err) => {
            if (enableLog) {
                if (err) {
                    console.log(
                        `✗ report ${llmId} failed!`,
                        err
                    );
                } else {
                    console.log(`● report ${llmId} created!`);
                }
            }
        });
    });
};

export type LLMEval = {
    llm_id: string,
    scores: TestScore[],
    aggregated_scores: {
        context_length: number,
        reasoning_depth: number,
        instruction_compliance: number
    }
    total_score: number
}

export type TestScore = {
    test_name: string
    assertion_score: number
    test_score: number
    repeat: number
}

type DifficultyType = {
    "context-length": number;
    "reasoning-depth": number;
    "instruction-compliance": number;
};

export type TestStats = {
    llms: string[];
    max_total_score: number;
    max_context_length: number;
    max_reasoning_depth: number;
    max_instruction_compliance: number;
    testcases: TestCase[];
    startTime: any;
    endTime: any;
}

type resultType = {
    provider: {
        id: string;
        label: string;
        [key: string]: any; // Index signature to allow additional properties
    };
    prompt: {
        raw: string;
        label: string;
        [key: string]: any;
    };
    vars: {
        name: string;
        prompt: string;
        difficulties: DifficultyType,
        [key: string]: any;
    };
    response?: {
        output: string;
        [key: string]: any;
    };
    [key: string]: any;
};

export type resultsType = {
    evalId: string;
    results: {
        timestamp: string;
        results: resultType[];
        [key: string]: any;
    };
};

export type TestCaseReport = {
    test_name: string;
    repeat: number;
    difficulty: DifficultyType;
    assertion_score: number;
    test_score: number;
    details?: object
}

export { resultFileName, scoreFileName, statsFileName, rawFileName, resultLaundry, extractLLMs, extractTestcases, evaluationScore, calculateTotalScore, getAggregatedScores, findDifficulties, getLLMScores, generateResponseLogs };