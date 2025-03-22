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
import { MAX_FILE_SIZE } from "@/constants";
import { queryKeys } from "@/constants/query-keys";
import categoryService from "@/services/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  type: "create" | "update";
};

const getFormSchema = (isEdit: boolean) =>
  z.object({
    name: isEdit ? z.string().nonempty() : z.string().nonempty(),
    description: isEdit ? z.string() : z.string(),
    icon: z.union([
      z.string(), // For existing icons (edit mode)
      z
        .instanceof(File) // For new uploads
        .refine((file) => file.size <= MAX_FILE_SIZE, "File size is too large")
        .refine(
          (file) =>
            ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
          "Invalid file type"
        ),
    ]),
  });

const CategoryActionForm = ({ type }: Props) => {
  const isEdit = type === "update";
  const { id } = useParams();
  const [iconPreview, setIconPreview] = useState("");
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.ADMIN_CATEGORY_BY_ID, id],
    queryFn: () => categoryService.getCategoryById(id!),
    enabled: isEdit,
  });

  const editItem = data?.data.item || null;

  const { mutate: mutateCreate, isPending: isPendingCreate } = useMutation({
    mutationFn: categoryService.createCategory,
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationFn: categoryService.updateCategory,
    onSuccess: () => {
      toast.success("Category updated");
      navigate("/dashboard/categories");
    },
  });

  const formSchema = useMemo(() => getFormSchema(isEdit), [isEdit]);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: "",
      description: "",
      icon: "",
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (!isLoading && editItem) {
      form.reset({
        name: editItem.name || "",
        description: editItem.description || "",
        icon: editItem.icon || "",
      });
    }
  }, [editItem, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (isEdit) {
      const obj = {
        ...data,
        id: id || "",
      };
      mutateUpdate(obj);
    } else {
      mutateCreate(data);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold my-10 ">
        {isEdit ? "Edit" : "Create"} Category
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">Category Name</FormLabel>
                  <FormControl>
                    <Input
                      className=""
                      placeholder="Category Name"
                      {...field}
                    />
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
                  <FormLabel className="">Category Description</FormLabel>
                  <FormControl>
                    <Input
                      className=""
                      placeholder="Category Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Category Icon</FormLabel>
                  <FormControl>
                    <div>
                      {/* Show current image preview if in edit mode */}

                      {/* File Input */}
                      <Input
                        type="file"
                        accept="image/*"
                        className=""
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIconPreview(URL.createObjectURL(file));
                            onChange(file); // Store file in form state
                          }
                        }}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end mt-4">
            {iconPreview || editItem?.icon ? (
              <img
                src={iconPreview || editItem.icon}
                alt="Category Icon"
                className="w-20 h-20 mb-2 object-cover"
              />
            ) : null}
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => navigate("/dashboard/categories")}
              type="button"
              variant={"secondary"}
              className="cursor-pointer"
            >
              Back
            </Button>
            <Button type="submit" disabled={isPendingCreate || isPendingUpdate}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CategoryActionForm;
