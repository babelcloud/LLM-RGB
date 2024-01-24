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
![image](https://github.com/babelcloud/LLM-RGB/assets/1726527/64a37851-3a4b-41df-a4be-7037bae81bcc)

### Score by Testcases
![image](https://github.com/babelcloud/LLM-RGB/assets/1726527/89d2b93f-5723-4e9a-aaed-73c2a28e0c9d)

### Evaluation Details
Please check the following link for evaluation details of above table.
[Result-1](https://llm-rgb.babel.run/view/testId/30c42a05-f325-447d-b829-1401344184b0) [Result-2](https://llm-rgb.babel.run/view/testId/3ea4c092-7f16-400a-9376-f963211a0d60) [Result-3](https://llm-rgb.babel.run/view/testId/2a46c7f1-7c5b-4876-85b3-0f60203a22b1) [Result-4](https://llm-rgb.babel.run/view/testId/6cbe7812-d987-4f8d-8d5f-4ecb92036bc0) [Result-5](https://llm-rgb.babel.run/view/testId/57d33aa7-13e1-4dec-afea-5cb0fdc82323) [Result-6](https://llm-rgb.babel.run/view/testId/8ad41299-2b5d-40cb-913b-7178cb87cb97) [Result-7](https://llm-rgb.babel.run/view/testId/07267d5f-9e4d-4e03-9300-3c1372556900) [Result-8](https://llm-rgb.babel.run/view/testId/d4386ad0-c3a3-4f6c-a9d1-b1509a657476) [Result-9](https://llm-rgb.babel.run/view/testId/f6f0511b-7f1f-4ab0-abfc-4f79bc0bdcae) [Result-10](https://llm-rgb.babel.run/view/testId/ded4d6ee-20a0-46cf-a06c-ceedb7ca8a55)

1. gpt-4-turbo: openai:gpt-4-1106-preview
2. gpt-3.5: openai:gpt-3.5-turbo-1106
3. minimax: minimax:abab6-chat
4. chatglm: zhipu:glm-4
5. moonshot: moonshot:moonshot-v1-8k
6. baichuan2: baichuan:Baichuan2-Turbo
7. gemini-pro: google:gemini-pro
8. aliqwen: alibaba:qwen-max
9. baidu: baidu:ernie_bot_8k
10. Yi-34b-chat: 01-ai:yi-34b-chat
11. llama2: meta:llama-2-70b-chat

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