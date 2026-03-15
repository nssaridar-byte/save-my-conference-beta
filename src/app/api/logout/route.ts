import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("token", "", {
      maxAge: 0,
      path: "/",
    });
    return new Response("Logged out", { status: 200 });
  } catch (error) {
    return new Response("Error logging out", { status: 500 });
  }
}
