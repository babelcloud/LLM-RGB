import { vi, describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

import {
  getTestStats,
} from './generateEvalScore';

vi.mock('fs', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdirSync: vi.fn(),
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdirSync: vi.fn()
  }
}));

describe('getTestStats', () => {
  it('should calculate correct test stats', () => {
    const scores = [{
      llm_id: 'llm1',
      scores: [],
      aggregated_scores: {
        context_length: 0,
        reasoning_depth: 0,
        instruction_compliance: 0
      },
      total_score: 10
    }];

    const tests = [{
      name: 'test1',
      difficulties: {
        'context-length': 1,
        'reasoning-depth': 2,
        'instruction-compliance': 3
      }
    }];

    const startTime = 1000;
    const endTime = 2000;

    const stats = getTestStats(scores, tests, startTime, endTime);

    expect(stats.llms).toEqual(['llm1']);
    expect(stats.max_total_score).toBe(6);
    expect(stats.max_context_length).toBe(1);
    expect(stats.max_reasoning_depth).toBe(2);
    expect(stats.max_instruction_compliance).toBe(3);
    expect(stats.startTime).toBe(startTime);
    expect(stats.endTime).toBe(endTime);
    expect(stats.testcases).toEqual([{
      name: 'test1',
      max_score: 6,
      difficulties: {
        'context-length': 1,
        'reasoning-depth': 2,
        'instruction-compliance': 3
      }
    }]);
  });

  it('should handle empty scores and tests', () => {
    const stats = getTestStats([], [], 1000, 2000);
    expect(stats.llms).toEqual([]);
    expect(stats.max_total_score).toBe(0);
    expect(stats.max_context_length).toBe(0);
    expect(stats.max_reasoning_depth).toBe(0);
    expect(stats.max_instruction_compliance).toBe(0);
    expect(stats.testcases).toEqual([]);
  });
});
