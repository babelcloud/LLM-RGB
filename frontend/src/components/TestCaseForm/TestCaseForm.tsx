import TestCase from "@models/TestCase";
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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { TestCaseFormAssert } from "@components/TestCaseFormAssert/TestCaseFormAssert";
import { TestCaseAssert } from "@models/TestCaseAssert";
import style from "@pages/Test.page.module.css";

interface OnTestCaseSave {
  (testCase: TestCase): void;
}

interface OnTestCaseDelete {
  (testCase: TestCase): void;
}

interface TestCaseFormProps {
  testCase: TestCase;
  testCaseList: TestCase[];
  onSave: OnTestCaseSave;
  onDelete: OnTestCaseDelete;
  disabled?: boolean;
}

export function TestCaseForm({
  testCase,
  testCaseList,
  onSave,
  onDelete,
  disabled = false,
}: TestCaseFormProps) {
  const [updated, setUpdated] = useState(false);

  const form = useForm({
    initialValues: testCase,
    validateInputOnChange: true,
    validate: {
      name: (value, values) => {
        if (
          testCaseList.filter(
            (t) => t.name === value && t.created !== values.created,
          ).length > 0
        ) {
          return "Duplicate names are not allowed";
        }
        if (!/^[0-9]{3,}_/.test(value)) {
          return "Must contain at least 3 digits with leading zeros and an underscore";
        }
        return null;
      },
      asserts: {
        type: (value, values) => {
          if (value !== "javascript") {
            return null;
          }
          if (
            values.asserts.filter((a) => a.type === "javascript").length < 2
          ) {
            return null;
          }
          return "Not allow to add one more javascript asset";
        },
      },
    },
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

  function resetForm() {
    form.reset();
    setUpdated(false);
  }

  function saveTestCase() {
    if (!form.isValid()) {
      return;
    }
    const newTestCase = Object.create(TestCase.prototype);
    Object.assign(newTestCase, form.values);
    onSave(newTestCase);
  }

  function addAssert() {
    form.insertListItem("asserts", new TestCaseAssert("equals", "", 1));
  }

  function deleteAssert(index: number) {
    form.removeListItem("asserts", index);
  }

  return (
    <>
      <form>
        <Box>
          <SimpleGrid cols={2}>
            <TextInput
              label="Name"
              disabled={disabled}
              {...form.getInputProps("name")}
            />
            <NumberInput
              label="Threshold"
              decimalScale={1}
              fixedDecimalScale
              step={0.1}
              min={0.1}
              max={1}
              disabled={disabled}
              {...form.getInputProps("threshold")}
            />
          </SimpleGrid>
          <Textarea
            label="Description"
            minRows={2}
            maxRows={10}
            autosize
            disabled={disabled}
            {...form.getInputProps("description")}
          />
        </Box>
        <Box mt={32}>
          <Text>Difficulties</Text>
          <SimpleGrid cols={3}>
            <NumberInput
              label="Context Length"
              min={1}
              max={5}
              disabled={disabled}
              {...form.getInputProps("contextLength")}
            />
            <NumberInput
              label="Reasoning Depth"
              min={1}
              max={5}
              disabled={disabled}
              {...form.getInputProps("reasoningDepth")}
            />
            <NumberInput
              label="Instruction Compliance"
              min={1}
              max={5}
              disabled={disabled}
              {...form.getInputProps("instructionCompliance")}
            />
          </SimpleGrid>
          <Textarea
            label="Prompt"
            mt={32}
            minRows={2}
            maxRows={10}
            autosize
            disabled={disabled}
            {...form.getInputProps("prompt")}
          />
        </Box>
        <Box mt={32}>
          {disabled ? (
            ""
          ) : (
            <Button
              size="xs"
              color="#795FF3"
              style={{ float: "right" }}
              onClick={() => addAssert()}
            >
              Add
            </Button>
          )}
          <Text style={{ lineHeight: "30px" }}>Asserts</Text>
          <div style={{ clear: "both" }} />
          {form.values.asserts.map((assert, index) => (
            <div key={assert.id}>
              <Divider mt={16} mb={8} />
              <div style={{ float: "right" }}>
                <Tooltip label="Delete this assert">
                  <CloseButton
                    disabled={disabled}
                    size="xs"
                    onClick={() => deleteAssert(index)}
                  />
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
      {disabled ? (
        ""
      ) : (
        <Box mt={16}>
          <Divider />
          <Box mt={16} style={{ float: "right" }}>
            <Button
              mr={16}
              className={style.newTest}
              size="2rem"
              color="gray"
              radius="8"
              disabled={!updated}
              onClick={resetForm}
            >
              Cancel
            </Button>
            <Button
              className={style.newTest}
              size="2rem"
              color="#795FF3"
              radius="8"
              disabled={!updated}
              onClick={saveTestCase}
            >
              Save
            </Button>
          </Box>
          <Box mt={16}>
            <Button
              className={style.newTest}
              size="2rem"
              color="pink"
              radius="8"
              disabled={disabled}
              onClick={() => onDelete(testCase)}
            >
              Delete
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}
