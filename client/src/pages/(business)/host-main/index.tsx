// import { Button } from "@/components/ui/button";
import { MultiStepForm } from "@/components/shared/MultiStepForm";
import { DialogTypeEnum } from "@/hooks/useDialog";

const HostMainPage = () => {
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
