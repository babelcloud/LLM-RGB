import { Select, Textarea, TextInput } from '@mantine/core';
import { AssertTypes, TestCaseAssert } from '@models/TestCaseAssert';

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
  const { assert, onChange, index, disabled } = props;
  return (
    <>
      <Select
        label="Assert Type"
        data={AssertTypes}
        defaultValue={assert.type}
        disabled={disabled}
        onChange={(value) => onChange(`assert[${index}]type`, value ?? '')}
      />
      <Textarea
        label="Value"
        inputWrapperOrder={['label', 'error', 'input', 'description']}
        defaultValue={assert.value}
        disabled={disabled}
        onChange={(e) => onChange(`assert[${index}]value`, e.currentTarget.value)}
      />
      <TextInput
        label="Weight"
        defaultValue={assert.weight}
        disabled={disabled}
        onChange={(e) => onChange(`assert[${index}]weight`, e.currentTarget.value)}
      />
    </>
  );
}
