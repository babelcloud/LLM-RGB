import { describe, it, expect, vi } from 'vitest';
import { LLMIcon, LLMIconProps } from './LLMIcon';

// Mock Mantine components
vi.mock('@mantine/core', () => ({
  Box: (props: any) => props.children,
  Text: (props: any) => props.children,
  Image: (props: any) => null
}));

describe('LLMIcon', () => {
  const mockData = {
    key: 'test-key',
    name: 'Test LLM',
    icon: 'test-icon.png'
  };

  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders with enabled styles when enable is true', () => {
    const props = new LLMIconProps('test-key', mockData, mockOnClick, true);
    const result = LLMIcon(props as any);
    expect(result.props.children.props.className).toContain('frameEnable');
  });

  it('renders with disabled styles when enable is false', () => {
    const props = new LLMIconProps('test-key', mockData, mockOnClick, false);
    const result = LLMIcon(props as any);
    expect(result.props.children.props.className).toContain('frameDisable');
  });

  it('displays correct name and icon', () => {
    const props = new LLMIconProps('test-key', mockData, mockOnClick, true);
    const result = LLMIcon(props as any);
    const children = result.props.children.props.children;

    expect(children[0].props.src).toBe('test-icon.png');
    expect(children[1].props.children).toBe('Test LLM');
  });

  it('calls onClick with correct arguments when clicked', () => {
    const props = new LLMIconProps('test-key', mockData, mockOnClick, true);
    const result = LLMIcon(props as any);

    result.props.children.props.onClick();
    expect(mockOnClick).toHaveBeenCalledWith(false, mockData);
  });
});
