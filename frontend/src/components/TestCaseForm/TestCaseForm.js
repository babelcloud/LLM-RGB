import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import TestCase from "@models/TestCase";
import { Box, Button, CloseButton, Divider, NumberInput, SimpleGrid, Text, Textarea, TextInput, Tooltip, } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { TestCaseFormAssert } from "@components/TestCaseFormAssert/TestCaseFormAssert";
import { TestCaseAssert } from "@models/TestCaseAssert";
import style from "@pages/Test.page.module.css";
export function TestCaseForm({ testCase, testCaseList, onSave, onDelete, disabled = false, }) {
    const [updated, setUpdated] = useState(false);
    const form = useForm({
        initialValues: testCase,
        validateInputOnChange: true,
        validate: {
            name: (value, values) => {
                if (testCaseList.filter((t) => t.name === value && t.created !== values.created).length > 0) {
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
                    if (values.asserts.filter((a) => a.type === "javascript").length < 2) {
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
        }
        else {
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
    function deleteAssert(index) {
        form.removeListItem("asserts", index);
    }
    return (_jsxs(_Fragment, { children: [_jsxs("form", { children: [_jsxs(Box, { children: [_jsxs(SimpleGrid, { cols: 2, children: [_jsx(TextInput, { label: "Name", disabled: disabled, ...form.getInputProps("name") }), _jsx(NumberInput, { label: "Threshold", decimalScale: 1, fixedDecimalScale: true, step: 0.1, min: 0.1, max: 1, disabled: disabled, ...form.getInputProps("threshold") })] }), _jsx(Textarea, { label: "Description", minRows: 2, maxRows: 10, autosize: true, disabled: disabled, ...form.getInputProps("description") })] }), _jsxs(Box, { mt: 32, children: [_jsx(Text, { children: "Difficulties" }), _jsxs(SimpleGrid, { cols: 3, children: [_jsx(NumberInput, { label: "Context Length", min: 1, max: 5, disabled: disabled, ...form.getInputProps("contextLength") }), _jsx(NumberInput, { label: "Reasoning Depth", min: 1, max: 5, disabled: disabled, ...form.getInputProps("reasoningDepth") }), _jsx(NumberInput, { label: "Instruction Compliance", min: 1, max: 5, disabled: disabled, ...form.getInputProps("instructionCompliance") })] }), _jsx(Textarea, { label: "Prompt", mt: 32, minRows: 2, maxRows: 10, autosize: true, disabled: disabled, ...form.getInputProps("prompt") })] }), _jsxs(Box, { mt: 32, children: [disabled ? ("") : (_jsx(Button, { size: "xs", color: "#795FF3", style: { float: "right" }, onClick: () => addAssert(), children: "Add" })), _jsx(Text, { style: { lineHeight: "30px" }, children: "Asserts" }), _jsx("div", { style: { clear: "both" } }), form.values.asserts.map((assert, index) => (_jsxs("div", { children: [_jsx(Divider, { mt: 16, mb: 8 }), _jsx("div", { style: { float: "right" }, children: _jsx(Tooltip, { label: "Delete this assert", children: _jsx(CloseButton, { disabled: disabled, size: "xs", onClick: () => deleteAssert(index) }) }) }), _jsx(TestCaseFormAssert, { form: form, assert: assert, index: index, disabled: disabled })] }, assert.id)))] })] }), disabled ? ("") : (_jsxs(Box, { mt: 16, children: [_jsx(Divider, {}), _jsxs(Box, { mt: 16, style: { float: "right" }, children: [_jsx(Button, { mr: 16, className: style.newTest, size: "2rem", color: "gray", radius: "8", disabled: !updated, onClick: resetForm, children: "Cancel" }), _jsx(Button, { className: style.newTest, size: "2rem", color: "#795FF3", radius: "8", disabled: !updated, onClick: saveTestCase, children: "Save" })] }), _jsx(Box, { mt: 16, children: _jsx(Button, { className: style.newTest, size: "2rem", color: "pink", radius: "8", disabled: disabled, onClick: () => onDelete(testCase), children: "Delete" }) })] }))] }));
}
