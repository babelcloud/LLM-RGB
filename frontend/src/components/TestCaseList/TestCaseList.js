import { jsx as _jsx } from "react/jsx-runtime";
import style from '@pages/Test.page.module.css';
import { NavLink } from '@mantine/core';
class TestCaseListProps {
    testCases;
    onChange;
    active;
    constructor(testCases, onChange, active) {
        this.testCases = testCases;
        this.onChange = onChange;
        this.active = active;
    }
}
export function TestCaseList(props) {
    const { active, onChange } = props;
    return (_jsx("div", { children: props.testCases.map((item, index) => (_jsx(NavLink, { mb: 8, className: style.navLink, label: item.name, active: item.created === active.created, onClick: () => onChange(item, index) }, item.created))) }));
}
