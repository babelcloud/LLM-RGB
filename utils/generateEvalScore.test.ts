import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  extractTestcases,
  getTestStats,
  evaluationScore,
  getAggregatedScores,
  getLLMScores,
  TestCase,
  LLMEval,
  TestScore,
  TestStats,
  resultsType,
} from './generateEvalScore';

vi.mock('fs', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdirSync: vi.fn(),
  get default() {
    return this;
  },
}));

describe('extractTestcases', () => {
  it('should extract and organize test cases from results', () => {
    const mockResults = {
      results: [
        {
          vars: {
            name: 'test1',
            difficulties: {
              'context-length': 2,
              'reasoning-depth': 3,
              'instruction-compliance': 1,
            },
          },
        },
        {
          vars: {
            name: 'test2',
            difficulties: {
              'context-length': 1,
              'reasoning-depth': 2,
              'instruction-compliance': 3,
            },
          },
        },
      ],
    };

    const expected: TestCase[] = [
      {
        name: 'test1',
        difficulties: {
          'context-length': 2,
          'reasoning-depth': 3,
          'instruction-compliance': 1,
        },
      },
      {
        name: 'test2',
        difficulties: {
          'context-length': 1,
          'reasoning-depth': 2,
          'instruction-compliance': 3,
        },
      },
    ];

    expect(extractTestcases(mockResults)).toEqual(expected);
  });
});

describe('getTestStats', () => {
  it('should calculate various statistics from test scores and cases', () => {
    const scores: LLMEval[] = [
      {
        llm_id: 'provider1',
        scores: [],
        aggregated_scores: {
          context_length: 2,
          reasoning_depth: 3,
          instruction_compliance: 1,
        },
        total_score: 6,
      },
    ];
    const tests: TestCase[] = [
      {
        name: 'test1',
        difficulties: {
          'context-length': 2,
          'reasoning-depth': 3,
          'instruction-compliance': 1,
        },
      },
    ];
    const startTime = 1000;
    const endTime = 2000;

    const expected: TestStats = {
      llms: ['provider1'],
      max_total_score: 6,
      max_context_length: 2,
      max_reasoning_depth: 3,
      max_instruction_compliance: 1,
      testcases: [
        {
          name: 'test1',
          difficulties: {
            'context-length': 2,
            'reasoning-depth': 3,
            'instruction-compliance': 1,
          },
          max_score: 6,
        },
      ],
      startTime,
      endTime,
      categoryScores: {},
      difficultyDistribution: {
        contextLength: [0, 1, 0],
        reasoningDepth: [0, 0, 1, 0],
        instructionCompliance: [1, 0, 0],
      },
    };

    expect(getTestStats(scores, tests, startTime, endTime)).toEqual(expected);
  });
});

describe('evaluationScore', () => {
  it('should evaluate scores for each provider', () => {
    const providers = ['provider1'];
    const tests: TestCase[] = [
      {
        name: 'test1',
        difficulties: {
          'context-length': 2,
          'reasoning-depth': 3,
          'instruction-compliance': 1,
        },
      },
    ];
    const result = {
      results: [
        {
          provider: { id: 'provider1' },
          vars: { name: 'test1' },
          score: 1.0,
        },
      ],
    };

    const expected: LLMEval[] = [
      {
        llm_id: 'provider1',
        scores: [
          {
            test_name: 'test1',
            assertion_score: 1.0,
            test_score: 6.0,
            repeat: 1,
          },
        ],
        aggregated_scores: {
          context_length: 2.0,
          reasoning_depth: 3.0,
          instruction_compliance: 1.0,
        },
        total_score: 6.0,
      },
    ];

    expect(evaluationScore(providers, tests, result)).toEqual(expected);
  });
});

describe('getAggregatedScores', () => {
  it('should calculate aggregated scores based on test scores and difficulties', () => {
    const scores: TestScore[] = [
      {
        test_name: 'test1',
        assertion_score: 1.0,
        test_score: 6.0,
        repeat: 1,
      },
    ];
    const tests: TestCase[] = [
      {
        name: 'test1',
        difficulties: {
          'context-length': 2,
          'reasoning-depth': 3,
          'instruction-compliance': 1,
        },
      },
    ];

    const expected = {
      context_length: 2.0,
      reasoning_depth: 3.0,
      instruction_compliance: 1.0,
    };

    expect(getAggregatedScores(scores, tests)).toEqual(expected);
  });
});

describe('getLLMScores', () => {
  it('should extract and calculate scores for each LLM', () => {
    const llm_id = 'provider1';
    const results = [
      {
        provider: { id: 'provider1' },
        vars: { name: 'test1' },
        score: 1.0,
      },
    ];
    const tests: TestCase[] = [
      {
        name: 'test1',
        difficulties: {
          'context-length': 2,
          'reasoning-depth': 3,
          'instruction-compliance': 1,
        },
      },
    ];

    const expected: TestScore[] = [
      {
        test_name: 'test1',
        assertion_score: 1.0,
        test_score: 6.0,
        repeat: 1,
      },
    ];

    expect(getLLMScores(llm_id, results, tests)).toEqual(expected);
  });
});
