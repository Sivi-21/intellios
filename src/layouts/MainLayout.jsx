import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { CommandBar } from "../components/CommandBar";
import { FloatingConsole } from "../components/FloatingConsole";
export const MainLayout = () => {
  return <div className="relative flex h-screen w-screen overflow-hidden bg-zinc-950 font-sans">
      
      {
    /* Absolute Backdrop Gradient Highlights */
  }
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vh] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vh] rounded-full bg-indigo-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[35vw] h-[35vh] rounded-full bg-violet-900/5 blur-[120px] pointer-events-none" />

      {
    /* Global Collapsible Sidebar Navigation Panel */
  }
      <Sidebar />

      {
    /* Primary Dynamic Content Frame */
  }
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        {
    /* Sticky Top Navbar Container */
  }
        <Navbar />

        {
    /* Scalable Viewport Canvas scroll-wrapper */
  }
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-6 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {
    /* Spotlight Command Bar Overlay Controller */
  }
      <CommandBar />

      {
    /* Operating System Interactive Control Panel Drawer */
  }
      <FloatingConsole />

    </div>;
};
