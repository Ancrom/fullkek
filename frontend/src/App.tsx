import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import UsersCreate from "./pages/UsersCreate";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/users">users</Link>
      </nav>
      <Routes>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/create" element={<UsersCreate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
