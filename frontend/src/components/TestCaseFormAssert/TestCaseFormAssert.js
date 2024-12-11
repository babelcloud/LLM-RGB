import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, NumberInput, Select, SimpleGrid, Textarea } from "@mantine/core";
import { AssertTypes } from "@models/TestCaseAssert";
import Editor from "@monaco-editor/react";
class TestCaseFormAssertProps {
    form;
    assert;
    index;
    disabled = false;
    constructor(form, assert, index, disabled) {
        this.form = form;
        this.assert = assert;
        this.index = index;
        if (disabled !== undefined) {
            this.disabled = disabled;
        }
    }
}
export function TestCaseFormAssert(props) {
    const { form, assert, index, disabled } = props;
    const monacoOptions = {
        domReadOnly: disabled,
        minimap: { enabled: false },
        contextmenu: false,
    };
    return (_jsxs(_Fragment, { children: [_jsxs(SimpleGrid, { cols: 2, children: [_jsx(Select, { label: "Assert Type", data: AssertTypes, defaultValue: assert.type, disabled: disabled, ...form.getInputProps(`asserts.${index}.type`) }), _jsx(NumberInput, { label: "Weight", defaultValue: assert.weight, decimalScale: 1, step: 1, min: 0.1, max: 10, disabled: disabled, ...form.getInputProps(`asserts.${index}.weight`) })] }), assert.type === "javascript" ? (_jsx(Box, { mt: 16, children: _jsx(Editor, { height: "50vh", language: "javascript", theme: "vs-dark", options: monacoOptions, onMount: (editor) => {
                        editor.updateOptions({ readOnly: disabled });
                    }, ...form.getInputProps(`asserts.${index}.value`) }) })) : (_jsx(Textarea, { label: "Value", autosize: true, minRows: 1, maxRows: 10, disabled: disabled, ...form.getInputProps(`asserts.${index}.value`) }))] }));
}
