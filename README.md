# LLM Reasoning and Generation Benchmark

This repository contains a collection of detailed test cases (prompts) designed to evaluate the reasoning and generation capabilities of Language Learning Models (LLMs) in complex scenarios. It's important to note that this benchmark is not intended to be a comprehensive test for LLMs. The project was initially developed as an internal project at babel.cloud, with the aim of assessing the performance of LLMs in understanding context and complying with instructions.

Complex scenarios present three main challenges compared to chat or simple generations:
1. Context Length: A single prompt may contain more than 10K tokens (approximately 30K characters).
2. Reasoning Depth: The generation of an answer may require multi-step reasoning.
3. Instruction Compliance: The LLM may need to generate a response in a specific format, rather than in natural language.

Each test case is a generation task for an LLM, without involving multi-turn conversations. The complexity of each test case is assessed based on the following dimensions:

### Context Length Difficulty: 1 - 3
The value is 1 if the prompt contains 2000 characters or less. If the number of characters is between 2000 and 5000 (inclusive), the value is 2. If it's more than 5000, the value is 3. The model's actual performance in this dimension depends on the result of each task and the task's context length difficulty. It's not accurate to rate a model's ability in different context lengths solely based on the maximum context length that the model can handle.

### Reasoning Depth Difficulty: 1 - 4
The value is 1 if the answer can be inferred directly from the context, such as a knowledge base. If the answer requires reasoning, the value is 2, for example, "Who is considered the father of the iPhone and what is the last digit of his birth year?". If the answer requires reasoning with the provided context, the value is 4, such as writing a program using the provided context syntax.

### Instruction Compliance Difficulty: 1 - 3
The value is 1 if the expected response is in natural language without any special requirements. If the expected response should be in a specific style such as "YES or NO", "Shell command only", the value is 2. If the expected response requires a structural format such as JSON, YAML, the value is 3.

The difficulty of each test case (Dn) is the sum of the three difficulties. Each test case includes a set of assertions to evaluate the LLM's output. The result of the assertion (Rn) is a decimal between [0, 1]. The final score of the test case (Sn) is calculated as Rn x Dn. "n" is the test case number. The total score for each LLM is the sum of all test case scores (S1...Sn).

## Score Table
The following tables show the evaluation results, executed on Oct. 11th, 2024. We ran the evaluation 10 times and take the average scores. The full score of all 15 testcases is 100. You can check experiments/2024-10-11T22-43-25-810Z for the detailed results.

### Score by Abilities
![image](https://github.com/user-attachments/assets/cac07fb8-c475-4f62-9422-67d2a877418e)

### Score by Testcases
![image](https://github.com/user-attachments/assets/79123df5-1244-4ff3-8ff8-53c8532bb2b7)


## Quick Start
The testing tools used in this project are provided by [promptfoo](https://github.com/promptfoo/promptfoo). 

```shell
cp promptfooconfig.yaml.example promptfooconfig.yaml
```
To run evaluations, you need to fill in the LLM configurations in `promptfooconfig.yaml`. You should comment out any providers and test cases that you don't want to use. You can also add LLM providers according to promptfoo documents https://www.promptfoo.dev/docs/providers/ .

```shell
npm install
```

```shell
npm run start --repeat=10 --concurrency=8
```
You should change the repeat and concurrency settings as needed. If these values are not specified, the default value of repeat is 1 and concurrency is 8.

Some of the test cases requires python to execute. Make sure you have python installed. If you have python3 installed, you can run the following command to create a symlink.
```shell
sudo ln -s $(which python3) /usr/local/bin/python
```

## Contribute Test Cases
We welcome contributions of test cases that can evaluate the reasoning and generation abilities of LLMs. Please refer to the existing test cases for the required files and formats.