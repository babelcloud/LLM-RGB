# LLM-RGB Documentation

## Test Case Development Guide

### Difficulty Rating Guidelines

LLM-RGB uses three dimensions to rate test case difficulty:

1. **Context Length (1-3)**
   - Level 1: Single-context tasks, minimal background needed
   - Level 2: Multi-context tasks, requires understanding related concepts
   - Level 3: Complex scenarios requiring extensive context integration

2. **Reasoning Depth (1-4)**
   - Level 1: Direct application, minimal reasoning
   - Level 2: Basic inference and pattern recognition
   - Level 3: Complex problem-solving, multiple reasoning steps
   - Level 4: Advanced reasoning, requires novel approach synthesis

3. **Instruction Compliance (1-3)**
   - Level 1: Simple, straightforward instructions
   - Level 2: Multi-step instructions with dependencies
   - Level 3: Complex requirements with edge cases

### Best Practices for Writing Assertions

1. **Structure**
   - Use clear, atomic assertions
   - Include both positive and negative test cases
   - Test edge cases and error conditions

2. **Common Patterns**
   ```typescript
   // YAML Validation
   const result = commonAssertions.validateYAML(output);
   assert(result.isValid, "Output should be valid YAML");

   // JSON Validation
   const result = commonAssertions.validateJSON(output);
   assert(result.isValid, "Output should be valid JSON");

   // TypeScript Code Validation
   const result = commonAssertions.validateTypeScript(output);
   assert(result.matches.hasInterface, "Output should contain interface definition");
   ```

3. **Weight Distribution**
   - Assign weights based on assertion importance
   - Core functionality: 0.6-1.0
   - Edge cases: 0.3-0.5
   - Style/format: 0.1-0.2

### Common Patterns and Utilities

1. **Validation Utilities**
   - `validateTestCase`: Validates test configuration
   - `validateYAML`: Checks YAML format
   - `validateJSON`: Checks JSON format
   - `validateTypeScript`: Validates TypeScript code
   - `validateCodeBlock`: Checks code block formatting

2. **Score Generation**
   - `generateEvalScore`: Calculates test scores
   - `getTestStats`: Generates test statistics
   - `combineAssertions`: Combines multiple assertion results

## Contributing Guide

### How to Add New Test Cases

1. **File Structure**
   ```
   testcases/
   ├── NNN_test_name_config.yaml    # Test configuration
   ├── NNN_test_name_prompt.txt     # Test prompt
   └── NNN_test_name_assert.js      # Test assertions
   ```

2. **Configuration File**
   ```yaml
   description: "Clear description of the test"
   threshold: 0.8  # Minimum passing score
   vars:
     name: "NNN_test_name"
     difficulties:
       context-length: 2
       reasoning-depth: 3
       instruction-compliance: 2
     prompt: ${readFile prompt.txt}
   ```

3. **Assertion File**
   ```javascript
   module.exports = async ({ output, assert }) => {
     // Your assertions here
     assert(condition, "Error message");
   };
   ```

### Test Categories and Organization

1. **Main Categories**
   - Code Generation
   - Parsing
   - Reasoning
   - System Design
   - Algorithm Implementation
   - Error Handling

2. **Naming Convention**
   - Use format: `NNN_descriptive_name`
   - NNN: Sequential number (001, 002, etc.)
   - descriptive_name: Lowercase with underscores

3. **Category Assignment**
   - Add test to appropriate category in `categories.yaml`
   - Multiple categories allowed if applicable

### Code Style and Standards

1. **TypeScript**
   - Use strict type checking
   - Document interfaces and functions
   - Follow ESLint configuration

2. **Testing**
   - Write clear assertions
   - Include error messages
   - Test edge cases

3. **Documentation**
   - Update README.md for significant changes
   - Document new utilities
   - Keep categories.yaml up to date

## Running Tests

1. **Setup**
   ```bash
   npm install
   cp promptfooconfig.yaml.example promptfooconfig.yaml
   ```

2. **Configuration**
   - Configure LLM providers in promptfooconfig.yaml
   - Adjust test parameters as needed

3. **Execution**
   ```bash
   npm run start --repeat=10 --concurrency=8
   ```

4. **Results**
   - View results: `ts-node utils/render.ts "experiments/[timestamp]"`
   - Check category scores and difficulty distribution
