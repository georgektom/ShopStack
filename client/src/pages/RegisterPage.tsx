import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../app/AuthContext";
import { Button } from "../components/Button";
import { ApiError } from "../services/api";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await register({
        name,
        email,
        password
      });
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to register.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-12 lg:px-8">
      <form className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8" onSubmit={handleSubmit}>
        <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Account</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Create account</h1>
        <div className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-stone-300">Name</span>
            <input
              className="w-full rounded-3xl border border-white/10 bg-stone-950 px-5 py-3 text-white outline-none"
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-stone-300">Email</span>
            <input
              className="w-full rounded-3xl border border-white/10 bg-stone-950 px-5 py-3 text-white outline-none"
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-stone-300">Password</span>
            <input
              className="w-full rounded-3xl border border-white/10 bg-stone-950 px-5 py-3 text-white outline-none"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </label>
        </div>
        {error ? <p className="mt-5 text-sm text-rose-300">{error}</p> : null}
        <Button className="mt-8 w-full" disabled={saving} type="submit">
          {saving ? "Creating account..." : "Create account"}
        </Button>
        <p className="mt-5 text-sm text-stone-400">
          Already have an account?{" "}
          <Link className="text-cyan-200 hover:text-cyan-100" to="/login">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
