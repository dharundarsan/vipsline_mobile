import salesIcon from "../assets/icons/reportIcons/sales.png"
import appointmentIcon from "../assets/icons/reportIcons/appointments.png"
import taxIcon from "../assets/icons/reportIcons/tax.png"
import staffReportIcon from "../assets/icons/reportIcons/staffReports.png"
import membershipIcon from "../assets/icons/reportIcons/membership.png"
import clientReportIcon from "../assets/icons/reportIcons/clientReports.png"
import businessIcon from "../assets/icons/reportIcons/business.png"

// export const toPascalCase = (str) => 
//     str
//         .replace(/(^\w|[\s-_]\w)/g, match => match.replace(/[\s-_]/, '').toUpperCase());

const toPascalCase = (str) => 
    str.replace(/(^\w|\s\w)/g, match => match.toUpperCase());

const reportSalesSelection = [
    {
        title:"Sales list report"
    },
    {
        title:"Service sales"
    },
    {
        title:"Product sales"
    },
    {
        title:"Membership sales"
    },
    {
        title:"Package sales"
    },
    {
        title:"Prepaid sales"
    },
    {
        title:"Payment mode reports"
    },
    {
        title:"cancelled invoice"
    }
].map((item,index) => ({...item,id:index + 1,navigation:toPascalCase(item.title)}));

const appointmentStaffSelection = [
    {
        title:"Appointment list"
    },
    {
        title:"Appointment by service"
    },
    {
        title:"Appointment by staff"
    }
].map((item,index) => ({...item,id:index + 1,navigation:toPascalCase(item.title)}));

const taxStaffSelection = [
    {
        title:"Taxes summary reports"
    }
].map((item,index)=>({...item,id:index+1,navigation:toPascalCase(item.title)}));

const staffReportSelection = [
    {
        title:"Staff sales summary"
    },
    {
        title:"Staff summary"
    },
    {
        title:"Staff working hours"
    },
    {
        title:"Staff commission"
    },
].map((item,index)=>({...item,id:index+1,navigation:toPascalCase(item.title)}));

const membershipStaffSelection = [
    {
        title:"All active Membership"
    },
    {
        title:"Active Individual Membership"
    },
    {
        title:"About to expire"
    },
    {
        title:"Expired Membership"
    },
].map((item,index)=>({...item,id:index+1,navigation:toPascalCase(item.title)}));

const clientReportSelection = [
    {
        title:"Client list report"
    },
    {
        title:"Client service list"
    },
    {
        title:"Client source list"
    },
].map((item,index)=>({...item,id:index+1,navigation:toPascalCase(item.title)}));

const businessStaffSelection = [
    {
        title:"Prepaid",
    },
    {
        title:"Packages",
    },
    {
        title:"Reward points",
    },
    {
        title:"Notifications",
    },
    {
        title:"Feedback",
    },
].map((item,index)=>({...item,id:index+1,navigation:toPascalCase(item.title)}));

export const staffStackDisplay = [
    {
        icon:salesIcon,
        title:"SALES",
        data:reportSalesSelection
    },
    {
        icon:appointmentIcon,
        title:"APPOINTMENTS",
        data:appointmentStaffSelection
    },
    {
        icon:taxIcon,
        title:"TAX",
        data:taxStaffSelection
    },
    {
        icon:staffReportIcon,
        title:"STAFF REPORTS",
        data:staffReportSelection
    },
    {
        icon:membershipIcon,
        title:"MEMBERSHIP",
        data:membershipStaffSelection
    },
    {
        icon:clientReportIcon,
        title:"CLIENT REPORTS",
        data:clientReportSelection
    },
    {
        icon:businessIcon,
        title:"BUSINESS",
        data:businessStaffSelection
    },
]

export const cardTitleData = [
    {
        title:"Total Bills"
    },
    {
        title:"Total Net Sales"
    },
    {
        title:"Total Sales Value"
    },
]