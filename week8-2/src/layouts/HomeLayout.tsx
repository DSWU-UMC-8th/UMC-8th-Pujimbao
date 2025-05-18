import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import { SearchProvider } from "../context/SearchContext"; // ✅ 추가

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SearchProvider>
      <div className="overflow-x-hidden">
        <Navbar onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)} />
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main
            className={`flex-1 mt-16 px-6 py-6 transition-all duration-300
              ${isSidebarOpen ? "ml-64" : "ml-0"}`}
          >
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </SearchProvider>
  );
};

export default HomeLayout;
