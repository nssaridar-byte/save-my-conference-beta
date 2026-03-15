import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

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

      const user: AuthUser = { id: decoded.id };

      return handler(req, user, context);
    } catch (error) {
      console.error("Auth Error:", error);
      return new Response("Session expired or invalid", { status: 401 });
    }
  };
}

export function withAdmin(
  handler: (req: Request, user: AuthUser, context: { params: Promise<any> }) => Promise<Response>
) {
  return withAuth(async (req, user, context) => {
    try {
      const userFromDb = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!userFromDb || userFromDb.role !== "ADMIN") {
        return new Response("Forbidden: Admin access required", { status: 403 });
      }

      return handler(req, user, context);
    } catch (error) {
      console.error("Admin Auth Error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  });
}
