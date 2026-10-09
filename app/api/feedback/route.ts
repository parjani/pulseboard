
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const allowedCategories = [
  "Feature Request",
  "Bug",
  "Improvement",
  "Other",
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "pulseboard");

    const feedback = await db
      .collection("feedback")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error("Failed to fetch feedback:", error);

    return NextResponse.json(
      { success: false, message: "Unable to load feedback." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim() : "";
    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";
    const category =
      typeof body.category === "string" ? body.category : "";

    if (title.length < 3 || title.length > 100) {
      return NextResponse.json(
        { success: false, message: "Title must be 3–100 characters." },
        { status: 400 }
      );
    }

    if (description.length < 10 || description.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          message: "Description must be 10–1000 characters.",
        },
        { status: 400 }
      );
    }

    if (!allowedCategories.includes(category)) {
      return NextResponse.json(
        { success: false, message: "Please select a valid category." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "pulseboard");

    const newFeedback = {
      title,
      description,
      category,
      status: "New",
      createdAt: new Date(),
    };

    const result = await db.collection("feedback").insertOne(newFeedback);

    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted successfully!",
        feedback: {
          ...newFeedback,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create feedback:", error);

    return NextResponse.json(
      { success: false, message: "Unable to submit feedback." },
      { status: 500 }
    );
  }
}
