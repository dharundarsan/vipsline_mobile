import Colors from "../constants/Colors";

export const dashboardSelection = [
  {
    header: "Sales Dashboard",
    desc: "Dashboard of your business performance",
    icon: require("../assets/icons/dashboard/selection/sales.png"),
    navigate: "SalesScreen",
  },
  {
    header: "Staff Dashboard",
    desc: "Dashboard of your Staff performance",
    icon: require("../assets/icons/dashboard/selection/staff.png"),
    navigate: "StaffScreen",
  },
  {
    header: "Client Dashboard",
    desc: "Dashboard of your client performance",
    icon: require("../assets/icons/dashboard/selection/client.png"),
    navigate: "ClientScreen",
  },
];

export const salesCardData = [
  {
    title: "Total Bill Count",
    icon: require("../assets/icons/dashboard/salesdashboard/totalbillcount.png"),
    color:Colors.lightblue,
  },
  {
    title: "Total Sales Value",
    icon: require("../assets/icons/dashboard/salesdashboard/totalsales.png"),
    color:Colors.lightpurple
  },
  {
    title: "Avg. Bill Value",
    icon: require("../assets/icons/dashboard/salesdashboard/totalbillvalue.png"),
    color:Colors.teal
  },
  {
    title: "Total Expense Value",
    icon: require("../assets/icons/dashboard/salesdashboard/totalexpense.png"),
    color:Colors.neonblue
  },
];

export const listData = [
    {
        title:"Total Appointments",
        icon:require("../assets/icons/dashboard/selection/totalappointments.png")
    },
    {
        title:"Online Sales",
        icon:require("../assets/icons/dashboard/selection/onlinesales.png")
    },
    {
        title:"Cancelled bill count",
        icon:require("../assets/icons/dashboard/selection/cancelbillcount.png")
    },
    {
        title:"Cancelled bill value",
        icon:require("../assets/icons/dashboard/selection/cancelbillvalue.png")
    },
]

export const paymentData = [
    {
        title:'Cash'
    },
    {
        title:'Card'
    },
    {
        title:'Digital'
    },
    {
        title:'Prepaid Redeemed'
    },
]

export const salesData = [
    {
        title:"Services"
    },
    {
        title:"Products"
    },
    {
        title:"Memberships"
    },
    {
        title:"Package"
    },
    {
        title:"Prepaid"
    },
    {
        title:"Custom Item"
    },
]

export const pieChartColorCode = [
  { color: "#357AF6",name:'Service' },
  { color: "#5CC8BE",name:'Product' },
  { color: "#F09436",name:'Custom Item' },
  { color: "#5856D6",name:'Package' },
  { color: "#EA3354",name:'Prepaid' },
  { color: "#AF52DE",name:'Membership' },
  { color: "#36a2eb"},
  { color: "#f09436"},
  { color: "#188038"},
  { color: "#ffd7a3"},
];

export const lifetimeData = [
  {
    title:'Lifetime Unique Clients',
    icon:require("../assets/icons/dashboard/selection/totalappointments.png")
  },
  {
    title:'Lifetime Repeat Clients',
    icon:require("../assets/icons/dashboard/selection/totalappointments.png")
  },
  {
    title:'Unique Clients Till Date',
    icon:require("../assets/icons/dashboard/selection/totalappointments.png")
  },
]

export const clientPieColorCode = [
  { color: "#6950F3"},
  { color: "#EF5DA8"},
  { color: "#EF5DA8"},
  { color: "#BAA3EB"},
  { color: "#E9ECF8"},
]