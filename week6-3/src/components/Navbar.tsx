// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const Navbar = () => {
//   const {accessToken, logout, userName} = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async() => {
//     await logout();
//     navigate("/");
//   }

//   return <nav className="bg-black text-white dark:bg-gray-900 shadow-md fixed w-full z-10">
//     <div className="flex items-center justify-between p-4">
//       <Link to='/' className="text-pink-500 text-2xl font-bold mb-3">Pujim LP</Link>

//       <div className="space-x-6">
//         {accessToken && (
//           <>
//             <span className="text-gray-300">{userName}님 반갑습니다.</span>
//             <button
//               onClick={handleLogout}
//               className="dark:text-gray-300 hover:text-pink-300 cursor-pointer transition-colors"
//             >
//               로그아웃
//             </button>
//           </>
//         )}
//         {!accessToken && ( //accessToken이 없는 경우에만 로그인, 회원가입 페이지
//           <>
//             <Link to={"/login"} className="dark:text-gray-300 hover:text-pink-300">로그인</Link>
//             <Link to={"/signup"} className="dark:text-gray-300 hover:text-pink-300">회원가입</Link>
//           </>
//         )}

//         {/* <Link to={"/search"} className="dark:text-gray-300 hover:text-pink-300">검색</Link> */}
//       </div>
//     </div>
//   </nav>
// }

// export default Navbar;

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  onSidebarToggle: () => void;
}

const Navbar = ({ onSidebarToggle }: NavbarProps) => {
  const { accessToken, logout, userName } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-black text-white shadow-md fixed w-full z-50">
      <div className="flex items-center justify-between p-4">
        {/* ☰ 햄버거 버튼 - 항상 보이게 */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSidebarToggle}
            className="text-white text-2xl"
          >
            ☰
          </button>
          <Link to="/" className="text-pink-500 text-2xl font-bold">Pujim LP</Link>
        </div>

        <div className="space-x-6">
          {accessToken ? (
            <>
              <span>{userName}님 반갑습니다.</span>
              <button onClick={handleLogout} className="hover:text-pink-300">로그아웃</button>
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
