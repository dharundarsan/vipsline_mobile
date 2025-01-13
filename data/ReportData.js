import salesIcon from "../assets/icons/reportIcons/sales.png"
import appointmentIcon from "../assets/icons/reportIcons/appointments.png"
import taxIcon from "../assets/icons/reportIcons/tax.png"
import staffReportIcon from "../assets/icons/reportIcons/staffReports.png"
import membershipIcon from "../assets/icons/reportIcons/membership.png"
import clientReportIcon from "../assets/icons/reportIcons/clientReports.png"
import businessIcon from "../assets/icons/reportIcons/business.png"
import ServiceSalesReportScreen from '../screens/Reports/Sales/ServiceSalesReportScreen';
import ProductSalesReportScreen from '../screens/Reports/Sales/ProductSalesReportScreen';
import MembershipSalesReportScreen from '../screens/Reports/Sales/MembershipSalesReportScreen';
import PackageSalesReportScreen from '../screens/Reports/Sales/PackageSalesReportScreen';
import PaymentModeReportScreen from '../screens/Reports/Sales/PaymentModeReportScreen';
import CancelledInvoiceReportScreen from '../screens/Reports/Sales/CancelledInvoiceReportScreen';
import AppointmentListReportScreen from '../screens/Reports/Appointments/AppointmentListReportScreen';
import AppointmentByServiceReportScreen from '../screens/Reports/Appointments/AppointmentByServiceReportScreen';
import AppointmentByStaffReportScreen from '../screens/Reports/Appointments/AppointmentByStaffReportScreen';
import TaxesSummaryReportsReportScreen from '../screens/Reports/Tax/TaxesSummaryReportsReportScreen';
import StaffSalesSummaryReportScreen from '../screens/Reports/Staff Reports/StaffSalesSummaryReportScreen';
import StaffSummaryReportScreen from '../screens/Reports/Staff Reports/StaffSummaryReportScreen';
import StaffWorkingHoursReportScreen from '../screens/Reports/Staff Reports/StaffWorkingHoursReportScreen';
import StaffCommissionReportScreen from '../screens/Reports/Staff Reports/StaffCommissionReportScreen';
import AllActiveMembershipReportScreen from '../screens/Reports/Membership/AllActiveMembershipReportScreen';
import ActiveIndividualMembershipReportScreen from '../screens/Reports/Membership/ActiveIndividualMembershipReportScreen';
import AboutToExpireReportScreen from '../screens/Reports/Membership/AboutToExpireReportScreen';
import ExpiredMembershipReportScreen from '../screens/Reports/Membership/ExpiredMembershipReportScreen';
import ClientListReportReportScreen from '../screens/Reports/Client Reports/ClientListReportReportScreen';
import ClientServiceListReportScreen from '../screens/Reports/Client Reports/ClientServiceListReportScreen';
import ClientSourceListReportScreen from '../screens/Reports/Client Reports/ClientSourceListReportScreen';
import PrepaidReportScreen from '../screens/Reports/Business/PrepaidReportScreen';
import PackagesReportScreen from '../screens/Reports/Business/PackagesReportScreen';
import RewardPointsReportScreen from '../screens/Reports/Business/RewardPointsReportScreen';
import NotificationsReportScreen from '../screens/Reports/Business/NotificationsReportScreen';
import FeedbackReportScreen from '../screens/Reports/Business/FeedbackReportScreen';
import PrepaidSalesReportScreen from "../screens/Reports/Sales/PrepaidSalesReportScreen"
import SalesListReportScreen from "../screens/Reports/Sales/SalesListReportScreen"

export const PascalCase = (str) =>
    str
        .replace(/(^\w|[\s-_]\w)/g, match => match.replace(/[\s-_]/, '').toUpperCase());
export const camelCase = (str) => {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
};
const toPascalCase = (str) =>
    str.replace(/(^\w|\s\w)/g, match => match.toUpperCase());

const reportSalesSelection = [
    {
        title: "Sales list report",
        component: SalesListReportScreen,
    },
    {
        title: "Service sales",
        component: ServiceSalesReportScreen
    },
    {
        title: "Product sales",
        component: ProductSalesReportScreen
    },
    {
        title: "Membership sales",
        component: MembershipSalesReportScreen
    },
    {
        title: "Package sales",
        component: PackageSalesReportScreen
    },
    {
        title: "Prepaid sales",
        component: PrepaidSalesReportScreen
    },
    {
        title: "Payment mode reports",
        component: PaymentModeReportScreen
    },
    {
        title: "cancelled invoice",
        component: CancelledInvoiceReportScreen
    }
].map((item, index) => ({ ...item, id: index + 1, navigation: camelCase(item.title), headerTitle: toPascalCase(item.title) }));

