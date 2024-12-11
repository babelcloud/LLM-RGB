import { describe, it, expect, vi } from 'vitest';

vi.mock('@models/TestCase', () => {
  return {
    default: class TestCase {
      name: string;
      created: number;
      constructor(name: string, a: number, b: number, c: number, d: number) {
        this.name = name;
        this.created = Date.now();
      }
    }
  }
});

vi.mock('@mantine/hooks', () => ({
  useListState: vi.fn(),
  randomId: vi.fn()
}));

vi.mock('@mantine/core', () => ({
  Box: vi.fn(),
  Button: vi.fn(),
  Grid: vi.fn(),
  ScrollArea: vi.fn()
}));

vi.mock('@pages/Test.page.module.css', () => ({
  default: {
    newTest: 'newTest',
    testcaseForm: 'testcaseForm'
  }
}));

vi.mock('@components/TestCaseList/TestCaseList', () => ({
  TestCaseList: vi.fn()
}));

vi.mock('@components/TestCaseForm/TestCaseForm', () => ({
  TestCaseForm: vi.fn()
}));

import { create } from './TestCaseManage';
import TestCase from '@models/TestCase';

describe('create', () => {
  it('should create test case with index 001 when list is empty', () => {
    const testCases: any[] = [];
    const result = create(testCases);
    expect(result.name).toBe('001_test_case');
  });

  it('should increment highest numeric prefix when creating new test case', () => {
    const testCases = [
      new TestCase('001_test_case', 1, 1, 1, 1),
      new TestCase('002_test_case', 1, 1, 1, 1)
    ] as any[];

    const result = create(testCases);
    expect(result.name).toBe('003_test_case');
  });

  it('should handle non-numeric test case names', () => {
    const testCases = [
      new TestCase('abc_test', 1, 1, 1, 1),
      new TestCase('def_test', 1, 1, 1, 1)
    ] as any[];

    const result = create(testCases);
    expect(result.name).toBe('001_test_case');
  });

  it('should find highest number even with gaps', () => {
    const testCases = [
      new TestCase('001_test_case', 1, 1, 1, 1),
      new TestCase('005_test_case', 1, 1, 1, 1),
      new TestCase('003_test_case', 1, 1, 1, 1)
    ] as any[];

    const result = create(testCases);
    expect(result.name).toBe('006_test_case');
  });

  it('should handle mix of numeric and non-numeric names', () => {
    const testCases = [
      new TestCase('abc_test', 1, 1, 1, 1),
      new TestCase('002_test_case', 1, 1, 1, 1),
      new TestCase('def_test', 1, 1, 1, 1)
    ] as any[];

    const result = create(testCases);
    expect(result.name).toBe('003_test_case');
  });
});
