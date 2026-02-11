import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import "./app.scss";
import "../../styles/_container.scss";
import UsersPage from "../../pages/users/UsersListPage";
import UsersCreatePage from "../../pages/users/UsersCreatePage";
import UsersEditPage from "../../pages/users/UsersEditPage";
import UserPage from "../../pages/users/UserPage";
import LoginPage from "../../pages/LoginPage";
import SvgSprite from "../ui/Icons/SvgSprite";

function App() {
  return (
    <>
      <SvgSprite />
      <BrowserRouter>
        <Routes>
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/edit/:id" element={<UsersEditPage />} />
            <Route path="/users/:id" element={<UserPage />}></Route>
          </Route>

          {/* Public routes */}
          <Route>
            <Route path="/users/create" element={<UsersCreatePage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
