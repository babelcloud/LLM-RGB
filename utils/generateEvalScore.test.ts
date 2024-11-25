import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fs from 'fs';
import {
  resultLaundry,
  extractLLMs,
  extractTestcases,
  getTestStats,
  evaluationScore,
  calculateTotalScore,
  getAggregatedScores,
  findDifficulties,
  getLLMScores,
  generateResponseLogs,
  TestCase,
  LLMEval,
  TestScore,
  TestStats,
  resultsType,
  resultType,
} from './generateEvalScore';

vi.mock('fs', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdirSync: vi.fn(),
}));

describe('generateEvalScore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('resultLaundry', () => {
    it('should remove specified properties from results', () => {
      const result = {
        table: {},
        stats: {},
        results: [
          {
            vars: {
              _conversation: 'some conversation',
              prompt: 'some prompt',
            },
          },
        ],
      };

      resultLaundry(result);

      expect(result).not.toHaveProperty('table');
      expect(result).not.toHaveProperty('stats');
      expect(result.results[0].vars).not.toHaveProperty('_conversation');
      expect(result.results[0].vars).not.toHaveProperty('prompt');
    });
  });

  describe('extractLLMs', () => {
    it('should extract unique provider IDs and sort them', () => {
      const result = {
        results: [
          { provider: { id: 'provider1' } },
          { provider: { id: 'provider2' } },
          { provider: { id: 'provider1' } },
        ],
      };

      const providers = extractLLMs(result);

      expect(providers).toEqual(['provider1', 'provider2']);
    });
  });

  describe('extractTestcases', () => {
    it('should extract unique test cases and sort them', () => {
      const result = {
        results: [
          { vars: { name: 'test1', difficulties: {} } },
          { vars: { name: 'test2', difficulties: {} } },
          { vars: { name: 'test1', difficulties: {} } },
        ],
      };

      const testcases = extractTestcases(result);

      expect(testcases).toEqual([
        { name: 'test1', difficulties: {} },
        { name: 'test2', difficulties: {} },
      ]);
    });
  });

  describe('getTestStats', () => {
    it('should calculate statistics based on scores and tests', () => {
      const scores = [
        { llm_id: 'provider1', scores: [], aggregated_scores: {}, total_score: 0 },
      ];
      const tests: TestCase[] = [
        { name: 'test1', difficulties: { 'context-length': 1, 'reasoning-depth': 1, 'instruction-compliance': 1 } },
      ];
      const startTime = Date.now();
      const endTime = Date.now();

      const stats = getTestStats(scores, tests, startTime, endTime);

      expect(stats.llms).toEqual(['provider1']);
      expect(stats.max_total_score).toBe(3);
      expect(stats.max_context_length).toBe(1);
      expect(stats.max_reasoning_depth).toBe(1);
      expect(stats.max_instruction_compliance).toBe(1);
    });
  });

  describe('evaluationScore', () => {
    it('should calculate evaluation scores for providers', () => {
      const providers = ['provider1'];
      const tests: TestCase[] = [
        { name: 'test1', difficulties: { 'context-length': 1, 'reasoning-depth': 1, 'instruction-compliance': 1 } },
      ];
      const result = {
        results: [
          {
            provider: { id: 'provider1' },
            vars: { name: 'test1' },
            score: 1,
          },
        ],
      };

      const scores = evaluationScore(providers, tests, result);

      expect(scores).toHaveLength(1);
      expect(scores[0].llm_id).toBe('provider1');
      expect(scores[0].total_score).toBeGreaterThan(0);
    });
  });

  describe('calculateTotalScore', () => {
    it('should calculate the total score from aggregated scores', () => {
      const aggregated_scores = {
        context_length: 2,
        reasoning_depth: 3,
        instruction_compliance: 4,
      };

      const totalScore = calculateTotalScore(aggregated_scores);

      expect(totalScore).toBe(9.0);
    });
  });

  describe('getAggregatedScores', () => {
    it('should calculate aggregated scores based on test scores and difficulties', () => {
      const scores: TestScore[] = [
        { test_name: 'test1', assertion_score: 1, test_score: 3, repeat: 1 },
      ];
      const tests: TestCase[] = [
        { name: 'test1', difficulties: { 'context-length': 1, 'reasoning-depth': 1, 'instruction-compliance': 1 } },
      ];

      const aggregatedScores = getAggregatedScores(scores, tests);

      expect(aggregatedScores).toEqual({
        context_length: 1.0,
        reasoning_depth: 1.0,
        instruction_compliance: 1.0,
      });
    });
  });

  describe('findDifficulties', () => {
    it('should retrieve difficulty values for a given test by name', () => {
      const tests: TestCase[] = [
        { name: 'test1', difficulties: { 'context-length': 1, 'reasoning-depth': 2, 'instruction-compliance': 3 } },
      ];

      const difficulties = findDifficulties('test1', tests);

      expect(difficulties).toEqual({ 'context-length': 1, 'reasoning-depth': 2, 'instruction-compliance': 3 });
    });
  });

  describe('getLLMScores', () => {
    it('should extract and calculate scores for a specific provider', () => {
      const llm_id = 'provider1';
      const results = [
        {
          provider: { id: 'provider1' },
          vars: { name: 'test1' },
          score: 1,
        },
      ];
      const tests: TestCase[] = [
        { name: 'test1', difficulties: { 'context-length': 1, 'reasoning-depth': 1, 'instruction-compliance': 1 } },
      ];

      const scores = getLLMScores(llm_id, results, tests);

      expect(scores).toHaveLength(1);
      expect(scores[0].test_name).toBe('test1');
      expect(scores[0].assertion_score).toBe(1);
    });
  });

  describe('generateResponseLogs', () => {
    it('should generate response logs and reports based on raw responses and scores', () => {
      const rawResp: resultsType = {
        evalId: 'eval1',
        results: {
          timestamp: '2024-11-10T10:00:00.000Z',
          results: [
            {
              provider: { id: 'provider1', label: 'Provider 1' },
              prompt: { raw: 'What is AI?', label: 'Question' },
              vars: { name: 'test1', difficulties: { 'context-length': 1, 'reasoning-depth': 1, 'instruction-compliance': 1 } },
              response: { output: 'AI is artificial intelligence.' },
              score: 1,
            },
          ],
        },
      };
      const scores: LLMEval[] = [
        {
          llm_id: 'provider1',
          scores: [
            { test_name: 'test1', assertion_score: 1, test_score: 3, repeat: 1 },
          ],
          aggregated_scores: {
            context_length: 1,
            reasoning_depth: 1,
            instruction_compliance: 1,
          },
          total_score: 3,
        },
      ];
      const testStats: TestStats = {
        llms: ['provider1'],
        max_total_score: 3,
        max_context_length: 1,
        max_reasoning_depth: 1,
        max_instruction_compliance: 1,
        testcases: [
          { name: 'test1', difficulties: { 'context-length': 1, 'reasoning-depth': 1, 'instruction-compliance': 1 } },
        ],
        startTime: Date.now(),
        endTime: Date.now(),
      };
      const extractedTestcases: TestCase[] = [
        { name: 'test1', difficulties: { 'context-length': 1, 'reasoning-depth': 1, 'instruction-compliance': 1 } },
      ];

      generateResponseLogs(rawResp, scores, testStats, extractedTestcases);

      expect(fs.writeFile).toHaveBeenCalled();
    });
  });
});
