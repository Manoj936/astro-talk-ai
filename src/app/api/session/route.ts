import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req : NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    console.log(userId);

    if(!userId){
        return new NextResponse("Unauthorized", { status: 401 });
    }

    
}