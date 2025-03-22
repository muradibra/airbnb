import { Listing } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

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
      return (
        <div className="flex justify-center items-center gap-2">
          <Link
            className="p-2 bg-[#f1f1f1] text-[#333] rounded"
            to={`/listings/${row.original._id}`}
            // onClick={() => {}}
          >
            View
          </Link>
          <button
            className="p-2 bg-[#f1f1f1] text-[#333] rounded"
            onClick={() => console.log("Delete", row.original._id)}
          >
            Delete
          </button>
        </div>
      );
    },
  },
];
