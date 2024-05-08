'use client'

import useBookRoom from "@/hooks/useBookRoom";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Separator } from "../ui/separator";
import moment from 'moment';
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";

interface RoomPaymentFormProps {
    clientSecret: string;
    handleSetPaymentSuccess: (value: boolean) => void
}

const RoomPaymentForm = ({clientSecret, handleSetPaymentSuccess}: RoomPaymentFormProps) => {
    const{bookingRoomData, resetBookRoom} = useBookRoom()
    const stripe = useStripe()
    const elements = useElements()
    const [isloading, setIsLoading] = useState(false)
    const {toast} = useToast()
    const router = useRouter()

    useEffect(() =>{
        if(!stripe){
            return;
        }
        if(!clientSecret){
            return;
        }
        handleSetPaymentSuccess(false)
        setIsLoading(false)

    }, [stripe])

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)

        if(!stripe || !elements || !bookingRoomData){
            return;
        }

        try {
            //date overlaps

            stripe.confirmPayment({elements, redirect: 'if_required'}).then((result)=>{
                if(!result.error){
                    axios.patch(`/api/booking/${result.paymentIntent.id}`).then((res) =>{
                        toast({
                            variant: 'success',
                            description: 'Room Reserved Successfully!'
                        })
                        router.refresh()
                        resetBookRoom()
                        handleSetPaymentSuccess(true)
                        setIsLoading(false)       
                    }).catch(error => {
                        console.log(error)
                        toast({
                            variant: 'destructive',
                            description: 'Something went wrong, try again!!'
                        })
                        setIsLoading(false)
                    })
                }else{
                    setIsLoading(false)
                }

            })
            
        } catch (error) {
            console.log(error)
            setIsLoading(false)
            
        }
    }

    if(!bookingRoomData?.startDate || !bookingRoomData?.endDate) return <div>
        Missing Reservation Dates!!!</div>

    const startDate = moment(bookingRoomData?.startDate).format('MMMM Do YYYY')
    const endDate = moment(bookingRoomData?.endDate).format('MMMM Do YYYY')

    return ( <form onSubmit={handleSubmit} id="payment-form">
        <h2 className="font-semibold mb-2 text-lg">Billing Address/Mpesa</h2>
        <AddressElement options={{
            mode: 'billing',
            
        }
        }/>
         <h2 className="font-semibold mt-4 mb-2 text-lg">Payment Information</h2>
         <PaymentElement id="payment-element" options={{layout: 'tabs'}}/>
         <div className="flex flex-col gap-1">
            <Separator/>
            <div className="flex flex-col gap-1">
                <h2 className="font-semibold mb-1 text-lg">Booking Summary</h2>
                <div>Check-in Date will be on {startDate} at 10AM</div>
                <div>Your Rent expires on {endDate} </div>
                <Separator/>
                <div className="font-bold text-lg">
                    Total Price: Kes{bookingRoomData?.totalPrice}

                </div>

            </div>
         </div>
         
         {isloading && <Alert className='bg-indigo-600 text-white'>
                  <Alert/>
  <Terminal className="h-4 w-4 stroke-white" />
  <AlertTitle>Payment Processing....</AlertTitle>
  <AlertDescription>
  Please wait as we process your payments!
  </AlertDescription>
</Alert>}
         <Button disabled={isloading}>{isloading ? 'Processing Payment...': 'Pay Now'}</Button>
         
    </form> );
}
 
export default RoomPaymentForm;