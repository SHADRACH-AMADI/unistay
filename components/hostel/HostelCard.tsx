'use client'

import { usePathname, useRouter } from "next/navigation";
import { HostelWithRooms } from "./AddHostelForm";
import { cn } from "@/lib/utils";
import Image from "next/image";

const HostelCard = ({hostel}:{hostel: HostelWithRooms}) => {

    const pathname = usePathname()
    const isMyHostels = pathname.includes('my-hostels')
    const router = useRouter()
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
            <div></div>
        </div>
       </div> );
}
 
export default HostelCard;