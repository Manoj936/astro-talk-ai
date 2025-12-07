import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";


export async function POST(request: NextRequest ){
    const {email ,  password , name } = await request.json();

    if(!email || !password || !name){
        return NextResponse.json({error: "Email, password and name fields are required"}, {status: 400});
    }

    try{
     await connectDB();
    }
    catch(error){
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}