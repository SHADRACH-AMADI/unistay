import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: {
    roomId: any; hostelId: string 
} }) {
    try {
        const body = await req.json();
        const { userId } = auth();

        if (!params.roomId) {
            return new NextResponse("Room Id is required", { status: 400 });
        }

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const roomId = uuidv4();

        const room = await prismadb.room.update({
            where: {
                id: params.roomId,
            },
            data: {
                ...body,
                roomId,
            },
        });

        return NextResponse.json(room);
    } catch (error) {
        console.log('Error at /api/hostel/hostelId PATCH', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: {
    roomId: any; hostelId: string 
} }) {
    try {
        const { userId } = auth();

        if (!params.roomId) {
            return new NextResponse("Room Id is required", { status: 400 });
        }

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Delete the hostel with the provided ID
        await prismadb.room.delete({
            where: {
                id: params.roomId,
            },
        });

        return new NextResponse('Room deleted successfully', { status: 200 });
    } catch (error) {
        console.log('Error at /api/hostel/roomId DELETE', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

function uuidv4() {
    throw new Error("Function not implemented.");
}
