import { describe, it, expect } from 'vitest';
import { extractCodeBlock } from './extractCode';

describe('extractCodeBlock', () => {
  it('should return the code block content when a code block is present', () => {
    const text = 'Here is some text\n```js\nconsole.log("Hello, world!");\n```\nMore text.';
    const result = extractCodeBlock(text);
    expect(result).toBe('console.log("Hello, world!");');
  });

  it('should return the entire text if no code block is present', () => {
    const text = 'This is a text without any code block.';
    const result = extractCodeBlock(text);
    expect(result).toBe(text);
  });

  it('should return an empty string if the code block is empty', () => {
    const text = 'Text before\n```\n```\nText after.';
    const result = extractCodeBlock(text);
    expect(result).toBe('');
  });

  it('should handle multiple code blocks and return the first one', () => {
    const text = 'Text\n```js\nfirst block\n```\nMore text\n```js\nsecond block\n```';
    const result = extractCodeBlock(text);
    expect(result).toBe('first block');
  });

  it('should handle code blocks at the start of the text', () => {
    const text = '```js\nstart block\n```\nFollowing text.';
    const result = extractCodeBlock(text);
    expect(result).toBe('start block');
  });

  it('should handle code blocks at the end of the text', () => {
    const text = 'Preceding text\n```js\nend block\n```';
    const result = extractCodeBlock(text);
    expect(result).toBe('end block');
  });

  it('should handle code blocks with no specified language', () => {
    const text = 'Text\n```\ncode without language\n```\nMore text.';
    const result = extractCodeBlock(text);
    expect(result).toBe('code without language');
  });
});
