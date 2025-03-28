import { Button } from "@/components/ui/button";
import queryClient from "@/config/query";
import { queryKeys } from "@/constants/query-keys";
import listingService from "@/services/listing";
import { Listing } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export const columns: ColumnDef<Listing>[] = [
  {
    // header: "Images",
    header: () => {
      return <div className="text-center">Images</div>;
    },
    accessorKey: "images",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center w-[150px] h-[150px]">
          <img
            src={row.original.images[0]}
            alt={row.original.title}
            className="w-full h-full object-cover"
          />
        </div>
      );
    },
  },
  {
    header: () => {
      return <div className="text-center">Title</div>;
    },
    accessorKey: "title",
    cell: ({ row }) => {
      return <p className="font-semibold text-center">{row.original.title}</p>;
    },
  },
  {
    header: () => {
      return <div className="text-center">Category</div>;
    },
    accessorKey: "category",
    cell: ({ row }) => {
      return <p className="text-center">{row.original.category.name}</p>;
    },
  },
  {
    header: () => {
      return <div className="text-center">Price</div>;
    },
    accessorKey: "pricePerNight",
    cell: ({ row }) => {
      return <p className="text-center">{row.original.pricePerNight}</p>;
    },
  },
  {
    header: () => {
      return <div className="text-center">Host</div>;
    },
    accessorKey: "host",
    cell: ({ row }) => {
      return (
        <div className="text-center flex gap-2">
          <div className="avatar h-[20px] w-[20px] overflow-hidden">
            <img
              src={row.original.host.avatar}
              className="rounded-full"
              alt="Host"
            />
          </div>
          {row.original.host.name}
        </div>
      );
    },
  },
  {
    header: () => {
      return <div className="text-center">Actions</div>;
    },
    accessorKey: "actions",
    cell: ({ row }) => {
      const { mutate: removeListingMutate } = useMutation({
        mutationFn: listingService.removeListing,
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [queryKeys.HOST_LISTINGS],
          });
        },
      });

      const removeListing = (id: string) => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            removeListingMutate(id);
            Swal.fire({
              title: "Deleted!",
              text: "Your listing has been deleted.",
              icon: "success",
            });
          }
        });
      };

      return (
        <div className="flex justify-center items-center gap-2">
          <Link
            className="p-2 bg-[#f1f1f1] text-[#333] rounded"
            to={`/listings/${row.original._id}`}
          >
            View
          </Link>
          <Button
            variant={"destructive"}
            className="cursor-pointer"
            onClick={() => removeListing(row.original._id)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
