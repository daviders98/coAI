import useAuth from "@/auth/useAuth";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

function HomePage() {
  const { user } = useAuth();

  useEffect(() => {
    // TO-DO
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <div>HomePage</div>;
}

export default HomePage;
