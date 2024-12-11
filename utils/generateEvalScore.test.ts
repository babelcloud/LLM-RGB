import { describe, it, expect } from 'vitest';
import {
  getTestStats,
  type TestCase,
  type LLMEval,
  type TestScore,
  type TestStats,
  type resultsType,
  type TestCaseReport
} from './generateEvalScore';

// Internal type recreation for testing purposes
type DifficultyType = {
  "context-length": number;
  "reasoning-depth": number;
  "instruction-compliance": number;
};

// Internal type for result objects
type resultType = {
  provider: {
    id: string;
    label: string;
    [key: string]: any;
  };
  prompt: {
    raw: string;
    label: string;
    [key: string]: any;
  };
  vars: {
    name: string;
    prompt: string;
    difficulties: DifficultyType;
    [key: string]: any;
  };
  score: number;
  response?: {
    output: string;
    [key: string]: any;
  };
  [key: string]: any;
};

// Test fixtures
const mockDifficulties: DifficultyType = {
  "context-length": 1,
  "reasoning-depth": 2,
  "instruction-compliance": 1
};

const mockTestCase: TestCase = {
  name: "test1",
  difficulties: mockDifficulties
};

const mockTestCase2: TestCase = {
  name: "test2",
  difficulties: {
    "context-length": 2,
    "reasoning-depth": 1,
    "instruction-compliance": 2
  }
};

const mockLLMEval: LLMEval = {
  llm_id: "llm1",
  scores: [
    {
      test_name: "test1",
      assertion_score: 0.8,
      test_score: 3.2, // 0.8 * (1 + 2 + 1)
      repeat: 1
    }
  ],
  aggregated_scores: {
    context_length: 0.8,
    reasoning_depth: 1.6,
    instruction_compliance: 0.8
  },
  total_score: 3.2
};

const mockLLMEval2: LLMEval = {
  llm_id: "llm2",
  scores: [
    {
      test_name: "test2",
      assertion_score: 0.9,
      test_score: 4.5, // 0.9 * (2 + 1 + 2)
      repeat: 1
    }
  ],
  aggregated_scores: {
    context_length: 1.8,
    reasoning_depth: 0.9,
    instruction_compliance: 1.8
  },
  total_score: 4.5
};

// Mock result fixtures
const mockResult: resultType = {
  provider: {
    id: "llm1",
    label: "LLM 1"
  },
  prompt: {
    raw: "test prompt",
    label: "Test Prompt"
  },
  vars: {
    name: "test1",
    prompt: "test prompt",
    difficulties: mockDifficulties
  },
  score: 0.8,
  response: {
    output: "test response"
  }
};

const mockResults: resultsType = {
  evalId: "test-eval",
  results: {
    timestamp: "2024-01-01",
    results: [mockResult]
  }
};

