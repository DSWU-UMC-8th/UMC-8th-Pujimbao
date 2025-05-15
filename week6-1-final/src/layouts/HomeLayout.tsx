// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import Sidebar from "../components/Sidebar";

// const HomeLayout = () => {
//   return (
//     <div className="h-dvh flex flex-col overflow-x-hidden">
//       <Navbar/>
//       <main className="flex-1 mt-10">
//         <Sidebar />
//         <main className="ml-64 w-full p-6">
//           <Outlet/>
//         </main>
//       </main>
//       <Footer/>
//     </div>
//   )
// };

// export default HomeLayout;


import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
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
      <Footer/>
    </div>
  );
};

export default HomeLayout;
