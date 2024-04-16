import prismadb from "@/lib/prismadb";


export const getHostels = async (searchParams: {
    title: string;
    County: string;
    constituency: string;
    Town: string;
}) => {
    try {
        const { title, County, constituency, Town } = searchParams;

        const hostels = await prismadb.hostel.findMany({
            where: {
                title: {
                    contains: title,
                },
                County, // Here is the typo, you missed a comma after country
                constituency,
                Town,
            },
            include: { rooms: true },
        });

        return hostels;
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
};
