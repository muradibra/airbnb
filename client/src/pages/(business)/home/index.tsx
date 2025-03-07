import { Button } from "@/components/ui/button";
import { paths } from "@/constants/paths";
import { useAppSelector } from "@/hooks/redux";
import { DialogTypeEnum, useDialog } from "@/hooks/useDialog";
import { selectAuth } from "@/store/auth";
import { UserRole } from "@/types";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { openDialog } = useDialog();
  const { user } = useAppSelector(selectAuth);

  console.log(user);

  return (
    <div>
      HomePage
      <Button onClick={() => openDialog(DialogTypeEnum.LOGIN)}>Log In</Button>
      {user?.role === UserRole.Admin && (
        <Link to={paths.DASHBOARD.CATEGORIES.LIST}>Go to Dashboard</Link>
      )}
    </div>
  );
};

export default HomePage;
