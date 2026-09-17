"use client";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api,{apiError} from "@/lib/api";
import {auth} from "@/lib/auth";
const loginSchema=z.object({email:z.string().email("Enter a valid email"),password:z.string().min(1,"Password is required")});
const registerSchema=loginSchema.extend({name:z.string().min(2,"Name must be at least 2 characters").max(80),password:z.string().min(8,"Password must be at least 8 characters"),confirmPassword:z.string()}).refine(d=>d.password===d.confirmPassword,{message:"Passwords do not match",path:["confirmPassword"]});
type Values={email:string;password:string;name?:string;confirmPassword?:string};
export function AuthForm({mode}:{mode:"login"|"register"}) { 
  const router=useRouter(); 
  const schema=mode==="login"?loginSchema:registerSchema; 
  const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<Values>({
    resolver:zodResolver(schema) as Resolver<Values>,
    defaultValues:{email:"",password:"",...(mode==="register"?{name:"",confirmPassword:""}:{})}
  }); 
  const submit=async(v:Values)=>{
    try { 
      if(mode==="register"){
        await api.post("/api/auth/register",v); 
        router.push("/login?registered=1");
      } else {
        const {data}=await api.post("/api/auth/login",v); 
        auth.set(data); 
        router.push("/dashboard");
      }
    } catch(e){
      alert(apiError(e));
    }
  }; 
  const label=mode==="login"?"Welcome back":"Create your account"; 
  return (
    <main className="grid min-h-screen place-items-center px-4 py-12 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-indigo-500/20">P</span>
            <span>Peer<span className="text-indigo-400">Solve</span></span>
          </Link>
          <p className="text-xs text-slate-400 mt-1 font-mono tracking-wider uppercase">Adaptive AI Education</p>
        </div>

        <section className="card p-8 shadow-xl shadow-black/40 border border-slate-800 bg-slate-900/90 rounded-2xl backdrop-blur">
          <h1 className="text-2xl font-bold tracking-tight text-white">{label}</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            {mode==="login"?"Log in to continue your adaptive learning journey.":"Join thousands mastering algorithms through AI-guided deliberate practice."}
          </p>

          <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-4">
            {mode==="register" && (
              <Field label="Full Name" error={errors.name?.message}>
                <input 
                  {...register("name")} 
                  autoComplete="name" 
                  placeholder="Ada Lovelace"
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </Field>
            )}
            <Field label="Email Address" error={errors.email?.message}>
              <input 
                {...register("email")} 
                type="email" 
                autoComplete="email" 
                placeholder="developer@example.com"
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </Field>
            <Field label="Password" error={errors.password?.message}>
              <input 
                {...register("password")} 
                type="password" 
                autoComplete={mode==="login"?"current-password":"new-password"}
                placeholder="••••••••"
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </Field>
            {mode==="register" && (
              <Field label="Confirm Password" error={errors.confirmPassword?.message}>
                <input 
                  {...register("confirmPassword")} 
                  type="password" 
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </Field>
            )}

            <button 
              disabled={isSubmitting} 
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Authenticating..." : mode==="login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
            {mode==="login" ? (
              <>Don't have an account? <Link className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors" href="/register">Sign up</Link></>
            ) : (
              <>Already have an account? <Link className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors" href="/login">Sign in</Link></>
            )}
          </div>
        </section>
      </div>
    </main>
  ); 
}
function Field({label,error,children}:{label:string;error?:string;children:React.ReactNode}) { 
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">{label}</label>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-400">{error}</span>}
    </div>
  ); 
}
