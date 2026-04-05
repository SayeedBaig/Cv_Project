import { useState } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/register", {
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
        window.location.href = "/login";
        return;
      }

      setError(result.message || "Registration failed. Please try again.");
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 px-4 py-8">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-gray-800/80 p-8 shadow-2xl shadow-black/30 ring-1 ring-white/5 backdrop-blur">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-400">
              Create Account
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Register
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Create your account to access the Road Hazard Detection dashboard.
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
                className="w-full rounded-2xl border border-gray-700 bg-gray-900/80 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Choose a username"
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
                className="w-full rounded-2xl border border-gray-700 bg-gray-900/80 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Create a password"
                autoComplete="new-password"
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
              className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
