import { Box, NumberInput, Select, SimpleGrid, Textarea } from '@mantine/core';
import { AssertTypes, TestCaseAssert } from '@models/TestCaseAssert';
import Editor from '@monaco-editor/react';

class TestCaseFormAssertProps {
  assert: TestCaseAssert;
  onChange: Function;
  index: number;
  disabled: boolean = false;

  constructor(assert: TestCaseAssert, onChange: Function, index: number) {
    this.assert = assert;
    this.onChange = onChange;
    this.index = index;
  }
}

export function TestCaseFormAssert(props: TestCaseFormAssertProps) {
  const {
    assert,
    onChange,
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
          onChange={(value) => onChange(`assert[${index}]type`, value ?? '')}
        />
        <NumberInput
          label="Weight"
          defaultValue={assert.weight}
          decimalScale={1}
          step={1}
          min={0.1}
          max={10}
          disabled={disabled}
          onChange={(e) => onChange(`assert[${index}]weight`, e)}
        />
      </SimpleGrid>
      {assert.type === 'javascript' ? (
        <Box mt={16}>
        <Editor
          height="50vh"
          language="javascript"
          theme="vs-dark"
          value={assert.value ?? ''}
          options={monacoOptions}
          onMount={(editor) => {
            editor.updateOptions({ readOnly: disabled });
          }}
          onChange={(e) => onChange(`assert[${index}]value`, e)}
        />
        </Box>
      ) : (
        <Textarea
          label="Value"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          defaultValue={assert.value ?? ''}
          autosize
          minRows={1}
          maxRows={10}
          disabled={disabled}
          onChange={(e) => onChange(`assert[${index}]value`, e.currentTarget.value)}
        />
      )}
    </>
  );
}
