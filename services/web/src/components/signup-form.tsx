'use client';

// TODO: imporove, only form needs to be client

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUp } from '@/server/users';
import { toast } from 'sonner';

const formSchema = z
  .object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    error: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const { success, message } = await signUp(data.name, data.email, data.password);
    if (!success) return toast.error(message);
    toast.success('Logged in successfully');
    return router.push('/app');
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Enter your email below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Full Name</FormLabel>
                      <Input {...field} id="name" type="text" placeholder="John Doe" required />
                      <FormMessage />
                    </FormItem>
                  )}
                  name="name"
                />
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input {...field} id="email" type="email" placeholder="m@example.com" required />
                      <FormMessage />
                    </FormItem>
                  )}
                  name="email"
                />
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Input {...field} id="password" type="password" required />
                      <FormMessage />
                    </FormItem>
                  )}
                  name="password"
                />
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="passwordConfirmation">Confirm Password</FormLabel>
                      <Input {...field} id="passwordConfirmation" type="password" required />
                      <FormMessage />
                    </FormItem>
                  )}
                  name="passwordConfirmation"
                />
                <FieldDescription>Must be at least 8 characters long.</FieldDescription>
                <Field>
                  <Button type="submit">Create Account</Button>
                  <FieldDescription className="text-center">
                    Already have an account? <a href="/sign-in">Sign in</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
