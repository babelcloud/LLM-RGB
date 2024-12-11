import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Container, Grid, Tabs, Text, Title, Select, Button, Popover, TextInput, } from "@mantine/core";
import { defer, useLoaderData, useNavigate, useParams, useLocation, } from "react-router-dom";
import { useState } from "react";
import { randomId } from "@mantine/hooks";
import dayjs from "dayjs";
import { GetTestResultStats } from "@services/TestResultStats";
import { GetTestResultScore } from "@services/TestResultScore";
import { ResultTable } from "@components/ResultTable/ResultTable";
import { ResultScoreDetailTable } from "@components/ResultScoreDetailTable/ResultScoreDetailTable";
import { GetTestResultRaw } from "@services/TestResultRaw";
import { LLMItemConfig } from "@components/LLMItemConfig/LLMItemConfig";
import { TestRunService } from "@services/TestRunService";
import { TestRun } from "@models/TestRun";
import { testCaseService } from "@services/TestCaseService";
import style from "./Result.page.module.css";
import GithubLogo from "./assets/GithubLogo.png";
import Vector from "./assets/Vector.png";
export const resultLoader = async ({ params, }) => {
    const { testId } = params;
    if (!testId) {
        throw new Error("Test ID is required");
    }
    const overviewStats = await GetTestResultStats(testId);
    const overviewScore = await GetTestResultScore(testId);
    const testResultRaw = await GetTestResultRaw(testId);
    return defer({
        overviewStats,
        overviewScore,
        testResultRaw,
    });
};
const llmNameMap = {
    "gpt-4": "GPT-4",
    "gpt-3.5": "GPT-3.5",
    "llama2-70b-v2-chat": "Llama2",
    minimax: "MINIMAX",
    palm2: "Palm2",
    claude2: "Claude2",
    cohere: "Cohere",
    chatglm: "ChatGLM",
    baidu: "Baidu",
    baichuan2: "Baichuan2",
    aliqwen: "Aliqwen",
    moonshot: "Moonshot",
    sensenova: "SenseNova",
    hunyuan: "HunYuan",
};
class ResultPageProps {
    readonly = false;
    constructor(readonly) {
        if (readonly === undefined) {
            this.readonly = false;
        }
        else {
            this.readonly = readonly;
        }
    }
}
export function ResultPage(props) {
    const [activeTabsMap, setActiveTabsMap] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    let { testId } = useParams();
    let report = "";
    if (!testId) {
        testId = location.state.testId;
        if (!testId) {
            if (!props.readonly) {
                navigate("/test");
            }
        }
        else {
            report = testId;
        }
    }
    else {
        report = testId;
    }
    const data = useLoaderData();
    const { overviewStats, overviewScore, testResultRaw } = data;
    const testRunService = new TestRunService();
    let testRun = testRunService.getByReportId(report);
    let llms = testRun?.getLlmList();
    if (!testRun) {
        testRun = new TestRun("undefined");
    }
    if (!llms) {
        llms = [];
    }
    const testCases = testCaseService.list();
    if (props.readonly) {
        document.title = "Test Result Share - LLM-RGB";
    }
    else {
        document.title = `${testRun.name} LLM-RGB`;
    }
    function getTestCaseDescription(name) {
        const testCase = testCases.find((t) => t.name === name);
        if (testCase) {
            return testCase.description;
        }
        return "";
    }
    function selectAll(e) {
        const element = e.currentTarget;
        element.setSelectionRange(0, element.value.length);
        e.preventDefault();
    }
    const startTime = overviewStats.startTime ?? 1000;
    const endTime = overviewStats.endTime ?? 2000;
    const viewUrl = `${window.location.protocol}://${window.location.host}/view/testId/${testId}`;
    const duration = Math.round((endTime - startTime) / 1000);
    console.log(testResultRaw);
    return (_jsx("div", { className: style.bodyContainer, children: _jsxs(Container, { size: 1200, className: style.mainContainer, children: [_jsxs(Title, { className: `${style.title} ${style.hand}`, onClick: () => navigate("/"), children: ["LLM-", _jsx("span", { className: style.mainColor, children: "RGB" }), _jsx("a", { className: style.imgBtn, href: "https://babel.cloud", target: "_blank", rel: "noreferrer", children: _jsx("img", { alt: "", src: Vector }) }), _jsx("a", { className: style.imgBtn, href: "https://github.com/babelcloud/LLM-RGB", target: "_blank", rel: "noreferrer", children: _jsx("img", { alt: "", src: GithubLogo }) })] }), _jsxs(Box, { mt: 8, className: style.subtitle, children: [!props.readonly ? (_jsx(Box, { component: "span", onClick: () => navigate("/test"), className: style.hand, children: "Test Console" })) : (_jsx(Box, { component: "span", children: "Test Result" })), !props.readonly ? _jsx(Text, { span: true, className: style.dot }) : "", _jsxs(Box, { className: style.subtitleInfo, children: [!props.readonly ? (_jsx("span", { className: style.subtitleName, children: testRun.name })) : (""), llms.length > 0 ? (_jsxs(Box, { className: style.subtitleTime, children: [_jsx(Text, { children: dayjs(startTime).format("YYYY-MM-DD HH:mm:ss") }), _jsxs(Text, { children: ["Duration: ", duration, " secs"] })] })) : ("")] })] }), !props.readonly ? (_jsxs(Popover, { width: 300, trapFocus: true, position: "bottom", withArrow: true, shadow: "md", children: [_jsx(Popover.Target, { children: _jsx(Button, { className: style.share, color: "#795FF3", leftSection: _jsx("svg", { width: "13", height: "15", viewBox: "0 0 13 15", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M10 9.50005C9.66649 9.49994 9.33632 9.56676 9.02907 9.69656C8.72181 9.82635 8.44373 10.0165 8.21128 10.2557L5.33003 8.4038C5.55667 7.82261 5.55667 7.17749 5.33003 6.5963L8.21128 4.74442C8.64406 5.18775 9.22604 5.45458 9.84439 5.49319C10.4627 5.5318 11.0734 5.33944 11.558 4.95339C12.0425 4.56735 12.3665 4.01513 12.467 3.40379C12.5676 2.79246 12.4376 2.16557 12.1022 1.64466C11.7668 1.12375 11.2499 0.745928 10.6518 0.584454C10.0536 0.422981 9.41684 0.489355 8.86487 0.770708C8.31289 1.05206 7.88504 1.52835 7.66428 2.10723C7.44352 2.68611 7.44557 3.32634 7.67003 3.9038L4.78878 5.75567C4.44182 5.39947 3.99652 5.15483 3.5098 5.05301C3.02308 4.9512 2.51706 4.99685 2.05642 5.18411C1.59578 5.37138 1.20144 5.69176 0.923827 6.1043C0.646211 6.51684 0.497925 7.0028 0.497925 7.50005C0.497925 7.9973 0.646211 8.48326 0.923827 8.8958C1.20144 9.30834 1.59578 9.62872 2.05642 9.81599C2.51706 10.0033 3.02308 10.0489 3.5098 9.94708C3.99652 9.84527 4.44182 9.60063 4.78878 9.24442L7.67003 11.0963C7.47701 11.5941 7.44845 12.1407 7.58853 12.6559C7.7286 13.1712 8.02996 13.628 8.44847 13.9596C8.86698 14.2912 9.38065 14.48 9.91427 14.4985C10.4479 14.5171 10.9734 14.3642 11.4139 14.0625C11.8544 13.7607 12.1867 13.3258 12.3621 12.8215C12.5376 12.3173 12.547 11.77 12.3889 11.26C12.2309 10.75 11.9137 10.304 11.4838 9.98731C11.0539 9.6706 10.534 9.49985 10 9.50005ZM10 1.50005C10.2967 1.50005 10.5867 1.58802 10.8334 1.75284C11.0801 1.91767 11.2723 2.15193 11.3858 2.42602C11.4994 2.70011 11.5291 3.00171 11.4712 3.29268C11.4133 3.58366 11.2705 3.85093 11.0607 4.06071C10.8509 4.27049 10.5836 4.41335 10.2927 4.47123C10.0017 4.5291 9.70009 4.4994 9.426 4.38587C9.15192 4.27234 8.91765 4.08008 8.75282 3.8334C8.588 3.58673 8.50003 3.29672 8.50003 3.00005C8.50003 2.60222 8.65806 2.22069 8.93937 1.93939C9.22067 1.65808 9.60221 1.50005 10 1.50005ZM3.00003 9.00005C2.70336 9.00005 2.41335 8.91208 2.16667 8.74725C1.92 8.58243 1.72774 8.34816 1.61421 8.07407C1.50068 7.79998 1.47097 7.49839 1.52885 7.20741C1.58673 6.91644 1.72959 6.64917 1.93937 6.43939C2.14915 6.22961 2.41642 6.08675 2.70739 6.02887C2.99836 5.97099 3.29996 6.0007 3.57405 6.11423C3.84814 6.22776 4.08241 6.42002 4.24723 6.66669C4.41206 6.91337 4.50003 7.20338 4.50003 7.50005C4.50003 7.89787 4.34199 8.2794 4.06069 8.56071C3.77938 8.84201 3.39785 9.00005 3.00003 9.00005ZM10 13.5C9.70336 13.5 9.41335 13.4121 9.16667 13.2473C8.92 13.0824 8.72774 12.8482 8.61421 12.5741C8.50068 12.3 8.47097 11.9984 8.52885 11.7074C8.58673 11.4164 8.72959 11.1492 8.93937 10.9394C9.14915 10.7296 9.41642 10.5867 9.70739 10.5289C9.99837 10.471 10.3 10.5007 10.5741 10.6142C10.8481 10.7278 11.0824 10.92 11.2472 11.1667C11.4121 11.4134 11.5 11.7034 11.5 12C11.5 12.3979 11.342 12.7794 11.0607 13.0607C10.7794 13.342 10.3979 13.5 10 13.5Z", fill: "white" }) }), children: "Share" }) }), _jsx(Popover.Dropdown, { children: _jsx(TextInput, { label: "Share Link", placeholder: "", value: viewUrl, readOnly: true, size: "s", onClick: selectAll }) })] })) : (""), _jsxs(Tabs, { mt: 32, defaultValue: "overview", children: [_jsxs(Tabs.List, { className: style.tabsList, children: [_jsx(Tabs.Tab, { className: style.tabsTab, value: "overview", children: "Overview" }, randomId()), overviewStats.llms?.map((item) => (_jsx(Tabs.Tab, { className: style.tabsTab, value: item, children: llmNameMap[item] ?? item }, randomId())))] }), _jsxs(Tabs.Panel, { mt: 24, value: "overview", children: [_jsxs(Box, { className: style.resultBox, children: [_jsx(Text, { mb: 16, className: style.header, children: "Model Score" }), _jsx(ResultTable, { data: overviewScore, statData: overviewStats })] }), _jsxs(Box, { mt: 16, className: style.resultBox, children: [_jsx(Text, { mb: 16, className: style.header, children: "Score Detail" }), _jsx(ResultScoreDetailTable, { data: overviewScore, statData: overviewStats })] })] }), overviewStats.llms?.map((item) => {
                            const activeTab = activeTabsMap[item] ||
                                item +
                                    testResultRaw.results.find((rawItem) => rawItem.provider.id === item)?.vars.name;
                            return (_jsx(Tabs.Panel, { value: item, children: _jsxs(Grid, { gutter: "16", children: [_jsx(Grid.Col, { span: {
                                                base: 12,
                                                lg: 0,
                                            }, children: _jsx(Select, { className: style.selectItems, defaultValue: activeTab, data: testResultRaw.results
                                                    .filter((rawItem) => rawItem.provider.id === item)
                                                    .sort((a, b) => parseInt(a.vars.name, 10) -
                                                    parseInt(b.vars.name, 10))
                                                    .map((rawItem) => ({
                                                    value: item + rawItem.vars.name,
                                                    label: rawItem.vars.name,
                                                })), onChange: (value) => setActiveTabsMap((prev) => ({
                                                    ...prev,
                                                    [item]: value || "",
                                                })) }) }), _jsx(Grid.Col, { span: {
                                                base: 12,
                                                lg: 12,
                                            }, children: _jsxs(Tabs, { defaultValue: activeTab, orientation: "vertical", activateTabWithKeyboard: false, children: [_jsx(Tabs.List, { className: style.tabsListLeft, mt: 24, children: testResultRaw.results
                                                            .filter((rawItem) => rawItem.provider.id === item)
                                                            .sort((a, b) => parseInt(a.vars.name, 10) -
                                                            parseInt(b.vars.name, 10))
                                                            .map((rawItem) => (_jsx(Tabs.Tab, { value: item + rawItem.vars.name, className: style.navLink, children: rawItem.vars.name }, item + rawItem.vars.name))) }), testResultRaw.results
                                                        .filter((rawItem) => rawItem.provider.id === item)
                                                        .map((rawItem) => (_jsx(Tabs.Panel, { value: item + rawItem.vars.name, children: _jsxs(Box, { className: style.description, children: [_jsxs(Text, { className: style.descriptionTitle, style: { whiteSpace: "pre-wrap" }, children: [getTestCaseDescription(rawItem.vars.name), _jsx("br", {}), _jsx("br", {}), "difficulties", _jsx("br", {}), "context-length:", " ", rawItem.vars.difficulties["context-length"], _jsx("br", {}), "instruction-compliance:", " ", rawItem.vars.difficulties["instruction-compliance"], _jsx("br", {}), "reasoning-depth:", " ", rawItem.vars.difficulties["reasoning-depth"]] }), _jsx(Text, { className: style.descriptionSub, children: "Prompt:" }), _jsxs(Box, { className: style.descriptionText, children: [_jsx(Text, { mt: 16, style: { whiteSpace: "pre-wrap" }, children: rawItem.prompt.raw }), _jsx(Text, { mt: 32, className: style.descriptionSub, children: "Response:" }), _jsx(Text, { mt: 16, style: { whiteSpace: "pre-wrap" }, children: rawItem.response?.output ?? "ERROR" })] })] }) }, item + rawItem.vars.name)))] }) }), !props.readonly ? (_jsx(Grid.Col, { span: {
                                                base: 12,
                                                lg: 12,
                                            }, children: _jsxs(Box, { className: style.config, children: [_jsx(Text, { className: style.configTitle, children: "LLM Config" }), _jsx(Box, { pt: 16, pb: 16, children: llms
                                                            ?.filter((l) => l.id === item)
                                                            .map((llm) => (_jsx(LLMItemConfig, { data: llm }, randomId()))) })] }) })) : ("")] }) }, randomId()));
                        })] }), _jsx(Text, { mt: 80, className: style.copyright, children: "Powered by babel.cloud" })] }) }));
}
