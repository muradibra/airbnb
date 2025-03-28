// import { ModalsContainer } from "@/components/modals";
import { LoginDialog } from "./Login";
import { RegisterDialog } from "./Register";
import { Filter } from "./Filter";
import { SearchModal } from "./SearchModal";

export const Dialogs = () => {
  return (
    <>
      <LoginDialog />
      <RegisterDialog />
      {/* <ModalsContainer /> */}
      <Filter />
      <SearchModal />
    </>
  );
};
