import { authOptions } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getServerSession(authOptions);
  const id = Number(params.id);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const authUser = await session.auth();
  const authUserId = Number(authUser?.user?.id);

  try {
    const body = await req.json(); // Read request body

    const updatedClient = await db.client.update({
      where: {
        id: id,
        userId: authUserId,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json({ message: "Success", data: updatedClient });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request", error },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  const authUser = await session.auth();
  const authUserId = Number(authUser?.user?.id);

  try {
    await db.client.delete({
      where: {
        id: id,
        userId: authUserId,
      },
    });

    return NextResponse.json({ message: "Success" }, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request", error },
      { status: 400 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getServerSession(authOptions);
  const id = Number(params.id);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const authUser = await session.auth();
  const authUserId = Number(authUser?.user?.id);
  try {
    const client = await db.client.findFirst({
      where: { id, userId: authUserId },
    });

    return NextResponse.json({ message: "Success", data: client });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request", error },
      { status: 400 }
    );
  }
}
