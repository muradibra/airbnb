import { SortableImageProps } from "@/types";
import { FaTrash } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "../ui/button";
import { useState } from "react";

export const SortableImage: React.FC<SortableImageProps> = ({
  image,
  removeImage,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    if (!isDragging) {
      removeImage(image.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition: transition ?? undefined,
      }}
      className="relative cursor-grab"
    >
      <img
        src={image.preview}
        alt="uploaded"
        className="w-full h-32 object-cover rounded-md"
      />
      <Button
        type="button"
        size={"icon"}
        // onClick={() => removeImage(image.id)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full cursor-pointer"
      >
        <FaTrash size={16} />
      </Button>
    </div>
  );
};
