
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const allowedStatuses = ["New", "Planned", "Done"];

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid feedback ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const status = body.status;

    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Status must be New, Planned, or Done.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "pulseboard");

    const result = await db.collection("feedback").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Feedback not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feedback status updated successfully!",
      status,
    });
  } catch (error) {
    console.error("Failed to update feedback:", error);

    return NextResponse.json(
      { success: false, message: "Unable to update feedback status." },
      { status: 500 }
    );
  }
}
