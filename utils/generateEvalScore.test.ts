import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  extractTestcases,
  getTestStats,
  evaluationScore,
  getAggregatedScores,
  getLLMScores,
  generateResponseLogs,
  TestCase,
  resultsType,
  LLMEval,
  TestStats
} from './generateEvalScore';

vi.mock('fs', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdirSync: vi.fn(),
  get default() { return this; }
}));

const resultSample = {
  results: [
    {
      provider: { id: 'provider1', label: 'Provider 1' },
      prompt: { raw: 'prompt1', label: 'Prompt 1' },
      vars: { name: 'test1', difficulties: { "context-length": 1, "reasoning-depth": 2, "instruction-compliance": 3 } },
      score: 0.8
    },
    {
      provider: { id: 'provider2', label: 'Provider 2' },
      prompt: { raw: 'prompt2', label: 'Prompt 2' },
      vars: { name: 'test2', difficulties: { "context-length": 2, "reasoning-depth": 3, "instruction-compliance": 1 } },
      score: 0.9
    }
  ]
};

describe('extractTestcases', () => {
  it('should extract unique test cases and sort them by name', () => {
    const testCases = extractTestcases(resultSample);
    expect(testCases).toEqual([
      { name: 'test1', difficulties: { "context-length": 1, "reasoning-depth": 2, "instruction-compliance": 3 } },
      { name: 'test2', difficulties: { "context-length": 2, "reasoning-depth": 3, "instruction-compliance": 1 } }
    ]);
  });
});

describe('getTestStats', () => {
  it('should calculate statistics from scores and tests', () => {
    const scores = [
      { llm_id: 'provider1', scores: [], aggregated_scores: { context_length: 1, reasoning_depth: 2, instruction_compliance: 3 }, total_score: 6 },
      { llm_id: 'provider2', scores: [], aggregated_scores: { context_length: 2, reasoning_depth: 3, instruction_compliance: 1 }, total_score: 6 }
    ];
    const testCases: TestCase[] = extractTestcases(resultSample);
    const startTime = Date.now();
    const endTime = Date.now() + 1000;

    const stats = getTestStats(scores, testCases, startTime, endTime);

    expect(stats).toEqual({
      llms: ['provider1', 'provider2'],
      max_total_score: 12,
      max_context_length: 3,
      max_reasoning_depth: 5,
      max_instruction_compliance: 4,
      testcases: [
        { name: 'test1', difficulties: { "context-length": 1, "reasoning-depth": 2, "instruction-compliance": 3 }, max_score: 6 },
        { name: 'test2', difficulties: { "context-length": 2, "reasoning-depth": 3, "instruction-compliance": 1 }, max_score: 6 }
      ],
      startTime,
      endTime
    });
  });
});

describe('evaluationScore', () => {
  it('should calculate evaluation scores for providers', () => {
    const providers = ['provider1', 'provider2'];
    const testCases: TestCase[] = extractTestcases(resultSample);

    const scores = evaluationScore(providers, testCases, resultSample);

    expect(scores).toHaveLength(2);
    expect(scores[0].llm_id).toBe('provider2');
    expect(scores[1].llm_id).toBe('provider1');
  });
});

describe('getAggregatedScores', () => {
  it('should calculate aggregated scores based on test scores and difficulties', () => {
    const scores = [
      { test_name: 'test1', assertion_score: 0.8, test_score: 4.8, repeat: 1 },
      { test_name: 'test2', assertion_score: 0.9, test_score: 6.3, repeat: 1 }
    ];
    const testCases: TestCase[] = extractTestcases(resultSample);

    const aggregatedScores = getAggregatedScores(scores, testCases);

    expect(aggregatedScores).toEqual({
      context_length: 2.6,
      reasoning_depth: 4.3,
      instruction_compliance: 3.3
    });
  });
});

describe('getLLMScores', () => {
  it('should extract and calculate scores for a specific provider', () => {
    const testCases: TestCase[] = extractTestcases(resultSample);

    const scores = getLLMScores('provider1', resultSample.results, testCases);

    expect(scores).toEqual([
      { test_name: 'test1', assertion_score: 0.8, test_score: 4.8, repeat: 1 }
    ]);
  });
});

describe('generateResponseLogs', () => {
  beforeEach(() => {
    vi.mocked(fs.writeFile).mockReset();
    vi.mocked(fs.mkdirSync).mockReset();
  });

  it('should generate response logs and reports', () => {
    const rawResp: resultsType = {
      evalId: 'eval123',
      results: {
        timestamp: '2023-11-01T12:00:00Z',
        results: resultSample.results as any
      }
    };
    const scores: LLMEval[] = [
      {
        llm_id: 'provider1',
        scores: [{ test_name: 'test1', assertion_score: 0.8, test_score: 4.8, repeat: 1 }],
        aggregated_scores: { context_length: 1.0, reasoning_depth: 2.0, instruction_compliance: 3.0 },
        total_score: 6.0
      },
      {
        llm_id: 'provider2',
        scores: [{ test_name: 'test2', assertion_score: 0.9, test_score: 6.3, repeat: 1 }],
        aggregated_scores: { context_length: 2.0, reasoning_depth: 3.0, instruction_compliance: 1.0 },
        total_score: 6.0
      }
    ];
    const testStats: TestStats = getTestStats(scores, extractTestcases(resultSample), Date.now(), Date.now());
    const extractedTestcases: TestCase[] = extractTestcases(resultSample);

    generateResponseLogs(rawResp, scores, testStats, extractedTestcases);

    expect(fs.mkdirSync).toHaveBeenCalled();
    expect(fs.writeFile).toHaveBeenCalled();
  });
});
