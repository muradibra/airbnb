import moment from "moment";

import userService from "@/services/user";

import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { queryKeys } from "@/constants/query-keys";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/config/query";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      return (
        <img
          src={row.original.avatar || ""}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <div>{row.original.name}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div>{row.original.email}</div>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return <div className="capitalize">{row.original.role}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return <div>{moment(row.original.createdAt).format("MMMM Do YYYY")}</div>;
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const { mutate, isPending } = useMutation({
        mutationKey: [queryKeys.ADMIN_DELETE_USER],
        mutationFn: userService.deleteUser,
        onSuccess: () => {
          toast.success("User deleted successfully");
          queryClient.invalidateQueries({
            queryKey: [queryKeys.ADMIN_USERS],
          });
        },
        onError: () => {
          toast.error("Failed to delete user");
        },
      });

      const handleDelete = () => {
        mutate(row.original._id);
        setOpen(false);
      };

      return (
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
              <p>Are you sure you want to delete this user?</p>
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
      );
    },
  },
];
