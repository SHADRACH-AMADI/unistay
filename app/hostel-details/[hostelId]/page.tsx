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
    return ( <div>
        <HostelDetailsClient hostel={hostel}/>
    </div> );
}
 
export default HostelDetails;