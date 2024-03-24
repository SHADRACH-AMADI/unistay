import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { hostelId: string } }) {
    try {
        const body = await req.json();
        const { userId } = auth();

        if (!params.hostelId) {
            return new NextResponse("Hostel Id is required", { status: 400 });
        }

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const updatedHostel = await prismadb.hostel.update({
            where: {
                id: params.hostelId,
            },
            data: {
                ...body,
            },
        });

        return NextResponse.json(updatedHostel);
    } catch (error) {
        console.log('Error at /api/hostel/hostelId PATCH', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { hostelId: string } }) {
    try {
        const { userId } = auth();

        if (!params.hostelId) {
            return new NextResponse("Hostel Id is required", { status: 400 });
        }

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Delete the hostel with the provided ID
        await prismadb.hostel.delete({
            where: {
                id: params.hostelId,
            },
        });

        return new NextResponse('Hostel deleted successfully', { status: 200 });
    } catch (error) {
        console.log('Error at /api/hostel/hostelId DELETE', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}