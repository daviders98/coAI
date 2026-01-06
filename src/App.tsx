import { AuthProvider } from "./auth/AuthProvider";
import { AppRouter } from "./router";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
