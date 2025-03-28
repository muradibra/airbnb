import FooterNavigation from "./components/FooterNavigation";
import FooterSocialMedia from "./components/FooterSocialMedia";

function Footer() {
  return (
    <footer>
      <div className="bg-[#f7f7f7] px-[24px] md:px-[40px] xxl:px-[80px]">
        <FooterNavigation />
        <FooterSocialMedia />
      </div>
    </footer>
  );
}

export default Footer;
