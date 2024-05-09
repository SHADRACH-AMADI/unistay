import { getHostelsByUserId } from "@/actions/getHostelsByUserId";
import HostelList from "@/components/hostel/HostelList";

const MyHostels = async() => {
    const hostels = await getHostelsByUserId()

    if(!hostels) return <div>No hostels found!</div>
    return ( <div>
        <h2 className="text-2xl font-semibold">Here are your properties!!</h2>
        <HostelList hostels={hostels}/>
        
         </div> );
}
 
export default MyHostels;