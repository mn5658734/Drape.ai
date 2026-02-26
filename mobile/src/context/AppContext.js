import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState(null);

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      selectedOccasion,
      setSelectedOccasion,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
