import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Text, Image, Button, Modal, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { randomId, useDisclosure, useListState } from '@mantine/hooks';
import { IconMinus, IconSettings2 } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { LLMConfigService, maskKey } from '@services/LLMConfigService';
import LLMConfig from '@models/LLMConfig';
import style from './LLMItem.module.css';
class LLMItemProps {
    data;
    disable;
    onUpdate;
    onDelete;
    warning = false;
    constructor(data, disable, onUpdate, onDelete, warning) {
        this.data = data;
        this.disable = disable;
        this.onUpdate = onUpdate;
        this.onDelete = onDelete;
        if (warning !== undefined) {
            this.warning = warning;
        }
    }
}
export function LLMItem(props) {
    const { data, disable, onUpdate, onDelete } = props;
    const [listOpened, { open: openList, close: closeList }] = useDisclosure(false);
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
    const configService = new LLMConfigService();
    const [configList, setConfigList] = useListState(configService.get(data.id));
    const initialValues = {
        apiKey: data.config.apiKey,
        temperature: data.config.temperature,
        max_new_tokens: data.config.max_new_tokens,
        groupId: data.config.groupId,
        maxOutputTokens: data.config.maxOutputTokens,
        secretKey: data.config.secretKey,
        secret_id: data.config.secret_id,
        secret_key: data.config.secret_key,
        app_id: data.config.app_id,
        id: data.config.id,
        url: data.config.url,
        config: data.config.config,
        remark: data.config.remark,
    };
    const form = useForm({
        initialValues,
    });
    function add() {
        form.reset();
        openEdit();
    }
    function applyConfig(config) {
        Object.assign(data.config, config);
        onUpdate(data.config);
        closeList();
    }
    function del(config) {
        configService.delete(data.id, config);
        setConfigList.filter(c => c.created !== config.created);
        console.log(configService.get(data.id));
    }
    function cancelEdit() {
        form.reset();
        closeEdit();
    }
    function save() {
        const config = new LLMConfig(form.values.apiKey === null ? undefined : form.values.apiKey, form.values.temperature === null ? undefined : form.values.temperature, form.values.max_new_tokens === null ? undefined : form.values.max_new_tokens, form.values.groupId === null ? undefined : form.values.groupId, form.values.maxOutputTokens === null ? undefined : form.values.maxOutputTokens, form.values.secretKey === null ? undefined : form.values.secretKey, form.values.secret_id === null ? undefined : form.values.secret_id, form.values.secret_key === null ? undefined : form.values.secret_key, form.values.app_id === null ? undefined : form.values.app_id, form.values.id === null ? undefined : form.values.id, form.values.url === null ? undefined : form.values.url, form.values.config === null ? undefined : form.values.config, form.values.remark === null ? undefined : form.values.remark);
        configService.add(data.id, config);
        setConfigList.append(config);
        closeEdit();
        form.reset();
    }
    return (_jsx(_Fragment, { children: _jsxs(Box, { className: `${data.config?.remark ? style.item2 : style.item} ${props.warning ? style.warning : ''}`, children: [_jsx(Image, { w: 40, h: 40, src: data.icon, className: `${style.displayInline} ${data.config?.remark ? '' : style.textMiddle}` }), data.config?.remark ? (_jsxs(Box, { ml: 16, className: style.itemBoxText, children: [_jsx(Text, { span: true, className: style.itemBoxTextTitle, children: data.name }), _jsx(Text, { className: style.itemBoxTextSub, children: data.config?.remark })] })) : (_jsx(Text, { span: true, ml: 16, className: style.itemText, children: data.name })), _jsxs(Button.Group, { pt: 6, className: style.floatRight, children: [_jsxs(Modal, { className: style.styleModal, opened: listOpened, onClose: closeList, centered: true, title: "", children: [_jsx(Image, { w: 40, h: 40, src: data.icon, className: `${style.displayInline} ${style.textMiddle}` }), _jsx(Text, { span: true, ml: 16, className: style.itemText, children: data.name }), _jsxs(Box, { mt: 28, className: style.llmForm, children: [configList.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(Text, { children: "Used configurations" }), _jsx(Box, { className: style.configList, children: configList.map(config => (_jsxs(Box, { mb: 12, style: {
                                                            background: 'linear-gradient(0deg, #1E232B, #1E232B), linear-gradient(0deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06))',
                                                            padding: '10px 16px',
                                                            borderRadius: '8px',
                                                            height: '64px',
                                                            border: '1px solid #FFFFFF0F',
                                                        }, onDoubleClick: () => del(config), children: [_jsx(Button, { className: style.useIt, color: "#F7F9FC14", style: { float: 'right' }, onClick: () => applyConfig(config), children: "Use it" }), _jsxs(Text, { className: style.configListRow1, style: { fontSize: '16px' }, children: [config.remark, " - ", dayjs(config.created).format('YYYY-MM-DD HH:mm')] }), _jsx(Text, { className: style.configListRow2, style: {
                                                                    color: '#BABBBF',
                                                                    fontSize: '13px',
                                                                }, children: typeof config.apiKey === 'string' ? maskKey(config.apiKey) : '' })] }, randomId()))) })] })) : (''), _jsx(Box, { mt: 20, children: _jsx(Button, { style: {
                                                    backgroundColor: '#795FF3',
                                                    width: '100%',
                                                    borderRadius: '8px',
                                                }, onClick: add, children: "Add a new configuration" }) })] })] }), _jsxs(Modal, { className: style.styleModal, opened: editOpened, onClose: closeEdit, centered: true, title: "", children: [_jsx(Image, { w: 40, h: 40, src: data.icon, className: `${style.displayInline} ${style.textMiddle}` }), _jsxs(Text, { span: true, ml: 16, className: style.itemText, children: [data.name, " Configuration ", data.note] }), _jsxs(Box, { mt: 28, className: style.llmForm, children: [_jsx(TextInput, { disabled: disable, label: "Remarks", placeholder: "Remarks information is optional", inputWrapperOrder: ['label', 'error', 'input', 'description'], ...form.getInputProps('remark') }), data.config.apiKey !== undefined ? (_jsx(TextInput, { disabled: disable, mt: 20, label: "API Key", placeholder: "Please input the API key", inputWrapperOrder: ['label', 'error', 'input', 'description'], ...form.getInputProps('apiKey') })) : (''), data.config.secretKey !== undefined ? (_jsx(TextInput, { disabled: disable, mt: 20, label: "Secret Key", placeholder: "Please input the secret key", inputWrapperOrder: ['label', 'error', 'input', 'description'], ...form.getInputProps('secretKey') })) : (''), data.config.secret_id !== undefined ? (_jsx(TextInput, { disabled: disable, mt: 20, label: "Secret ID", placeholder: "Please input the secret id", inputWrapperOrder: ['label', 'error', 'input', 'description'], ...form.getInputProps('secret_id') })) : (''), data.config.secret_key !== undefined ? (_jsx(TextInput, { disabled: disable, mt: 20, label: "Secret Key", placeholder: "Please input the secret key", inputWrapperOrder: ['label', 'error', 'input', 'description'], ...form.getInputProps('secret_key') })) : (''), data.config.app_id !== undefined ? (_jsx(TextInput, { disabled: disable, mt: 20, label: "App ID", placeholder: "Please input the app id", inputWrapperOrder: ['label', 'error', 'input', 'description'], ...form.getInputProps('app_id') })) : (''), data.config.groupId !== undefined ? (_jsx(TextInput, { disabled: disable, mt: 20, label: "Group ID", placeholder: "Please input the group id", inputWrapperOrder: ['label', 'error', 'input', 'description'], ...form.getInputProps('groupId') })) : (''), data.config.id !== undefined ? (_jsx(TextInput, { disabled: disable, mt: 20, label: "ID", placeholder: "Please input the unique model id", inputWrapperOrder: ['label', 'error', 'input', 'description'], ...form.getInputProps('id') })) : (''), data.config.url !== undefined ? (_jsx(TextInput, { disabled: disable, mt: 20, label: "URL", placeholder: "Please input the webhook url", inputWrapperOrder: ['label', 'error', 'input', 'description'], ...form.getInputProps('url') })) : (''), data.config.config !== undefined ? (_jsx(Textarea, { minRows: 4, maxRows: 8, autosize: true, disabled: disable, mt: 20, label: "Config", placeholder: "Please input the config json", inputWrapperOrder: ['label', 'error', 'input', 'description'], ...form.getInputProps('config') })) : (''), _jsxs(Box, { mt: 20, ta: "right", children: [_jsx(Button, { color: "gray", mr: 10, onClick: cancelEdit, children: "Cancel" }), _jsx(Button, { disabled: disable, onClick: save, children: "Save" })] })] })] }), _jsx(Button, { className: style.listBtn, variant: "transparent", color: "#BABBBF", size: "2rem", onClick: disable ? openEdit : openList, children: _jsx(IconSettings2, { size: 20 }) }), !disable ? (_jsx(Button, { className: style.listBtn, variant: "transparent", color: "#BABBBF", size: "2rem", onClick: () => onDelete(), children: _jsx(IconMinus, { size: 20 }) })) : ('')] }), _jsx(Box, { className: style.clearBoth })] }, data.key) }));
}
