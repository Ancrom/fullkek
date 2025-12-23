import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./app.scss";
import UsersPage from "../../pages/UsersListPage";
import UsersFormPage from "../../pages/UsersFormPage";
import UserPage from "../../pages/UserPage";
import SvgSprite from "../ui/Icons/SvgSprite";

function App() {
  return (
    <>
      <SvgSprite />
      <BrowserRouter>
        <Routes>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/create" element={<UsersFormPage />} />
          <Route path="/users/:id" element={<UserPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
