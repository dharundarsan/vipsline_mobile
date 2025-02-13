import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {loadCartFromDB} from "./cartSlice";
import * as SecureStore from 'expo-secure-store';

export const initialStaffState = {
    staffs: [],
    allServices: [],
    isFetching: false,
    shiftTiming: [],
    businessClosedDates: [],
    timeOffType: [],
    schedulesForStaff: [],
    commissionProfile: [],
    staffCommissionItem: {
        Services: [],
        Products: [],
        Membership: [],
        Packages: [],
        Prepaid: [],
        Custom_services: [],
    },

};


async function getBusinessId() {
    let businessId = ""
    try {
        // const value = await AsyncStorage.getItem('businessId');
        const value = await SecureStore.getItemAsync('businessId');
        if (value !== null) {
            return value;
        }
    } catch (e) {
    }
}

export const loadStaffsFromDB = () => async (dispatch, getState) => {
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside staffSlice loadStaffsFromDb)" + e);
    }


    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/resource/getByBusiness`,
            {
                business_id: `${await getBusinessId()}`,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(updateStaffs(response.data.data));
        return response.data.data;
    } catch (error) {
    }
}

export const updateCartItemStaff = (res_list) => async (dispatch, getState) => {
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside staffSLice updateCartItemsStaff)" + e);
    }

    try {
        const response = await axios.put(
            `${process.env.EXPO_PUBLIC_API_URI}/cart/updateMultipleResourceInCart2`,
            {
                business_id: `${await getBusinessId()}`,
                res_list: res_list

            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(loadCartFromDB());
    } catch (error) {
    }
}

export const getAllServicesFromDb = (resource_id) => async (dispatch, getState) => {
    const {staff} = getState();
    if(staff.isFetching) return;

    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside staffSlice loadServices)" + e);
    }


    try {
        dispatch(updateIsFetching(true));
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/resource/getAllResourceDetails`,
            {
                business_id: `${await getBusinessId()}`,
                resource_id: resource_id
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(updateAllServices(response.data.data[0]));
        dispatch(updateIsFetching(false));
    } catch (error) {
        dispatch(updateIsFetching(false));
    }
}

export const loadShiftTiming = () => async (dispatch, getState) => {
    const {staff} = getState();
    if(staff.isFetching) return;
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside staffSlice loadStaffsFromDb)" + e);
    }


    try {
        dispatch(updateIsFetching(true));
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/staffschedule/getListOfShiftTimingsByBusiness`,
            {
                business_id: `${await getBusinessId()}`,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(updateShiftTiming(response.data.data));
        dispatch(updateIsFetching(false));
    } catch (error) {
        dispatch(updateIsFetching(false));
    }
}

export const loadBusinessClosedDates = () => async (dispatch, getState) => {
    const {staff} = getState();
    if(staff.isFetching) return;
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside staffSlice loadStaffsFromDb)" + e);
    }


    try {
        dispatch(updateIsFetching(true));
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/staffschedule/getListOfBusinessHolidaysByBusinessId`,
            {
                business_id: `${await getBusinessId()}`,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(updateBusinessClosedDates(response.data.data));
        dispatch(updateIsFetching(false));
    } catch (error) {
        dispatch(updateIsFetching(false));
    }
}

