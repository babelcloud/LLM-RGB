import { describe, it, expect, vi } from "vitest";
import { TestCaseList } from "./TestCaseList";
import TestCase from "@models/TestCase";
import React from "react";

// Mock TestCase
vi.mock("@models/TestCase", () => ({
  default: class {
    name: string;
    threshold: number;
    contextLength: number;
    reasoningDepth: number;
    instructionCompliance: number;
    description: string;
    prompt: string;
    created: string;

    constructor(
      name: string,
      threshold: number,
      contextLength: number,
      reasoningDepth: number,
      instructionCompliance: number,
      description?: string,
      prompt?: string
    ) {
      this.name = name;
      this.threshold = threshold;
      this.contextLength = contextLength;
      this.reasoningDepth = reasoningDepth;
      this.instructionCompliance = instructionCompliance;
      this.description = description || "";
      this.prompt = prompt || "";
      this.created = "";
    }
  }
}));

// Mock NavLink component
vi.mock("@mantine/core", () => ({
  NavLink: vi.fn().mockImplementation((props: any) => {
    return React.createElement("div", {
      key: props.key,
      className: props.className,
      active: props.active,
      onClick: props.onClick
    }, props.label);
  })
}));

vi.mock("@pages/Test.page.module.css", () => ({
  default: {
    navLink: "navLink"
  }
}));

describe("TestCaseList", () => {
  const mockTestCases = [
    new TestCase(
      "Test Case 1",
      0.8,
      100,
      3,
      0.9,
      "Description 1",
      "Prompt 1"
    ),
    new TestCase(
      "Test Case 2",
      0.7,
      200,
      2,
      0.8,
      "Description 2",
      "Prompt 2"
    )
  ];

  mockTestCases[0].created = "2024-01-01";
  mockTestCases[1].created = "2024-01-02";

  const mockOnChange = vi.fn();

  it("renders all test cases", () => {
    const mockProps = {
      testCases: mockTestCases,
      onChange: mockOnChange,
      active: mockTestCases[0]
    };

    const result = TestCaseList(mockProps as any);

    const navLinks = result.props.children;
    expect(navLinks).toHaveLength(2);
    expect(navLinks[0].props.label).toBe("Test Case 1");
    expect(navLinks[1].props.label).toBe("Test Case 2");
  });

  it("marks active test case correctly", () => {
    const mockProps = {
      testCases: mockTestCases,
      onChange: mockOnChange,
      active: mockTestCases[0]
    };

    const result = TestCaseList(mockProps as any);
    const navLinks = result.props.children;

    expect(navLinks[0].props.active).toBe(true);
    expect(navLinks[1].props.active).toBe(false);
  });

  it("calls onChange when clicking a test case", () => {
    const mockProps = {
      testCases: mockTestCases,
      onChange: mockOnChange,
      active: mockTestCases[0]
    };

    const result = TestCaseList(mockProps as any);
    const navLinks = result.props.children;

    navLinks[1].props.onClick();

    expect(mockOnChange).toHaveBeenCalledWith(mockTestCases[1], 1);
  });
});
