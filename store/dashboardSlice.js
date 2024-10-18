import {
  EXPO_PUBLIC_API_URI,
  EXPO_PUBLIC_BUSINESS_ID,
  EXPO_PUBLIC_AUTH_KEY,
} from "@env";
import { createSlice } from "@reduxjs/toolkit";
import { getStorageKey } from "../config/storage";
import axios from "axios";

const initialDashboardState = {
  expenseValues: {
    totalBillCount: 0,
    totalSalesValue: 0,
    totalExpenseValue: 0,
    avgBillValue: 0,
  },
  dateData: [
    { label: "Today", value: "" },
    { label: "Yesterday", value: "" },
    { label: "Last 7 days", value: "" },
    { label: "Last 30 days", value: "" },
    { label: "This month", value: "" },
    { label: "Custom range", value: "" },
  ],
  listData: {
    totalAppointments: 0,
    onlineSales: 0,
    cancelledBillCount: 0,
    cancelledBillValue: 0,
  },
  paymentModeSummary: [
    {
      mode_of_payment: "CARD",
      net_sales: 0,
    },
    {
      mode_of_payment: "CASH",
      net_sales: 0,
    },
    {
      mode_of_payment: "NIL",
      net_sales: 0,
    },
    {
      mode_of_payment: "DIGITAL PAYMENTS",
      net_sales: 0,
    },
    {
      mode_of_payment: "Prepaid redeemed",
      net_sales: 0,
    },
    {
      mode_of_payment: "Wallet",
      net_sales: 0,
    },
  ],
  totalSalesRevenue: {
    services: 0,
    products: 0,
    memberships: 0,
    package: 0,
    prepaid: 0,
    customItem: 0,
  },
  billItemDetails: [
    {
      series: [0, 0, 0, 0, 0, 0],
      labels: [
        "Services | ₹ 0",
        "Product | ₹ 0",
        "Membership | ₹ 0",
        "Package | ₹ 0",
        "Prepaid | ₹ 0",
        "Custom Item | ₹ 0",
      ],
    },
  ],
  revenueReport6months: [
    {
      revenue: [0],
      month: [""],
      count: [1],
    },
  ],
  topRevenueServiceDetails:[
    {
      label_list:[""],
      services_list:[{percent:0}],
      chart_series:[1]
    }
  ],
  topRevenueProductDetails:[
    {
      label_list:[""],
      services_list:[{percent:0}],
      chart_series:[1]
    }
  ],
  clientStatistics:[
    {
      repeat_clients: 0,
      unique_clients: 0,
      unique_clients_till_date: 0
    }
  ],
  revenueByGender:[{
    label_list:[""],
    chart_series:[1]
  }]
};

export const loadSalesDashboard =
  (fromDate, toDate) => async (dispatch, getState) => {
    const { authDetails } = getState();

    let authToken = "";
    try {
      // const value = await AsyncStorage.getItem('authKey');
      const value = await getStorageKey("authKey");
      if (value !== null) {
        authToken = value;
      }
    } catch (e) {
      console.error(
        "auth token fetching error. (inside dashboardSlice loadSalesDashBoard)" +
          e
      );
    }
    await axios
      .post(
        process.env.EXPO_PUBLIC_API_URI + "/analytics/getSalesDashboardReport",
        {
          business_id: authDetails.businessId,
          // fromDate: "2020-12-01",
          // toDate: "2024-10-16",
          fromDate:fromDate,
          toDate:toDate
        },
        {
          headers: {
            authorization: "Bearer " + authToken,
          },
        }
      )
      .then((response) => {
        // console.log(JSON.stringify(response.data.data[0], null, 3));
        dispatch(updateSalesCard(response.data.data[0]));
        dispatch(updateListData(response.data.data[0]));
        dispatch(updatePaymentMode(response.data.data[0]));
        dispatch(updateTotalSales(response.data.data[0]));
        dispatch(updateBillItems(response.data.data[0]));
        dispatch(updateRevenueReport(response.data.data[0]));
      })
      .catch((error) => {
        console.error("Error Fetching in SalesDashboadReport");
        console.log(error);
      });
  };

export const loadTopRevenueServices = (fromDate, toDate) => async(dispatch, getState) =>{
  const { authDetails } = getState();
  
  let authToken = "";
  try {
    // const value = await AsyncStorage.getItem('authKey');
    const value = await getStorageKey("authKey");
    if (value !== null) {
      authToken = value;
    }
  } catch (e) {
    console.error(
      "auth token fetching error. (inside dashboardSlice loadSalesDashBoard)" +
        e
    );
  }
  await axios
  .post(
    process.env.EXPO_PUBLIC_API_URI + "/analytics/getTopRevenueServicesByBusiness",
    {
      business_id: authDetails.businessId,
      fromDate: fromDate,
      toDate: toDate,
    },
    {
      headers: {
        authorization: "Bearer " + authToken,
      },
    }
  ).then(res => {
    // console.log(res.data.data);
    dispatch(updateTopRevenueService(res.data.data))
  }).catch(err =>{
    console.error("Error Fetching Top Revenue Services");
    console.log(err);
  })
}

