import {createSlice} from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import {getBusinessId} from './cartSlice';

const initialState = {
    total_count: 10,
    totalSalesValue: 0,
    totalNetSalesValue: 0,
    salesReportList: [],
    isFilterModalVisible: false,
};

export const fetchSalesReportByBusiness = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "invoice_issued_on", sortOrder = "desc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getSalesReportByBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: fromDate,
                toDate: toDate,
                sortItem: sortItem === null ? "invoice_issued_on" : sortItem,
                sortOrder: sortOrder,
                query: query !== undefined ? query : "",
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchSalesByServiceForBusiness = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "name", sortOrder = "desc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getSalesByServiceForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: fromDate,
                toDate: toDate,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                query: query !== undefined ? query : "",
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchProductSalesSummaryReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "name", sortOrder = "desc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getProductSalesSummaryReport?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: fromDate,
                toDate: toDate,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                query: query !== undefined ? query : "",
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchSalesByMembershipForBusiness = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "cm.membership_name", sortOrder = "desc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getSalesByMembershipForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: fromDate,
                toDate: toDate,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                query: query !== undefined ? query : "",
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchSalesByPackagesForBusiness = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "cm.package_name", sortOrder = "desc", filterData) => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    console.log("filterData")
    console.log(filterData)

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getSalesByPackagesForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: fromDate,
                toDate: toDate,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                query: query !== undefined ? query : "",
                ...filterData.reduce((acc, filter) => {
                    acc[filter.apiName] = filter.selectedValue.value;
                    return acc;
                }, {})
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchSalesByPrepaidForBusiness = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "bc.name", sortOrder = "desc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getSalesByPrepaidForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: fromDate,
                toDate: toDate,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                query: query !== undefined ? query : "",
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchPaymentModeReportForBusiness = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "bc.name", sortOrder = "desc", modeFilter = undefined) => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getPaymentModeReportForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: fromDate,
                toDate: toDate,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                query: query !== undefined ? query : "",
                modeFilter: modeFilter
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchCancelledInvoiceReportByBusiness = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "SUBSTRING(substring_index(business_invoice_no,'/',1),5)+0", sortOrder = "desc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getCancelledInvoiceReportByBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: fromDate,
                toDate: toDate,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                query: query !== undefined ? query : "",
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchSalesByApointmentsReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "bc.name", sortOrder = "asc", filterData) => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getSalesByAppointmentForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: fromDate,
                toDate: toDate,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                query: query !== undefined ? query : "",
                ...filterData.reduce((acc, filter) => {
                    acc[filter.apiName] = filter.selectedValue.value;
                    return acc;
                }, {})
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchAppointmentByServiceReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "name", sortOrder = "asc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getAppointmentReportByServiceForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: fromDate,
                toDate: toDate,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                query: query !== undefined ? query : "",
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchAppointmentByStaffReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "staff_name", sortOrder = "asc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getAppointmentByStaffForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: fromDate.toString(),
                toDate: toDate.toString(),
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                query: query !== undefined ? query : "",
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchStaffSummaryReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "staff_name", sortOrder = "asc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getStaffServiceSummaryReportForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: fromDate.toString(),
                toDate: toDate.toString(),
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                staffName: "All"
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchStaffWorkHourReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "invoice_no", sortOrder = "asc", filterData) => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/staffschedule/getWorkingHoursReportForTheBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: fromDate.toString(),
                toDate: toDate.toString(),
                ...filterData.reduce((acc, filter) => {
                    acc[filter.apiName] = filter.selectedValue.value;
                    return acc;
                }, {})
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchWANotificationReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "staff_name", sortOrder = "asc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/messaging/getWhatsappNotificationReport?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                from_date: fromDate.toString(),
                to_date: toDate.toString(),
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchActiveMembershipReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "cm.membership_name", sortOrder = "asc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getListOfAllActiveMembershipByBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchAboutToExpireMembershipReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "cm.membership_name", sortOrder = "asc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getListOfDueToExpireClientMemberships?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchExpiredMembershipReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "cm.membership_price", sortOrder = "asc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getListOfExpiredClientMemberships?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchActiveIndividualMembershipReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "cm.membership_name", sortOrder = "asc", filterData) => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getListOfSpecificActiveMembershipById?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                ...filterData.reduce((acc, filter) => {
                    acc[filter.apiName] = filter.selectedValue.value;
                    return acc;
                }, {})

            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchFeedbackReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "cm.membership_price", sortOrder = "asc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getFeedbackForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: fromDate.toString(),
                toDate: toDate.toString(),
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchRewardPointsReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "date", sortOrder = "asc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/rewards/getRewardPointForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                sortItem: sortItem === null ? "date" : sortItem,
                sortOrder: sortOrder,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchPackageReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "name", sortOrder = "desc", filterData) => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/package/getListOfClientPackageDetailByBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                ...filterData.reduce((acc, filter) => {
                    acc[filter.apiName] = filter.selectedValue.value;
                    return acc;
                }, {})
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchPrepaidReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "date", sortOrder = "asc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/wallet/getWalletBalanceReportForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                sortBy: sortItem === null ? "date" : sortItem,
                sortOrder: sortOrder,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchClientServiceListReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "appointment_date", sortOrder = "asc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getListOfClientServicesForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                fromDate: fromDate,
                toDate: toDate
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchClientSourceListReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "name", sortOrder = "asc", filterData) => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getListOfClientSourcesForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                fromDate: fromDate,
                search_term: "",
                toDate: toDate,
                ...filterData.reduce((acc, filter) => {
                    acc[filter.apiName] = filter.selectedValue.value;
                    return acc;
                }, {})
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchClientListReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "name", sortOrder = "asc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getClientReportByBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                sortItem: sortItem === null ? "name" : sortItem,
                sortOrder: sortOrder,
                fromDate: fromDate,
                toDate: toDate,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};


