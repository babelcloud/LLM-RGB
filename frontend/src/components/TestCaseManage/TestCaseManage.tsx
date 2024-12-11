import TestCase from '@models/TestCase';
import { randomId, useListState } from '@mantine/hooks';
import { Box, Button, Grid, ScrollArea } from '@mantine/core';
import style from '@pages/Test.page.module.css';
import { TestCaseList } from '@components/TestCaseList/TestCaseList';
import { TestCaseForm } from '@components/TestCaseForm/TestCaseForm';
import React, { useEffect, useRef, useState } from 'react';

interface OnTestCaseManageSave {
  (testCaseList: TestCase[]): void;
}

interface TestCaseManageProps {
  testCases: TestCase[];
  onSave: OnTestCaseManageSave;
}

function create(testCases: TestCase[]): TestCase {
  let lastNumber = 0;
  testCases.map(testCase => {
    const found = testCase.name.match('^[0-9]+');
    if (found !== null) {
      const number = parseInt(found[0], 10);
      if (number >= lastNumber) {
        lastNumber = number;
      }
    }
    return testCase;
  });
  lastNumber += 1;
  const index = String(lastNumber).padStart(3, '0');
  return new TestCase(`${index}_test_case`, 1, 1, 1, 1);
}

export function TestCaseManage(props: TestCaseManageProps) {
  const { testCases, onSave } = props;
  const [testCaseList, setTestCaseList] = useListState(testCases);
  const firstTestCase = testCaseList[0];
  const [currentTestCase, setCurrentTestCase] = useState(firstTestCase);
  const testCaseListViewport = useRef<HTMLDivElement>(null);

  function changeCurrentTestCase(testCase: TestCase) {
    setCurrentTestCase(testCase);
  }

  function addTestCase() {
    const newTestCase: TestCase = create(testCaseList);
    setTestCaseList.append(newTestCase);
    setCurrentTestCase(newTestCase);
    setTimeout(() => {
      testCaseListViewport.current!.scrollTo({
        top: testCaseListViewport.current!.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);
  }

  function deleteTestCase(testCase: TestCase) {
    if (testCaseList.length <= 1) {
      alert('Cannot delete last test case');
    } else {
      setTestCaseList.filter(item => item.created !== testCase.created);
      const nextTestCase = testCaseList.at(0);
      if (nextTestCase !== undefined) {
        setCurrentTestCase(nextTestCase);
      }
    }
  }

  function saveTestCase(testCase: TestCase) {
    const newTestCase = Object.create(TestCase.prototype);
    Object.assign(newTestCase, testCase);
    setCurrentTestCase(newTestCase);
    testCaseList.findIndex((value, index) => {
      if (testCase.created === value.created) {
        setTestCaseList.setItem(index, newTestCase);
        return true;
      }
      return false;
    });
  }

  useEffect(() => () => {
    onSave(testCaseList);
  });

  return (
    <>
      <Grid gutter="16">
        <Grid.Col
          span={{
            base: 12,
            lg: 3,
          }}
        >
          <Button
            className={style.newTest}
            size="2rem"
            color="#795FF3"
            radius="8"
            onClick={addTestCase}
          >
            Add
          </Button>
        </Grid.Col>
        <Grid.Col
          span={{
            base: 12,
            lg: 9,
          }}
          style={{ textAlign: 'right' }}
        />
      </Grid>
      <Grid gutter="16">
        <Grid.Col
          span={{
            base: 12,
            lg: 3,
          }}
        >
          <ScrollArea h={600} viewportRef={testCaseListViewport}>
            <Box
              className={style.testcaseForm}
              style={{
                height: '50%',
                overflowY: 'auto',
              }}
            >
              <TestCaseList
                testCases={testCaseList}
                active={currentTestCase}
                onChange={changeCurrentTestCase}
              />
            </Box>
          </ScrollArea>
        </Grid.Col>
        <Grid.Col
          span={{
            base: 12,
            lg: 9,
          }}
        >
          <ScrollArea h={600}>
            <Box className={style.testcaseForm}>
              <TestCaseForm
                key={randomId()}
                testCase={currentTestCase}
                testCaseList={testCaseList}
                onSave={saveTestCase}
                onDelete={deleteTestCase}
                disabled={currentTestCase.readonly}
              />
            </Box>
          </ScrollArea>
        </Grid.Col>
      </Grid>
    </>
  );
}
