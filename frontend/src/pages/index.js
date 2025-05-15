
import { useRouter } from "next/router";
import { useState } from "react";
import { API } from "@/utils/auth";


export default function Home({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userId", data.id);
      setToken(data.token);
      router.push("/tasks");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className={" flex justify-center items-center min-h-screen bg-black/20"}>
      <form
        onSubmit={handleLogin}
        className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Login
        </h1>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex flex-col gap-5">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => router.push("/sign-up")}
            className="w-full bg-orange-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

