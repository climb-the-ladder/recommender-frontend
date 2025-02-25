"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinWaitlist } from "@/lib/actions/waitlist";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Required",
    })
    .email(),
});

type FormValues = z.infer<typeof formSchema>;

export const WaitlistForm = ({
  buttonText = "Join Waitlist",
}: {
  buttonText?: string;
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["get-started"],
    mutationFn: async ({ email }: FormValues) => {
      const response = await joinWaitlist(email);
      return response;
    },

    onSuccess: async (data: any) => {
      toast.success("Just added you to the waitlist");
    },
    onError: (error: any) => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  async function onSubmit({ email }: FormValues) {
    mutate({ email });
  }

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-2 text-center text-white")}>
        <Label>
          Thank you for your interst. We&apos;ll notify you via email.
        </Label>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoComplete="off"
                    className="rounded-full h-12 w-full "
                    disabled={isPending}
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-start ml-2" />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            type="submit"
            // position it in the middle right
            className="absolute transform  -translate-y-1/2 top-1/2 right-4 right-1.5 rounded-full bg-[#343433] hover:bg-[#343433]/95 text-white"
          >
            {isPending ? "Loading..." : buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
