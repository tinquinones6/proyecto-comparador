import { createContext, useState, useContext } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [abierto, setAbierto] = useState(true);
  const toggleSidebar = () => setAbierto(!abierto);

  return (
    <SidebarContext.Provider value={{ abierto, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);