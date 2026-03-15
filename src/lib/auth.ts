import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export interface AuthUser {
  id: string;
}

export function withAuth(
  handler: (req: Request, user: AuthUser, context: { params: Promise<any> }) => Promise<Response>
) {
  return async (req: Request, context: { params: Promise<any> }) => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;

      if (!token) {
        return new Response("Unauthorized", { status: 401 });
      }

      const decoded = verify(token, process.env.JWT_SECRET!) as any;

      if (!decoded || !decoded.id) {
        return new Response("Invalid session", { status: 401 });
      }

      // Optional: If you want to block all API access for unverified users
      // const userFromDb = await prisma.user.findUnique({ where: { id: decoded.id } });
      // if (!userFromDb?.emailVerified) {
      //   return new Response("Email not verified", { status: 403 });
      // }

      const user: AuthUser = { id: decoded.id };

      return handler(req, user, context);
    } catch (error) {
      console.error("Auth Error:", error);
      return new Response("Session expired or invalid", { status: 401 });
    }
  };
}
