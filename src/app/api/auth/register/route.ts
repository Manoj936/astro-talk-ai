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
    const hasedPass = await hashPassword(password , 10)
    console.log(hasedPass ,"hasedPass")
    // Password will be hashed automatically by the pre-save hook
    const newUser = await User.create({
      email,
      password : hasedPass,
      name,
      isVerified: false,
      role: "user",
      softDelete: false,
    });

    return NextResponse.json(
      { message: "User created successfully" , ok:true  },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error", ok: false },
      { status: 500 }
    );
  }
}
