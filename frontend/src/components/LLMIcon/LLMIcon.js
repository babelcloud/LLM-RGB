import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, Image } from "@mantine/core";
import { Fragment } from "react";
import style from "./LLMIcon.module.css";
export class LLMIconProps {
    key;
    data;
    enable = true;
    onClick;
    constructor(key, data, onClick, enable) {
        this.key = key;
        this.data = data;
        this.enable = enable === undefined ? false : enable;
        this.onClick = onClick;
    }
}
export function LLMIcon(props) {
    const { data, enable, onClick } = props;
    return (_jsx(Fragment, { children: _jsxs(Box, { className: enable ? style.frameEnable : style.frameDisable, onClick: () => {
                onClick(!enable, data);
            }, children: [_jsx(Image, { w: 40, h: 40, className: style.displayInline, src: data.icon }), _jsx(Text, { className: style.frameLabel, mt: 8, children: data.name })] }) }, props.data.key));
}
