import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import HomePage from "./pages/Home/HomePage";
import useAuth from "./auth/useAuth";
import { NotesProvider } from "./notes/NotesProvider";

export function AppRouter() {
  const { user } = useAuth();
  return (
    <NotesProvider user={user}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </NotesProvider>
  );
}
