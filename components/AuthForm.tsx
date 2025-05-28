"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");
  const [openAuth, setOpenAuth] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let result;
    if (view === "sign-in") {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    if (result.error) setError(result.error.message);
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">{view === "sign-in" ? "Sign In" : "Sign Up"}</h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Loading..." : view === "sign-in" ? "Sign In" : "Sign Up"}
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
      <div className="mt-4 text-center">
        {view === "sign-in" ? (
          <span>
            Don't have an account?{" "}
            <button className="text-blue-600 underline" onClick={() => setView("sign-up")}>Sign Up</button>
          </span>
        ) : (
          <span>
            Already have an account?{" "}
            <button className="text-blue-600 underline" onClick={() => setView("sign-in")}>Sign In</button>
          </span>
        )}
      </div>
    </div>
  );
} 