import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { queryKeys } from "@/constants/query-keys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

type Props = {
  type: "create" | "update";
};

const getFormSchema = (isEdit: boolean) =>
  z.object({
    name: isEdit ? z.string().nonempty() : z.string().nonempty(),
    description: isEdit ? z.string() : z.string(),
    icon: isEdit ? z.string().nonempty() : z.string().nonempty(),
  });

const CategoryActionForm = ({ type }: Props) => {
  const isEdit = type === "update";
  const isCreate = type === "create";
  const { id } = useParams();

  // const { data, isLoading } = useQuery({
  //   queryKey: [queryKeys.ADMIN_CATEGORY_BY_ID, id],
  //   // queryFn: () => categoryService.getCategoryById(id),
  //   enabled: isEdit,
  // });

  // const editItem = data?.data || null;

  // const { mutate: mutateCreate, isPending: isPendingCreate } = useMutation({
  //   mutationFn: () => {},
  // });

  // const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
  //   mutationFn: () => {},
  // });

  const formSchema = useMemo(() => getFormSchema(isEdit), [isEdit]);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: "",
      description: "",
      icon: "",
    },
    resolver: zodResolver(formSchema),
  });

  // useEffect(() => {
  //   if (editItem) {
  //     form.setValue("name", editItem.name);
  //     form.setValue("description", editItem.description);
  //   }
  // }, [editItem]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // if (isCreate) {
    //   mutateCreate(data);
    // } else {
    //   mutateUpdate(data);
    // }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary my-4">
        {isEdit ? "Edit" : "Create"} Category
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Category Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button variant={"secondary"}>Back</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CategoryActionForm;
