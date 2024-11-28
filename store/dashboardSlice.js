import {
  EXPO_PUBLIC_API_URI,
  EXPO_PUBLIC_BUSINESS_ID,
  EXPO_PUBLIC_AUTH_KEY,
} from "@env";
import { createSlice } from "@reduxjs/toolkit";
import { getStorageKey } from "../config/storage";
import axios from "axios";

const initialDashboardState = {
  dashboardName:"",
  isLoading:false,
  expenseValues: {
    totalBillCount: 0,
    totalSalesValue: 0,
    totalExpenseValue: 0,
    avgBillValue: 0,
  },
  dateData: [
    { label: "Today", value: "today",day:0 },
    { label: "Yesterday", value: "yesterday",day:-1 },
    { label: "Last 7 days", value: "last7days",day:-6 },
    { label: "Last 30 days", value: "last30days",day:-29 },
    { label: "Current month", value: "Current month",day1:0,day2:0},
    { label: "Custom range", value: "Custom Range",day1: 0,day2: 0 },
  ],
  toggleDateData: [
    { label: "Current month", value: "thismonth" },
    { label: "Today", value: "today",day:0 },
    { label: "Yesterday", value: "yesterday",day:-1 },
    { label: "Last 7 days", value: "last7days",day:-6 },
    { label: "Last 30 days", value: "last30days",day:-29 },
    { label: "Custom range", value: "Custom range" },
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
  }],
  revenueCountByGender:[{
    label_list:[""],
    chart_series:[1]
  }],
  revenueCountByPrepaid:[{
    label_list:[""],
    chart_series:[1]
  }],
  accountResourceId:"",
  staffPieChartData:{
    label_list:[""],
    chart_series:[1]
  },
  top_performer_report:[{
    total_value:1,
    name:""
  }],
  staff_sales_report:[
    {
      "item_count": 0,
      "total_value": 0,
      "package_service_value": 0,
      "product": 0,
      "service": 0,
      "name": "",
      "custom_item": 0,
      "prepaid": 0,
      "membership": 0,
      "avg_bill_value": 0,
      "packages": 0,
      "customer_count": 0
    }
  ],
  totalSalesOverTime:{
    date:[""],
    duration:"",
    count:[1]
  },
  totalAppointmentOverTime:{
    date:[""],
    duration:"",
    count:[1]
  },
  lineChartData:[
    { label: "Current month", value: "currentmonth" },
    { label: "Last 7 days", value: "last7days" },
    { label: "Last 30 days", value: "last30days" },
    { label: "Last 3 months", value: "last3months" },
    { label: "Last 6 months", value: "last6months" },
    { label: "Last 1 year", value: "last1year" },
    { label: "Current year", value: "thisyear" },
    { label: "Past year", value: "previousyear" },
  ],
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
    try{
      dispatch(updateTopRevenueService(res.data.data))
    }
    catch(e){
      // console.log("222");
      console.log(e);
    }
    
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
    if(res.data.data[0]?.label_list.length > 0){
      dispatch(updateRevenueByGender(res.data.data))
    }
    else{
      dispatch(updateRevenueByGender([{
        label_list:[""],
        chart_series:[1]
      }]))
    }
  }).catch(err => {
    console.error("Error Fetching loadrevenuebygender");
    console.log(err);
    
  })
}
export const loadRevenueCountByGender = (fromDate,toDate) => async(dispatch, getState) =>{
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
    process.env.EXPO_PUBLIC_API_URI + "/analytics/getClientDashboardCountByGender",
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
    if(res.data.data[0]?.label_list.length > 0){
      dispatch(updateRevenueCountByGender(res.data.data))
    }
    else {
      dispatch(updateRevenueCountByGender([{
        label_list:[""],
        chart_series:[1]
      }]))
    }
  }).catch(err => {
    console.error("Error Fetching loadRevenueCountByGender");
    console.log(err);
  })
}
export const loadRevenueByPrepaid = (fromDate,toDate) => async(dispatch, getState) =>{
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
    process.env.EXPO_PUBLIC_API_URI + "/analytics/getClientDashboardPrepaidRevenue",
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
    if(res.data.data[0]?.label_list.length > 0){
      dispatch(updateRevenueByPrepaid(res.data.data))
    }else{
      dispatch(updateRevenueByPrepaid([{
        label_list:[""],
        chart_series:[1]
      }]))
    }

  }).catch(err => {
    console.error("Error Fetching loadRevenueByPrepaid");
    console.log(err);
  })
}

