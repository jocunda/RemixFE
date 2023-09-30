import type { FunctionComponent } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { LinksFunction } from "@remix-run/node";

import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { toast } from "~/components/ui/use-toast"
import appStylesHref from "../app.css";
import styles from "../tailwind.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(appStylesHref ? [{ rel: "stylesheet", href: appStylesHref }] : []),
];

const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

const FormSchema = z.object({
  username: z.string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .max(40, {
      message: "Username must be below 40 characters.",
    }),
  password: z.string()
    .min(6, {
      message: "Username must be at least 6 characters."
    })
    .refine(value => /[0-9]/.test(value), {
      message: getCharacterValidationError("digit")
    })
    .refine(value => /[a-z]/.test(value), {
      message: getCharacterValidationError("lowercase")
    })
    .refine(value => /[A-Z]/.test(value), {
      message: getCharacterValidationError("uppercase")
    })
    .refine(value => /[^\w]/.test(value), {
      message: getCharacterValidationError("symbol")
    })
});


export default function Home() {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }


  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input id="login-form" type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="bg-zinc-950 dark:bg-white" type="submit">Submit</Button>
      </form>
    </Form>
  );

};
