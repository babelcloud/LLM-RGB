import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Table } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { ResultTableProgress } from '@components/ResultTableProgress/ResultTableProgress';
import style from './ResultTable.module.css';
class ResultTableProps {
    data;
    statData;
    constructor(data, statData) {
        this.data = data;
        this.statData = statData;
    }
}
export function ResultTable(props) {
    if (!props.data || props.data.length === 0) {
        return (_jsx(_Fragment, { children: _jsx(Box, { h: 400, style: {
                    textAlign: 'center',
                    lineHeight: '400px',
                }, children: "No data" }) }));
    }
    let maxTotalScore = 0;
    if (props.statData.max_total_score !== undefined) {
        maxTotalScore = props.statData.max_total_score;
    }
    let maxContextLengthScore = 0;
    if (props.statData.max_context_length !== undefined) {
        maxContextLengthScore = props.statData.max_context_length;
    }
    let maxReasoningDepthScore = 0;
    if (props.statData.max_reasoning_depth !== undefined) {
        maxReasoningDepthScore = props.statData.max_reasoning_depth;
    }
    let maxInstructionComplianceScore = 0;
    if (props.statData.max_instruction_compliance !== undefined) {
        maxInstructionComplianceScore = props.statData.max_instruction_compliance;
    }
    const items = props.data;
    return (_jsxs("div", { className: style.resultContainer, children: [_jsx("div", { className: style.resultTable, children: _jsxs(Table, { children: [_jsx(Table.Thead, { children: _jsxs(Table.Tr, { children: [_jsx(Table.Th, { className: style.resultTableFistTh, children: "Model" }), _jsx(Table.Th, { children: "Total Score" }), _jsx(Table.Th, { children: "Context Length" }), _jsx(Table.Th, { children: "Reasoning Depth" }), _jsx(Table.Th, { children: "Instruction Compliance" })] }) }), _jsx(Table.Tbody, { children: items.map((item) => (_jsxs(Table.Tr, { children: [_jsx(Table.Td, { className: style.resultTableFistTd, children: item.llm_id }), _jsx(Table.Td, { className: style.resultTableTd, children: _jsx(ResultTableProgress, { value: item.total_score, maxValue: maxTotalScore }) }), _jsx(Table.Td, { className: style.resultTableTd, children: _jsx(ResultTableProgress, { value: item.aggregated_scores?.context_length, maxValue: maxContextLengthScore }) }), _jsx(Table.Td, { className: style.resultTableTd, children: _jsx(ResultTableProgress, { value: item.aggregated_scores?.reasoning_depth, maxValue: maxReasoningDepthScore }) }), _jsx(Table.Td, { className: style.resultTableLastTd, children: _jsx(ResultTableProgress, { value: item.aggregated_scores?.instruction_compliance, maxValue: maxInstructionComplianceScore }) })] }, randomId()))) })] }) }), _jsxs(Table, { className: style.resultTableFixed, children: [_jsx(Table.Thead, { children: _jsx(Table.Tr, { children: _jsx(Table.Th, { className: style.resultTableFistTh, children: "Model" }) }) }), _jsx(Table.Tbody, { children: items.map((item) => (_jsx(Table.Tr, { children: _jsx(Table.Td, { className: style.resultTableFistTd, children: item.llm_id }) }, randomId()))) })] })] }));
}
