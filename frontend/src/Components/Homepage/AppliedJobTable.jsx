import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
const AppliedJobTable = () => {
  return (
    <div>
        <Table>
            <TableCaption>Recent applied jobs</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Job Role</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead className='text-right'>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    [1,2,3,4].map((item, idx) => (
                        <TableRow key={idx}>
                            <TableCell>12-11-2024</TableCell>
                            <TableCell>Frontend Developer</TableCell>
                            <TableCell>Netflix</TableCell>
                            <TableCell className='text-right'><Badge className='bg-black text-white hover:text-black'>Selected</Badge></TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </div>
  )
}

export default AppliedJobTable