export const fetchDailyAttendanceReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "r.name", sortOrder = "asc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getDailyAttendanceReportForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                sortItem: sortItem === null ? "r.name" : sortItem,
                sortOrder: sortOrder,
                fromDate: fromDate,
                search_term: "",
                toDate: toDate,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

export const fetchMonthlyAttendanceReport = (initialPage, finalPage, fromDate, toDate, query = "", sortItem = "r.name", sortOrder = "asc") => async (dispatch, getState) => {
    let authToken = "";
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getMonthlyAttendanceReportForBusiness?pageNo=${initialPage ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                sortItem: sortItem === null ? "r.name" : sortItem,
                sortOrder: sortOrder,
                fromDate: fromDate,
                search_term: "",
                toDate: toDate,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e;
    }
};

const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        updateTotalCount(state, action) {
            if (action.payload.type === 'update') {
                state.total_count = action.payload.value;
            } else if (action.payload.type === 'reset') {
                state.total_count = 10;
            }
        },
        updateTotalSalesValue(state, action) {
            if (action.payload.type === 'update') {
                state.totalSalesValue = action.payload.value;
            } else if (action.payload.type === 'reset') {
                state.totalSalesValue = 0;
            }
        },
        updateTotalNetSalesValue(state, action) {
            if (action.payload.type === 'update') {
                state.totalNetSalesValue = action.payload.value;
            } else if (action.payload.type === 'reset') {
                state.totalNetSalesValue = 0;
            }
        },
        updateSalesReportList(state, action) {
            if (action.payload.type === 'update') {
                state.salesReportList = action.payload.value;
            } else if (action.payload.type === 'reset') {
                state.salesReportList = [];
            }
        },
        updateDateChangeValue(state, action) {
            if (action.payload.type === 'update') {
                Object.keys(action.payload.values).forEach(key => {
                    if (state.hasOwnProperty(key)) {
                        state[key] = action.payload.values[key];
                    }
                });
            } else if (action.payload.type === 'reset') {
                state.total_count = 10;
                state.totalSalesValue = 0;
                state.totalNetSalesValue = 0;
                state.salesReportList = [];
            }
        },
        updatePageNo(state, action) {
            if (action.payload.type === 'update') {
                state.pageNo = action.payload.value;
                state.pageSize = action.payload.pageSize;
            } else if (action.payload.type === 'reset') {
                state.pageNo = 0;
                state.pageSize = 10;
            }
        },
        incrementSearchReportPageNumber(state, action) {
            state.searchPageNo++;
        },
        decrementSearchPageNumber(state, action) {
            const page_no = state.searchPageNo - 1;
            if (page_no < 0) {
                state.searchPageNo = 0;
            } else {
                state.searchPageNo--;
            }
        },
        incrementPageNumber(state, action) {
            state.pageNo++;
        },
        decrementPageNumber(state, action) {
            const page_no = state.pageNo - 1;
            if (page_no < 0) {
                state.pageNo = 0;
            } else {
                state.pageNo--;
            }
        },
        updateMaxEntry(state, action) {
            state.maxEntry = action.payload;
        },
        setIsFilterModalVisible(state, action) {
            state.isFilterModalVisible = action.payload;
        }
    },
});

export const {
    updateTotalCount,
    updateTotalSalesValue,
    updateTotalNetSalesValue,
    updateDateChangeValue,
    updateSalesReportList,
    updatePageNo,
    incrementPageNumber,
    decrementPageNumber,
    updateMaxEntry,
    incrementSearchReportPageNumber,
    decrementSearchPageNumber,
    setIsFilterModalVisible
} = reportSlice.actions;

export default reportSlice.reducer;