export const loadResourceIdByUserInfo = (username) => async(dispatch, getState) =>{
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
    process.env.EXPO_PUBLIC_API_URI + "/user/getResourceIdByUserInfo",
    {
      username: username,
    },
    {
      headers: {
        authorization: "Bearer " + authToken,
      },
    }
  ).then(res => {
    // console.log(res.data.other_message);
    dispatch(updateResourceId(res.data.other_message))
  }).catch(err => {
    console.error("Error Fetching loadRevenueCountByGender");
    console.log(err);
  })
}
export const loadAllowedPage = (username) => async(dispatch, getState) =>{
  const { authDetails,dashboardDetails } = getState();
  
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
    process.env.EXPO_PUBLIC_API_URI + "/resource/getAllowedPagesForStaff",
    {
      business_id: authDetails.businessId,
      resource_id: dashboardDetails.accountResourceId,
    },
    {
      headers: {
        authorization: "Bearer " + authToken,
      },
    }
  ).then(res => {
    // console.log(res.data.other_message);
    dispatch(updateResourceId(res.data.other_message))
  }).catch(err => {
    console.error("Error Fetching loadRevenueCountByGender");
    console.log(err);
  })
}

export const loadStaffDashboardReport = (fromDate,toDate) => async(dispatch, getState) =>{
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
    process.env.EXPO_PUBLIC_API_URI + "/analytics/getStaffDashboardReportByBusiness",
    {
      business_id: authDetails.businessId,
      // fromDate:'2024-10-01',
      // toDate:'2024-10-31'
      fromDate:fromDate,
      toDate:toDate
    },
    {
      headers: {
        authorization: "Bearer " + authToken,
      },
    }
  ).then(res => {
    // console.log(res.data.data[0]);
    dispatch(updateStaffPieChart(res.data.data[0].pie_chart_data));
    dispatch(updateTopPerformer(res.data.data[0].top_performer_report));
    dispatch(updateSalesReport(res.data.data[0].staff_sales_report))
  }).catch(err => {
    console.error("Error Fetching loadRevenueCountByGender");
    console.log(err);
  })
}
export const loadDailyAppointmentAnalyticsForBusiness = (isCount,date) => async(dispatch, getState) =>{
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
    process.env.EXPO_PUBLIC_API_URI + "/analytics/getDailyAppointmentAnalyticsForBusiness",
    {
      business_id: authDetails.businessId,
      // fromDate:'2024-10-01',
      // toDate:'2024-10-31'
      isCount:isCount,
      period:date
    },
    {
      headers: {
        authorization: "Bearer " + authToken,
      },
    }
  ).then(res => {
    // console.log(res.data.data[0]);
    if(isCount){
      dispatch(updateTotalAppointmentOverTime(res.data.data[0]))
    }
    else{
      dispatch(updateTotalSalesOverTime(res.data.data[0]));
    }
  }).catch(err => {
    console.error("Error Fetching loadDailyAppointmentAnalyticsForBusiness");
    console.log(err);
  })
}

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialDashboardState,
  reducers: {
    updateDashBoardName(state,action){
      state.dashboardName = action.payload;
    },
    updateLoadingState(state, action) {
      state.isLoading = action.payload
    },
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
    },
    updateRevenueCountByGender(state, action) {
      state.revenueCountByGender = action.payload;
    },
    updateRevenueByPrepaid(state, action) {
      state.revenueCountByPrepaid = action.payload
    },
    updateResourceId(state, action) {
      state.accountResourceId = action.payload
    },
    updateStaffPieChart(state, action) {
      state.staffPieChartData = action.payload
    },
    updateTopPerformer(state, action) {
      state.top_performer_report = action.payload
    },
    updateSalesReport(state, action) {
      state.staff_sales_report = action.payload
    },
    updateDate(state,action) {
      if(action.payload.data !== undefined){
        state.dateData[action.payload.type].value = action.payload.data.toString();
      }
      else{
        state.dateData[action.payload.type].day1 = action.payload.day1;
        state.dateData[action.payload.type].day2 = action.payload.day2;
      }
    },
    updateLabelDate(state,action) {
      state.toggleDateData[action.payload.type].value = action.payload.data.toString();
    },
    updateTotalSalesOverTime(state,action) {
      state.totalSalesOverTime = action.payload;
    },
    updateTotalAppointmentOverTime(state,action) {
      state.totalAppointmentOverTime = action.payload;
    },
  },
});

export const {
  updateDashBoardName,
  updateLoadingState,
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
  updateRevenueCountByGender,
  updateRevenueByPrepaid,
  updateResourceId,
  updateStaffPieChart,
  updateTopPerformer,
  updateSalesReport,
  updateDate,
  updateLabelDate,
  updateTotalSalesOverTime,
  updateTotalAppointmentOverTime
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
