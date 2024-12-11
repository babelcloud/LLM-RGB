import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import TestCase from "@models/TestCase";
import { randomId, useListState } from "@mantine/hooks";
import { Box, Button, Grid, ScrollArea } from "@mantine/core";
import style from "@pages/Test.page.module.css";
import { TestCaseList } from "@components/TestCaseList/TestCaseList";
import { TestCaseForm } from "@components/TestCaseForm/TestCaseForm";
import { useEffect, useRef, useState } from "react";
function create(testCases) {
    let lastNumber = 0;
    testCases.map((testCase) => {
        const found = testCase.name.match("^[0-9]+");
        if (found !== null) {
            const number = parseInt(found[0], 10);
            if (number >= lastNumber) {
                lastNumber = number;
            }
        }
        return testCase;
    });
    lastNumber += 1;
    const index = String(lastNumber).padStart(3, "0");
    return new TestCase(`${index}_test_case`, 1, 1, 1, 1);
}
export function TestCaseManage(props) {
    const { testCases, onSave } = props;
    const [testCaseList, setTestCaseList] = useListState(testCases);
    const firstTestCase = testCaseList[0];
    const [currentTestCase, setCurrentTestCase] = useState(firstTestCase);
    const testCaseListViewport = useRef(null);
    function changeCurrentTestCase(testCase) {
        setCurrentTestCase(testCase);
    }
    function addTestCase() {
        const newTestCase = create(testCaseList);
        setTestCaseList.append(newTestCase);
        setCurrentTestCase(newTestCase);
        setTimeout(() => {
            testCaseListViewport.current.scrollTo({
                top: testCaseListViewport.current.scrollHeight,
                behavior: "smooth",
            });
        }, 0);
    }
    function deleteTestCase(testCase) {
        if (testCaseList.length <= 1) {
            alert("Cannot delete last test case");
        }
        else {
            setTestCaseList.filter((item) => item.created !== testCase.created);
            const nextTestCase = testCaseList.at(0);
            if (nextTestCase !== undefined) {
                setCurrentTestCase(nextTestCase);
            }
        }
    }
    function saveTestCase(testCase) {
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
    return (_jsxs(_Fragment, { children: [_jsxs(Grid, { gutter: "16", children: [_jsx(Grid.Col, { span: {
                            base: 12,
                            lg: 3,
                        }, children: _jsx(Button, { className: style.newTest, size: "2rem", color: "#795FF3", radius: "8", onClick: addTestCase, children: "Add" }) }), _jsx(Grid.Col, { span: {
                            base: 12,
                            lg: 9,
                        }, style: { textAlign: "right" } })] }), _jsxs(Grid, { gutter: "16", children: [_jsx(Grid.Col, { span: {
                            base: 12,
                            lg: 3,
                        }, children: _jsx(ScrollArea, { h: 600, viewportRef: testCaseListViewport, children: _jsx(Box, { className: style.testcaseForm, style: {
                                    height: "50%",
                                    overflowY: "auto",
                                }, children: _jsx(TestCaseList, { testCases: testCaseList, active: currentTestCase, onChange: changeCurrentTestCase }) }) }) }), _jsx(Grid.Col, { span: {
                            base: 12,
                            lg: 9,
                        }, children: _jsx(ScrollArea, { h: 600, children: _jsx(Box, { className: style.testcaseForm, children: _jsx(TestCaseForm, { testCase: currentTestCase, testCaseList: testCaseList, onSave: saveTestCase, onDelete: deleteTestCase, disabled: currentTestCase.readonly }, randomId()) }) }) })] })] }));
}


export { create };