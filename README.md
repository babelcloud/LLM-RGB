# LLM Reasoning and Generation Benchmark

This repository contains a collection of detailed test cases (prompts) designed to evaluate the reasoning and generation capabilities of Language Learning Models (LLMs) in complex scenarios. It's important to note that this benchmark is not intended to be a comprehensive test for LLMs. The project was initially developed as an internal project at babel.cloud, with the aim of assessing the performance of LLMs in understanding context and complying with instructions.

Complex scenarios present three main challenges compared to chat or simple generations:
1. Context Length: A single prompt may contain more than 8000 tokens (approximately 20K characters).
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
The following tables show the evaluation results, executed on Oct. 22nd, 2023. We ran the evaluation 10 times and take the average scores. The full score of all 15 testcases is 100.

### Score by Abilities
![image](https://github.com/babelcloud/LLM-RGB/assets/1726527/4c0263b8-9143-4e99-b0cc-63dc9f2cf769)

### Score by Testcases
![image](https://github.com/babelcloud/LLM-RGB/assets/1726527/e0aa573a-cd17-4ee9-931e-3b888eb0a5ed)

### Evaluation Details
Please check the following link for evaluation details of above table.
[Result-1](https://llm-rgb.babel.run/view/testId/0fe24287-b3a2-4133-977b-a6cf4e7bd75c) [Result-2](https://llm-rgb.babel.run/view/testId/4da29438-86a4-44f1-9951-1c1a579a7c42) [Result-3](https://llm-rgb.babel.run/view/testId/7abb8037-58ea-40c1-94eb-fed6fbd8a341) [Result-4](https://llm-rgb.babel.run/view/testId/65acfaa7-73ab-4975-ba5b-31c461853bce) [Result-5](https://llm-rgb.babel.run/view/testId/473b72af-d994-438e-9c34-78f1ab7f9048) [Result-6](https://llm-rgb.babel.run/view/testId/895f2850-fdb0-4036-992d-0088be35aa33) [Result-7](https://llm-rgb.babel.run/view/testId/5574566c-1444-4018-8d8b-68c13c32abaf) [Result-8](https://llm-rgb.babel.run/view/testId/a9b0d5c3-d3dc-4b2c-b90c-0f4670ea0af7) [Result-9](https://llm-rgb.babel.run/view/testId/a707dc23-0ae8-4dfd-8051-90963f75b1e7) [Result-10](https://llm-rgb.babel.run/view/testId/e8544d3b-dea6-4de8-a9e9-d69142df90be)

1. GPT-4: openai:gpt-4-0613
2. GPT-3.5: openai:gpt-3.5-turbo-16k-0613
3. Claude2: anthropic:claude-2
4. Minimax: minimax:abab5.5-chat
5. Cohere: cohere:command
6. Palm2: google:code-bison
7. Baidu: baidu:ERNIE-Bot
8. ChatGLM: zhipu:chatglm_pro
9. Aliqwen: alibaba:qwen-plus-v1
10. Llama2: meta:llama2-70b-v2-chat
11. Baichuan2: baichuan:Baichuan2-53B

## Quick Start
The testing tools used in this project are provided by [promptfoo](https://github.com/promptfoo/promptfoo). To run evaluations, you need to fill in the LLM configurations in `promptfooconfig.yaml`. You should comment out any providers and test cases that you don't want to use.

```shell
npm install
```

```shell
npm run start
```

By default, the test result will be uploaded so that you can share the test result link. If you don't want to share the test result:

```shell
npm run start:noshare
```

If you don't have a suitable environment to run the tests, you can use [LLM-RGB Online](https://llm-rgb.babel.run).

If you want to run these tests against LLMs that are not currently listed, you can add custom webhook providers in the same way as the existing ones.

## Contribute Test Cases
We welcome contributions of test cases that can evaluate the reasoning and generation abilities of LLMs. Please refer to the existing test cases for the required files and formats.