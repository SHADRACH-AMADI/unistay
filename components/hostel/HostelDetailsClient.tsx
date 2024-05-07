'use client'

import { Booking } from "@prisma/client";
import { HostelWithRooms } from "./AddHostelForm";
import useLocation from "@/hooks/useLocation";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { CupSoda, MapPin, Table2Icon, WashingMachineIcon, WavesIcon, Wind } from "lucide-react";
import RoomCard from "../room/RoomCard";

const HostelDetailsClient = ({hostel, bookings}: {hostel: HostelWithRooms, bookings?: Booking[] }) => {
    const {getCountryByCode, getStateByCode} = useLocation()
    const country = getCountryByCode(hostel.County)
    const state = getStateByCode(hostel.County, hostel.constituency)

    return ( <div className="flex flex-col gap-6 pb-2">
        <div className="apeaspect-square overflow-hidden relative w-full h-[200px] md:h-[400px] rounded-lg">
            <Image
            fill
            src={hostel.image}
            alt={hostel.title}
            className="object-cover"
            
            />

        </div>
        <div>
            <h3 className="font-semibold text-xl md:text-3xl">{hostel.title}</h3>
            <div className="font-semibold mt-4">
                <AmenityItem><MapPin className="h-4 w-4"/> {country?.name},{state?.name},{hostel.constituency}</AmenityItem>
            </div>
            <h3 className="font-semibold text-lg mt-4 mb-2">Location Details</h3>
            <p className="text-primary/90 mb-2">{hostel.locationDescription}</p>
            <h3 className="font-semibold text-lg mt-4 mb-2">About this hostel</h3>
            <p className="text-primary/90 mb-2">{hostel.description}</p>
            <h3 className="font-semibold text-lg mt-4 mb-2">Popular Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 content-start text-sm">
                {hostel.restaurants && <AmenityItem><CupSoda className="w-4 h-4"/>Restaurant</AmenityItem>}
                {hostel.restaurants && <AmenityItem><WavesIcon className="w-4 h-4"/>Swimming Pool</AmenityItem>}
                {hostel.restaurants && <AmenityItem><Wind className="w-4 h-4"/>Balcony</AmenityItem>}
                {hostel.bikeRental && <AmenityItem><WashingMachineIcon className="w-4 h-4"/>Laundry</AmenityItem>}
                {hostel.bikeRental && <AmenityItem><Table2Icon className="w-4 h-4"/>Study Table</AmenityItem>}

            </div>
        </div>
        <div>{!!hostel.rooms.length && <div>
            <h3 className="text-lg font-semibold my-4">Hostel Rooms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {hostel.rooms.map((room)=>{
                    return <RoomCard hostel={hostel} room={room} key={room.id} bookings={bookings}/>
                })}
            </div>
            </div>}</div>

    </div> );
}
 
export default HostelDetailsClient;