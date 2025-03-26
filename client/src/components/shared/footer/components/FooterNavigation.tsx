function FooterNavigation() {
  return (
    <div className="border-t-[1px] border-t-[#ddd]">
      <div className="container mx-auto px-5 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="border-t-[1px] border-t-[#ddd] lg:border-t-0 lg:border-t-none py-6">
            <h4 className="text-sm font-medium text-[#222] mb-3">Support</h4>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Help Center
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                AirCover
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Anti-discrimination
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Disability support Plus
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Cancellation options
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Report neighborhood concern
              </p>
            </div>
          </div>

          <div className="border-t-[1px] border-t-[#ddd] lg:border-t-0 lg:border-t-none py-6">
            <h4 className="text-sm font-medium text-[#222] mb-3">Hosting</h4>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Airbnb your home
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                AirCover for Hosts
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Hosting resources
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Community forum
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Hosting responsibly
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Airbnb-friendly apartments
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Join a free Hosting class
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Find a co-host
              </p>
            </div>
          </div>

          <div className="border-t-[1px] border-t-[#ddd] lg:border-t-0 lg:border-t-none py-6">
            <h4 className="text-sm font-medium text-[#222] mb-3">Airbnb</h4>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Newsroom
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                New features
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Careers
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Investors
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Gift cards
              </p>
              <p className="text-sm text-[#222] font-normal cursor-pointer hover:underline">
                Airbnb.org emergency stays
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterNavigation;
