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

  const invoices = await db.invoice.findMany({
    where: {
      userId: Number(authUserId),
    },
    include: {
      project: {
        include: {
          client: true,
        },
      },
    },
  });

  return NextResponse.json({
    message: "You are authenticated",
    invoices,
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
    const { amount, currency, dueDate, clientId, projectId } = await req.json();
    const timestamp = new Date(dueDate).toISOString();

    const newInvoice = await db.invoice.create({
      data: {
        amount,
        currency,
        dueDate: timestamp,
        paymentLink: "",
        clientId: Number(clientId),
        projectId: Number(projectId),
        userId: authUserId,
      },
    });

    return NextResponse.json({ message: "Success", data: newInvoice });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request", error },
      { status: 400 }
    );
  }
}
