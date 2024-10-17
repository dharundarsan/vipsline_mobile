import React, { createContext, useContext, useState } from "react";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [isDashboardPage, setIsDashboardPage] = useState(true);
  return (
    <DataContext.Provider value={{ isDashboardPage, setIsDashboardPage }}>
      {children}
    </DataContext.Provider>
  );
};

const useDataContext = () => {
  return useContext(DataContext);
};

export { DataProvider, useDataContext };