// Test suites
describe('getTestStats', () => {
  it('should calculate correct max scores for single LLM', () => {
    const scores = [mockLLMEval];
    const tests = [mockTestCase];
    const startTime = Date.now();
    const endTime = startTime + 1000;

    const stats = getTestStats(scores, tests, startTime, endTime);

    expect(stats.llms).toEqual(['llm1']);
    expect(stats.max_total_score).toBe(4); // 1 + 2 + 1
    expect(stats.max_context_length).toBe(1);
    expect(stats.max_reasoning_depth).toBe(2);
    expect(stats.max_instruction_compliance).toBe(1);
    expect(stats.testcases).toHaveLength(1);
    expect(stats.startTime).toBe(startTime);
    expect(stats.endTime).toBe(endTime);
  });

  it('should calculate correct max scores for multiple LLMs', () => {
    const scores = [mockLLMEval, mockLLMEval2];
    const tests = [mockTestCase, mockTestCase2];
    const startTime = Date.now();
    const endTime = startTime + 1000;

    const stats = getTestStats(scores, tests, startTime, endTime);

    expect(stats.llms).toEqual(['llm1', 'llm2']);
    expect(stats.max_total_score).toBe(9); // (1 + 2 + 1) + (2 + 1 + 2)
    expect(stats.max_context_length).toBe(3); // 1 + 2
    expect(stats.max_reasoning_depth).toBe(3); // 2 + 1
    expect(stats.max_instruction_compliance).toBe(3); // 1 + 2
    expect(stats.testcases).toHaveLength(2);
  });

  it('should handle empty scores array', () => {
    const scores: LLMEval[] = [];
    const tests = [mockTestCase];
    const startTime = Date.now();
    const endTime = startTime + 1000;

    const stats = getTestStats(scores, tests, startTime, endTime);

    expect(stats.llms).toEqual([]);
    expect(stats.max_total_score).toBe(4); // 1 + 2 + 1
    expect(stats.testcases).toHaveLength(1);
  });

  it('should calculate correct max_score for each test case', () => {
    const scores = [mockLLMEval];
    const tests = [mockTestCase];
    const startTime = Date.now();
    const endTime = startTime + 1000;

    const stats = getTestStats(scores, tests, startTime, endTime);

    expect(stats.testcases[0].max_score).toBe(4); // 1 + 2 + 1
    expect(stats.testcases[0].difficulties).toEqual(mockDifficulties);
  });

  it('should handle undefined difficulties gracefully', () => {
    const invalidTest = { name: "invalid" } as TestCase;
    const scores: LLMEval[] = [];
    const startTime = Date.now();
    const endTime = startTime + 1000;

    const stats = getTestStats(scores, [invalidTest], startTime, endTime);

    expect(stats.max_total_score).toBe(0);
    expect(stats.max_context_length).toBe(0);
    expect(stats.max_reasoning_depth).toBe(0);
    expect(stats.max_instruction_compliance).toBe(0);
  });

  it('should handle missing test cases gracefully', () => {
    const scores = [mockLLMEval];
    const startTime = Date.now();
    const endTime = startTime + 1000;

    const stats = getTestStats(scores, [], startTime, endTime);

    expect(stats.llms).toEqual(['llm1']);
    expect(stats.max_total_score).toBe(0);
    expect(stats.max_context_length).toBe(0);
    expect(stats.max_reasoning_depth).toBe(0);
    expect(stats.max_instruction_compliance).toBe(0);
    expect(stats.testcases).toHaveLength(0);
  });

  it('should aggregate scores correctly across multiple test cases', () => {
    const multiScoreLLM: LLMEval = {
      llm_id: "llm3",
      scores: [
        {
          test_name: "test1",
          assertion_score: 0.8,
          test_score: 3.2,
          repeat: 1
        },
        {
          test_name: "test2",
          assertion_score: 0.9,
          test_score: 4.5,
          repeat: 1
        }
      ],
      aggregated_scores: {
        context_length: 2.6,
        reasoning_depth: 2.5,
        instruction_compliance: 2.6
      },
      total_score: 7.7
    };

    const scores = [multiScoreLLM];
    const tests = [mockTestCase, mockTestCase2];
    const startTime = Date.now();
    const endTime = startTime + 1000;

    const stats = getTestStats(scores, tests, startTime, endTime);

    expect(stats.llms).toEqual(['llm3']);
    expect(stats.max_total_score).toBe(9); // (1 + 2 + 1) + (2 + 1 + 2)
    expect(stats.testcases).toHaveLength(2);
    expect(stats.testcases[0].max_score).toBe(4); // 1 + 2 + 1
    expect(stats.testcases[1].max_score).toBe(5); // 2 + 1 + 2
  });

  it('should sort llms array alphabetically', () => {
    const scores = [mockLLMEval2, mockLLMEval];
    const tests = [mockTestCase, mockTestCase2];
    const startTime = Date.now();
    const endTime = startTime + 1000;

    const stats = getTestStats(scores, tests, startTime, endTime);

    expect(stats.llms).toEqual(['llm1', 'llm2']); // Should be sorted
  });
});
