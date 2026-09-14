import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title:"PeerSolve", description:"Learn by Solving Together." };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
