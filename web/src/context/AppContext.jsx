import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('drape_user');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [selectedOccasion, setSelectedOccasion] = useState(null);

  useEffect(() => {
    if (user) localStorage.setItem('drape_user', JSON.stringify(user));
    else localStorage.removeItem('drape_user');
  }, [user]);

  return (
    <AppContext.Provider value={{ user, setUser, selectedOccasion, setSelectedOccasion }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
