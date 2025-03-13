import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { authOptions } from "@/auth"; // Adjust path if needed
import { db } from "@/lib/db";

export async function GET() {
  const session = getServerSession(authOptions);
  const authUser = await session.auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authUserId = authUser?.user?.id;

  const projects = await db.project.findMany({
    where: {
      userId: Number(authUserId),
    },
    include: {
      client: true,
    },
  });

  return NextResponse.json({
    message: "You are authenticated",
    projects,
  });
}

export async function POST(req: NextRequest) {
  const session = getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const authUser = await session.auth();
  const authUserId = Number(authUser?.user?.id);

  try {
    const { title, description, dueDate, clientId } = await req.json();
    const timestamp = new Date(dueDate).toISOString();

    const newProject = await db.project.create({
      data: {
        title,
        description,
        dueDate: timestamp,
        clientId: Number(clientId),
        userId: authUserId,
      },
    });

    return NextResponse.json({ message: "Success", data: newProject });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request", error },
      { status: 400 }
    );
  }
}
