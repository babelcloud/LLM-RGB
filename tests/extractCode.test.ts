import { describe, it, expect } from 'vitest';
import { extractCodeBlock } from '../utils/extractCode';

describe('extractCodeBlock', () => {
  it('should extract code block from text', () => {
    const input = "Here is some text\n```js\nconsole.log('Hello, world!');\n```\nAnd some more text.";
    const expectedOutput = "console.log('Hello, world!');";
    const result = extractCodeBlock(input);
    expect(result).toBe(expectedOutput);
  });

  it('should return the entire text if no code block is present', () => {
    const input = "Here is some text without a code block.";
    const expectedOutput = input;
    const result = extractCodeBlock(input);
    expect(result).toBe(expectedOutput);
  });

  it('should handle text with multiple code blocks and return the first one', () => {
    const input = "Text before\n```js\nconsole.log('First block');\n```\nText between\n```js\nconsole.log('Second block');\n```\nText after.";
    const expectedOutput = "console.log('First block');";
    const result = extractCodeBlock(input);
    expect(result).toBe(expectedOutput);
  });

  it('should handle an empty string input', () => {
    const input = "";
    const expectedOutput = "";
    const result = extractCodeBlock(input);
    expect(result).toBe(expectedOutput);
  });

  it('should handle improperly formatted code blocks', () => {
    const input = "Here is some text\n```js\nconsole.log('Hello, world!');";
    const expectedOutput = input;
    const result = extractCodeBlock(input);
    expect(result).toBe(expectedOutput);
  });

  it('should trim the extracted code block', () => {
    const input = "Here is some text\n```js\n    console.log('Hello, world!');    \n```\nAnd some more text.";
    const expectedOutput = "console.log('Hello, world!');";
    const result = extractCodeBlock(input);
    expect(result).toBe(expectedOutput);
  });
});
