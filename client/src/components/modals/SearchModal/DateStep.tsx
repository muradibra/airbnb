import { Button } from "@/components/ui/button";
import { DateRange } from "react-date-range";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";
import { addDays } from "date-fns";
import { useState } from "react";

interface DateStepProps {
  startDate: string;
  endDate: string;
  onChange: (dates: { startDate: string; endDate: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DateStep = ({
  startDate,
  endDate,
  onChange,
  onNext,
  onBack,
}: DateStepProps) => {
  const [dateRange, setDateRange] = useState<
    [Date | undefined, Date | undefined]
  >([
    startDate ? new Date(startDate) : undefined,
    endDate ? new Date(endDate) : undefined,
  ]);

  return (
    <div className="space-y-4 ">
      <h2 className="text-2xl font-semibold">When do you plan to go?</h2>
      <div className="flex justify-center w-full overflow-hidden">
        {/* <div className="w-full max-w-md sm:max-w-lg md:max-w-xl"> */}
        <DateRange
          ranges={[
            {
              startDate: dateRange[0] || new Date(),
              endDate: dateRange[1] || addDays(new Date(), 1),
              key: "selection",
            },
          ]}
          onChange={(item) => {
            setDateRange([item.selection.startDate, item.selection.endDate]);
            if (item.selection.startDate && item.selection.endDate) {
              onChange({
                startDate: item.selection.startDate.toISOString(),
                endDate: item.selection.endDate.toISOString(),
              });
            }
          }}
          // months={2}
          // direction="horizontal"
          minDate={new Date()}
          rangeColors={["#FF385C"]}
          showDateDisplay={false}
        />
        {/* </div> */}
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} className="bg-[#FF385C] hover:bg-[#FF385C]/90">
          {dateRange[0] && dateRange[1] ? "Next" : "Skip"}
        </Button>
      </div>
    </div>
  );
};
