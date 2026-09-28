// themes/ThemeContext.tsx
// Context pattern — mọi sub-component gọi useTheme() để đọc màu
// Không cần prop drilling qua từng tầng

import React, { createContext, useContext } from "react";
import { ThemeTokens, NisaTheme } from "./themes";

const ThemeContext = createContext<ThemeTokens>(NisaTheme);

export const ThemeProvider: React.FC<{
  theme:    ThemeTokens;
  children: React.ReactNode;
}> = ({ theme, children }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

/** Hook cho mọi sub-component */
export const useTheme = () => useContext(ThemeContext);
