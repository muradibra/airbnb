import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogTypeEnum, useDialog } from "@/hooks/useDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { amenities } from "@/constants";

// const amenities = [
//   "Wifi",
//   "TV",
//   "Kitchen",
//   "Washer",
//   "Parking",
//   "Air Conditioning",
//   "Pool",
//   "Hot Tub",
// ];

const filterFormSchema = z.object({
  priceRange: z.array(z.number()).length(2),
  bedCount: z.number().min(1, "Must have at least 1 bed"),
  bedroomCount: z.number().min(1, "Must have at least 1 bedroom"),
  bathroomCount: z.number().min(1, "Must have at least 1 bathroom"),
  amenities: z.array(z.string()),
});

type FilterFormValues = z.infer<typeof filterFormSchema>;

export const Filter = () => {
  const { isOpen, closeDialog, type } = useDialog();
  const [searchParams, setSearchParams] = useSearchParams();
  // const

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      priceRange: [0, 1000],
      bedCount: 1,
      bedroomCount: 1,
      bathroomCount: 1,
      amenities: [],
    },
  });

  // Initialize form with URL params
  useEffect(() => {
    const priceRange = searchParams
      .get("priceRange")
      ?.split("-")
      .map(Number) || [0, 10000];
    const bedCount = Number(searchParams.get("bedCount")) || 1;
    const bedroomCount = Number(searchParams.get("bedroomCount")) || 1;
    const bathroomCount = Number(searchParams.get("bathroomCount")) || 1;
    const amenities = searchParams.get("amenities")?.split(",") || [];

    form.reset({
      priceRange,
      bedCount,
      bedroomCount,
      bathroomCount,
      amenities,
    });
  }, [searchParams]);

  const onSubmit = (data: FilterFormValues) => {
    const params = new URLSearchParams(searchParams);

    params.set("priceRange", `${data.priceRange[0]}-${data.priceRange[1]}`);
    params.set("bedCount", data.bedCount.toString());
    params.set("bedroomCount", data.bedroomCount.toString());
    params.set("bathroomCount", data.bathroomCount.toString());

    if (data.amenities.length > 0) {
      params.set("amenities", data.amenities.join(","));
    } else {
      params.delete("amenities");
    }

    setSearchParams(params);
    closeDialog();
  };

  if (isOpen && type !== DialogTypeEnum.FILTER) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="priceRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Range (per night)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <span>${field.value[0]}</span>
                      <Slider
                        min={0}
                        max={1000}
                        step={10}
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex-1"
                      />
                      <span>${field.value[1]}</span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bedCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beds</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bedroomCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathroomCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenities</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {amenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            checked={field.value.includes(amenity)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, amenity]);
                              } else {
                                field.onChange(
                                  field.value.filter((a) => a !== amenity)
                                );
                              }
                            }}
                          />
                          <label className="text-sm">{amenity}</label>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit">Apply Filters</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
