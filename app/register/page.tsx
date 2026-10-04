"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { register as apiRegister } from "@/lib/api/auth";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { showError, showSuccess } from "@/components/common/Toast";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await apiRegister(formData);
      showSuccess("Account created! Please login.");
      router.push("/login");
    } catch (err) {
      const message = (err as Error).message || "Registration failed";
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
          Create Account
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Siam Khan"
            required
          />
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
            placeholder="Minimum 6 characters"
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
