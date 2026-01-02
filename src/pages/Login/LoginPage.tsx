import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/auth/useAuth";
import logo from "@/assets/logo.webp";
import loginImage from "@/assets/login.jpg";
import { Brand } from "../../components/Brand";

function LoginPage() {
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    login(email);
    navigate("/", { replace: true });
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left side – Form */}
      <div className="flex flex-col justify-center px-6 py-12 md:px-16">
        <div className="mx-auto w-full max-w-sm space-y-2">
          <img src={logo} alt="App logo" className="mb-4 flex h-16 w-auto justify-self-center" />

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-wider">
              Welcome to <Brand />
            </h1>

            <p className="text-sm text-muted-foreground">Sign in to start brainstorming</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="youremail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full duration-200 ease-out hover:bg-foreground hover:shadow-md active:scale-[0.98]"
            >
              Sign in
            </Button>

            <p className="text-center text-xs text-muted-foreground">No password required.</p>
          </form>
        </div>
      </div>

      {/* Right side (hidden on mobile) */}
      <div
        className="relative hidden md:block"
        style={{
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-8 left-8 right-8 text-white">
          <h2 className="text-3xl font-semibold">Bring your ideas to life.</h2>
          <p className="mt-2 max-w-md text-sm text-white/90">
            Collaborate in real time, manage ideas effortlessly, and stay in sync with your team.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
