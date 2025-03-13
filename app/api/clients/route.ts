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

  const clients = await db.client.findMany({
    where: {
      userId: Number(authUserId),
    },
  });

  return NextResponse.json({
    message: "You are authenticated",
    clients,
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
    const { name, email, address, phone } = await req.json(); // Read request body

    const newClient = await db.client.create({
      data: {
        name,
        email,
        phone,
        address,
        userId: authUserId,
      },
    });

    return NextResponse.json({ message: "Success", data: newClient });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request", error },
      { status: 400 }
    );
  }
}
