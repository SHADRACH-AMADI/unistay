import prismadb from "@/lib/prismadb";

export const getHostelById = async(hostelId: string) => {
    try {
        const hostel = await prismadb.hostel.findUnique({
            where: {
                id: hostelId,

            },
            include: {
                rooms: true,
            },
        });
        if(!hostel) return null;

        return hostel
        
    } catch (error: any) {
        throw new Error(error);
    };

};