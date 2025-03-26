import { GoStarFill } from "react-icons/go";

function ReviewCard() {
  return (
    <div className="border-[1px] border-[#222] rounded-lg p-4 sm:border-0 sm:p-0  sm:rounded-none flex-shrink-0 max-w-[600px] sm:w-auto">
      <div className="flex gap-3 mb-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-400">
          {/* <img src={Review} alt="" className="w-full h-full object-cover" /> */}
        </div>
        <div>
          <p className="text-base font-medium text-[#222]">Niels</p>
          <p className="text-sm text-[#222]">1 year on Airbnb</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <GoStarFill key={index} className="text-[#222] text-xs" />
          ))}
        </div>
        <span className="text-sm text-[#222] font-medium">July 2024</span>
        <span className="text-sm text-[#6a6a6a] font-medium">
          Stayed about a week
        </span>
      </div>
      <p className="text-base text-[#222] leading-7 line-clamp-3">
        Super nice villa with a clean swimming pool. The villa is very modern
        and nice to stay in. The only thing that was a little less comfortable
        was the camping bed for the 7th person. The beds were good and the air
        conditioning worked great. Definitely recommend this villa! Lorem, ipsum
        dolor sit amet consectetur adipisicing elit. Adipisci quo fugit maxime
        ducimus aut, magni, ratione quis accusantium excepturi eos consectetur
        atque minima fuga dolorem.
      </p>
      <button
        type="button"
        className="text-lg underline text-[#222] cursor-pointer font-medium mt-2"
      >
        Show more
      </button>
    </div>
  );
}

export default ReviewCard;
