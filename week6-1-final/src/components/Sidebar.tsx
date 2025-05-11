// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const Sidebar = () => {
//   const { accessToken } = useAuth();

//   return (
//     <aside className="w-52 bg-black text-white p-6 pt-10 h-screen fixed">

//       <ul className="space-y-4 text-l">
//         <li>
//           <Link to="/search" className="hover:text-pink-300">🔍 찾기</Link>
//         </li>
//         {accessToken && (
//           <li>
//             <Link to="/my" className="hover:text-pink-300">👤 마이페이지</Link>
//           </li>
//         )}
//       </ul>
//     </aside>
//   );
// };

// export default Sidebar;

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { accessToken } = useAuth();

  return (
    <aside
      className={`
        fixed top-16 left-0 h-full bg-black text-white p-6 w-64 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <ul className="space-y-4 text-lg">
        <li><Link to="/search" className="hover:text-pink-300">🔍 찾기</Link></li>
        {accessToken && (
          <li><Link to="/my" className="hover:text-pink-300">👤 마이페이지</Link></li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
