 import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (isAuth) {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem("user", username.trim());
        localStorage.setItem("isAuthenticated", "true");
        window.location.href = "/dashboard";
        return;
      }

      setError(result.message || "Login failed. Please try again.");
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 px-4 py-8">
        <div className="w-full max-w-md animate-[fadeIn_0.45s_ease-out] rounded-3xl border border-white/10 bg-gray-800/80 p-8 shadow-2xl shadow-black/30 ring-1 ring-white/5 backdrop-blur">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-400">
              Secure Access
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Login
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Sign in to access the Road Hazard Detection dashboard.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-2xl border border-gray-700 bg-gray-900/80 px-4 py-3 text-white outline-none transition duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-gray-700 bg-gray-900/80 px-4 py-3 text-white outline-none transition duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-emerald-900/30 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-900/40 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-950/30 border-t-gray-950" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            <p className="text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-emerald-400 transition hover:text-emerald-300"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Login;

// function Login() {
//   return <h1>Hello Login</h1>;
// }

// export default Login;
