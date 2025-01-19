// import { UseFormReturn } from "react-hook-form";
// import { AccountFormData } from "../AccountForm";
// import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// interface BasicFieldsProps {
//   form: UseFormReturn<AccountFormData>;
// }

// export function BasicFields({ form }: BasicFieldsProps) {
//   return (
//     <>
//       <FormField
//         control={form.control}
//         name="name"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Account Name</FormLabel>
//             <FormControl>
//               <Input placeholder="My Savings" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       <FormField
//         control={form.control}
//         name="type"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Account Type</FormLabel>
//             <Select onValueChange={field.onChange} defaultValue={field.value}>
//               <FormControl>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select account type" />
//                 </SelectTrigger>
//               </FormControl>
//               <SelectContent>
//                 <SelectItem value="cash">Cash</SelectItem>
//                 <SelectItem value="bank">Bank Account</SelectItem>
//                 <SelectItem value="mobile_money">Mobile Money</SelectItem>
//               </SelectContent>
//             </Select>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       <FormField
//         control={form.control}
//         name="balance"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Initial Balance</FormLabel>
//             <FormControl>
//               <Input
//                 type="number"
//                 placeholder="0.00"
//                 {...field}
//                 onChange={(e) => field.onChange(Number(e.target.value))}
//               />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </>
//   );
// } 