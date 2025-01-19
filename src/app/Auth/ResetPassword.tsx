import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { accountService as authService } from "@/lib/appwrite";
import { AppwriteException } from "appwrite";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

const resetPasswordSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
}).required();

type ResetPasswordForm = yup.InferType<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<ResetPasswordForm>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      await authService.resetPassword(data.email);
      setIsEmailSent(true);
      toast({
        title: "Reset email sent",
        description: "Please check your email for reset instructions.",
      });
    } catch (error) {
      if (error instanceof AppwriteException) {
        switch (error.code) {
          case 404:
            toast({
              variant: "destructive",
              title: "Email not found",
              description: "No account exists with this email address.",
            });
            break;
          case 429:
            toast({
              variant: "destructive",
              title: "Too many attempts",
              description: "Please try again later.",
            });
            break;
          default:
            toast({
              variant: "destructive",
              title: "Error",
              description: "An error occurred while sending reset email.",
            });
        }
      }
      console.error(error);
    }
  };

  if (isEmailSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Check your email</CardTitle>
          <CardDescription className="text-center">
            We've sent you a password reset link to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Mail className="h-12 w-12 text-blue-500" />
          <p className="text-sm text-center text-muted-foreground">
            Click the link in the email to reset your password. If you don't see the email, check your spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsEmailSent(false)}
          >
            Try another email
          </Button>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Remember your password?</span>{" "}
            <Link
              to="/auth/signin"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Reset password</CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="john@example.com" 
                      type="email"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending reset link...
                </div>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Remember your password?</span>{" "}
          <Link
            to="/auth/signin"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}