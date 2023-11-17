import {
  Title,
  Container,
  Text,
  Grid,
  Button,
  NavLink,
  Checkbox,
  Box,
  Group,
  Select,
  Modal,
  Progress,
  ActionIcon,
} from '@mantine/core';
import '@mantine/carousel/styles.css';
import { Carousel } from '@mantine/carousel';
import React, { useState } from 'react';
import { randomId, useDisclosure, useListState } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { TestRun } from '@models/TestRun';
import { getLLMs } from '@services/LLM';
import TestCase from '@models/TestCase';
import LLM from '@models/LLM';
import { LLMIcon } from '@components/LLMIcon/LLMIcon';
import { LLMItem } from '@components/LLMItem/LLMItem';
import { runTest } from '@services/RunTest';
import { TestRunService } from '@services/TestRunService';
import LLMConfig from '@models/LLMConfig';
import { GetTestResultStats } from '@services/TestResultStats';
import { IconPencil } from '@tabler/icons-react';
import { testCaseService } from '@services/TestCaseService';
import { TestCaseManage } from '@components/TestCaseManage/TestCaseManage';
import GithubLogo from './assets/GithubLogo.png';
import Vector from './assets/Vector.png';
import style from './Test.page.module.css';

export function TestPage() {
  document.title = 'Test Console - LLM-RGB';

  // // 测试计划部分开始

  const testRunService: TestRunService = new TestRunService();
  const testRunNames: string[] = testRunService.listNames();

  let initTestRun = testRunService.getByName(testRunNames[0]);
  if (initTestRun === undefined) {
    initTestRun = new TestRun('Default Test'); // 正常不会执行到这里
  }
  const [currentTestRun, setCurrentTestRun] = useState(initTestRun);
  const [currentTestCases, setCurrentTestCases] = useListState(currentTestRun.testCaseList);
  const [currentLLMs, setCurrentLLMs] = useListState(currentTestRun.llmList);

  function setCurrent(testRun: TestRun) {
    setCurrentTestRun(testRun);
    setCurrentTestCases.setState(testRun.testCaseList);
    setCurrentLLMs.setState(testRun.llmList);
  }

  function changeTestRun(name: string) {
    if (currentTestRun.name === name) {
      return;
    }
    const targetTestRun = testRunService.getByName(name);
    if (targetTestRun !== undefined) {
      setCurrent(targetTestRun);
    }
  }

  function newTestRun() {
    const testRun = testRunService.new();
    testRunService.add(testRun);
    setCurrent(testRun);
  }

  function duplicateTestRun() {
    const testRun = testRunService.duplicate(currentTestRun.name);
    if (testRun !== undefined) {
      setCurrent(testRun);
    }
  }

  function deleteTestRun() {
    testRunService.delete(currentTestRun.name);
    if (testRunService.listNames().length < 1) {
      testRunService.add(testRunService.new());
    }
    const nextTestRunNames = testRunService.listNames();
    const nextTestRun = testRunService.getByName(nextTestRunNames[0]);
    if (nextTestRun) {
      setCurrent(nextTestRun);
    }
  }

  // 测试计划部分结束

  // 测试用例部分开始

  const testCases: TestCase[] = testCaseService.list();
  const [testCaseList, setTestCaseList] = useListState(testCases);

  function toggleTestCase(event: React.ChangeEvent<HTMLInputElement>, testCase: TestCase) {
    if (event.currentTarget.checked) {
      setCurrentTestCases.append(testCase);
      currentTestRun.testCaseList.push(testCase);
    } else {
      setCurrentTestCases.filter((t) => t.name !== testCase.name);
      currentTestRun.testCaseList = currentTestRun.testCaseList.filter(
        (t) => t.name !== testCase.name
      );
    }
    testRunService.update(currentTestRun);
  }

  function selectAllTestCase(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.checked) {
      setCurrentTestCases.setState(Object.assign([], testCases));
      currentTestRun.testCaseList = Object.assign([], testCases);
    } else {
      setCurrentTestCases.setState([]);
      currentTestRun.testCaseList = [];
    }
    testRunService.update(currentTestRun);
  }

  const allChecked = testCaseList.length === currentTestCases.length;
  const indeterminate = currentTestCases.length > 0 && !allChecked;

  // 测试用例部分结束

  // LLM 部分开始

  const LLMs: LLM[] = getLLMs();

  function toggleLLM(enable: boolean, llm: LLM) {
    if (currentTestRun.finished()) {
      return;
    }
    if (enable) {
      const exists: string[] = [];
      setCurrentLLMs.append(llm);
      setCurrentLLMs.filter((l: LLM) => {
        if (exists.some((e) => e === l.name)) {
          return false;
        }
        exists.push(l.name);
        return true;
      });
      const newLLM = llm;
      if (newLLM.config.apiKey !== undefined) {
        newLLM.config.apiKey = '';
      }
      currentTestRun.llmList.push(newLLM);
    } else {
      setCurrentLLMs.filter((l) => l.name !== llm.name);
      currentTestRun.llmList = currentTestRun.llmList.filter((t) => t.name !== llm.name);
    }
    testRunService.update(currentTestRun);
  }

  function updateItem(llm: LLM, index: number, newConfig: LLMConfig) {
    setCurrentLLMs.setItemProp(index, 'config', newConfig);
    const llmIndex = currentTestRun.llmList.findIndex((l) => l.name === llm.name);
    Object.assign(currentTestRun.llmList[llmIndex].config, newConfig);
    testRunService.update(currentTestRun);
  }

  function removeItem(item: LLM) {
    toggleLLM(false, item);
  }

  // LLM 部分结束

  // 运行测试部分开始

  const [running, {
    open: openRunning,
    close: closeRunning,
  }] = useDisclosure(false);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [viewLoading, setViewLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  function view() {
    const testId = currentTestRun.reportId;
    setViewLoading(true);
    navigate(`/result/testId/${testId}`, { state: { testId } });
  }

  async function run() {
    setShowWarning(false);
    if (currentTestRun.llmList.length < 1) {
      alert('No LLM selected');
      return;
    }
    if (currentTestRun.testCaseList.length < 1) {
      alert('No Test Cases selected');
      return;
    }

    const requestTestCaseList = testCaseList.filter(t =>
    currentTestRun.testCaseList.some(ct =>
        ct.name === t.name
    ));

    const invalidLLMs = currentTestRun.llmList.filter((l) => {
      if (l.config.apiKey !== undefined) {
        return l.config.apiKey?.trim() === '';
      }
      if (l.config.url !== undefined) {
        return l.config.url?.trim() === '';
      }
      return false;
    });
    if (invalidLLMs.length > 0) {
      setShowWarning(true);
      return;
    }
    openRunning();
    const startTime = new Date().getTime();
    const testId: string = await runTest(
      currentTestRun.llmList,
      requestTestCaseList,
      (r) => {
        console.log(r);
        setProgress((r.progress / r.total) * 100);
      }
    );
    const endTime = new Date().getTime();
    const duration = endTime - startTime;
    currentTestRun.duration = Math.round(duration / 1000);
    let reties = 0;
    const waiter = async () => {
      try {
        const stats = await GetTestResultStats(testId);
        if (stats.llms !== undefined && stats.llms.length > 0) {
          closeRunning();
          currentTestRun.setReportId(testId);
          currentTestRun.setTestCaseList(requestTestCaseList);
          testRunService.update(currentTestRun);
          setCurrent(currentTestRun);
          view();
        }
      } catch (e) {
        reties += 1;
        console.log(e);
        if (reties < 3) {
          setTimeout(waiter, 1000);
        } else {
          alert('Internal Error, please try to run again');
        }
      }
    };
    setTimeout(waiter, 1000);
  }

  // 运行测试部分结束

  // Test Case 管理开始

  const [showManage, {
    open: openManage,
    close: closeManage,
  }] = useDisclosure(false);

  function saveTestCaseList(newTestCaseList: TestCase[]) {
    testCaseService.setList(newTestCaseList);
    setTestCaseList.setState(newTestCaseList);
  }

  // Test Case 管理结束

  return (
    <div className={style.bodyContainer}>
      <Container size={1200} className={style.mainContainer}>
        <Title className={style.title} onClick={() => navigate('/')}>
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
        <Text mt={8} className={style.subtitle}>
          Test Console
        </Text>
        <Box pos="relative">
          <Modal
            opened={running}
            onClose={closeRunning}
            withCloseButton={false}
            closeOnClickOutside={false}
          >
            <Progress value={progress} />
          </Modal>
          <Grid gutter="16" mt={40}>
            <Grid.Col
              span={{
                base: 12,
                lg: 2,
              }}
            >
              <Select
                className={style.selectItems}
                leftSection={
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.8538 4.39615L10.1038 0.646155C10.0573 0.599667 10.0022 0.562787 9.94148 0.537625C9.88078 0.512463 9.81571 0.499512 9.75001 0.499512C9.6843 0.499512 9.61924 0.512463 9.55854 0.537625C9.49784 0.562787 9.44269 0.599667 9.39626 0.646155L1.31938 8.72303C0.794584 9.24783 0.499756 9.9596 0.499756 10.7018C0.499756 11.444 0.794584 12.1557 1.31938 12.6805C1.84418 13.2053 2.55596 13.5002 3.29813 13.5002C4.04031 13.5002 4.75208 13.2053 5.27688 12.6805L12.27 5.68741L13.6581 5.22491C13.739 5.19799 13.8117 5.15084 13.8693 5.08791C13.9268 5.02499 13.9673 4.9484 13.9869 4.86541C14.0065 4.78242 14.0046 4.6958 13.9813 4.61378C13.958 4.53175 13.9141 4.45705 13.8538 4.39678V4.39615ZM4.56938 11.973C4.23014 12.3 3.77613 12.4807 3.305 12.4764C2.83387 12.472 2.38327 12.2829 2.05012 11.9498C1.71697 11.6166 1.52788 11.166 1.52354 10.6949C1.51919 10.2238 1.69993 9.76977 2.02688 9.43053L3.82688 7.63053C4.35626 7.44928 5.18626 7.38053 6.26876 7.94303C6.93126 8.28928 7.53001 8.44303 8.05376 8.48866L4.56938 11.973ZM11.8419 4.77553C11.7682 4.8 11.7012 4.8413 11.6463 4.89615L9.17313 7.36928C8.64376 7.55053 7.81376 7.61928 6.73126 7.05678C6.06876 6.71053 5.47001 6.55678 4.94626 6.51116L9.75001 1.70678L12.5744 4.53116L11.8419 4.77553Z"
                      fill="#F5F9FC"
                    />
                  </svg>
                }
                value={currentTestRun.name}
                data={testRunNames}
                onChange={(value) => changeTestRun(value || '')}
              />
              <Button
                className={style.newTest}
                size="2rem"
                color="#795FF3"
                radius="8"
                onClick={newTestRun}
              >
                <span className={style.newTestSpan}>+</span>
                New Test
              </Button>
              <Box className={style.navLinkList}>
                {testRunNames.map((item) => (
                  <NavLink
                    key={item}
                    mb={8}
                    className={style.navLink}
                    label={item}
                    leftSection={
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.8538 4.39615L10.1038 0.646155C10.0573 0.599667 10.0022 0.562787 9.94148 0.537625C9.88078 0.512463 9.81571 0.499512 9.75001 0.499512C9.6843 0.499512 9.61924 0.512463 9.55854 0.537625C9.49784 0.562787 9.44269 0.599667 9.39626 0.646155L1.31938 8.72303C0.794584 9.24783 0.499756 9.9596 0.499756 10.7018C0.499756 11.444 0.794584 12.1557 1.31938 12.6805C1.84418 13.2053 2.55596 13.5002 3.29813 13.5002C4.04031 13.5002 4.75208 13.2053 5.27688 12.6805L12.27 5.68741L13.6581 5.22491C13.739 5.19799 13.8117 5.15084 13.8693 5.08791C13.9268 5.02499 13.9673 4.9484 13.9869 4.86541C14.0065 4.78242 14.0046 4.6958 13.9813 4.61378C13.958 4.53175 13.9141 4.45705 13.8538 4.39678V4.39615ZM4.56938 11.973C4.23014 12.3 3.77613 12.4807 3.305 12.4764C2.83387 12.472 2.38327 12.2829 2.05012 11.9498C1.71697 11.6166 1.52788 11.166 1.52354 10.6949C1.51919 10.2238 1.69993 9.76977 2.02688 9.43053L3.82688 7.63053C4.35626 7.44928 5.18626 7.38053 6.26876 7.94303C6.93126 8.28928 7.53001 8.44303 8.05376 8.48866L4.56938 11.973ZM11.8419 4.77553C11.7682 4.8 11.7012 4.8413 11.6463 4.89615L9.17313 7.36928C8.64376 7.55053 7.81376 7.61928 6.73126 7.05678C6.06876 6.71053 5.47001 6.55678 4.94626 6.51116L9.75001 1.70678L12.5744 4.53116L11.8419 4.77553Z"
                          fill="#F5F9FC"
                        />
                      </svg>
                    }
                    active={item === currentTestRun.name}
                    onClick={() => changeTestRun(item)}
                  />
                ))}
              </Box>
            </Grid.Col>
            <Grid.Col
              span={{
                base: 12,
                lg: 3,
              }}
            >
              <Container className={style.form}>
                <Box style={{ float: 'right' }}>
                  <ActionIcon variant="filled" aria-label="Manage" size="sm" color="#795FF3" onClick={openManage}>
                    <IconPencil
                      style={{
                        width: '70%',
                        height: '70%',
                      }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                  <Modal opened={showManage} onClose={closeManage} title="Test Case Management" size="1200" centered>
                    <TestCaseManage testCases={testCaseList} onSave={saveTestCaseList} />
                  </Modal>
                </Box>
                <Text className={style.header}>Select Test Cases</Text>
                <Box className={style.formHead}>
                  <Checkbox
                    disabled={currentTestRun.finished()}
                    checked={allChecked}
                    indeterminate={indeterminate}
                    size="1rem"
                    label="Select All"
                    className={style.checkbox}
                    onChange={selectAllTestCase}
                  />
                </Box>
                <Box className={style.testCases}>
                  {testCaseList.map((testCase) => (
                    <Checkbox
                      disabled={currentTestRun.finished()}
                      key={testCase.name}
                      label={testCase.name}
                      size="1rem"
                      checked={currentTestCases.some((t) => t.name === testCase.name)}
                      className={style.checkbox}
                      onChange={(e) => toggleTestCase(e, testCase)}
                    />
                  ))}
                </Box>
              </Container>
            </Grid.Col>
            <Grid.Col
              span={{
                base: 12,
                lg: 7,
              }}
            >
              <Container className={style.form1}>
                <Text className={style.header}>Select LLMs</Text>
                <Group mt={16}>
                  <Carousel
                    className={style.carousel}
                    align="start"
                    slideSize={100}
                    slideGap="8"
                    height={113}
                    slidesToScroll={6}
                    dragFree
                    loop
                  >
                    {LLMs.map((item) => (
                      <Carousel.Slide key={item.key}>
                        <LLMIcon
                          key={item.key}
                          data={item}
                          enable={currentLLMs.some((l) => {
                            if (l === undefined) {
                              return false;
                            }
                            return l.name === item.name;
                          })}
                          onClick={toggleLLM}
                        />
                      </Carousel.Slide>
                    ))}
                  </Carousel>
                </Group>
                <Text mt={32} className={style.header}>
                  Config LLMs
                </Text>
                <Box className={style.itemList} mt={16}>
                  {currentLLMs.map((item, index) => (
                    <LLMItem
                      key={randomId()}
                      data={item}
                      disable={currentTestRun.finished()}
                      onUpdate={(newConfig) => updateItem(item, index, newConfig)}
                      onDelete={() => removeItem(item)}
                      warning={
                        ((typeof item.config.apiKey === 'string' && item.config.apiKey === '') ||
                          (typeof item.config.url === 'string' && item.config.url === '')) &&
                        showWarning
                      }
                    />
                  ))}
                </Box>
              </Container>
            </Grid.Col>
            <Grid.Col
              className={style.nbsp1}
              span={{
                base: 0,
                lg: 2,
              }}
            >
              &nbsp;
            </Grid.Col>
            <Grid.Col
              span={{
                base: 3,
                lg: 3,
              }}
            >
              <Button
                className={style.duplicationBtn}
                color="rgba(247, 249, 252, 0.08)"
                onClick={duplicateTestRun}
              >
                Duplication Test
              </Button>
            </Grid.Col>
            <Grid.Col
              className={style.nbsp2}
              span={{
                base: 2,
                lg: 0,
              }}
            >
              &nbsp;
            </Grid.Col>
            <Grid.Col
              span={{
                base: 7,
                lg: 7,
              }}
              ta="right"
            >
              <Button
                className={style.deleteBtn}
                color="rgba(247, 249, 252, 0.08)"
                mr={10}
                onClick={deleteTestRun}
              >
                Delete
              </Button>
              {currentTestRun.finished() ? (
                <Button
                  className={style.runBtn}
                  color="rgba(121, 95, 243, 1)"
                  loading={viewLoading}
                  onClick={view}
                >
                  View Result
                </Button>
              ) : (
                <Button className={style.runBtn} color="rgba(121, 95, 243, 1)" onClick={run}>
                  Run
                </Button>
              )}
            </Grid.Col>
          </Grid>
        </Box>
        <Text mt={80} className={style.copyright}>
          Powered by babel.cloud
        </Text>
      </Container>
    </div>
  );
}
