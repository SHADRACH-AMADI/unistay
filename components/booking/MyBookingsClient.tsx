'use client'

import { Booking, Hostel, Room } from "@prisma/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { AirVent, Bath, Bed, BedDouble, Loader2, MapPin, Pencil, Plus, Trash, Users, UtensilsCrossed, Wand2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";


import axios from "axios";
import { useToast } from "../ui/use-toast";

import { DateRange } from "react-day-picker";

import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRoom";
import useLocation from "@/hooks/useLocation";

import moment from "moment";


interface MyBookingClientProps{
  booking: Booking & {Room: Room | null} & {Hostel: Hostel | null}
}

const MyBookingClient:React.FC<MyBookingClientProps>  = ({booking}) => {
    const {setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId} = useBookRoom()
    const [isLoading, setIsLoading] = useState(false)
    const [bookingIsLoading, setBookingIsLoading] = useState(false)
    const {getCountryByCode, getStateByCode} = useLocation()
    const {userId} = useAuth()
    const router = useRouter()
    const {Hostel, Room} = booking

    if(!Hostel || !Room ) return <div>Missing Data...</div>

    const country = getCountryByCode(Hostel.County)
    const state = getStateByCode(Hostel.County, Hostel.constituency)


    const startDate = moment(booking.startDate).format('MMMM Do YYYY')
    const endDate = moment(booking.endDate).format('MMMM Do YYYY')
    const dayCount = differenceInCalendarDays(
        booking.endDate,
        booking.startDate
    )

    const {toast} = useToast()
   
   

const handleBookRoom = () =>{
    if(!userId) return toast({
        variant: 'destructive',
        description: 'Error! Ensure you are logged in'
    })

    if(!Hostel?.userId) return toast({
        variant: 'destructive',
        description: 'Refresh the page, Something went wrong!'
    })
    
    //  user cannot book room if not selected the date
  
        setBookingIsLoading(true);

        const bookingRoomData = {
            room: Room,
            totalPrice: booking.totalPrice,
            startDate: booking.startDate,
            endDate: booking.endDate
        }

        setRoomData(bookingRoomData)

        fetch('/api/create-payment-intent',{
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                booking:{
                    hostelOwnerId: Hostel.userId,
                    roomId:Room.hostelId,
                    startDate: bookingRoomData.startDate,
                    endDate: bookingRoomData.endDate,
                    totalPrice: bookingRoomData.totalPrice
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

    
    }


    return (  <Card>
        <CardHeader>
            <CardTitle>{Hostel.title}</CardTitle>
            <CardDescription><div className="font-semibold mt-4">
                <AmenityItem><MapPin className="h-4 w-4"/> {country?.name},{state?.name},{Hostel.constituency}</AmenityItem>
                <p className="py-2">{Hostel.locationDescription}</p>
            </div></CardDescription>

            <CardTitle>{Room.title}</CardTitle>
            <CardDescription>{Room.description}</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
            <div className='aspect-square overflow-hidden relative h-[200px] rounded-lg'>
                <Image fill src={Room.image} alt={Room.title} className="object-cover"/>
            </div>
            <div className="grid grid-cols-2 gap-4 content-start text-sm">
                <AmenityItem><Bed className="h-4 w-4"/>{Room.bedCount} Bed{'(s)'}</AmenityItem>
                <AmenityItem><Users className="h-4 w-4"/>{Room.guestCount} Guest{'(s)'}</AmenityItem>
                <AmenityItem><Bath className="h-4 w-4"/>{Room.bathroomCount} Bathroom{'(s)'}</AmenityItem>
                {Room.roomService && <AmenityItem><UtensilsCrossed  className="h-4 w-4"/>Room Services</AmenityItem>}
                {Room.airConditiom && <AmenityItem><AirVent  className="h-4 w-4"/>Air Condition</AmenityItem>}
                
                
     

            </div>
            <Separator/>
            <div className="flex gap-4 justify-between">
                <div>Room Price: <span className="font-bold">KES{Room.roomPrice}</span><span className="text-xs"> /PM</span></div>

            </div>
            <Separator/>
            <div className="flex flex-col gap-2">
                <CardTitle>Booking Details</CardTitle>
                <div className="text-primary/90">
                    <div>Room booked {booking.userName} for {dayCount} days - {moment(booking.bookedAt).fromNow()} </div>
                    <div>Check-in: {startDate} at 10AM </div>
                    <div>Rent expires on: {endDate} at 10AM </div>
                    {booking.paymentStatus ? <div className="text-teal-500">Paid Kes{booking.totalPrice} - Room Reserved</div> :
                    <div className="text-red-500">Not Paid Kes{booking.totalPrice} - Room Not Reserved</div> }
                </div>
            </div>

        </CardContent>
        <CardFooter>
            <Button disabled={bookingIsLoading} variant='outline' onClick={() => router.push(`/hostel-details/${Hostel.id}`)}>View Hostel</Button>
        </CardFooter>
       


        </Card>);
}
 
export default MyBookingClient;