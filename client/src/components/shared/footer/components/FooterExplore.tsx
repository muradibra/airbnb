function FooterExplore() {
  return (
    <div className="border-t-[1px] border-t-[#ddd]">
      <div className="container mx-auto px-5 md:px-0">
        <div className="pt-8 pb-12">
          <h2 className="mb-8 text-2xl text-[#222] font-medium">
            Explore other options
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Array(12)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="flex flex-col gap-[2px]">
                  <h4 className="font-medium text-[#222]">Limassol </h4>
                  <p className="text-sm text-[#6a6a6a]">Vacation rentals</p>
                </div>
              ))}
          </div>
        </div>
        <div className="pb-12">
          <h2 className="mb-8 text-2xl text-[#222] font-medium">
            Other types of stays on Airbnb
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array(12)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="flex flex-col gap-[2px]">
                  <p className="text-sm text-[#222] font-medium">
                    Ayia Napa vacation rentals
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterExplore;
