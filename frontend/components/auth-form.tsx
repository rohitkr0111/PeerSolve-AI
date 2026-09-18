"use client";

import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import api, { apiError } from "@/lib/api";
import { auth } from "@/lib/auth";

const loginSchema = z.object({ email: z.string().email("Enter a valid email"), password: z.string().min(1, "Password is required") });
const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
type Values = { email: string; password: string; name?: string; confirmPassword?: string };

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const schema = mode === "login" ? loginSchema : registerSchema;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema) as Resolver<Values>,
    defaultValues: { email: "", password: "", ...(mode === "register" ? { name: "", confirmPassword: "" } : {}) }
  });
  const submit = async (values: Values) => {
    try {
      if (mode === "register") { await api.post("/api/auth/register", values); router.push("/login?registered=1"); }
      else { const { data } = await api.post("/api/auth/login", values); auth.set(data); router.push("/dashboard"); }
    } catch (error) { alert(apiError(error)); }
  };
  const isLogin = mode === "login";
  return (
    <main className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">
      <section className="hidden flex-col justify-between bg-[#121212] p-10 text-white lg:flex">
        <Link href="/" className="text-2xl font-black tracking-[-.07em]">peer<span className="text-[#ff765f]">solve</span><span className="ml-1 inline-block h-2 w-2 rounded-full bg-[#c9f36a]" /></Link>
        <div><p className="eyebrow text-white/40">Your next chapter</p><h2 className="mt-5 max-w-md text-6xl font-black leading-[.95] tracking-[-.07em]">Make progress feel <span className="text-[#c9f36a]">obvious.</span></h2><div className="mt-9 space-y-4 text-sm text-white/55"><p><Check className="mr-2 inline h-4 w-4 text-[#c9f36a]" /> Missions designed for momentum</p><p><Check className="mr-2 inline h-4 w-4 text-[#c9f36a]" /> A mentor that lets you think</p><p><Check className="mr-2 inline h-4 w-4 text-[#c9f36a]" /> Progress you can actually see</p></div></div>
        <p className="text-xs text-white/35">© 2025 PeerSolve. Keep learning.</p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-14 inline-flex items-center gap-2 text-sm font-bold text-[#706f6a] hover:text-[#121212]"><ArrowLeft className="h-4 w-4" /> Back to home</Link>
          <p className="eyebrow">{isLogin ? "Welcome back" : "Start your journey"}</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-.06em] sm:text-5xl">{isLogin ? "Good to see you." : "Let&apos;s get moving."}</h1>
          <p className="mt-4 text-[#706f6a]">{isLogin ? "Pick up where you left off." : "Create an account and take your first small win."}</p>
          <form onSubmit={handleSubmit(submit)} className="mt-9 space-y-5">
            {!isLogin && <Field label="Name" error={errors.name?.message}><input {...register("name")} autoComplete="name" placeholder="What should we call you?" /></Field>}
            <Field label="Email" error={errors.email?.message}><input {...register("email")} type="email" autoComplete="email" placeholder="you@example.com" /></Field>
            <Field label="Password" error={errors.password?.message}><input {...register("password")} type="password" autoComplete={isLogin ? "current-password" : "new-password"} placeholder="At least 8 characters" /></Field>
            {!isLogin && <Field label="Confirm password" error={errors.confirmPassword?.message}><input {...register("confirmPassword")} type="password" autoComplete="new-password" /></Field>}
            <button disabled={isSubmitting} className="mt-2 w-full rounded-full bg-[#121212] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#333] disabled:opacity-60">{isSubmitting ? "One moment…" : isLogin ? <>Log in <ArrowUpRight className="ml-1 inline h-4 w-4" /></> : <>Create account <ArrowUpRight className="ml-1 inline h-4 w-4" /></>}</button>
          </form>
          <p className="mt-8 text-center text-sm text-[#706f6a]">{isLogin ? <>New here? <Link className="font-bold text-[#121212] underline decoration-[#ff765f] decoration-2 underline-offset-4" href="/register">Create an account</Link></> : <>Already have an account? <Link className="font-bold text-[#121212] underline decoration-[#ff765f] decoration-2 underline-offset-4" href="/login">Log in</Link></>}</p>
        </div>
      </section>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-bold">{label}<span className="mt-2 block font-normal">{children}</span>{error && <span className="mt-1.5 block text-xs font-normal text-[#d94d3b]">{error}</span>}</label>;
}
