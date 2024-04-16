import { getHostels } from "@/actions/getHostels";
import HostelList from "@/components/hostel/HostelList";

interface HomeProps{
  searchParams: {
    title: string
    County: string;
    constituency: string;
    Town: string;
  }
}

export default async function Home({searchParams}: HomeProps) {
  const hostels = await getHostels(searchParams)

  if(!hostels) return <div>No Hostels found..</div>
  return (
    <div>
      <HostelList hostels = {hostels}/> 
    </div>
  );
}
