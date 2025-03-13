import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { authOptions } from "@/auth"; // Adjust path if needed
import { PrismaClient } from "@prisma/client";
// import { db } from "@/lib/db";

const prisma = new PrismaClient();

export async function GET() {
  const session = getServerSession(authOptions);
  const authUser = await session.auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authUserId = authUser?.user?.id;
  try {
    const projects = await prisma.project.findMany({
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
  } catch (err) {
    console.log("Error in backend while fetching projects", err);
  }
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
    console.log(title, description, dueDate, clientId);
    const timestamp = new Date(dueDate);
    if (isNaN(timestamp.getTime())) {
      return NextResponse.json({ error: "Invalid due date" }, { status: 400 });
    }

    const newProject = await prisma.project.create({
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
