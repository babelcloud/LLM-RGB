import { Box, NumberInput, Select, SimpleGrid, Textarea } from '@mantine/core';
import { AssertTypes, TestCaseAssert } from '@models/TestCaseAssert';
import Editor from '@monaco-editor/react';
import { UseFormReturnType } from '@mantine/form/lib/types';
import TestCase from '@models/TestCase';

class TestCaseFormAssertProps {
  form: UseFormReturnType<TestCase>;
  assert: TestCaseAssert;
  index: number;
  disabled: boolean = false;

  constructor(form: UseFormReturnType<TestCase>,
              assert: TestCaseAssert,
              index: number,
              disabled?: boolean) {
    this.form = form;
    this.assert = assert;
    this.index = index;
    if (disabled !== undefined) {
      this.disabled = disabled;
    }
  }
}

export function TestCaseFormAssert(props: TestCaseFormAssertProps) {
  const {
    form,
    assert,
    index,
    disabled,
  } = props;

  const monacoOptions = {
    domReadOnly: disabled,
    minimap: { enabled: false },
    contextmenu: false,
  };

  return (
    <>
      <SimpleGrid cols={2}>
        <Select
          label="Assert Type"
          data={AssertTypes}
          defaultValue={assert.type}
          disabled={disabled}
          {...form.getInputProps(`asserts.${index}.type`)}
        />
        <NumberInput
          label="Weight"
          defaultValue={assert.weight}
          decimalScale={1}
          step={1}
          min={0.1}
          max={10}
          disabled={disabled}
          {...form.getInputProps(`asserts.${index}.weight`)}
        />
      </SimpleGrid>
      {assert.type === 'javascript' ? (
        <Box mt={16}>
          <Editor
            height="50vh"
            language="javascript"
            theme="vs-dark"
            options={monacoOptions}
            onMount={(editor) => {
              editor.updateOptions({ readOnly: disabled });
            }}
            {...form.getInputProps(`asserts.${index}.value`)}
          />
        </Box>
      ) : (
        <Textarea
          label="Value"
          autosize
          minRows={1}
          maxRows={10}
          disabled={disabled}
          {...form.getInputProps(`asserts.${index}.value`)}
        />
      )}
    </>
  );
}
