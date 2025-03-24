import listingService from "@/services/listing";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const ListingDetailsPage = () => {
  const { id } = useParams();

  const {} = useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingService.getListingById(id!),
  });

  console.log("id", id);

  return <div>ListingDetailsPage</div>;
};

export default ListingDetailsPage;
