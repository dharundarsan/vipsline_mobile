import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import uuid from "react-native-uuid";
import {adjustServicesTimings, durationToMinutes, sortAppointments} from "../util/appointmentsHelper";

export const initialNewBookingState = {
    selectedClient: null,
    servicesList: [],
    date: moment().toISOString(),
    note: "",
    appointmentStartTime: moment().minutes(Math.round(moment().minutes() / 5) * 5).seconds(0).format("hh:mm A"),
};

export const newBookingSlice = createSlice({
    name: "newBooking",
    initialState: initialNewBookingState,
    reducers: {
        modifyValue(state, action) {
            const {field, value} = action.payload;
            if (field in state) {
                state[field] = value;
            } else {
                console.warn(`Field "${field}" does not exist in newBooking state.`);
            }
        },
        addBooking(state, action) {
            const getLatestBookingEndDate = (servicesList) => {
                // let max = parseTimeToMoment("12:00 AM").valueOf();
                let max = 0;
                servicesList.forEach((item) => {
                    const itemTime = splitAndAdd(moment(item.preferred_date, "hh:mm A"), item.preferred_duration.label).valueOf();
                    if (itemTime > max) {
                        max = itemTime;
                    }
                });
                return moment(max);
            };

            let newPreferredDate;
            let endTime;

            const splitAndAdd = (time, duration) => {
                let totalMinutes = durationToMinutes(duration)
                return time.add(totalMinutes, "minutes");
            };

            // Case when there are existing services
            if (state.servicesList.length > 0) {
                const latestBookingEndTime = getLatestBookingEndDate(state.servicesList);
                const newPreferredMoment = latestBookingEndTime.clone();

                // Format the start time as preferred date
                newPreferredDate = moment(newPreferredMoment).format("hh:mm A");

                // Calculate end time by adding duration to the preferred start time
                endTime = moment(splitAndAdd(newPreferredMoment, action.payload.preferred_duration.label)).format("hh:mm A");
            } else {
                // If no existing services, start with 12:00 AM
                newPreferredDate = moment().minutes(Math.round(moment().minutes() / 5) * 5).seconds(0).format("hh:mm A");
                endTime = moment(splitAndAdd(moment(newPreferredDate, "hh:mm A"), action.payload.preferred_duration.label)).format("hh:mm A");
            }

            state.servicesList = sortAppointments([
                ...state.servicesList,
                {
                    ...action.payload,
                    temp_id: uuid.v4(),
                    preferred_date: newPreferredDate,
                    preferred_staff: "",
                    preferred_duration: {label: action.payload.preferred_duration.label},
                    staff_available: null,
                    end_time: endTime,
                },
            ]);
        },
        // updateBooking(state, action) {
        //     const {temp_id, field, value} = action.payload;
        //     const index = state.servicesList.findIndex(service => service.temp_id === temp_id);
        //     if (index !== -1) {
        //         state.servicesList[index][field] = value;
        //     }
        //     console.log("index")
        //     console.log(index)
        //     console.log(state.servicesList[index])
        //     if (index === 0) {
        //         if (field === "preferred_date") {
        //             state.appointmentStartTime = value;
        //         }
        //
        //         console.log(field)
        //         console.log(field === "preferred_date" || field === "preferred_duration")
        //
        //         if (field === "preferred_date" || field === "preferred_duration") {
        //             state.servicesList = adjustServicesTimings(state.servicesList);
        //         }
        //     }
        // },
        updateBooking(state, action) {
            const {temp_id, field, value} = action.payload;

            const newList = state.servicesList.map((service, index) => {
                if (service.temp_id === temp_id) {
                    let updatedService = {...service, [field]: value};

                    if (index === 0 && field === "preferred_date") {
                        state.appointmentStartTime = value;
                    }

                    return updatedService;
                }
                return service;
            });

            state.servicesList = newList;

            if (field === "preferred_date" || field === "preferred_duration") {
                console.log("newwwww")
                console.log(newList.filter(n => n.type !== "remove"))
                state.servicesList = adjustServicesTimings(newList.filter(n => n.type !== "remove"));
            }
        },
        removeBooking(state, action) {
            state.servicesList = state.servicesList.filter(service => service.temp_id !== action.payload);
        },
        getEndTimeOfRecentBooking(state, action) {
            let max = 0;
            let maxIndex = -1;
            state.servicesList.forEach((item, index) => {
                if (moment(item.preferred_date).valueOf() > max) {
                    max = moment(item.preferred_date).valueOf();
                    maxIndex = index;
                }
            })

            let parts = state.servicesList[maxIndex].preferred_duration.split(" ");
            let totalMinutes = 0;

            for (let i = 0; i < parts.length; i++) {
                if (parts[i] === "h") totalMinutes += parseInt(parts[i - 1]) * 60;
                if (parts[i] === "mins") totalMinutes += parseInt(parts[i - 1]);
            }

            return moment(state.servicesList[maxIndex].preferred_date).add("minute", totalMinutes);
        },
        clearBookingData(state, action) {
            state.servicesList = []
            state.selectedClient = null
            state.date = moment().toISOString();
            state.note = "";
        }
    },
});

export const {
    modifyValue,
    addBooking,
    removeBooking,
    updateBooking,
    getEndTimeOfRecentBooking,
    clearBookingData
} = newBookingSlice.actions;

export default newBookingSlice.reducer;
