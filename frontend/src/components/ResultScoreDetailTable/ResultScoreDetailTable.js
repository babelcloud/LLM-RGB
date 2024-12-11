import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Table } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { ResultTableProgress } from "@components/ResultTableProgress/ResultTableProgress";
import style from "./ResultScoreDetailTable.module.css";
class ResultScoreDetailTableProps {
    data;
    statData;
    constructor(data, statData) {
        this.data = data;
        this.statData = statData;
    }
}
export function ResultScoreDetailTable(props) {
    if (!props.data || props.data.length === 0) {
        return (_jsx(_Fragment, { children: _jsx(Box, { h: 400, style: { textAlign: "center", lineHeight: "400px" }, children: "No data" }) }));
    }
    const items = props.data;
    const models = [];
    const scoreNameSet = [];
    const scoreSet = new Map();
    items.map((item) => {
        if (item.llm_id === undefined || item.total_score === undefined) {
            return false;
        }
        models.push(item.llm_id);
        const testName = "Total Score";
        if (!scoreSet.has(testName)) {
            scoreSet.set(testName, []);
            scoreNameSet.push(testName);
        }
        scoreSet.get(testName)?.push(item.total_score);
        item.scores?.map((score) => {
            if (!scoreSet.has(score.test_name)) {
                scoreSet.set(score.test_name, []);
                scoreNameSet.push(score.test_name);
            }
            scoreSet.get(score.test_name)?.push(score.test_score);
            return true;
        });
        return true;
    });
    const maxScores = new Map();
    maxScores.set("Total Score", props.statData.max_total_score ?? 0);
    props.statData.testcases?.forEach((testcase) => {
        const name = testcase.name;
        const maxScore = testcase.max_score;
        if (typeof name === "string" && typeof maxScore === "number") {
            maxScores.set(name, maxScore);
        }
    });
    return (_jsxs("div", { className: style.resultContainer, children: [_jsx("div", { className: style.resultTable, children: _jsxs(Table, { children: [_jsx(Table.Thead, { children: _jsxs(Table.Tr, { children: [_jsx(Table.Th, { className: style.resultTableFistTh, children: "Model" }, randomId()), models.map((item) => (_jsx(Table.Th, { children: item }, randomId())))] }) }), _jsx(Table.Tbody, { children: scoreNameSet.map((name) => (_jsxs(Table.Tr, { children: [_jsx(Table.Td, { className: style.resultTableFistTd, children: name }), scoreSet.get(name)?.map((value) => (_jsx(Table.Td, { className: style.resultTableTd, children: _jsx(ResultTableProgress, { value: value, maxValue: maxScores.get(name) ?? 0 }) }, randomId())))] }, randomId()))) })] }) }), _jsxs(Table, { className: style.resultTableFixed, children: [_jsx(Table.Thead, { children: _jsx(Table.Tr, { children: _jsx(Table.Th, { className: style.resultTableFistTh, children: "Model" }) }) }), _jsx(Table.Tbody, { children: scoreNameSet.map((name) => (_jsx(Table.Tr, { children: _jsx(Table.Td, { className: style.resultTableFistTd, children: name }) }, randomId()))) })] })] }));
}
