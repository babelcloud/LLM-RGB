import { jsx as _jsx } from "react/jsx-runtime";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Router } from "./Router";
export default function App() {
    return (_jsx(MantineProvider, { forceColorScheme: "dark", children: _jsx(Router, {}) }));
}
