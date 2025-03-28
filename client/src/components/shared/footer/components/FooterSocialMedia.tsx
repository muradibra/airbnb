import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";

function FooterSocialMedia() {
  return (
    <div className="container mx-auto px-5 md:px-0">
      <div className="border-t-[1px] border-t-[#ddd] py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div>
              <span>© 2025 Airbnb, Inc.</span>
              <span>.</span>
            </div>
            <div>
              <span>Privacy</span>
              <span>.</span>
            </div>
            <div>
              <span>Terms</span>
              <span>.</span>
            </div>
            <span>Sitemap</span>
          </div>
          <div className="flex items-center gap-2">
            <FaFacebookSquare className="text-lg cursor-pointer" />
            <FaInstagramSquare className="text-lg cursor-pointer" />
            <FaTwitterSquare className="text-lg cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterSocialMedia;
