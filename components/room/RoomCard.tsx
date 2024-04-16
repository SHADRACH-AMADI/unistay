'use client'

import { Booking, Hostel, Room } from "@prisma/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { AirVent, Bath, Bed, BedDouble, Loader2, Pencil, Plus, Trash, Users, UtensilsCrossed } from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import AddRoomForm from "./AddRoomForm";
import axios from "axios";
import { useToast } from "../ui/use-toast";

interface RoomCardProps{
    hostel?: Hostel & {
        rooms: Room[]
    }
    room: Room;
    bookings?: Booking[]
}

const RoomCard = ({hostel, room, bookings = []}: RoomCardProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname()
    const isHostelDetailsPage =pathname.includes('hostel-details')
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const {toast} = useToast()


    const handleDialogueOpen = () =>{
        setOpen(prev => !prev)
      }

      const handleRoomDelete = (room:Room) =>{
        setIsLoading(true)
        const imageKey = room.image.substring(room.image.lastIndexOf('/') +1 )
        axios.post('/api.uploadthing/delete', {imageKey}).then(() =>{
            axios.delete(`/api/room/${room.id}`).then(()=>{
                router.refresh()
                toast({
                    variant: 'success',
                    description: 'Room Deleted'
                })
                setIsLoading(false)
            }).catch(() =>{
                    setIsLoading(false)
                    toast({
                        variant: 'destructive',
                        description: 'Something Went Wrong'
                    
                })
                
            })
        }).catch(()=>{
            setIsLoading(false)
                    toast({
                        variant: 'destructive',
                        description: 'Something Went Wrong'

        })
    })
}

    return (  <Card>
        <CardHeader>
            <CardTitle>{room.title}</CardTitle>
            <CardDescription>{room.description}</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
            <div className='aspect-square overflow-hidden relative h-[200px] rounded-lg'>
                <Image fill src={room.image} alt={room.title} className="object-cover"/>
            </div>
            <div className="grid grid-cols-2 gap-4 content-start text-sm">
                <AmenityItem><Bed className="h-4 w-4"/>{room.bedCount} Bed{'(s)'}</AmenityItem>
                <AmenityItem><Users className="h-4 w-4"/>{room.guestCount} Guest{'(s)'}</AmenityItem>
                <AmenityItem><Bath className="h-4 w-4"/>{room.bathroomCount} Bathroom{'(s)'}</AmenityItem>
                {room.roomService && <AmenityItem><UtensilsCrossed  className="h-4 w-4"/>Room Services</AmenityItem>}
                {room.airConditiom && <AmenityItem><AirVent  className="h-4 w-4"/>Air Condition</AmenityItem>}
                
                
     

            </div>
            <Separator/>
            <div className="flex gap-4 justify-between">
                <div>Room Price: <span className="font-bold">KES{room.roomPrice}</span><span className="text-xs"> /PM</span></div>

            </div>
            <Separator/>

        </CardContent>

        <CardFooter>

        {
            isHostelDetailsPage ? <div>Hostel Details Page</div> : <div className="flex w-full justify-between">
                <Button disabled={isLoading} type="button" variant='ghost' onClick={() => 
                    handleRoomDelete(room)
                }>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4"/>Deleting...</> : <><Trash  className="mr-2 h-4 w-4"/> Delete</>}
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger>
    <Button type='button' variant='outline' className='max-w-[150px]'>
      <Pencil className='mr-2 h-4 w-4'/>  Edit Room
    </Button>
    </DialogTrigger>
  <DialogContent className='max-w-[900px] w-[90%]'>
    <DialogHeader className='px-2'>
      <DialogTitle>Edit Room!</DialogTitle>
      <DialogDescription>
        Apply changes to this room.
      </DialogDescription>
    </DialogHeader>
    <AddRoomForm hostel={hostel} room={room} handleDialogueOpen={handleDialogueOpen}/>
  </DialogContent>
</Dialog>

            </div>

        }
        </CardFooter>


        </Card>);
}
 
export default RoomCard;