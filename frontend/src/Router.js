import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { randomId } from "@mantine/hooks";
import { HomePage } from "./pages/Home.page";
import { TestPage } from "./pages/Test.page";
import { resultLoader, ResultPage } from "./pages/Result.page";
const router = createBrowserRouter([
    {
        path: "/",
        element: _jsx(HomePage, {}, randomId()),
    },
    {
        path: "/test",
        element: _jsx(TestPage, {}, randomId()),
    },
    {
        path: "/result/testId/:testId",
        element: _jsx(ResultPage, { readonly: false }, randomId()),
        loader: resultLoader,
    },
    {
        path: "/view/testId/:testId",
        element: _jsx(ResultPage, { readonly: true }, randomId()),
        loader: resultLoader,
    },
]);
export function Router() {
    return _jsx(RouterProvider, { router: router });
}
