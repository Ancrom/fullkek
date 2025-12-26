import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./app.scss";
import "../../styles/_container.scss";
import UsersPage from "../../pages/users/UsersListPage";
import UsersCreatePage from "../../pages/users/UsersCreatePage";
import UsersEditPage from "../../pages/users/UsersEditPage";
import UserPage from "../../pages/users/UserPage";
import SvgSprite from "../ui/Icons/SvgSprite";

function App() {
  return (
    <>
      <SvgSprite />
      <BrowserRouter>
        <Routes>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/create" element={<UsersCreatePage />} />
          <Route path="/users/edit/:id" element={<UsersEditPage />} />
          <Route path="/users/:id" element={<UserPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
