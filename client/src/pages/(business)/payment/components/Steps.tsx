import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-number-input";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { QUERY_KEYS } from "@/constants/query-keys";
// import { RenderIf } from "@/components/shared/RenderIf";
// import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
// import { AxiosResponseError } from "@/types";
import { useNavigate } from "react-router-dom";
// import { useMemo } from "react";
import { Spinner } from "@/components/shared/Spinner";
// import { paths } from "@/constants/paths";
// import { toast } from "sonner";
// import { GetRentByIdResponse } from "@/services/rent/types";
import bookingService from "@/services/booking";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { paths } from "@/constants/paths";
import { AxiosResponseError } from "@/types";
import { useAppSelector } from "@/hooks/redux";
import { selectAuth } from "@/store/auth";

const FormSchema = z.object({
  name: z.string().min(4, {
    message: "Name must be at least 4 characters.",
  }),
  phoneNumber: z.string().min(1, {
    message: "Phone number is required",
  }),
  address: z.string().min(4, {
    message: "Address must be at least 4 characters.",
  }),
  city: z.string().min(4, {
    message: "City must be at least 4 characters.",
  }),
  termsConditions: z.literal<boolean>(true, {
    message: "You must agree to terms and conditions",
  }),
});

type FormType = UseFormReturn<z.infer<typeof FormSchema>>;

interface BookingData {
  listing: {
    _id: string;
    pricePerNight: number;
  };
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  guestCount: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
}

export const Steps = ({ bookingData }: { bookingData: BookingData }) => {
  const { user } = useAppSelector(selectAuth);
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      bookingService.createBooking({
        ...data,
        listingId: bookingData.listing._id,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        totalPrice: bookingData.totalPrice,
        guestCount: bookingData.guestCount,
        paymentStatus: "paid",
      }),
    onSuccess: () => {
      toast.success("Booking created successfully!");
      navigate(paths.BOOKING);
    },
    onError: (error: AxiosResponseError) => {
      toast.error(error.response?.data.message ?? "Something went wrong!");
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user?.name ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      address: "",
      city: "",
      termsConditions: false,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const payload = {
      guestInfo: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        address: data.address,
        city: data.city,
      },
    };
    mutate(payload);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-8"
      >
        <BillingStep form={form} />
        <ConfirmationStep pending={isPending} form={form} />
      </form>
    </Form>
  );
};

const BillingStep = ({ form }: { form: FormType }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Guest Information
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Please enter your details
          </p>
        </div>
        <p className="text-gray-500 text-sm">Step 1 of 2</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-4 lg:gap-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  defaultCountry="US"
                  international
                  placeholder="Your number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Your address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Town / City</FormLabel>
              <FormControl>
                <Input placeholder="Town or city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

const ConfirmationStep = ({
  form,
  pending,
}: {
  form: FormType;
  pending: boolean;
}) => {
  const errors = form.formState.errors;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Confirmation</h3>
          <p className="text-gray-500 text-sm mt-1">
            Please review and confirm your booking
          </p>
        </div>
        <p className="text-gray-500 text-sm">Final Step</p>
      </div>

      <FormField
        control={form.control}
        name="termsConditions"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-5 space-y-0 rounded-lg bg-gray-50 p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="leading-none">
              <FormLabel
                className={cn(
                  "cursor-pointer",
                  errors.termsConditions && "text-red-500"
                )}
              >
                I agree with the terms and conditions and privacy policy
              </FormLabel>
            </div>
          </FormItem>
        )}
      />

      <Button
        disabled={pending}
        className="w-full mt-6 bg-[#FF385C] hover:bg-[#FF385C]/90"
      >
        {pending ? (
          <div className="mr-2">
            <Spinner />
          </div>
        ) : null}
        Confirm and Pay
      </Button>
    </div>
  );
};
