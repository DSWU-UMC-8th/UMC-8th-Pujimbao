import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useLogout from "../hooks/mutation/useLogout";
import useGetMyInfo from "../hooks/mutation/useGetMyInfo";

interface NavbarProps {
  onSidebarToggle: () => void;
}

const Navbar = ({ onSidebarToggle }: NavbarProps) => {
  const { accessToken, userName } = useAuth();
  const { data } = useGetMyInfo();
  const { mutate: logout } = useLogout();

  return (
    <nav className="bg-black text-white shadow-md fixed w-full z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <button onClick={onSidebarToggle} className="text-white text-2xl">☰</button>
          <Link to="/" className="text-pink-500 text-2xl font-bold">Pujim LP</Link>
        </div>

        <div className="space-x-6">
          {accessToken ? (
            <>
              <span>{data?.data.name}</span>
              <button onClick={() => logout()} className="hover:text-pink-300">로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-pink-300">로그인</Link>
              <Link to="/signup" className="hover:text-pink-300">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