export const loadTimeOffTypeFromDb = () => async (dispatch, getState) => {
    const {staff} = getState();
    if(staff.isFetching) return;
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {

        console.log("auth token fetching error. (inside staffSlice loadStaffsFromDb)" + e);
    }


    try {
        dispatch(updateIsFetching(true));
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/staffschedule/getListOfTimeOffTypesByBusinessId`,
            {
                business_id: `${await getBusinessId()}`,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(updateTimeOffType(response.data.data));
        dispatch(updateIsFetching(false));
    } catch (error) {
        dispatch(updateIsFetching(false));
    }
}

export const getSchedulesForStaffByDatesAPI = (resource_id, start_date, end_date, staff_index) => async (dispatch, getState) => {
    const {staff} = getState();
    try {
        dispatch(updateIsFetching(true));
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/getScheduleForAStaffByDates", {
            business_id: await SecureStore.getItemAsync('businessId'),
            start_date: start_date,
            end_date: end_date,
            resource_id: resource_id,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        let staff_name = staff.staffs.find((staff) => staff.id === resource_id);
        const staff_schedules = response.data.data[0];
        // Object.assign(staff_schedules, {staff_index: staff_index});
        // dispatch(updateSchedulesForStaff({[staff_name.name]: staff_schedules}));
        // dispatch(updateIsFetching(false));
        return response.data.data[0];
    } catch (e) {
        console.error("Error: Get Staff schedules API")
        dispatch(updateIsFetching(false));
        throw e.response;
    }
}

export const getListOfDataToDisplayForStaffCommission = (
    type,
    commission_id = undefined,
    commission_value = undefined,
    commission_type = undefined,
) => async (dispatch, getState) => {
    const { staff } = getState();
    try {
        dispatch(updateIsFetching(true));

        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/getListOfDatasToDisplay", {
            business_id: await SecureStore.getItemAsync('businessId'),
            commission_id: commission_id,
            commission_value: commission_value,
            commission_type: commission_type,
            type: type,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        });

        if (!response.data.data) {
            dispatch(updateIsFetching(false));
            return console.error("API response does not contain expected data");
        }



        const formattedData = response.data.data.flatMap(category =>
            category.resource_categories.map(item => ({
                ...item,
                gender: category.gender
            }))
        );


        // dispatch(updateListOfDataForStaffCommission({type: type, data: [] }));
        //
        //
        // dispatch(updateListOfDataForStaffCommission({type: type, data: formattedData}));
        dispatch(updateIsFetching(false));
        return formattedData;

    } catch (e) {
        console.error("Error: Get Staff schedules API111");
        dispatch(updateIsFetching(false));
    }
};

export const getListOfCommissionProfile = () => async (dispatch, getState) => {
    const {staff} = getState();
    if(staff.isFetching) return;
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {

        console.log("auth token fetching error. (inside staffSlice loadStaffsFromDb)" + e);
    }


    try {
        dispatch(updateIsFetching(true));
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/resource/getListOfCommissionProfile`,
            {
                business_id: `${await getBusinessId()}`,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(updateCommissionProfile(response.data.data));
        dispatch(updateIsFetching(false));
        return response.data.data
    } catch (error) {
        dispatch(updateIsFetching(false));
    }
}

export const staffSlice = createSlice({
    name: "staffs",
    initialState: initialStaffState,
    reducers: {
        updateStaffs(state, action) {
            state.staffs = action.payload;
        },
        updateAllServices(state, action) {
            state.allServices = action.payload;
        },
        updateIsFetching(state, action) {
            state.isFetching = action.payload;
        },
        updateShiftTiming(state, action) {
            state.shiftTiming = action.payload;
        },
        updateBusinessClosedDates: (state, action) => {
            state.businessClosedDates = action.payload;
        },
        updateTimeOffType(state, action) {
            state.timeOffType = action.payload;
        },
        updateSchedulesForStaff(state, action) {
            state.schedulesForStaff[Object.values(action.payload)[0].staff_index] = action.payload;
        },
        clearSchedulesForStaff(state, action) {
            state.schedulesForStaff = [];
        },
        updateListOfDataForStaffCommission(state, action) {
            const { type, data } = action.payload;


            // const updatedData = data.flatMap(category =>
            //     category.resource_categories.map(item => ({
            //         ...item,
            //         gender: category.gender,
            //     }))
            // );

            // state.staffCommissionItem[type] = data[type];

        },
        updateCommissionProfile(state, action) {
            state.commissionProfile = action.payload;
        },
        updateListOfDataForStaffCommission1(state, action) {
            state.staffCommissionItem = action.payload;
        }

    }
});

export const {
    updateStaffs,
    updateAllServices,
    updateIsFetching,
    updateShiftTiming,
    updateBusinessClosedDates,
    updateTimeOffType,
    updateSchedulesForStaff,
    clearSchedulesForStaff,
    updateCommissionProfile,
    updateListOfDataForStaffCommission,
    updateListOfDataForStaffCommission1
} = staffSlice.actions;

export default staffSlice.reducer;
