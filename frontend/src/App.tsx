import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UsersPage from "./pages/UsersPage";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Users</Link>
      </nav>
      <Routes>
        <Route path="/" element={<UsersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
