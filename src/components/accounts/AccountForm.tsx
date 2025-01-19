// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { AccountType } from "@/lib/appwrite";
// import { Button } from "@/components/ui/button";
// import {
//   Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";

// export const accountSchema = yup.object({
//   name: yup.string().required("Account name is required"),
//   type: yup.string().oneOf(['mobile_money', 'cash', 'bank'] as const).required("Account type is required"),
//   balance: yup.number().required("Initial balance is required").min(0, "Balance cannot be negative"),
//   description: yup.string().optional(),
//   accountNumber: yup.string().when('type', {
//     is: (type: string) => type === 'bank' || type === 'mobile_money',
//     then: (schema) => schema.required("Account number is required"),
//   }),
//   bankName: yup.string().when('type', {
//     is: 'bank',
//     then: (schema) => schema.required("Bank name is required"),
//   }),
//   mobileProvider: yup.string().when('type', {
//     is: 'mobile_money',
//     then: (schema) => schema.required("Mobile provider is required"),
//   }),
// }).required();

// export type AccountFormData = yup.InferType<typeof accountSchema>;

// interface AccountFormProps {
//   onSubmit: (data: AccountFormData) => Promise<void>;
// }

// export function AccountForm({ onSubmit }: AccountFormProps) {
//   const form = useForm<AccountFormData>({
//     resolver: yupResolver(accountSchema),
//     defaultValues: {
//       name: "",
//       type: undefined,
//       balance: 0,
//       description: "",
//     },
//   });

//   const accountType = form.watch("type") as AccountType;

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         {/* Basic Fields */}
//         <BasicFields form={form} />
        
//         {/* Conditional Fields */}
//         {accountType === "bank" && <BankFields form={form} />}
//         {accountType === "mobile_money" && <MobileMoneyFields form={form} />}
        
//         {/* Description Field */}
//         <DescriptionField form={form} />

//         <Button type="submit" className="w-full">
//           {form.formState.isSubmitting ? "Creating..." : "Create Account"}
//         </Button>
//       </form>
//     </Form>
//   );
// } 