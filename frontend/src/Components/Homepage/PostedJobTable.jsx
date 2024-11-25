import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'

const PostedJobTable = ({data}) => {
    console.log(data,"fg");
    //const date=new Date(data.updatedAt);
    function getDate(timestamp){
        console.log(timestamp);
        const date = new Date(timestamp);
        console.log(date); 
        const firstMonth = new Date(date.getFullYear(), 0, 1);
         const day = firstMonth.getDate().toString().padStart(2, '0'); // Add leading 0 if day is single-digit
        const month = (firstMonth.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed, so add 1
        const year = firstMonth.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;
    }
  return (
    <div>
        <Table>
            <TableCaption>Recent posted jobs</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Job Role</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead className=''>Location</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.map((item, idx) => (   
                        <TableRow key={idx}>
                            <TableCell>
                                {
                                     getDate(item.updatedAt)
                                }
                                 </TableCell>
                            <TableCell>{item.position}</TableCell>
                            <TableCell>{item.company}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            {/* <TableCell className='text-right'><Badge className='bg-black text-white hover:text-black'>Selected</Badge></TableCell> */}
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </div>
  )
}

export default PostedJobTable