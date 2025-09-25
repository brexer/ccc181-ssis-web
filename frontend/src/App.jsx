import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import Dashboard from "./pages/dashboard";
import Students from "./pages/students";
import Colleges from "./pages/colleges";
import Programs from "./pages/programs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="programs" element={<Programs />} />
          <Route path="colleges" element={<Colleges />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;