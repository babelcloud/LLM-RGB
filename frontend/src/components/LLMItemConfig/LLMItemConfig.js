import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Text, Image } from '@mantine/core';
import { maskKey } from '@services/LLMConfigService';
import style from './LLMItemConfig.module.css';
class LLMItemConfigProps {
    data;
    constructor(data) {
        this.data = data;
    }
}
export function LLMItemConfig(props) {
    const { data } = props;
    return (_jsx(_Fragment, { children: _jsxs(Box, { className: data.config?.remark ? style.item2 : style.item, children: [_jsx(Image, { w: 40, h: 40, src: data.icon, className: `${style.displayInline} ${data.config?.remark ? '' : style.textMiddle}` }), data.config?.remark ? (_jsxs(Box, { ml: 16, className: style.itemBoxText, children: [_jsx(Text, { span: true, className: style.itemBoxTextTitle, children: data.name }), _jsx(Text, { className: style.itemBoxTextSub, children: data.config?.remark })] })) : (_jsx(Text, { ml: 16, className: style.itemText, children: data.name })), _jsxs(Box, { className: style.infoBox, children: [typeof data.config.apiKey === 'string' ? _jsx(Text, { children: maskKey(data.config.apiKey) }) : '', data.config.temperature !== undefined ? (_jsxs(Text, { children: ["Temperature: ", data.config.temperature] })) : ('')] })] }, data.key) }));
}
