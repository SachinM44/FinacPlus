import React, { useState } from "react";

const roles = ["admin", "user"];

export default function LoginPage({ onLogin }) {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      console.warn('[LoginPage] Validation failed: missing email or password');
      return;
    }
    setError("");
    console.log('[LoginPage] Attempting login:', { email, role });
    onLogin({ email, password, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 font-poppins">
      <div className="bg-white rounded-4xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 border border-green-100">
        <h1 className="text-3xl font-bold text-gray-800">Yapple Music</h1>
        <div className="text-gray-500 text-md mb-6">Hey, welcome back</div>
        
        <div className="flex bg-green-50 rounded-full overflow-hidden mb-4 border border-green-400">
          {roles.map((r) => (
            <button
              key={r}
              className={`flex-1 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none ${
                role === r
                  ? "bg-green-600 text-white shadow"
                  : "bg-transparent text-gray-600 hover:bg-green-100"
              }`}
              onClick={() => setRole(r)}
              type="button"
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col align-left gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="border border-green-400 rounded-2xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password"
                className="border border-green-200 rounded-2xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                
              </span>
            </div>
          </div>
          
          {error && <div className="text-red-500 text-xs">{error}</div>}
          
          <button
            type="submit"
            className="mt-4 bg-green-600 text-white rounded-full py-3 font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>Login</span>
            <span>→</span>
          </button>
        </form>
      </div>
    </div>
  );
}
