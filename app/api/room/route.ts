import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        // Generate a unique ID for the hostel using UUID
        const roomId = uuidv4();

        const room = await prismadb.room.create({
            data: {
                ...body,
                roomId,
                
                 // Include hostelId in the data object
            },
        });

        return NextResponse.json(room);
    } catch (error) {
        console.log('Error at /api/room POST', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
