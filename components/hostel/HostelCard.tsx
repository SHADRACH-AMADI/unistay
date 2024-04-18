'use client'

import { usePathname, useRouter } from "next/navigation";
import { HostelWithRooms } from "./AddHostelForm";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { Dumbbell, GlassWater, MapPin, Table, Table2 } from "lucide-react";
import useLocation from "@/hooks/useLocation";
import { Button } from "../ui/button";

const HostelCard = ({hostel}:{hostel: HostelWithRooms}) => {

    const pathname = usePathname()
    const isMyHostels = pathname.includes('my-hostels')
    const router = useRouter()
    const {getCountryByCode} = useLocation()
    const country =  getCountryByCode(hostel.County)


       return ( <div onClick={() => !isMyHostels && router.push(`/hostel-details/${hostel.id}`)} className={cn
        ('col-span-1 cursor-pointer transition hover:scale-105', isMyHostels && 'cursor-default')}>
        <div className="flex gap-2 bg-background/50 border border-primary/10 rounded-lg">
            <div className="flex-1 aspect-square overflow-hidden relative w-full h-[210px] rounded-s-lg">
                <Image
                fill
                src={hostel.image}
                alt={hostel.title}
                className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1 flex flex-col justify-between h-[210px] gap-1 p-1 py-2 text-sm">
                <h3 className="font-semibold text-xl">{hostel.title}</h3>
                <div className="text-primary/90">{hostel.description.substring(0, 45)}...</div>
                <div className="text-primary/90">
                    <AmenityItem >
                        <MapPin className="w-4 h-4"/> {country?.name}, {hostel.constituency}           
                    </AmenityItem>
                    {hostel.bikeRental && <AmenityItem><Table2 className="w-4 h-4"/>Study Table</AmenityItem>}
                    {hostel.restaurants && <AmenityItem><Dumbbell className="w-4 h-4"/>Restaurant</AmenityItem>}

                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                    {hostel?.rooms[0]?.roomPrice && <>
                    <div className="font-semibold text-base">Kes{hostel?.rooms[0].roomPrice}</div>
                    <div className="text=xs">/ PM</div>

                    </>}
                    </div>
                    {isMyHostels && <Button onClick={() => router.push(`/hostel${hostel.id}`)} variant='outline'>Edit</Button>}

                </div>
            </div>
        </div>
       </div> );
}
 
export default HostelCard;