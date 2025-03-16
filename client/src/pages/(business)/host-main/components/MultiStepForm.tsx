import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SortableImage } from "@/components/shared/SortableImage";

import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import { amenities } from "@/constants";
import { ImageFile } from "@/types";

import { useMutation, useQueries } from "@tanstack/react-query";

import { getCountries, TCountry } from "@/services/getCountries";

import listingService from "@/services/listing";
import categoryService from "@/services/category";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(10).max(200),
  category: z.string(),
  address: z.object({
    country: z.string().min(1),
    street: z.string().min(5, "Street address is required!"),
    city: z.string().min(3, "City is required!"),
    state: z.string().optional(),
    zip: z.string().optional(),
  }),
  amenities: z.array(z.string()),
  conditions: z.object({
    maxGuestCount: z.number().positive().min(1),
    bedroomCount: z.number().positive().min(0),
    bedCount: z.number().positive().min(1),
    bathroomCount: z.number().positive().min(1),
  }),
  pricePerNight: z
    .number({
      invalid_type_error: "Price must be a number",
      required_error: "Price is required",
    })
    .positive(),
  images: z
    .array(z.object({ id: z.string(), file: z.any(), preview: z.string() }))
    .min(5, "Minimum 5 images required")
    .max(100, "Maximum 100 images allowed"),
});

const steps = [
  "Basic Info",
  "Location",
  "Amenities",
  "Conditions",
  "Pricing",
  "Photos",
];

export const MultiStepForm = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [step, setStep] = useState(0);
  const [images, setImages] = useState<ImageFile[]>([]);

  const [
    { data: categories, isLoading: categoriesLoading },
    { data: countries, isLoading: countriesLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["categories"],
        queryFn: categoryService.getCategories,
      },
      {
        queryKey: ["countries"],
        queryFn: getCountries,
        enabled: step === 1,
      },
    ],
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: listingService.createListing,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      address: {
        country: "Azerbaijan",
        street: "",
        city: "",
        state: "",
        zip: "",
      },
      amenities: [],
      conditions: {
        maxGuestCount: 1,
        bedroomCount: 1,
        bedCount: 1,
        bathroomCount: 1,
      },
      pricePerNight: 0,
      images: [],
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    const newImages: ImageFile[] = files.map((file) => ({
      id: URL.createObjectURL(file),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    form.setValue("images", [...images, ...newImages]);
  };

  const removeImage = (id: string) => {
    const filteredImages = images.filter((img) => img.id !== id);
    setImages(filteredImages);
    form.setValue("images", filteredImages);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    const newOrder = arrayMove(images, oldIndex, newIndex);
    setImages(newOrder);
    form.setValue("images", newOrder);
  };

  const nextStep = async () => {
    let isValid;

    if (step === 0) {
      console.log("triggering title and description");
      isValid = await form.trigger(["title", "description", "category"]);
    } else if (step === 1) {
      console.log("triggering address");
      isValid = await form.trigger([
        "address.country",
        "address.street",
        "address.city",
        "address.state",
        "address.zip",
      ]);
    } else if (step === 2) {
      console.log("triggering amenities");
      isValid = await form.trigger(["amenities"]);
    } else if (step === 3) {
      console.log("triggering conditions");
      isValid = await form.trigger([
        "conditions.bathroomCount",
        "conditions.bedCount",
        "conditions.bedroomCount",
        "conditions.maxGuestCount",
      ]);
    } else if (step === 4) {
      console.log("triggering price");
      isValid = await form.trigger(["pricePerNight"]);
    } else if (step === 5) {
      console.log("triggering images");
      isValid = await form.trigger(["images"]);
    }

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const transformedValues = {
      ...values,
      address: {
        ...values.address,
        state: values.address.state || "",
        zip: values.address.zip || "",
      },
      images: values.images.map((image) => image.file),
    };
    console.log(transformedValues);

    const {
      data: { message },
    } = await mutateAsync(transformedValues);
    form.reset();
    setImages([]);
    setStep(0);
    onClose();
    toast.success(message || "Listing created successfully!");
  }

  const categoriesData = categories?.data.items;

  console.log(form.getValues());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[800px] max-h-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{steps[step]}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="p-4 space-y-4">
              {step === 0 && (
                <div>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) =>
                              form.setValue("category", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categoriesLoading
                                ? "Loading..."
                                : categoriesData?.map((category) => (
                                    <SelectItem
                                      key={category._id}
                                      value={category._id}
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {step === 1 && (
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue>
                                {field.value || "Select a country"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {countriesLoading
                                ? "Loading..."
                                : countries.map((country: TCountry) => (
                                    <SelectItem
                                      key={country.name.common}
                                      value={country.name.common}
                                    >
                                      <img
                                        src={country.flags.png}
                                        alt={country.name.common}
                                        className="w-5 h-5 mr-2"
                                      />
                                      {country.name.common}
                                    </SelectItem>
                                  ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Street address</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.zip"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Zip code</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {step === 2 && (
                <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Ameneties</FormLabel>
                      <FormControl>
                        <div className="flex flex-col sm:flex-row  flex-wrap justify-between">
                          {amenities.map((amenity) => (
                            <div
                              key={amenity}
                              className="flex items-center gap-10 w-full sm:w-[48%] lg:w-[30%] mb-4 shadow-md rounded-lg"
                            >
                              <Label
                                className="w-full h-full text-[16px] p-3"
                                htmlFor={amenity}
                              >
                                {amenity}
                              </Label>
                              <Checkbox
                                id={amenity}
                                className="mr-3"
                                checked={field.value.includes(amenity)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, amenity]);
                                  } else {
                                    field.onChange(
                                      field.value.filter(
                                        (item: string) => item !== amenity
                                      )
                                    );
                                  }
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {step === 3 && (
                <div>
                  <FormField
                    control={form.control}
                    name="conditions.maxGuestCount"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Guest count</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="shadcn"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="conditions.bedroomCount"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Bedroom count</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="shadcn"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="conditions.bedCount"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Bed count</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="shadcn"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="conditions.bathroomCount"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Bathroom count</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="shadcn"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {step === 4 && (
                <div>
                  <FormField
                    control={form.control}
                    name="pricePerNight"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Price Per Night ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="shadcn"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {step === 5 && (
                <div>
                  <FormField
                    control={form.control}
                    name="images"
                    render={() => (
                      <FormItem>
                        <FormLabel>Upload Photos</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="mb-4"
                          />
                        </FormControl>
                        <FormMessage />
                        <DndContext
                          onDragEnd={handleDragEnd}
                          modifiers={[restrictToWindowEdges]}
                        >
                          <SortableContext items={images.map((img) => img.id)}>
                            <div className="grid grid-cols-3 gap-4">
                              {images.map((image) => (
                                <SortableImage
                                  key={image.id}
                                  image={image}
                                  removeImage={removeImage}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-between p-4">
              <Button onClick={prevStep} disabled={step === 0}>
                <FaArrowLeft /> Back
              </Button>
              {step < steps.length - 1 ? (
                <Button onClick={nextStep}>
                  Next <FaArrowRight />
                </Button>
              ) : (
                <Button disabled={isPending}>
                  Submit <FaCheck />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
