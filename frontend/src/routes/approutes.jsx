import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Programs from "../pages/Programs";
import Colleges from "../pages/Colleges";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "students", element: <Students /> },
      { path: "programs", element: <Programs /> },
      { path: "colleges", element: <Colleges /> },
    ],
  },
]);

export default router;