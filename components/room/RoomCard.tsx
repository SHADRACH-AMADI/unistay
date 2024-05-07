'use client'

import { Booking, Hostel, Room } from "@prisma/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { AirVent, Bath, Bed, BedDouble, Loader2, Pencil, Plus, Trash, Users, UtensilsCrossed, Wand2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import AddRoomForm from "./AddRoomForm";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { DatePickerWithRange } from "./DateRangerPicker";
import { DateRange } from "react-day-picker";

import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRoom";


interface RoomCardProps{
    hostel?: Hostel & {
        rooms: Room[]
    }
    room: Room;
    bookings?: Booking[]
}

const RoomCard = ({hostel, room, bookings = []}: RoomCardProps) => {
    const {setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId} = useBookRoom()
    const [isLoading, setIsLoading] = useState(false)
    const [bookingIsLoading, setBookingIsLoading] = useState(false)
    const pathname = usePathname()
    const isHostelDetailsPage =pathname.includes('hostel-details')
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<DateRange | undefined>()
    const [totalPrice, setTotalPrice] = useState(room.roomPrice)
    const [days, setDays] = useState(30)
    const {userId} = useAuth()


    const router = useRouter()
    const {toast} = useToast()

    useEffect(() => {
        if(date && date.from && date.to){
            const dayCount = differenceInCalendarDays(
                date.to,
                date.from
            )

            setDays(dayCount)

            if(dayCount && room.roomPrice){
                setTotalPrice(dayCount * room.roomPrice)
                
            }else{
                setTotalPrice(room.roomPrice)
            }


        }

    }, [date, room.roomPrice])

    const disabledDates = useMemo(() =>{
        let dates: Date[] = []

        const roomBookings = bookings.filter(booking => booking.roomId == room.id)

      //ensures dates in between have been reserved
        roomBookings.forEach(booking =>{
            const range = eachDayOfInterval({
                start: new Date(booking.startDate),
                end: new Date(booking.endDate)
            })

            dates = {...dates, ...range}    
        })

        return dates
        
    }, [bookings])


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

const handleBookRoom = () =>{
    if(!userId) return toast({
        variant: 'destructive',
        description: 'Error! Ensure you are logged in'
    })

    if(!hostel?.userId) return toast({
        variant: 'destructive',
        description: 'Refresh the page, Something went wrong!'
    })
    
     //user cannot book room if not selected the date
    if(date?.from && date?.to) {
        setBookingIsLoading(true);

        const bookingRoomData = {
            room,
            totalPrice,
            startDate: date.from,
            endDate: date.to
        }

        setRoomData(bookingRoomData)

        fetch('/api/create-payment-intent',{
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                booking:{
                    hostelOwnerId: hostel.userId,
                    roomId: room.id,
                    startDate: date.from,
                    endDate: date.to,
                    totalPrice: totalPrice
                },
                payment_intent_id: paymentIntentId
            })
        }).then((res) =>{
            setBookingIsLoading(false)
            if(res.status === 401){
                return router.push('/login')
            }

            return res.json()

        }).then((data) =>{
            setClientSecret(data.paymentIntent.client_secret)
            setPaymentIntentId(data.paymentIntent.id)
            router.push('/book-room')
        }).catch((error: any) => {
            console.log('Error:', error)
            toast({
                variant: 'destructive',
                description: `ERROR! ${error.message}`
            })
        })

    }else {
        toast({
            variant: 'destructive',
            description: 'Please Select Date'
        })
    }
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
            isHostelDetailsPage ? <div className="flex flex-col gap-6">
                <div>
                    <div className="mb-2">Select the duration of time you'll stay in this room!</div>
                    <DatePickerWithRange date = {date} setDate = {setDate} disabledDates = {disabledDates}/>
                </div>
                <div>Total Price: <span className="font-bold">Kes{room.roomPrice}</span>/PM <span className="font-bold">{days} Days</span></div>

                <Button onClick={() => handleBookRoom()} disabled={bookingIsLoading} type="button">
                    {bookingIsLoading ? <Loader2 className="mr-2 h-4 w-4"/> : <Wand2 className="mr-2 h-4 w-4"/>}
                    {bookingIsLoading ? 'Loading...' : 'Book Room'}
                </Button>

    
            </div> : <div className="flex w-full justify-between">
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