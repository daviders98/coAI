import { AuthProvider } from "./auth/AuthProvider";
import { NotesProvider } from "./notes/NotesProvider";
import { AppRouter } from "./router";

export default function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <AppRouter />
      </NotesProvider>
    </AuthProvider>
  );
}
