import TestCase from '@models/TestCase';
import { Box, Button, CloseButton, Divider, Text, Textarea, TextInput, Tooltip } from '@mantine/core';
import { TestCaseFormAssert } from '@components/TestCaseFormAssert/TestCaseFormAssert';
import { randomId } from '@mantine/hooks';

interface TestCaseFormProps {
  testCase: TestCase;
  onChange: Function;
  onDelete: Function;
  onAddAssert: Function;
  onDelAssert: Function;
  disabled?: boolean;
}

export function TestCaseForm({
                               testCase,
                               onChange,
                               onDelete,
                               onAddAssert,
                               onDelAssert,
                               disabled = false,
                             }: TestCaseFormProps) {
  return (
    <div>
      <div style={{ float: 'right' }}>
        <Tooltip label="Delete this test case">
          <CloseButton disabled={disabled} size="xs" onClick={() => onDelete(testCase)} />
        </Tooltip>
      </div>
      <form>
        <Box>
          <TextInput
            label="Name"
            value={testCase.name}
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            disabled={disabled}
            onChange={(e) => onChange('name', e.currentTarget.value)}
          />
          <Textarea
            label="Description"
            value={testCase.description}
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            disabled={disabled}
            onChange={(e) => onChange('description', e.currentTarget.value)}
          />
          <TextInput
            label="Threshold"
            value={testCase.threshold}
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            disabled={disabled}
            onChange={(e) => onChange('threshold', e.currentTarget.value)}
          />
        </Box>
        <Box mt={32}>
          <Text>Difficulties</Text>
          <TextInput
            label="Context Length"
            value={testCase.contextLength}
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            disabled={disabled}
            onChange={(e) => onChange('contextLength', e.currentTarget.value)}
          />
          <TextInput
            label="Reasoning Depth"
            value={testCase.reasoningDepth}
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            disabled={disabled}
            onChange={(e) => onChange('reasoningDepth', e.currentTarget.value)}
          />
          <TextInput
            label="Instruction Compliance"
            value={testCase.instructionCompliance}
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            disabled={disabled}
            onChange={(e) => onChange('instructionCompliance', e.currentTarget.value)}
          />
          <Textarea
            label="Prompt"
            value={testCase.prompt}
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            disabled={disabled}
            onChange={(e) => onChange('prompt', e.currentTarget.value)}
          />
        </Box>
        <Box mt={32}>
          <Button size="xs" color="#795FF3" style={{ float: 'right' }} onClick={() => onAddAssert()}>Add</Button>
          <Text>Asserts</Text>
          <div style={{ clear: 'both' }} />
          {testCase.asserts.map((assert, index) => (
            <div key={randomId()}>
              <Divider mt={24} mb={8} />
              <div style={{ float: 'right' }}>
                <Tooltip label="Delete this assert">
                  <CloseButton disabled={disabled} size="xs" onClick={() => onDelAssert(assert)} />
                </Tooltip>
              </div>
              <TestCaseFormAssert
                key={randomId()}
                assert={assert}
                disabled={disabled}
                index={index}
                onChange={onChange}
              />
            </div>
          ))}
          <br />
        </Box>
      </form>
    </div>
  );
}
