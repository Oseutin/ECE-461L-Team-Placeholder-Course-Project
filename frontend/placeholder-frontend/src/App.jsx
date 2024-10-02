import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AddUser from "./pages/AddUser";

function App() {
   return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="adduser" element={<AddUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
