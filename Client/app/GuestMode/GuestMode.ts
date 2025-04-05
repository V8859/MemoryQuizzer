import { cookies } from "next/headers";

export async function getGuestMode() {
  const cookieStore = await cookies();
  return cookieStore.get("GuestMode")?.value === "true";
}

export async function setGuestMode(value: boolean) {
  const cookieStore = await cookies();
  cookieStore.set("GuestMode", value.toString(), { path: "/" });
}
