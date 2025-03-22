import moment from "moment";
import { useState } from "react";

import { Category } from "@/types";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { ColumnDef } from "@tanstack/react-table";
import { PenIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import categoryService from "@/services/category";
import { queryKeys } from "@/constants/query-keys";
import { toast } from "sonner";
import { paths } from "@/constants/paths";

export const columns: ColumnDef<Category>[] = [
  {
    header: () => {
      return <div className="">Icon</div>;
    },
    accessorKey: "icon",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center w-[80px] h-[80px]">
          <img
            src={row.original.icon}
            alt={row.original.name}
            className="w-full h-full object-cover"
          />
        </div>
      );
    },
  },
  {
    header: () => {
      return <div className="text-center">Name</div>;
    },
    accessorKey: "name",
    cell: ({ row }) => {
      return <p className="text-center">{row.original.name}</p>;
    },
  },
  {
    header: () => {
      return <div className="text-center">Description</div>;
    },
    accessorKey: "description",
    cell: ({ row }) => {
      return (
        <p className="text-center">
          {row.original.description ? row.original.description : "-"}
        </p>
      );
    },
  },
  {
    header: () => {
      return <div className="text-center">Created At</div>;
    },
    accessorKey: "createdAt",
    cell: ({ row }) => {
      return (
        <p className="text-center">
          {moment(row.original.createdAt).format("MMMM Do YYYY")}
        </p>
      );
    },
  },
  {
    header: () => {
      return <div className="text-center">Updated At</div>;
    },
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      return (
        <p className="text-center">
          {moment(row.original.updatedAt).format("MMMM Do YYYY")}
        </p>
      );
    },
  },
  {
    header: () => {
      return <div className="text-center">Actions</div>;
    },
    accessorKey: "actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const { mutate, isPending } = useMutation({
        mutationKey: [queryKeys.ADMIN_DELETE_CATEGORY],
        mutationFn: categoryService.deleteCategory,
        onSuccess: () => {
          toast.success("Category deleted");
        },
        onError: () => {
          toast.error("Failed to delete category");
        },
      });

      const handleDelete = () => {
        mutate(row.original._id);
        setOpen(!open);
      };
      return (
        <div className="flex gap-y-2 justify-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
              <Button
                className="cursor-pointer"
                variant={"destructive"}
                size={"icon"}
              >
                <Trash2Icon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-2">
                <p>Are you sure you want to delete this category?</p>
                <div className="flex gap-2">
                  <Button
                    variant={"outline"}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={"destructive"}
                    className="cursor-pointer"
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Link
            className=""
            to={paths.DASHBOARD.CATEGORIES.EDIT(row.original._id)}
          >
            <Button
              size={"icon"}
              variant={"outline"}
              className="bg-yellow-400 cursor-pointer text-white hover:bg-yellow-400 hover:text-white"
            >
              <PenIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
