'use client'
import useBookRoom from '@/hooks/useBookRoom'
import {Elements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import RoomCard from '../room/RoomCard'


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

const BookRoomClient = () => {

    const {bookingRoomData, clientSecret} = useBookRoom()

    return ( <div className='max-w-[700px] mx-auto'>
        {clientSecret && bookingRoomData && <div>
            <h3 className='text-2xl font-semibold mb-6'>Complete payment to reserve the Room!</h3>
            <div className='mb-6'>
                <RoomCard room={bookingRoomData.room}/>
            </div>
            <Elements stripe={stripePromise}>

            </Elements>
            </div>}
    </div> );
}
 
export default BookRoomClient;