'use client'

import { Booking, Hostel, Room } from "@prisma/client";

interface RoomCardProps{
    hostel?: Hostel & {
        rooms: Room[]
    }
    room: Room;
    bookings?: Booking[]
}

const RoomCard = ({hostel, room, bookings = []}: RoomCardProps) => {
    return (  <div>{room.title}</div>);
}
 
export default RoomCard;