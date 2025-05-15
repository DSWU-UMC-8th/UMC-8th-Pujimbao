import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import useWithdraw from "../hooks/mutation/useWithdraw"; // 👈 탈퇴 mutation 훅

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { accessToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { mutate: withdraw } = useWithdraw();

  const handleWithdraw = () => {
    setShowModal(true);
  };

  const confirmWithdraw = () => {
    withdraw(); // 실제 탈퇴 API 호출
    setShowModal(false);
  };

  const cancelWithdraw = () => {
    setShowModal(false);
  };

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
          <>
            <li><Link to="/my" className="hover:text-pink-300">👤 마이페이지</Link></li>
            <li>
              <button onClick={handleWithdraw} className="hover:text-pink-300">⚠️ 탈퇴하기</button>
            </li>
          </>
        )}
      </ul>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-black">
            <p className="mb-4">정말 탈퇴하시겠습니까?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={cancelWithdraw} className="px-4 py-2 border rounded">아니오</button>
              <button onClick={confirmWithdraw} className="px-4 py-2 bg-red-500 text-white rounded">예</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
