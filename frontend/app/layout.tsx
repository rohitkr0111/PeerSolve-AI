import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "PeerSolve — Learn by solving",
  description: "A focused, game-based way to build real algorithmic intuition."
};
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
