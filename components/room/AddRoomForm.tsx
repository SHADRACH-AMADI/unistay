'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Hostel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { Loader2, PencilLine, XCircle } from "lucide-react";
import { UploadButton } from "../uploadthing";
import { useRouter } from "next/navigation";


interface AddRoomFormProps {
    hostel?: Hostel & {
        rooms: Room[]
    }
    room?: Room
    handleDialogueOpen: () => void
}

const formSchema = z.object({
    title: z.string().min(3, {
        message: 'Title must be atleast 3 characters long'
    }),
    description: z.string().min(10, {
        message: 'Description must be atleast 10 characters long'
    }),
    bedCount: z.coerce.number().min(1, {
        message: 'Bed count required'
    }),
    guestCount: z.coerce.number().min(1, {
        message: 'Guest count required'
    }),
    bathroomCount: z.coerce.number().min(1, {
        message: 'Guest count required'
    }),
    kingBedCount: z.coerce.number().min(0),
    queenBedCount: z.coerce.number().min(0),
    image: z.string().min(1, {
        message: 'Image is required'
    }),
    roomPrice: z.coerce.number().min(1, {
        message: 'Room Price is required'
    }),
    roomService: z.boolean().optional(),
    roofTop: z.boolean().optional(),
    airConditiom: z.boolean().optional(),
    bikeRental: z.boolean().optional(),
})

const AddRoomForm = ({ hostel, room, handleDialogueOpen }: AddRoomFormProps) => {
    const [image, setImage] = useState<string | undefined>(room?.image)
    const [imageIsDeleting, setImageIsDeleting] = useState(false)
    const {toast} = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: room || {
            title: '',
            description: '',
            bedCount: 0,
            guestCount: 0,
            bathroomCount: 0,
            kingBedCount: 0,
            queenBedCount: 0,
            image: '', 
            roomPrice: 0,
            roomService: false,
            roofTop: false,
            airConditiom: false, 
            bikeRental: false,
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

      function onSubmit(values: z.infer<typeof formSchema>) {
      
        setIsLoading(true)
        if(hostel && room){
          axios.patch(`/api/room/${room.id}`, values).then((res) =>{
            toast({
              variant: "success",
              description: "Room Updated!"
            })

         router.refresh()
            setIsLoading(false)
            handleDialogueOpen()
          }).catch((err) =>{
            console.log(err)
            toast({
              variant: "destructive",
              description: 'Something went wrong!'
            })
            setIsLoading(false)
          })
          


        }else {
            if(!hostel) return;
          axios.post('/api/room', {...values, hostelId: hostel?.id}).then((res) =>{
            toast({
              variant: "success",
              description: "Room created!"
            })

         router.refresh
            setIsLoading(false)
            handleDialogueOpen()

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

    return <div className='max-h-[75vh] overflow-y-auto px-2'>
        <Form {...form}>
            <form className='space-y-6'>
            <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Title *</FormLabel>
              <FormDescription>
                Provide a room name
              </FormDescription>
              <FormControl>
                <Input placeholder="Double Room" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Description *</FormLabel>
              <FormDescription>
                Provide details of this room
              </FormDescription>
              <FormControl>
                <Textarea placeholder="Enjoy the beautiful display of this room" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
            <FormLabel>Choose Room Amenities</FormLabel>
            <FormDescription>What makes this room special?</FormDescription>
            <div className='grid grid-cols-2 gap-2 mt-2'>
                <FormField
                 
                 control={form.control}
                 name="roomService"
                 render={({ field }) => (
                   <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                     <FormControl>
                        <Checkbox checked={field.value}
                        onCheckedChange={field.onChange}
                        />

                     </FormControl>
                     <FormLabel>Balcony</FormLabel>
                     
                     <FormMessage />
                   </FormItem>
                   
                 )}
                />

<FormField
                 
                 control={form.control}
                 name="roofTop"
                 render={({ field }) => (
                   <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                     <FormControl>
                        <Checkbox checked={field.value}
                        onCheckedChange={field.onChange}
                        />

                     </FormControl>
                     <FormLabel>Free Wifi</FormLabel>
                     
                     <FormMessage />
                   </FormItem>
                   
                 )}
                />

<FormField
                 
                 control={form.control}
                 name="airConditiom"
                 render={({ field }) => (
                   <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                     <FormControl>
                        <Checkbox checked={field.value}
                        onCheckedChange={field.onChange}
                        />

                     </FormControl>
                     <FormLabel>Air Condition</FormLabel>
                     
                     <FormMessage />
                   </FormItem>
                 )}
                />
                
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
                     <FormLabel>Laundry Services</FormLabel>
                     
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
                    <FormDescription>Choose a quality image for your room!</FormDescription>
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
             <div className='flex flex-row gap-6'>
                <div className='flex-1 flex flex-col gap-6'>
                <FormField
          control={form.control}
          name="roomPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Price*</FormLabel>
              <FormDescription>
                State the price for this room for each month
              </FormDescription>
              <FormControl>
                <Input type='number' min={0} {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="bedCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bed Count*</FormLabel>
              <FormDescription>
                How many beds are available in this room?
              </FormDescription>
              <FormControl>
                <Input type='number' min={0} max={8} {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="guestCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guest Count*</FormLabel>
              <FormDescription>
                How many guests are allowed in this room?
              </FormDescription>
              <FormControl>
                <Input type='number' min={0} max={10} {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
                </div>
                <div className='flex-1 flex flex-col gap-6'> 
                <FormField
          control={form.control}
          name="kingBedCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>King Beds</FormLabel>
              <FormDescription>
                How many King beds are in this room?
              </FormDescription>
              <FormControl>
                <Input type='number' min={0} {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="queenBedCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Queen Bed Count</FormLabel>
              <FormDescription>
                How many queen beds are available in this room?
              </FormDescription>
              <FormControl>
                <Input type='number' min={0} max={8} {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="bathroomCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bathroom Count</FormLabel>
              <FormDescription>
                How many bathrooms are available in this room?
              </FormDescription>
              <FormControl>
                <Input type='number' min={0} max={10} {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
                </div>
             </div>
             <div className='pt-4 pb-2'>
             {room ? <Button onClick={form.handleSubmit(onSubmit)} type='button' className='max-w-[150px]' disabled={isLoading}>
                {isLoading ? <><Loader2 className='mr-2 h-4 w-4'/>Updating</> :
                <><PencilLine className='mr-2 h-4 w-4'/>Update</>}</Button> : <Button onClick={form.handleSubmit(onSubmit)} type='button'
                className='max-w-[150px]' disabled={isLoading}>
                   {isLoading ? <><Loader2 className='mr-2 h-4 w-4'/> Creating</> :
                    <><PencilLine className='mr-2 h-4 w-4'/> Create Room</>}
                </Button>
                }

             </div>

            </form>
        </Form>
    </div>;
}

export default AddRoomForm;