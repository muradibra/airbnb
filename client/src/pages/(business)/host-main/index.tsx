// import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { MultiStepForm } from "@/components/shared/MultiStepForm";
import { useAppSelector } from "@/hooks/redux";
import { selectAuth } from "@/store/auth";
import { DialogTypeEnum, useDialog } from "@/hooks/useDialog";

const HostMainPage = () => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const { openDialog } = useDialog();
  const { user } = useAppSelector(selectAuth);
  const searchParams = new URLSearchParams(window.location.search);
  const createListing = searchParams.get("createListing");

  useEffect(() => {
    if (createListing) {
      // setIsModalOpen(true);
      openDialog(DialogTypeEnum.CREATE_LISTING);
    }
  }, [createListing]);

  useEffect(() => {
    if (user?.listings.length === 0) {
      // setIsModalOpen(true);
      openDialog(DialogTypeEnum.CREATE_LISTING);
    }
  }, [user]);

  return (
    <div className="px-4 py-3">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <MultiStepForm type={DialogTypeEnum.CREATE_LISTING} />
        {/* <Button
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          Host a Listing
        </Button> */}
      </div>

      {/* <MultiStepForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
    </div>
  );
};

export default HostMainPage;
