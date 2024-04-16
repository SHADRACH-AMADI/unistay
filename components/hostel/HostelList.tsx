import { HostelWithRooms } from "./AddHostelForm";
import HostelCard from "./HostelCard";

const HostelList = ({hostels}: {hostels: HostelWithRooms[]}) => {
    return ( <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-4">
    {hostels.map((hostel) => <div key={hostel.id}>
        <HostelCard hostel = {hostel}/>

    </div>)}
    </div> );
}
 
export default HostelList;