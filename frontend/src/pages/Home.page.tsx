import { Container, Box, Center, Title, Text, Button } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResultTable } from '@components/ResultTable/ResultTable';
import lastResultFile from '@data/score.json';
import lastResultStatsFile from '@data/stats.json';
import TestResultScore from '@models/TestResultScore';
import TestResultStats from '@models/TestResultStats';
import style from './Home.page.module.css';
import chartBar from './assets/ChartBar.png';
import GithubLogo from './assets/GithubLogo.png';
import Vector from './assets/Vector.png';

export function HomePage() {
  document.title = 'LLM-RGB Evaluate LLMs systematically';

  const lastResult: TestResultScore[] = lastResultFile.map(item => {
    const score = Object.create(TestResultScore.prototype);
    Object.assign(score, item);
    return score;
  });
  const lastResultStats = Object.create(TestResultStats.prototype);
  Object.assign(lastResultStats, lastResultStatsFile);

  const [isReadMore, setIsReadMore] = useState(false);
  const navigate = useNavigate();
  return (
    <div className={style.bodyContainer} style={{ minHeight: window.document.body.clientHeight }}>
      <Container size="md" className={style.mainContainer}>
        <Title className={style.title}>
          LLM-
          <span className={style.mainColor}>RGB</span>
          <a className={style.imgBtn} href="https://babel.cloud" target="_blank" rel="noreferrer">
            <img alt="" src={Vector} />
          </a>
          <a
            className={style.imgBtn}
            href="https://github.com/babelcloud/LLM-RGB"
            target="_blank"
            rel="noreferrer"
          >
            <img alt="" src={GithubLogo} />
          </a>
        </Title>
        <Text mt={10} className={style.subtitle}>
          LLM Reasoning and Generation Benchmark
          <img
            alt=""
            src={chartBar}
            style={{
              verticalAlign: 'middle',
              marginLeft: '6px',
              position: 'relative',
              top: '-2px',
            }}
          />
        </Text>
        <Box
          mt={32}
          mb={29.8}
          className={`${isReadMore ? style.descriptionRead : ''} ${style.description}`}
        >
          <Text>
            This repository contains a collection of detailed test cases (prompts) designed to
            evaluate the reasoning and generation capabilities of Language Learning Models (LLMs) in
            complex scenarios. It's important to note that this benchmark is not intended to be a
            comprehensive test for LLMs. The project was initially developed as an internal project
            at babel.cloud, with the aim of assessing the performance of LLMs in understanding
            context and complying with instructions.
          </Text>
          <Text>
            Complex scenarios present three main challenges compared to chat or simple generations:
            1. Context Length: A single prompt may contain more than 8000 tokens (approximately 20K
            characters). 2. Reasoning Depth: The generation of an answer may require multi-step
            reasoning. 3. Instruction Compliance: The LLM may need to generate a response in a
            specific format, rather than in natural language.
          </Text>
          <Text>
            Each test case is a generation task for an LLM, without involving multi-turn
            conversations. The complexity of each test case is assessed based on the following
            dimensions:
          </Text>
          <Text>
            <span style={{ fontWeight: 'bold' }}>Context Length Difficulty: 1 - 3</span>
            <br />
            The value is 1 if the prompt contains 2000 characters or less. If the number of
            characters is between 2000 and 5000 (inclusive), the value is 2. If it's more than 5000,
            the value is 3. The model's actual performance in this dimension depends on the result
            of each task and the task's context length difficulty. It's not accurate to rate a
            model's ability in different context lengths solely based on the maximum context length
            that the model can handle.
          </Text>
          <Text>
            <span style={{ fontWeight: 'bold' }}>Reasoning Depth Difficulty: 1 - 4</span>
            <br />
            The value is 1 if the answer can be inferred directly from the context, such as a
            knowledge base. If the answer requires reasoning, the value is 2, for example, "Who is
            considered the father of the iPhone and what is the last digit of his birth year?". If
            the answer requires reasoning with the provided context, the value is 4, such as writing
            a program using the provided context syntax.
          </Text>
          <Text>
            <span style={{ fontWeight: 'bold' }}>Instruction Compliance Difficulty: 1 - 3</span>
            <br />
            The value is 1 if the expected response is in natural language without any special
            requirements. If the expected response should be in a specific style such as "YES or
            NO", "Shell command only", the value is 2. If the expected response requires a
            structural format such as JSON, YAML, the value is 3.
          </Text>
          <Text>
            The difficulty of each test case (Dn) is the sum of the three difficulties. Each test
            case includes a set of assertions to evaluate the LLM's output. The result of the
            assertion (Rn) is a decimal between [0, 1]. The final score of the test case (Sn) is
            calculated as Rn x Dn. "n" is the test case number. The total score for each LLM is the
            sum of all test case scores (S1...Sn).
          </Text>
          <Text>
            <span style={{ fontWeight: 'bold' }}>Score Table</span>
            <br />
            The following tables show the evaluation results, executed on Oct. 22nd, 2023. We ran
            the evaluation 10 times and take the average scores. The full score of all 15 testcases
            is 100.
          </Text>
          <Button
            variant="transparent"
            className={style.readMore}
            onClick={() => setIsReadMore(true)}
          >
            Read More
          </Button>
        </Box>
        <Box mt={32} className={style.mainBox}>
          <Center>
            <Text className={`${style.try} ${style.bright}`}>Try it now</Text>
          </Center>
          <Center mt={16}>
            <Button
              onClick={() => navigate('/test')}
              className={style.console}
              size="md"
              justify="center"
              variant="filled"
            >
              Test Console
            </Button>
          </Center>
          <Text mt={32} mb={16} className={`${style.last} ${style.bright}`}>
            Last Benchmark Result
          </Text>
          <ResultTable data={lastResult} statData={lastResultStats} />
          <Box mt={32} className={style.description}>
            <Text>
              1. GPT-4: openai:gpt-4-0613
              <br />
              2. GPT-3.5: openai:gpt-3.5-turbo-16k-0613
              <br />
              3. Claude2: anthropic:claude-2
              <br />
              4. Minimax: minimax:abab5.5-chat
              <br />
              5. Cohere: cohere:command
              <br />
              6. Palm2: google:code-bison
              <br />
              7. Baidu: baidu:ERNIE-Bot
              <br />
              8. ChatGLM: zhipu:chatglm_pro
              <br />
              9. Aliqwen: alibaba:qwen-plus-v1
              <br />
              10. Llama2: meta:llama2-70b-v2-chat
              <br />
              11. Baichuan2: baichuan:Baichuan2-53B
            </Text>
          </Box>
        </Box>
        <Text mt={80} className={style.copyright}>Powered by babel.cloud</Text>
      </Container>
    </div>
  );
}
