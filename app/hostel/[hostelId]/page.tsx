import { getHostelById } from "@/actions/getHostelById";
import AddHostelForm from "@/components/hostel/AddHostelForm";
import { auth } from "@clerk/nextjs";

interface HostelPageProps {
    params: {
        hostelId: string
    }
}
const  Hostel = async({params}: HostelPageProps) => {
    const hostel = await getHostelById(params.hostelId)
    const {userId} = auth()

    if(!userId) return <div>Not Authenticated...</div>

    if(hostel && hostel.userId != userId) return <div>Access Denied</div>

    return ( <div>
        <AddHostelForm hostel = {hostel}/>
    </div> );
}
 
export default Hostel;

