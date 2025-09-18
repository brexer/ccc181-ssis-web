import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import Dashboard from "./pages/dashboard";
import Students from "./pages/students";
import Colleges from "./pages/colleges";
import Programs from "./pages/programs";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;