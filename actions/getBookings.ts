import prismadb from "@/lib/prismadb";

export const getBookings = async(hostelId: string) =>{
    try {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        const bookings = await prismadb.booking.findMany({
            where:{
                hostelId,
                
                endDate:{
                    gt:yesterday
                },
            },
        });
        
        return bookings;
    } catch (error:any) {
        console.log(error)
        throw new Error(error)
        
    }

}