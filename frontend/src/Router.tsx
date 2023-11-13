import { createBrowserRouter, LoaderFunction, RouterProvider } from 'react-router-dom';
import { randomId } from '@mantine/hooks';
import { HomePage } from './pages/Home.page';
import { TestPage } from './pages/Test.page';
import { resultLoader, ResultPage } from './pages/Result.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage key={randomId()} />,
  },
  {
    path: '/test',
    element: <TestPage key={randomId()} />,
  },
  {
    path: '/result/testId/:testId',
    element: <ResultPage key={randomId()} readonly={false} />,
    loader: resultLoader as LoaderFunction,
  },
  {
    path: '/view/testId/:testId',
    element: <ResultPage key={randomId()} readonly />,
    loader: resultLoader as LoaderFunction,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
