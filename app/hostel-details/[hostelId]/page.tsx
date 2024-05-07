import { getBookings } from "@/actions/getBookings";
import { getHostelById } from "@/actions/getHostelById";
import HostelDetailsClient from "@/components/hostel/HostelDetailsClient";
import { Hostel } from "@prisma/client";

interface HostelDetailsProps{
    params:{
        hostelId:string
    }
}

const HostelDetails = async({params}:HostelDetailsProps) => {
    const hostel = await getHostelById(params.hostelId)
    
    if(!hostel) return <div>Try Again! Hostel with the given Id not found</div>

    const bookings = await getBookings(hostel.id)
    return ( <div>
        <HostelDetailsClient hostel={hostel} bookings={bookings}/>
    </div> );
}
 
export default HostelDetails;