import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const resultFileName = path.join(os.homedir(), '.promptfoo/output/latest.json');
const scoreFileName = path.join(os.homedir(), '.promptfoo/output/latest-score.json');
const statsFileName = path.join(os.homedir(), '.promptfoo/output/latest-stats.json');
const rawFileName = path.join(os.homedir(), '.promptfoo/output/latest-raw.json');
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
                console.log('Error writing scores to file:', err);
            } else {
                console.log('Successfully wrote scores to ' + rawFileName);
            }
        });

    } catch(err) {
        console.log('Error parsing JSON string:', err);
    }
});

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
interface TestCase {
    name: string;
    difficulties: object;
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

function getTestStats(scores, tests, startTime, endTime) {
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
    var scores: TestScore[] = [];
    for (const result of results) {
        if (result.provider.id == llm_id) {
            const test_difficulties = findDifficulties(result.vars.name, tests);
            const test_score = result.score.toFixed(1) * (test_difficulties["context-length"] + test_difficulties["reasoning-depth"] + test_difficulties["instruction-compliance"]);
            var score: TestScore = {
                test_name: result.vars.name,
                assertion_score: parseFloat(result.score.toFixed(1)),
                test_score: parseFloat(test_score.toFixed(1))
            }
            scores.push(score);
        }
    }
    return scores.sort((a, b) => a.test_name.localeCompare(b.test_name));
}

type LLMEval = {
    llm_id: string,
    scores: TestScore[],
    aggregated_scores: {
        context_length: number,
        reasoning_depth: number,
        instruction_compliance: number
    }
    total_score: number
}

type TestScore = {
    test_name: string
    assertion_score: number
    test_score: number
}