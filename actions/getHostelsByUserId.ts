import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export const getHostelsByUserId = async() => {
    try {

        const {userId} = auth()

        if(!userId){
            throw new Error("Unauthorized")
        }
        const hostel = await prismadb.hostel.findMany({
            where: {
                userId

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