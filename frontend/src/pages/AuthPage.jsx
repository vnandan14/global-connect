import { LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../features/authSlice";

export default function AuthPage() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", headline: "" });

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (mode === "login") {
      dispatch(login({ email: form.email, password: form.password }));
    } else {
      dispatch(register(form));
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="grid w-full max-w-5xl gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex min-h-[520px] flex-col justify-end rounded-lg bg-[linear-gradient(135deg,rgba(15,107,95,.95),rgba(207,95,67,.78)),url('https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center p-8 text-white">
          <h1 className="max-w-xl text-4xl font-black sm:text-5xl">Global Connect</h1>
          <p className="mt-4 max-w-xl text-lg text-white/90">Build a professional profile, connect with people, share updates, chat in real time, and apply for jobs.</p>
        </div>

        <form className="panel p-6 shadow-sm" onSubmit={submit}>
          <div className="mb-5 flex gap-2">
            <button type="button" className={`btn flex-1 ${mode === "login" ? "btn-primary" : "btn-soft"}`} onClick={() => setMode("login")}>
              <LogIn size={18} />
              Login
            </button>
            <button type="button" className={`btn flex-1 ${mode === "register" ? "btn-primary" : "btn-soft"}`} onClick={() => setMode("register")}>
              <UserPlus size={18} />
              Register
            </button>
          </div>

          <h2 className="text-2xl font-black">{mode === "login" ? "Welcome back" : "Create account"}</h2>
          <p className="mb-5 mt-1 text-sm text-slate-500">Use any valid email format for your local demo.</p>

          {mode === "register" && (
            <>
              <label className="mb-3 block text-sm font-bold">
                Name
                <input className="field mt-1" value={form.name} onChange={(e) => update("name", e.target.value)} required />
              </label>
              <label className="mb-3 block text-sm font-bold">
                Headline
                <input className="field mt-1" value={form.headline} onChange={(e) => update("headline", e.target.value)} placeholder="Frontend Developer" />
              </label>
            </>
          )}

          <label className="mb-3 block text-sm font-bold">
            Email
            <input className="field mt-1" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
          </label>
          <label className="mb-4 block text-sm font-bold">
            Password
            <input className="field mt-1" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} minLength={6} required />
          </label>

          {error && <p className="mb-3 rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}

          <button className="btn btn-primary w-full" disabled={status === "loading"}>
            {status === "loading" ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </section>
    </main>
  );
}
