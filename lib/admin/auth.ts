import "server-only";
import { cookies } from "next/headers";
import { supabase } from "../supabase";

export const ADMIN_COOKIE = "seshna_atelier";

export async function verifyPassphrase(passphrase: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("seshna_admin_verify", {
    p_passphrase: passphrase,
  });
  if (error) throw new Error(error.message);
  return data === true;
}

/** Returns the passphrase if the session cookie is valid, null otherwise. */
export async function getAdminPassphrase(): Promise<string | null> {
  const store = await cookies();
  const pass = store.get(ADMIN_COOKIE)?.value;
  if (!pass) return null;
  return (await verifyPassphrase(pass)) ? pass : null;
}
