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

// export const pieChartColorCode = [
//   { color: "#357AF6",name:'Service' },
//   { color: "#5CC8BE",name:'Product' },
//   { color: "#F09436",name:'Custom Item' },
//   { color: "#5856D6",name:'Package' },
//   { color: "#EA3354",name:'Prepaid' },
//   { color: "#AF52DE",name:'Membership' },
//   { color: "#36a2eb"},
//   { color: "#f09436"},
//   { color: "#188038"},
//   { color: "#ffd7a3"},
//   { color: "#6950F3",title:"Male"},
//   { color: "#EF5DA8",title:"Female"},
//   { color: "#BAA3EB",title:"Others"},
//   { color: "#E9ECF8",title:"No Data"},
// ];

export const pieChartColorCode = [
  { color: "#357AF6", name: 'Service' },
  { color: "#5CC8BE", name: 'Product' },
  { color: "#F09436", name: 'Custom Item' },
  { color: "#5856D6", name: 'Package' },
  { color: "#EA3354", name: 'Prepaid' },
  { color: "#AF52DE", name: 'Membership' },
  { color: "#36A2EB", name: 'Sky Blue' },
  { color: "#F6C445", name: 'Gold' },
  { color: "#188038", name: 'Green' },
  { color: "#FFD7A3", name: 'Peach' },
  { color: "#6950F3", title: "Male" },
  { color: "#EF5DA8", title: "Female" },
  { color: "#BAA3EB", title: "Others" },
  { color: "#E9ECF8", title: "No Data" },
  
  // Additional colors
  { color: "#FF5733", name: 'Coral Red' },
  { color: "#33FF57", name: 'Lime Green' },
  { color: "#3357FF", name: 'Royal Blue' },
  { color: "#FFC300", name: 'Bright Yellow' },
  { color: "#DAF7A6", name: 'Light Green' },
  { color: "#C70039", name: 'Crimson' },
  { color: "#900C3F", name: 'Dark Red' },
  { color: "#581845", name: 'Eggplant' },
  { color: "#FF33B5", name: 'Hot Pink' },
  { color: "#6A5ACD", name: 'Slate Blue' },
  { color: "#20B2AA", name: 'Light Sea Green' },
  { color: "#FF69B4", name: 'Hot Pink' },
  { color: "#00BFFF", name: 'Deep Sky Blue' },
  { color: "#FF4500", name: 'Orange Red' },
  { color: "#FFD700", name: 'Gold' },
  { color: "#FF1493", name: 'Deep Pink' },
  { color: "#32CD32", name: 'Lime Green' },
  { color: "#ADFF2F", name: 'Green Yellow' },
  { color: "#7B68EE", name: 'Medium Slate Blue' },
  { color: "#FF8C00", name: 'Dark Orange' },
  { color: "#DDA0DD", name: 'Plum' },
  
  // More unique colors
  { color: "#FF6347", name: 'Tomato' },
  { color: "#40E0D0", name: 'Turquoise' },
  { color: "#B22222", name: 'Firebrick' },
  { color: "#FFDAB9", name: 'Peach Puff' },
  { color: "#F0E68C", name: 'Khaki' },
  { color: "#E6E6FA", name: 'Lavender' },
  { color: "#FFF0F5", name: 'Lavender Blush' },
  { color: "#FA8072", name: 'Light Salmon' },
  { color: "#FFB6C1", name: 'Light Pink' },
  { color: "#B0E0E6", name: 'Powder Blue' },
  { color: "#E6E6FA", name: 'Lavender' },
  { color: "#FFB000", name: 'Yellow Orange' },
  { color: "#3CB371", name: 'Medium Sea Green' },
  { color: "#FF5E5E", name: 'Light Coral' },
  { color: "#9ACD32", name: 'Yellow Green' },
  { color: "#7FFF00", name: 'Chartreuse' },
  { color: "#D2691E", name: 'Chocolate' },
  { color: "#B0C4DE", name: 'Light Steel Blue' },
  { color: "#E0FFFF", name: 'Light Cyan' },
  { color: "#FFDEAD", name: 'Navajo White' },
  { color: "#FFE4E1", name: 'Misty Rose' },
  { color: "#FFF5EE", name: 'Seashell' },
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
  { color: "#6950F3",title:"Male"},
  { color: "#EF5DA8",title:"Female"},
  { color: "#BAA3EB",title:"Others"},
  { color: "#999999",title:"No Data"},
]

export const prepaidNonPrepaidColorCode = [
  { color: "#357AF6",title:"Prepaid"},
  { color: "#AF52DE",title:"Non Prepaid"},
  { color: "#BAA3EB",title:"Others"},
  { color: "#999999",title:"No Data"},
]

export const trophyIcon = [
  {
    icon:require("../assets/icons/dashboard/staffdashboard/first.png"),
  },
  {
    icon:require("../assets/icons/dashboard/staffdashboard/second.png"),
  },
  {
    icon:require("../assets/icons/dashboard/staffdashboard/third.png"),
  },
]

export const staffDetails = [
  { name: 'Services', key: 'service' },
  { name: 'Products', key: 'product' },
  { name: 'Memberships', key: 'membership' },
  { name: 'Package', key: 'package_service_value' },
  { name: 'Prepaid', key: 'prepaid' },
  { name: 'Custom Item', key: 'custom_item' },
  { name: 'Average Value', key: 'avg_bill_value' },
  { name : 'Total', key: 'total_value'}
];
