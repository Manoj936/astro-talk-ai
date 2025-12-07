import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json();

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "Email, password and name fields are required" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" , ok:false },
        { status: 400 }
      );
    }
    const hashed = await hashPassword(password , 10);
    const newUser = await User.create({
      email,
      password : hashed,
      name,
      isVerified: false,
      role: "user",
      softDelete: false,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "User created successfully" , ok:true  },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" , ok:false },
      { status: 500 }
    );
  }
}
