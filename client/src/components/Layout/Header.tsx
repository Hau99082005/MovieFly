import { Link } from "react-router-dom";
import { assets } from "@/assets/assets";

const Header = () => {
  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
        <Link to="/">
          <img src={assets.logo} alt="logo"/>
        </Link>
    </div>
  );
};

export default Header;
