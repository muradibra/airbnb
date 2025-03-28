import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import Cards, { Focused } from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { number as validateCardNumber } from "card-validator";
import { formatCreditCardNumber, formatExpirationDate } from "@/lib/formatters";

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
  // Guest Information
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

  // Updated Card Information
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .transform((val) => val.replace(/\s/g, "")) // Remove spaces before validation
    .refine((val) => validateCardNumber(val).isValid, {
      message: "Invalid card number",
    }),

  cardName: z
    .string()
    .min(1, "Cardholder name is required")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters")
    .min(4, "Cardholder name must be at least 4 characters"),

  expiryDate: z
    .string()
    .min(1, "Expiry date is required")
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Must be in MM/YY format")
    .refine((val) => {
      const [month, year] = val.split("/");
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      return expiry > new Date();
    }, "Card has expired"),

  cvc: z
    .string()
    .min(1, "CVC is required")
    .regex(/^[0-9]{3,4}$/, "CVC must be 3 or 4 digits"),

  // Terms
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
  const [step, setStep] = useState(1);
  const [focused, setFocused] = useState<undefined | Focused>();

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
      // TODO: Redirect to bookings page
      navigate(paths.HOME);
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
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvc: "",
      termsConditions: false,
    },
  });

  const nextStep = async () => {
    const currentFields = {
      1: ["name", "phoneNumber", "address", "city"],
      2: ["cardNumber", "cardName", "expiryDate", "cvc"],
      3: ["termsConditions"],
    }[step] as Array<keyof z.infer<typeof FormSchema>>;

    // Trigger validation for current step fields
    const result = await form.trigger(currentFields);

    // Check if all fields in current step are valid
    if (result) {
      setStep((prev) => Math.min(prev + 1, 3));
    } else {
      // Show error toast if validation fails
      toast.error("Please fill in all required fields correctly");
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Validate all fields one last time before submission
    const isValid = await form.trigger();

    if (!isValid) {
      toast.error("Please check all fields are filled correctly");
      return;
    }

    const payload = {
      guestInfo: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        address: data.address,
        city: data.city,
      },
      paymentInfo: {
        cardNumber: data.cardNumber,
        cardName: data.cardName,
        expiryDate: data.expiryDate,
        cvc: data.cvc,
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
        {step === 1 && <GuestInfoStep form={form} />}
        {step === 2 && (
          <PaymentStep form={form} focused={focused} setFocused={setFocused} />
        )}
        {step === 3 && <ConfirmationStep form={form} pending={isPending} />}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button type="button" onClick={nextStep} className="ml-auto">
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isPending} className="ml-auto">
              {isPending ? (
                <div className="mr-2">
                  <Spinner />
                </div>
              ) : null}
              Confirm Booking
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

const GuestInfoStep = ({ form }: { form: FormType }) => {
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
        <p className="text-gray-500 text-sm">Step 1 of 3</p>
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

const PaymentStep = ({
  form,
  focused,
  setFocused,
}: {
  form: FormType;
  focused?: Focused;
  setFocused: (focus: Focused) => void;
}) => {
  // Add validation on blur
  const validateField = (fieldName: keyof z.infer<typeof FormSchema>) => {
    form.trigger(fieldName);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Payment Information
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Please enter your card details
          </p>
        </div>
        <p className="text-gray-500 text-sm">Step 2 of 3</p>
      </div>

      <div className="mb-6">
        <Cards
          number={form.watch("cardNumber")}
          name={form.watch("cardName")}
          expiry={form.watch("expiryDate")}
          cvc={form.watch("cvc")}
          focused={focused}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  onFocus={() => setFocused("number")}
                  onBlur={() => {
                    setFocused("number" as const);
                    validateField("cardNumber");
                  }}
                  onChange={(e) => {
                    const formatted = formatCreditCardNumber(e.target.value);
                    field.onChange(formatted);
                  }}
                  value={field.value}
                  className={cn(
                    form.formState.errors.cardNumber && "border-red-500"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cardName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cardholder Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  onFocus={() => setFocused("name")}
                  onBlur={() => {
                    setFocused("name" as const);
                    validateField("cardName");
                  }}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    field.onChange(value);
                  }}
                  value={field.value}
                  className={cn(
                    form.formState.errors.cardName && "border-red-500"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input
                    placeholder="MM/YY"
                    maxLength={5}
                    onFocus={() => setFocused("expiry")}
                    onBlur={() => {
                      setFocused("expiry" as const);
                      validateField("expiryDate");
                    }}
                    onChange={(e) => {
                      const formatted = formatExpirationDate(e.target.value);
                      field.onChange(formatted);
                    }}
                    value={field.value}
                    className={cn(
                      form.formState.errors.expiryDate && "border-red-500"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cvc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVC</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123"
                    maxLength={4}
                    onFocus={() => setFocused("cvc")}
                    onBlur={() => {
                      setFocused("cvc" as const);
                      validateField("cvc");
                    }}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      field.onChange(value);
                    }}
                    value={field.value}
                    className={cn(
                      form.formState.errors.cvc && "border-red-500"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
  console.log("pending", pending);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Terms & Conditions
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Please review and accept our terms
          </p>
        </div>
        <p className="text-gray-500 text-sm">Step 3 of 3</p>
      </div>

      <div className="prose max-w-none mb-6">
        <h4>Booking Terms</h4>
        <p className="text-sm text-gray-600">
          By proceeding with this booking, you agree to:
        </p>
        <ul className="text-sm text-gray-600">
          <li>The host's house rules</li>
          <li>Our guest refund policy</li>
          <li>Our community guidelines</li>
        </ul>
      </div>

      <FormField
        control={form.control}
        name="termsConditions"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-5 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel
                className={cn(errors.termsConditions && "text-red-500")}
              >
                I agree to the terms and conditions
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