export const loadTopRevenueProducts = (fromDate, toDate) => async(dispatch, getState) =>{
  const { authDetails } = getState();
  
  let authToken = "";
  try {
    // const value = await AsyncStorage.getItem('authKey');
    const value = await getStorageKey("authKey");
    if (value !== null) {
      authToken = value;
    }
  } catch (e) {
    console.error(
      "auth token fetching error. (inside dashboardSlice loadSalesDashBoard)" +
        e
    );
  }
  await axios
  .post(
    process.env.EXPO_PUBLIC_API_URI + "/analytics/getTopRevenueProductsByBusiness",
    {
      business_id: authDetails.businessId,
      fromDate: fromDate,
      toDate: toDate,
    },
    {
      headers: {
        authorization: "Bearer " + authToken,
      },
    }
  ).then(res => {
    // console.log(res.data.data);
    dispatch(updateTopRevenueProduct(res.data.data))
  }).catch(err =>{
    console.error("Error Fetching Top Revenue Product");
    console.log(err);
  })
}

export const loadClientStatistics = () => async(dispatch, getState) =>{
  const { authDetails } = getState();
  
  let authToken = "";
  try {
    // const value = await AsyncStorage.getItem('authKey');
    const value = await getStorageKey("authKey");
    if (value !== null) {
      authToken = value;
    }
  } catch (e) {
    console.error(
      "auth token fetching error. (inside dashboardSlice loadSalesDashBoard)" +
        e
    );
  }
  await axios
  .post(
    process.env.EXPO_PUBLIC_API_URI + "/analytics/getClientDashboardReportByBusiness",
    {
      business_id: authDetails.businessId,
    },
    {
      headers: {
        authorization: "Bearer " + authToken,
      },
    }
  ).then(res => {
    dispatch(updateClientStatistics(res.data.data))
  })
}
export const loadRevenueByGender = (fromDate,toDate) => async(dispatch, getState) =>{
  const { authDetails } = getState();
  
  let authToken = "";
  try {
    // const value = await AsyncStorage.getItem('authKey');
    const value = await getStorageKey("authKey");
    if (value !== null) {
      authToken = value;
    }
  } catch (e) {
    console.error(
      "auth token fetching error. (inside dashboardSlice loadSalesDashBoard)" +
        e
    );
  }
  await axios
  .post(
    process.env.EXPO_PUBLIC_API_URI + "/analytics/getClientDashboardRevenueByGender",
    {
      business_id: authDetails.businessId,
      fromDate: fromDate,
      toDate: toDate,
    },
    {
      headers: {
        authorization: "Bearer " + authToken,
      },
    }
  ).then(res => {
    dispatch(updateRevenueByGender(res.data.data))
  })
}

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialDashboardState,
  reducers: {
    updateSalesCard(state, action) {
      state.expenseValues.totalBillCount = action.payload.total_bill_count;
      state.expenseValues.totalSalesValue = action.payload.total_sales_value;
      state.expenseValues.avgBillValue = action.payload.total_expense;
      state.expenseValues.totalExpenseValue = action.payload.avg_bill_value;
    },
    updateListData(state, action) {
      state.listData.totalAppointments = action.payload.total_appointments;
      state.listData.cancelledBillCount = action.payload.cancelled_bill_count;
      state.listData.onlineSales = action.payload.online_sales;
      state.listData.cancelledBillValue = action.payload.cancelled_sales;
    },
    updatePaymentMode(state, action) {
      state.paymentModeSummary = action.payload.payment_mode_summary;
    },
    updateTotalSales(state, action) {
      state.totalSalesRevenue.services =
        action.payload.total_sales_data.totalServicesRevenue;
      state.totalSalesRevenue.products =
        action.payload.total_sales_data.productRevenue;
      state.totalSalesRevenue.customItem =
        action.payload.total_sales_data.customServicesRevenue;
      state.totalSalesRevenue.package =
        action.payload.total_sales_data.packageServicesRevenue;
      state.totalSalesRevenue.prepaid =
        action.payload.total_sales_data.prePaidRevenue;
      state.totalSalesRevenue.memberships =
        action.payload.total_sales_data.memberServicesRevenue;
    },
    updateBillItems(state, action) {
      state.billItemDetails = action.payload.total_sales;
    },
    updateRevenueReport(state,action){
      state.revenueReport6months = action.payload.revenue_report_6_months;
    },
    updateTopRevenueService(state, action) {
      state.topRevenueServiceDetails = action.payload;
    },
    updateTopRevenueProduct(state, action) {
      state.topRevenueProductDetails = action.payload
    },
    updateClientStatistics(state, action) {
      state.clientStatistics = action.payload
    },
    updateRevenueByGender(state, action) {
      state.revenueByGender = action.payload
    }
  },
});

export const {
  updateSalesCard,
  updateListData,
  updatePaymentMode,
  updateTotalSales,
  updateBillItems,
  updateRevenueReport,
  updateTopRevenueService,
  updateTopRevenueProduct,
  updateClientStatistics,
  updateRevenueByGender,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
