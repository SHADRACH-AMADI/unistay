import prismadb from '@/lib/prismadb';
import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-04-10'
});

export async function POST(req: Request) {
    const user = await currentUser();

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { booking, payment_intent_id } = body;

    // Make sure roomId is provided in the booking object
    if (!booking.roomId) {
        return new NextResponse('roomId is required', { status: 400 });
    }

    const bookingData = {
        ...booking,
        userName: user.firstName,
        userEmail: user.emailAddresses[0].emailAddress,
        userId: user.id,
        currency: 'Kes',
        paymentIntentId: payment_intent_id,
        hostelId: booking.hostelId,
        hostelOwnerId: user.id,
        
        
    };

    let foundBooking;

    if (payment_intent_id) {
        foundBooking = await prismadb.booking.findUnique({
            where: { paymentIntentId: payment_intent_id, userId: user.id }
        });
    }

    if (foundBooking && payment_intent_id) {
        // Update the existing booking
        const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);
        if (current_intent) {
            const updated_intent = await stripe.paymentIntents.update(payment_intent_id, {
                amount: booking.totalPrice * 100
            });

            const res = await prismadb.booking.update({
                where: { paymentIntentId: payment_intent_id, userId: user.id },
                data: bookingData
            });

            if (!res) {
                return new NextResponse('Error updating booking', { status: 500 });
            }

            return new NextResponse(JSON.stringify({ paymentIntent: updated_intent }));
        }
    } else {
        // Create a new booking
        const paymentIntent = await stripe.paymentIntents.create({
            amount: booking.totalPrice * 100,
            currency: bookingData.currency,
            automatic_payment_methods: { enabled: true }
        });

        bookingData.paymentIntentId = paymentIntent.id;

        await prismadb.booking.create({
            data: bookingData
        });

        return NextResponse.json({ paymentIntent });
    }

    return new NextResponse('Internal Server Error', { status: 500 });
}
