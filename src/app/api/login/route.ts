import { prisma } from "@/lib/prisma"
import { isEmpty } from "../isEmpty"
import { compare } from "bcrypt"
import { sign } from "jsonwebtoken"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        if (!email || !password || isEmpty([email, password])) return new Response("Please fill all fields", { status: 400 })

        const user = await prisma.user.findUnique({
            where: {
                email
            },
            include: {
                files: true,
                speeches: true,
                subscription: true,
                usage: true,
                conferences: true
            }
        })

        if (!user) return new Response("User not found", { status: 404 })

        const passValid = await compare(password, user.password as string)

        if (!passValid) return new Response("Incorrect Password", { status: 400 })

        const token = sign({ id: user.id }, process.env.JWT_SECRET as string)

        return Response.json({ token })
    } catch (error: any) {
        return new Response(error, { status: 500 })
    }
}