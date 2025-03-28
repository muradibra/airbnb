import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDialog } from "@/hooks/useDialog";
import { useState } from "react";
import { LocationStep } from "./LocationStep";
import { DateStep } from "./DateStep";
import { GuestsStep } from "./GuestsStep";
import { useNavigate } from "react-router-dom";
import { DialogTypeEnum } from "@/hooks/useDialog";
import { Button } from "@/components/ui/button";

export const SearchModal = () => {
  const { isOpen, closeDialog, type } = useDialog();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: { id: "", displayName: "" },
    startDate: "",
    endDate: "",
    guests: {
      adults: 1,
      children: 0,
      infants: 0,
      pets: 0,
    },
  });

  const handleNext = () => {
    if (step <= 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(window.location.search);

    // Only add params if they have values
    if (searchParams.location.id) {
      console.log("searchParams.location.id", searchParams.location.id);

      params.set("location", searchParams.location.id);
    }

    // Only add dates if both start and end dates exist
    if (searchParams.startDate && searchParams.endDate) {
      const startDate = new Date(searchParams.startDate);
      const endDate = new Date(searchParams.endDate);

      // Only add if dates are valid
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        params.set("startDate", startDate.toISOString().split("T")[0]);
        params.set("endDate", endDate.toISOString().split("T")[0]);
      }
    }

    // Only add guest counts if they're greater than 0
    const { adults, children, infants, pets } = searchParams.guests;

    if (adults >= 1) {
      // Only add if more than default 1 adult
      params.set("adults", adults.toString());
    }
    if (children > 0) {
      params.set("children", children.toString());
    }
    if (infants > 0) {
      params.set("infants", infants.toString());
    }
    if (pets > 0) {
      params.set("pets", pets.toString());
    }

    // Only add total guests if it's different from default
    const totalGuests = adults + children;
    if (totalGuests >= 1) {
      // Only add if more than default 1 guest
      params.set("guests", totalGuests.toString());
    }

    // Navigate even if no params are set
    navigate(`/?${params.toString()}`);
    closeDialog();
  };

  if (type !== DialogTypeEnum.SEARCH) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="min-w-full sm:min-w-0 sm:max-w-[600px]">
        <div className="relative">
          {/* <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
            <div
              className="h-full bg-[#FF385C] transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div> */}

          <div className="mt-6 w-full">
            {step === 1 && (
              <LocationStep
                value={searchParams.location}
                onChange={(location) =>
                  setSearchParams({
                    ...searchParams,
                    location: {
                      id: location.id,
                      displayName: location.displayName,
                    },
                  })
                }
                onNext={handleNext}
              />
            )}
            {step === 2 && (
              <DateStep
                startDate={searchParams.startDate}
                endDate={searchParams.endDate}
                onChange={({ startDate, endDate }) =>
                  setSearchParams({ ...searchParams, startDate, endDate })
                }
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {step === 3 && (
              <GuestsStep
                guests={searchParams.guests}
                onChange={(guests) =>
                  setSearchParams({ ...searchParams, guests })
                }
                onBack={handleBack}
                onSearch={handleSearch}
              />
            )}
          </div>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => {
                navigate("/");
                setStep(1);
                setSearchParams({
                  location: { id: "", displayName: "" },
                  startDate: "",
                  endDate: "",
                  guests: {
                    adults: 1,
                    children: 0,
                    infants: 0,
                    pets: 0,
                  },
                });
                closeDialog();
              }}
              className="mt-4 w-[100px] cursor-pointer"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
