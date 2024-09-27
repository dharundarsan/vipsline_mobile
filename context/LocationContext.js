// LocationContext.js
import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

const LocationProvider = ({ children }) => {
    const [currentLocation, setCurrentLocation] = useState("");

    const getLocation = (location) => {
        setCurrentLocation(location);
    };

    return (
        <LocationContext.Provider value={{ currentLocation, getLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

const useLocationContext = () => {
    return useContext(LocationContext);
};

export { LocationProvider, useLocationContext };