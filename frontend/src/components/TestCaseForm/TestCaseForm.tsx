import TestCase from '@models/TestCase';
import {
  Box,
  Button,
  CloseButton,
  Divider,
  NumberInput,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import { TestCaseFormAssert } from '@components/TestCaseFormAssert/TestCaseFormAssert';
import { TestCaseAssert } from '@models/TestCaseAssert';
import style from '@pages/Test.page.module.css';

interface OnTestCaseSave {
  (testCase: TestCase): void;
}

interface OnTestCaseDelete {
  (testCase: TestCase): void;
}

interface TestCaseFormProps {
  testCase: TestCase;
  onSave: OnTestCaseSave;
  onDelete: OnTestCaseDelete;
  disabled?: boolean;
}

export function TestCaseForm({
                               testCase,
                               onSave,
                               onDelete,
                               disabled = false,
                             }: TestCaseFormProps) {
  const [updated, setUpdated] = useState(false);

  const form = useForm({
    initialValues: testCase,
  });

  function canSave() {
    if (form.isDirty()) {
      setUpdated(true);
    } else {
      setTimeout(() => {
        canSave();
      }, 100);
    }
  }

  useEffect(() => {
    canSave();
  });

  function saveTestCase() {
    const newTestCase = Object.create(TestCase.prototype);
    Object.assign(newTestCase, form.values);
    onSave(newTestCase);
  }

  function addAssert() {
    form.insertListItem('asserts', new TestCaseAssert('equals', '', 1));
  }

  function deleteAssert(index: number) {
    form.removeListItem('asserts', index);
  }

  return (
    <>
      <div style={{ float: 'right' }}>
        <Tooltip label="Delete this test case">
          <CloseButton disabled={disabled} size="xs" onClick={() => onDelete(testCase)} />
        </Tooltip>
      </div>
      <form>
        <Box>
          <SimpleGrid cols={2}>
            <TextInput
              label="Name"
              inputWrapperOrder={['label', 'error', 'input', 'description']}
              disabled={disabled}
              {...form.getInputProps('name')}
            />
            <NumberInput
              label="Threshold"
              inputWrapperOrder={['label', 'error', 'input', 'description']}
              decimalScale={1}
              fixedDecimalScale
              step={0.1}
              min={0.1}
              max={1}
              disabled={disabled}
              {...form.getInputProps('threshold')}
            />
          </SimpleGrid>
          <Textarea
            label="Description"
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            minRows={2}
            maxRows={10}
            autosize
            disabled={disabled}
            {...form.getInputProps('description')}
          />
        </Box>
        <Box mt={32}>
          <Text>Difficulties</Text>
          <SimpleGrid cols={3}>
            <NumberInput
              label="Context Length"
              inputWrapperOrder={['label', 'error', 'input', 'description']}
              min={1}
              max={5}
              disabled={disabled}
              {...form.getInputProps('contextLength')}
            />
            <NumberInput
              label="Reasoning Depth"
              inputWrapperOrder={['label', 'error', 'input', 'description']}
              min={1}
              max={5}
              disabled={disabled}
              {...form.getInputProps('reasoningDepth')}
            />
            <NumberInput
              label="Instruction Compliance"
              inputWrapperOrder={['label', 'error', 'input', 'description']}
              min={1}
              max={5}
              disabled={disabled}
              {...form.getInputProps('instructionCompliance')}
            />
          </SimpleGrid>
          <Textarea
            label="Prompt"
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            mt={32}
            minRows={2}
            maxRows={10}
            autosize
            disabled={disabled}
            {...form.getInputProps('prompt')}
          />
        </Box>
        <Box mt={32}>
          {disabled ? '' : (
            <Button size="xs" color="#795FF3" style={{ float: 'right' }} onClick={() => addAssert()}>Add</Button>
          )}
          <Text style={{ lineHeight: '30px' }}>Asserts</Text>
          <div style={{ clear: 'both' }} />
          {form.values.asserts.map((assert, index) => (
            <div key={assert.id}>
              <Divider mt={16} mb={8} />
              <div style={{ float: 'right' }}>
                <Tooltip label="Delete this assert">
                  <CloseButton disabled={disabled} size="xs" onClick={() => deleteAssert(index)} />
                </Tooltip>
              </div>
              <TestCaseFormAssert
                form={form}
                assert={assert}
                index={index}
                disabled={disabled}
              />
            </div>
          ))}
        </Box>
      </form>
      {disabled ? '' : (
        <Box mt={16} style={{ textAlign: 'right' }}>
          <Divider />
          <Button
            mt={16}
            className={style.newTest}
            size="2rem"
            color="#795FF3"
            radius="8"
            disabled={!updated}
            onClick={saveTestCase}
          >Save
          </Button>
        </Box>
      )}
    </>
  );
}
