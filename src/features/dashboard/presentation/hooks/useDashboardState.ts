import { useState } from "react";

export function useDashboardState(){

    const[sidebarOpen,setSidebarOpen] = useState(true);
    const[darkMode,setDarkMode] = useState(false);

    const toggleSidebar = ()=>setSidebarOpen((prev)=>!prev);
    const toggleDarkMode = ()=>setDarkMode((prev)=>!prev);

    return{sidebarOpen,toggleSidebar,darkMode,toggleDarkMode}
}