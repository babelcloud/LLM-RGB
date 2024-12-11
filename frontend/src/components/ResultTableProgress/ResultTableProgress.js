import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Text, Progress } from '@mantine/core';
import { useLayoutEffect, useRef, useState } from 'react';
import style from './ResultTableProgress.module.css';
class ResultTableProgressProps {
    value = 0;
    maxValue = 0;
    constructor(value, maxValue) {
        if (value) {
            this.value = value;
        }
        if (maxValue) {
            this.maxValue = maxValue;
        }
    }
}
export function ResultTableProgress(props) {
    const ref = useRef(null);
    const [width, setWidth] = useState(0);
    useLayoutEffect(() => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        ref && ref.current && setWidth(ref.current['offsetWidth']);
    }, []);
    const value = props.value ?? 0;
    const maxValue = props.maxValue ?? 0;
    // 颜色配置
    const percentage = Math.round((value / maxValue) * 100);
    let colorValue = '#1F5F4B';
    if (percentage < 30) {
        colorValue = '#991B1B';
    }
    else if (percentage < 60) {
        colorValue = '#8a7c37';
    }
    return (_jsxs(_Fragment, { children: [_jsx(Progress.Root, { className: style.resultTableProgress, size: "1.5rem", children: _jsx(Progress.Section, { ref: ref, className: style.resultTableProgressSection, color: colorValue, value: percentage, style: {
                        justifyContent: width < 55 ? 'initial' : 'end',
                    }, children: _jsx(Progress.Label, { className: style.resultTableProgressLabel, children: value }) }) }), _jsx(Text, { className: style.resultTableValue, children: value })] }));
}
