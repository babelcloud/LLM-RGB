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
          <SimpleGrid cols={2}>
            <TextInput
              label="Name"
              value={testCase.name}
              inputWrapperOrder={['label', 'error', 'input', 'description']}
              disabled={disabled}
              onChange={(e) => onChange('name', e.currentTarget.value)}
            />
            <NumberInput
              label="Threshold"
              value={testCase.threshold}
              inputWrapperOrder={['label', 'error', 'input', 'description']}
              decimalScale={1}
              fixedDecimalScale
              step={0.1}
              min={0.1}
              max={1}
              disabled={disabled}
              onChange={(e) => onChange('threshold', e)}
            />
          </SimpleGrid>
          <Textarea
            label="Description"
            value={testCase.description ?? ''}
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            minRows={2}
            maxRows={10}
            autosize
            disabled={disabled}
            onChange={(e) => onChange('description', e.currentTarget.value)}
          />
        </Box>
        <Box mt={32}>
          <Text>Difficulties</Text>
          <SimpleGrid cols={3}>
            <NumberInput
              label="Context Length"
              value={testCase.contextLength}
              inputWrapperOrder={['label', 'error', 'input', 'description']}
              min={1}
              max={5}
              disabled={disabled}
              onChange={(e) => onChange('contextLength', e)}
            />
            <NumberInput
              label="Reasoning Depth"
              value={testCase.reasoningDepth}
              inputWrapperOrder={['label', 'error', 'input', 'description']}
              min={1}
              max={5}
              disabled={disabled}
              onChange={(e) => onChange('reasoningDepth', e)}
            />
            <NumberInput
              label="Instruction Compliance"
              value={testCase.instructionCompliance}
              inputWrapperOrder={['label', 'error', 'input', 'description']}
              min={1}
              max={5}
              disabled={disabled}
              onChange={(e) => onChange('instructionCompliance', e)}
            />
          </SimpleGrid>
          <Textarea
            label="Prompt"
            value={testCase.prompt}
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            mt={32}
            minRows={2}
            maxRows={10}
            autosize
            disabled={disabled}
            onChange={(e) => onChange('prompt', e.currentTarget.value)}
          />
        </Box>
        <Box mt={32}>
          {disabled ? '' : (
            <Button size="xs" color="#795FF3" style={{ float: 'right' }} onClick={() => onAddAssert()}>Add</Button>
          )}
          <Text style={{ lineHeight: '30px' }}>Asserts</Text>
          <div style={{ clear: 'both' }} />
          {testCase.asserts.map((assert, index) => (
            <div key={randomId()}>
              <Divider mt={16} mb={8} />
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
        </Box>
      </form>
    </div>
  );
}
