import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const defaultPrefs = () => {
  try {
    const s = localStorage.getItem('drape_outfit_prefs');
    return s ? JSON.parse(s) : {};
  } catch { return {}; }
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('drape_user');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [outfitPrefs, setOutfitPrefs] = useState(defaultPrefs);
  const [selectedOccasion, setSelectedOccasion] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('drape_outfit_prefs') || '{}');
      return p.occasion || null;
    } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem('drape_user', JSON.stringify(user));
    else localStorage.removeItem('drape_user');
  }, [user]);

  useEffect(() => {
    const prefs = { ...outfitPrefs, occasion: selectedOccasion };
    localStorage.setItem('drape_outfit_prefs', JSON.stringify(prefs));
  }, [outfitPrefs, selectedOccasion]);

  return (
    <AppContext.Provider value={{ user, setUser, selectedOccasion, setSelectedOccasion, outfitPrefs, setOutfitPrefs }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
