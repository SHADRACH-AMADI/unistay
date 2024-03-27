'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Hostel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";
import { UploadButton } from "../uploadthing";
import { useToast } from "../ui/use-toast";
import Image from "next/image";
import { Eye, Loader2, PencilLine, Plus, Terminal, Trash, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import axios, { AxiosResponse } from 'axios'
import useLocation from "@/hooks/useLocation";
import { ICity, IState } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AddRoomForm from "../room/AddRoomForm";


import RoomCard from "../room/RoomCard";
import { Separator } from "../ui/separator";






interface AddHostelFormProps {
  hostel: HostelWithRooms | null;
 
}

export type HostelWithRooms = Hostel & {
  id: string;
  title: string;
  description: string;
  image: string;
  County: string;
  constituency: string;
  Town: string;
  locationDescription: string;
  hostelId: string
  bikeRental: boolean;
  shopping: boolean;
  restaurants: boolean;
  rooms: Room[];
  
}




const formSchema = z.object({
    title: z.string().min(3,{
        message: 'Title must be atleast 3 characters long'
    }),
    description: z.string().min(1,{
        message: 'Description must be atleast 10 characters long' 
    }),    
    image: z.string().min(1,{
        message: 'Image is required' 
    }),     
    County: z.string().min(1,{
        message: 'County is required' 
    }),    
    constituency: z.string().min(1,{
      message: 'constituency is required' 
  }), 
    Town: z.string().min(1,{
        message: 'Town is required' 
    }),     
    locationDescription: z.string().min(1,{
        message: 'Description must be atleast 10 characters long' 
    }),      
    bikeRental: z.boolean().optional(),
    shopping: z.boolean().optional(),
    restaurants: z.boolean().optional(),
   
})

const AddHostelForm = ({hostel}: AddHostelFormProps) => {

    const [image, setImage] = useState<string | undefined>(hostel?.image)
    const [imageIsDeleting, setImageIsDeleting] = useState(false)
    const [states, setStates] = useState<IState[]>([])
    const [cities, setCities] = useState<ICity[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isHostelDeleting, setIsHostelDeleting] = useState(false)
    const [open, setOpen] = useState(false)

    const {toast} = useToast()
    const router = useRouter()
    const {getAllCountries, getCountryStates, getStateCities} = useLocation()
    const countries = getAllCountries()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: hostel || {
            title: '',
            description: '',  
            image: '', 
            County: '', 
            Town: '', 
            constituency: '',
            locationDescription: '',
            bikeRental: false, 
            shopping: false, 
            restaurants: false, 
            
            
        },
      })

      useEffect(() =>{
        if(typeof image == 'string'){
          form.setValue('image', image, {
           shouldValidate: true,
           shouldDirty: true,
           shouldTouch: true
          })
        }
      }, [image])

      useEffect(() =>{
        const selectedCountry = form.watch('County')
        const countryStates = getCountryStates(selectedCountry)
        if(countryStates){
          setStates(countryStates)
        }

      }, [form.watch('County')])

      useEffect(() =>{
        const selectedCountry = form.watch('County')
        const selectedState = form.watch('Town')
        const stateCities = getStateCities(selectedCountry, selectedState)
      
        if(stateCities){
          setCities(stateCities)
        }

      }, [form.watch('County'), form.watch('Town')])


      function onSubmit(values: z.infer<typeof formSchema>) {
      
        setIsLoading(true)
        if(hostel){
          axios.patch(`/api/hostel/${hostel.id}`, values).then((res) =>{
            toast({
              variant: "success",
              description: "Hostel Updated!"
            })

         router.push(`/hostel/${res.data.id}`)
            setIsLoading(false)
          }).catch((err) =>{
            console.log(err)
            toast({
              variant: "destructive",
              description: 'Something went wrong!'
            })
            setIsLoading(false)
          })
          


        }else {
          axios.post('/api/hostel', values).then((res) =>{
            toast({
              variant: "success",
              description: "Hostel created!"
            })

         router.push(`/hostel/${res.data.id}`)
            setIsLoading(false)

          }).catch((err) =>{
            console.log(err)
            toast({
              variant: "destructive",
              description: 'Something went wrong!'
            })
            setIsLoading(false)
          })
        }
      }

      const handleDeleteHostel = async (hostel: HostelWithRooms) =>{
        setIsHostelDeleting(true)
        const getImageKey = (src: string) => src.substring(src.lastIndexOf('/') + 1)

        try {
          const imageKey = getImageKey(hostel.image)
         await axios.post('/api/uploadthing/delete', {imageKey})
         await axios.delete(`/api/hostel/${hostel.id}`) 

         setIsHostelDeleting(false)
         toast({
          variant: "success",
          description: 'Hotel Delete!'
        })
        router.push('/hostel/new')
        } catch (error: any) {
          console.log(error)
          
          toast({
            variant: "destructive",
            description: `Hostel Deletion could not be completed! ${error.message}`
          })
          
        }

      }

      const handleImageDelete = (image: string) =>{
        setImageIsDeleting(true)
        const imageKey = image.substring(image.lastIndexOf('/') + 1)

        axios.post('/api/uploadthing/delete', {imageKey}).then((res) =>{
          if(res.data.success){
            setImage('');
            toast({
              variant: 'success',
              description: 'Image removed'
            })
          }
        }).catch(() =>{
          toast({
            variant: 'destructive',
            description: 'Something went wrong'
          })

        }).finally(() => {
          setImageIsDeleting(false)
        })
      }
      const handleDialogueOpen = () =>{
        setOpen(prev => !prev)
      }

    return ( <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h3 className='text-lg font-semibold'> {hostel ? 'Update your hostel' : 'Describe your hostel!'}</h3>
                <div className='flex flex-col md:flex-row gap-6'>
                    <div className='flex-1 flex flex-col gap-6'>
    <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hostel Title *</FormLabel>
              <FormDescription>
                Provide your hostel name
              </FormDescription>
              <FormControl>
                <Input placeholder="Qwetu Hostel" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
 
        <div>
            
           
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hostel Description *</FormLabel>
                    <FormDescription>
                      Provide a detailed description of your hostel
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="Qwetu Hostel offers the best student accommodation in Kenya" {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                  
                )}
                />
                <div >
                <FormLabel>Choose Amenities</FormLabel>
                <FormDescription>Choose Amenities popular in your hostel</FormDescription>
                <div className='grid grid-cols-2 gap-4 mt-2'>
                    <FormField
                     control={form.control}
                     name="bikeRental"
                     render={({ field }) => (
                       <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                         <FormControl>
                            <Checkbox checked={field.value}
                            onCheckedChange={field.onChange}
                            />

                         </FormControl>
                         <FormLabel>Bike Rental</FormLabel>
                         
                         <FormMessage />
                       </FormItem>
                       
                     )}
                    />
                     <FormField
                     control={form.control}
                     name="shopping"
                     render={({ field }) => (
                       <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                         <FormControl>
                            <Checkbox checked={field.value}
                            onCheckedChange={field.onChange}
                            />

                         </FormControl>
                         <FormLabel>Shopping</FormLabel>
                         
                         <FormMessage />
                       </FormItem>
                       
                     )}
                    />
                     <FormField
                     control={form.control}
                     name="restaurants"
                     render={({ field }) => (
                       <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                         <FormControl>
                            <Checkbox checked={field.value}
                            onCheckedChange={field.onChange}
                            />

                         </FormControl>
                         <FormLabel>Restaurants</FormLabel>
                         
                         <FormMessage />
                       </FormItem>
                       
                     )}
                    />
                   

                </div>
            </div>
            <FormField
            control={form.control}
            name="image"
            render={({field}) => (
                <FormItem className='flex flex-col space-y-3'>
                    <FormLabel>Upload and Image *</FormLabel>
                    <FormDescription>Choose a quality image for your hostel</FormDescription>
                    <FormControl>
                        {image ? <>
                        <div className='relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4'>
                          <Image fill src={image} alt='Hostel Image' className='object-contain'/>
                          <Button onClick={() => handleImageDelete(image)} type='button' size='icon' variant='ghost' className='absolute right-[-12px] top-0'>
                            {imageIsDeleting ? <Loader2/> : <XCircle/>}
                          </Button>

                        </div>
                        </> : <>
                        <div className='flex flex-col items-center max-w-[400px] p-12 border-2 border-dashed border-primary/50 rounded mt-4'>
                        <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          setImage(res[0].url)
          toast({
            variant: 'success',
            description: 'Upload Completed'
          })        
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          toast({
            title: 'destructive',
            description: `ERROR! ${error.message}`
          })
        }}
      />   
                        </div>
                        </>}
                    </FormControl>


                </FormItem>

            )}
             />
        </div>
                </div >
                    <div className='flex-1 flex flex-col gap-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        control={form.control}
                        name='County'
                        render={({field}) =>(
                          <FormItem>
                            <FormLabel>Select Country *</FormLabel>
                            <FormDescription>Which Country is your hostel located?</FormDescription>
                            <Select
                            disabled = {isLoading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                            >
                              
                              
  <SelectTrigger className="bg-background">
    <SelectValue defaultValue={field.value} placeholder="Select a Country" />
  </SelectTrigger>
  <SelectContent>
    {countries.map((country)=> {
      return <SelectItem key={country.isoCode} value={country.isoCode}>{country.name}</SelectItem>
    }
    )}
  
  </SelectContent>
</Select>

                          </FormItem>
                        )}
                        />
 <FormField
                        control={form.control}
                        name='Town'
                        render={({field}) =>(
                          <FormItem>
                            <FormLabel>Select Your County </FormLabel>
                            <FormDescription>Which County is your hostel located?</FormDescription>
                            <Select
                            disabled = {isLoading || states.length < 1}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                            >
                              
                              
  <SelectTrigger className="bg-background">
    <SelectValue defaultValue={field.value} placeholder="Select a County" />
  </SelectTrigger>
  <SelectContent>
    {states.map((state)=> {
      return <SelectItem key={state.isoCode} value={state.isoCode}>{state.name}</SelectItem>
    }
    )}
  
  </SelectContent>
</Select>

                          </FormItem>
                        )}
                        />

                      </div>
                      <FormField
                        control={form.control}
                        name='constituency'
                        render={({field}) =>(
                          <FormItem>
                            <FormLabel>Select Constituency</FormLabel>
                            <FormDescription>Which Constituency is your hostel located?</FormDescription>
                            <Select
                            disabled = {isLoading || cities.length < 1}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                            >
                              
                              
  <SelectTrigger className="bg-background">
    <SelectValue defaultValue={field.value} placeholder="Select a Constituency" />
  </SelectTrigger>
  <SelectContent>
    {cities.map((city)=> {
      return <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
    }
    )}
  
  </SelectContent>
</Select>

                          </FormItem>
                        )}
                        />
                          <FormField
                control={form.control}
                name="locationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Description *</FormLabel>
                    <FormDescription>
                      Provide a detailed description of your hostel
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="Located at Ruaraka Opposite Naivas Supermarket" {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                  
                )}
                />
                {hostel && !hostel.rooms.length && <Alert className='bg-indigo-600 text-white'>
                  <Alert>
  <Terminal className="h-4 w-4 stroke-white" />
  <AlertTitle>Almost There 😃
!</AlertTitle>
  <AlertDescription>
    You hostel was created successfully!
    <div>Please add some rooms in the created hostel!</div>
  </AlertDescription>
</Alert>
</Alert>}
                <div className='flex justify-between gap-2 flex-wrap'> 
                {hostel && <Button onClick={() => handleDeleteHostel(hostel)} variant='ghost'
                type='button' className='max-w-[150px]' disabled= {isHostelDeleting || isLoading}>
                  {isHostelDeleting ? <><Loader2 className='mr-2 h-4 w-4'/>Deleting</> :
                   <><Trash className='mr-2 h-4 w-4'/> Delete</>}
                </Button> }

                {hostel && <Button onClick={() => router.push (`/hostel-details/${hostel.id}`)} variant='outline' type='button'><Eye className='mr-2 h-4 w-4'/>View</Button>}
                {hostel &&  <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger>
    <Button type='button' variant='outline' className='max-w-[150px]'>
      <Plus className='mr-2 h-4 w-4'/>  Add Room
    </Button>
    </DialogTrigger>
  <DialogContent className='max-w-[900px] w-[90%]'>
    <DialogHeader className='px-2'>
      <DialogTitle>Add a Room!</DialogTitle>
      <DialogDescription>
        Add the details about the room in your hostel.
      </DialogDescription>
    </DialogHeader>
    <AddRoomForm hostel={hostel} handleDialogueOpen={handleDialogueOpen}/>
  </DialogContent>
</Dialog>
}
  
                {hostel ? <Button className='max-w-[150px]' disabled={isLoading}>
                {isLoading ? <><Loader2 className='mr-2 h-4 w-4'/>Updating</> :
                <><PencilLine className='mr-2 h-4 w-4'/>Update</>}</Button> : <Button
                className='max-w-[150px]' disabled={isLoading}>
                   {isLoading ? <><Loader2 className='mr-2 h-4 w-4'/> Creating</> :
                    <><PencilLine className='mr-2 h-4 w-4'/> Create Hostel</>}
                </Button>
                }
   
                    </div>
                    {hostel && !!hostel.rooms.length && <div>
                      <Separator/>
                      <h3 className='text-lg font-semibold my-4'>Hostel Rooms</h3>
                      <div className='grid grid-cols-1 2xl:grid-cols-2 gap-6'>
                        {hostel.rooms.map(room =>{
                          return <RoomCard key={room.id} hostel= {hostel} room= {room}/>
                        })}

                      </div>
                      </div>}
                    
                </div>
                </div>

            </form>

        </Form>
    </div>);
}
 
export default AddHostelForm;






function res(value: AxiosResponse<any, any>): AxiosResponse<any, any> | PromiseLike<AxiosResponse<any, any>> {
  throw new Error("Function not implemented.");
}

