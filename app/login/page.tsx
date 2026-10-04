"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { login as apiLogin } from "@/lib/api/auth";

import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { showError, showSuccess } from "@/components/common/Toast";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const quickLogin = (type: string) => {
    if (type === "admin") {
      setFormData({ email: "admin@test.com", password: "admin123" });
      showSuccess("Demo Admin credentials filled! Click Login.");
    } else {
      setFormData({ email: "siam@test.com", password: "123456" });
      showSuccess("Demo Customer credentials filled! Click Login.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiLogin(formData);
      login(res.user, res.token);
      showSuccess("Logged in successfully!");

      if (res.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      const message = (err as Error).message || "Login failed";
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-card-bg border border-card-border rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-black text-text-main mb-6 text-center">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="flex gap-3 mt-4">
          <Button
            type="button"
            variant="secondary"
            className="flex-1 justify-center text-xs"
            onClick={() => quickLogin("customer")}
          >
            Demo Customer
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex-1 justify-center text-xs"
            onClick={() => quickLogin("admin")}
          >
            Demo Admin
          </Button>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-brand font-bold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
