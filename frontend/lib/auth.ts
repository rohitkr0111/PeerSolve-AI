import type { LoginResponse, User } from "@/types/auth";
const TOKEN="peersolve_token", USER="peersolve_user";
export const auth = { set(data:LoginResponse) { localStorage.setItem(TOKEN,data.token); localStorage.setItem(USER,JSON.stringify(data.user)); }, user():User|null { try { const raw=localStorage.getItem(USER); return raw?JSON.parse(raw):null; } catch { return null; } }, clear() { localStorage.removeItem(TOKEN); localStorage.removeItem(USER); } };
