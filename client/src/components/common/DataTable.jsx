import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";

const columns = [
   {
      title: "Link",
      accessorKey: "link",
   },
   {
      title: "createdAt",
      accessorKey: "createdAt",
   },
   {
      title: "Total Fetched",
      accessorKey: "totalFetched",
   },
   {
      title: "New Jobs",
      accessorKey: "newJobs",
   },
   {
      title: "Updated Jobs",
      accessorKey: "updatedJobs",
   },
   {
      title: "Failed Jobs",
      accessorKey: "failedJobs",
   },
];

const DataTable = ({ data }) => {
   return (
      <Table className="w-full bg-card p-2 rounded-2xl">
         <TableHeader>
            <TableRow>
               <TableHead>Link</TableHead>
               <TableHead>Total Fetched</TableHead>
               <TableHead>New Jobs</TableHead>
               <TableHead>Updated Jobs</TableHead>
               <TableHead>Failed Jobs</TableHead>
            </TableRow>
         </TableHeader>
         <TableBody className="space-y-2">
            {data.map((item) => (
               <TableRow key={item.id}>
                  <TableCell>{item.link}</TableCell>
                  <TableCell>
                     {new Date(item.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{item.totalFetched}</TableCell>
                  <TableCell>{item.newJobs}</TableCell>
                  <TableCell>{item.updatedJobs}</TableCell>
                  <TableCell>{item.failedJobs.length}</TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
};

export default DataTable;
