import { v4 as uuidv4 } from 'uuid';
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        // Generate a unique ID for the hostel using UUID
        const hostelId = uuidv4();

        const hostel = await prismadb.hostel.create({
            data: {
                ...body,
                userId,
                hostelId, // Include hostelId in the data object
            },
        });

        return NextResponse.json(hostel);
    } catch (error) {
        console.log('Error at /api/hostel POST', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
