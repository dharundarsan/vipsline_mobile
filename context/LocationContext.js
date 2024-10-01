// LocationContext.js
import { createNavigationContainerRef } from '@react-navigation/native';
import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

const LocationProvider = ({ children }) => {
    const [currentLocation, setCurrentLocation] = useState("");
    const [reload, setReload] = useState(false);
    const getLocation = (location) => {
        setCurrentLocation(location);
    };

    return (
        <LocationContext.Provider value={{ currentLocation, getLocation, reload, setReload }}>
            {children}
        </LocationContext.Provider>
    );
};

const useLocationContext = () => {
    return useContext(LocationContext);
};

export { LocationProvider, useLocationContext };