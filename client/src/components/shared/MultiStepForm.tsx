import { useEffect, useState } from "react";
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
import { queryKeys } from "@/constants/query-keys";
import { DialogTypeEnum, useDialog } from "@/hooks/useDialog";
import queryClient from "@/config/query";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(50).max(1000),
  category: z.string().min(1, {
    message: "Category is required",
  }),
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
    .array(
      z.object({
        id: z.string(),
        file: z.union([z.string(), z.any()]),
        preview: z.string(),
      })
    )
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
  type = DialogTypeEnum.CREATE_LISTING,
  listingId,
}: {
  type: DialogTypeEnum;
  listingId?: string;
}) => {
  const { isOpen, closeDialog } = useDialog();
  const [formKey] = useState(0);
  const isEdit = type === DialogTypeEnum.EDIT_LISTING;
  const [step, setStep] = useState(0);
  const [images, setImages] = useState<ImageFile[]>([]);

  const [
    { data: categories, isLoading: categoriesLoading },
    { data: countries, isLoading: countriesLoading },
    { data: listingData, refetch: fetchListing },
  ] = useQueries({
    queries: [
      {
        queryKey: [queryKeys.HOST_CATEGORIES],
        queryFn: categoryService.getCategories,
      },
      {
        queryKey: ["countries"],
        queryFn: getCountries,
        enabled: step === 1,
      },
      {
        queryKey: [queryKeys.HOST_LISTING_BY_ID, listingId],
        queryFn: () =>
          listingId
            ? listingService.getHostListingById(listingId)
            : Promise.reject("Listing ID is undefined"),
        enabled: false,
      },
    ],
  });

  const editedListing = listingData?.data.listing;

  const { mutate: mutateCreate, isPending: isCreatePending } = useMutation({
    mutationFn: listingService.createListing,
    onSuccess: (data) => {
      form.reset();
      setImages([]);
      setStep(0);
      closeDialog();
      toast.success(data?.data?.message || "Listing created successfully!");
      queryClient.invalidateQueries({ queryKey: [queryKeys.HOST_LISTINGS] });
    },
  });

  const { mutate: mutateEdit, isPending: isEditPending } = useMutation({
    mutationFn: listingService.editListing,
    onSuccess: (data) => {
      form.reset();
      setImages([]);
      setStep(0);
      closeDialog();
      toast.success(data?.data?.message || "Listing updated successfully!");
      queryClient.invalidateQueries({ queryKey: [queryKeys.HOST_LISTINGS] });
    },
  });

  // const formSchema = useMemo(() => getFormSchema(isEdit), [isEdit]);

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

  useEffect(() => {
    if (isEdit && listingId) {
      fetchListing();
    }
  }, [isEdit, listingId, fetchListing]);

  useEffect(() => {
    if (type === DialogTypeEnum.CREATE_LISTING) {
      form.reset();
      setImages([]);
      setStep(0);
    }
  }, [type]);

  useEffect(() => {
    if (isEdit && editedListing) {
      form.reset({
        title: editedListing.title || "",
        description: editedListing.description || "",
        category: editedListing.category || "",
        address: {
          country: editedListing.address?.country || "Azerbaijan",
          street: editedListing.address?.street || "",
          city: editedListing.address?.city || "",
          state: editedListing.address?.state || "",
          zip: editedListing.address?.zip || "",
        },
        amenities: editedListing.amenities || [],
        conditions: {
          maxGuestCount: editedListing.maxGuestCount || 1,
          bedroomCount: editedListing.bedroomCount || 1,
          bedCount: editedListing.bedCount || 1,
          bathroomCount: editedListing.bathroomCount || 1,
        },
        pricePerNight: editedListing.pricePerNight || 0,
        images:
          editedListing.images.map((img: string) => {
            return {
              id: img,
              file: img,
              preview: img,
            };
          }) || [],
      });

      setImages(
        editedListing.images?.map((img: string) => ({
          id: img,
          file: img,
          preview: img,
        })) || []
      );
    }
  }, [editedListing, form, isEdit]);

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
      isValid = await form.trigger(["title", "description", "category"], {
        shouldFocus: true,
      });
    } else if (step === 1) {
      console.log("triggering address");
      isValid = await form.trigger(
        [
          "address.country",
          "address.street",
          "address.city",
          "address.state",
          "address.zip",
        ],
        { shouldFocus: true }
      );
    } else if (step === 2) {
      console.log("triggering amenities");
      isValid = await form.trigger(["amenities"], { shouldFocus: true });
    } else if (step === 3) {
      console.log("triggering conditions");
      isValid = await form.trigger(
        [
          "conditions.bathroomCount",
          "conditions.bedCount",
          "conditions.bedroomCount",
          "conditions.maxGuestCount",
        ],
        { shouldFocus: true }
      );
    } else if (step === 4) {
      console.log("triggering price");
      isValid = await form.trigger(["pricePerNight"], { shouldFocus: true });
    } else if (step === 5) {
      console.log("triggering images");
      isValid = await form.trigger(["images"], { shouldFocus: true });
    }

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values", values);

    const transformedValues = {
      ...values,
      address: {
        ...values.address,
        state: values.address.state || "",
        zip: values.address.zip || "",
      },
      images: values.images.map((image) => image.file),
    };
    if (isEdit && listingId) {
      console.log("-------editing-------", transformedValues);
      mutateEdit({ data: transformedValues, id: listingId });
    } else {
      // const transformedValues = {
      //   ...values,
      //   address: {
      //     ...values.address,
      //     state: values.address.state || "",
      //     zip: values.address.zip || "",
      //   },
      //   images: values.images.map((image) => image.file),
      // };
      console.log("------creating: transformedValues------", transformedValues);

      mutateCreate(transformedValues);
    }
  }

  const categoriesData = categories?.data.items;

  // console.log("errors", form.formState.errors);

  // console.log(
  //   form
  //     .getValues()
  //     .images.map((img) => img.split("http://localhost:3000/").pop())
  // );

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      {/* {isEdit ? (
        <Button
          className="cursor-pointer"
          onClick={() => {
            if (isEdit && listingId) {
              fetchListing();
            }
            openDialog(DialogTypeEnum.EDIT_LISTING);
          }}
        >
          Edit Listing
        </Button>
      ) : (
        <Button
          onClick={() => openDialog(DialogTypeEnum.CREATE_LISTING)}
          className="cursor-pointer"
        >
          Create Listing
        </Button>
      )} */}
      <DialogContent className="!max-w-[800px] max-h-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{steps[step]}</DialogTitle>
        </DialogHeader>
        <Form key={formKey} {...form}>
          <form className="space-y-4">
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
              <Button type="button" onClick={prevStep} disabled={step === 0}>
                <FaArrowLeft /> Back
              </Button>
              {step < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next <FaArrowRight />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={
                    step === steps.length - 1
                      ? form.handleSubmit(onSubmit)
                      : undefined
                  }
                  disabled={isCreatePending || isEditPending}
                >
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
