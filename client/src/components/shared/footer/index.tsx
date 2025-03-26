import FooterNavigation from "./components/FooterNavigation";
import FooterSocialMedia from "./components/FooterSocialMedia";

// import FooterExplore from "./components/FooterExplore";
// import FooterNavigationHeader from "./components/FooterNavigationHeader";

function Footer() {
  return (
    <footer>
      <div className="bg-[#f7f7f7] px-[24px] lg:px-[32px]">
        {/* <FooterNavigationHeader /> */}
        {/* <FooterExplore /> */}
        <FooterNavigation />
        <FooterSocialMedia />
      </div>
    </footer>
  );
}

export default Footer;
