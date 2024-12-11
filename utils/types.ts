/**
 * Type definitions for LLM-RGB test cases and configurations
 */

/**
 * Represents the difficulty ratings for a test case across different dimensions
 */
export interface TestDifficulty {
    'context-length': number;
    'reasoning-depth': number;
    'instruction-compliance': number;
}

/**
 * Represents the configuration for a single test case
 */
export interface TestConfig {
    description: string;
    threshold: number;
    vars: {
        name: string;
        difficulties: TestDifficulty;
        prompt: string;
    };
    assert: Array<{
        type: string;
        value: string;
        weight: number;
    }>;
}

/**
 * Re-export existing types from generateEvalScore.ts for centralized type management
 */
export type {
    LLMEval,
    TestStats,
    resultsType,
    TestCase,
    TestCaseReport,
    TestScore
} from './generateEvalScore';