const appointmentStaffSelection = [
    {
        title: "Appointment list",
        component: AppointmentListReportScreen
    },
    {
        title: "Appointment by service",
        component: AppointmentByServiceReportScreen
    },
    {
        title: "Appointment by staff",
        component: AppointmentByStaffReportScreen
    }
].map((item, index) => ({ ...item, id: index + 1, navigation: camelCase(item.title), headerTitle: toPascalCase(item.title) }));

const taxStaffSelection = [
    {
        title: "Taxes summary reports",
        component: TaxesSummaryReportsReportScreen
    }
].map((item, index) => ({ ...item, id: index + 1, navigation: camelCase(item.title), headerTitle: toPascalCase(item.title) }));

const staffReportSelection = [
    {
        title: "Staff sales summary",
        component: StaffSalesSummaryReportScreen
    },
    {
        title: "Staff summary",
        component: StaffSummaryReportScreen
    },
    {
        title: "Staff working hours",
        component: StaffWorkingHoursReportScreen
    },
    {
        title: "Staff commission",
        component: StaffCommissionReportScreen
    },
].map((item, index) => ({ ...item, id: index + 1, navigation: camelCase(item.title), headerTitle: toPascalCase(item.title) }));

const membershipStaffSelection = [
    {
        title: "All active Membership",
        component: AllActiveMembershipReportScreen
    },
    {
        title: "Active Individual Membership",
        component: ActiveIndividualMembershipReportScreen
    },
    {
        title: "About to expire",
        component: AboutToExpireReportScreen
    },
    {
        title: "Expired Membership",
        component: ExpiredMembershipReportScreen
    },
].map((item, index) => ({ ...item, id: index + 1, navigation: camelCase(item.title), headerTitle: toPascalCase(item.title) }));

const clientReportSelection = [
    {
        title: "Client list report",
        component: ClientListReportReportScreen
    },
    {
        title: "Client service list",
        component: ClientServiceListReportScreen
    },
    {
        title: "Client source list",
        component: ClientSourceListReportScreen
    },
].map((item, index) => ({ ...item, id: index + 1, navigation: camelCase(item.title), headerTitle: toPascalCase(item.title) }));

const businessStaffSelection = [
    {
        title: "Prepaid",
        component: PrepaidReportScreen
    },
    {
        title: "Packages",
        component: PackagesReportScreen
    },
    {
        title: "Reward points",
        component: RewardPointsReportScreen
    },
    {
        title: "Notifications",
        component: NotificationsReportScreen
    },
    {
        title: "Feedback",
        component: FeedbackReportScreen
    },
].map((item, index) => ({ ...item, id: index + 1, navigation: camelCase(item.title), headerTitle: toPascalCase(item.title) }));

export const reportStackDisplay = [
    {
        icon: salesIcon,
        title: "SALES",
        data: reportSalesSelection
    },
    {
        icon: appointmentIcon,
        title: "APPOINTMENTS",
        data: appointmentStaffSelection
    },
    {
        icon: taxIcon,
        title: "TAX",
        data: taxStaffSelection
    },
    {
        icon: staffReportIcon,
        title: "STAFF REPORTS",
        data: staffReportSelection
    },
    {
        icon: membershipIcon,
        title: "MEMBERSHIP",
        data: membershipStaffSelection
    },
    {
        icon: clientReportIcon,
        title: "CLIENT REPORTS",
        data: clientReportSelection
    },
    {
        icon: businessIcon,
        title: "BUSINESS",
        data: businessStaffSelection
    },
]

export const cardTitleData = [
    {
        title: "Total Bills"
    },
    {
        title: "Total Net Sales"
    },
    {
        title: "Total Sales Value"
    },
]

export const enableRupeeArray = [
    "Total Net Sales",
    "Total Sales Value"
]

export const toggleFunctions = [
    "DATE",
    "CLIENT",
    "GROSS TOTAL"
]

export const serviceSalesHeader = [
    "SERVICE NAME",
    "CATEGORY",
    "SERVICE COST",
    "QTY SOLD",
    "DISCOUNT",
    "NET SALES",
    "TAX",
    "TOTAL SALES"
]

const serviceSalesKey = [
    {
        key:"serviceName",
        sortKey:"name"
    },
    {
        key:"category",
        sortKey:"category"
    },
    {
        key:"price",
        sortKey:"price"
    },
    {
        key:"service_count",
        sortKey:"service_count"
    },
    {
        key:"discount",
        sortKey:""
    },
    {
        key:"net_sales",
        sortKey:""
    },
    {
        key:"tax",
        sortKey:""
    },
    {
        key:"total_sales",
        sortKey:"nametotal_sales"
    },
]

export const serviceSalesHeaderWithSort=serviceSalesKey.map((item,index)=>({...item,title:serviceSalesHeader[index]}));
