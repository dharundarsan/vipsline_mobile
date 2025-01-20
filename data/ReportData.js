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
import CommonReportSaleScreen from "../screens/Reports/Sales/CommonReportSaleScreen"
import { fetchCancelledInvoiceReportByBusiness, fetchProductSalesSummaryReport, fetchSalesByMembershipForBusiness, fetchSalesByPackagesForBusiness, fetchSalesByPrepaidForBusiness, fetchSalesByServiceForBusiness, fetchSalesReportByBusiness } from "../store/reportSlice"

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

const salesListHeader = ["DATE", "INVOICE #", "CLIENT", "MOBILE", "NET TOTAL", "TAX AMOUNT", "GROSS TOTAL", "PAYMENT MODE"];
const salesKey = [
    {
        key: "invoice_issued_on",
        sortKey: "invoice_issued_on"
    },
    {
        key: "invoice",
        sortKey: ""
    },
    {
        key: "name",
        sortKey: "name"
    },
    {
        key: "mobile",
        sortKey: ""
    },
    {
        key: "net_total_amount",
        sortKey: ""
    },
    {
        key: "tax_amount",
        sortKey: ""
    },
    {
        key: "net_total",
        sortKey: "net_total"
    },
    {
        key: "payment_mode",
        sortKey: ""
    },
]

const salesListCardTitleData = [
    "Total Bills",
    "Total Net Sales",
    "Total Sales Value"
]

const salesListCardData = ["total_count","net_revenue","total_revenue"]
const salesListInitialCardValue = [{"field": "total_count", "value": 0}, {"field": "net_revenue", "value": "₹ 0"}, {"field": "total_revenue", "value": "₹ 0"}]
const salesCurrencyFields = ['net_revenue', 'total_revenue'];

const salesListHeaderWithSort = salesKey.map((item, index) => ({ ...item, title: salesListHeader[index] }))


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
        key: "serviceName",
        sortKey: "name"
    },
    {
        key: "category",
        sortKey: "category"
    },
    {
        key: "price",
        sortKey: "price"
    },
    {
        key: "service_count",
        sortKey: "service_count"
    },
    {
        key: "discount",
        sortKey: ""
    },
    {
        key: "net_sales",
        sortKey: ""
    },
    {
        key: "tax",
        sortKey: ""
    },
    {
        key: "total_sales",
        sortKey: "total_sales"
    },
]

export const serviceSalesHeaderWithSort = serviceSalesKey.map((item, index) => ({ ...item, title: serviceSalesHeader[index] }));

export const productSalesHeader = [
    "PRODUCT NAME",
    "CATEGORY",
    "PRODUCT COST",
    "QTY SOLD",
    "DISCOUNT",
    "NET TOTAL",
    "TAX",
    "TOTAL SALES"
]

const productSalesKey = [
    {
        key: "name",
        sortKey: "name"
    },
    {
        key: "category",
        sortKey: "category"
    },
    {
        key: "service_cost",
        sortKey: "service_cost"
    },
    {
        key: "service_count",
        sortKey: "service_count"
    },
    {
        key: "discounts",
        sortKey: "discounts"
    },
    {
        key: "net_total",
        sortKey: "net_total"
    },
    {
        key: "tax",
        sortKey: "tax"
    },
    {
        key: "total_sales",
        sortKey: "total_sales"
    },
]

export const productSalesHeaderWithSort = productSalesKey.map((item, index) => ({ ...item, title: productSalesHeader[index] }));
export const membershipSalesHeader = [
    "MEMBERSHIP NAME",
    "CLIENT",
    "MOBILE",
    "STAFF NAME",
    "START DATE",
    "EXPIRY DATE",
    "NET TOTAL",
    "TAX VALUE",
    "GROSS TOTAL"
]

const membershipSalesKey = [
    {
        key: "cm.membership_name",
        sortKey: "cm.membership_name"
    },
    {
        key: "bc.name",
        sortKey: "bc.name"
    },
    {
        key: "bc.mobile_1",
        sortKey: "bc.mobile_1"
    },
    {
        key: "r.name",
        sortKey: "r.name"
    },
    {
        key: "start_date",
        sortKey: "start_date"
    },
    {
        key: "expiry_date",
        sortKey: "expiry_date"
    },
    {
        key: "price",
        sortKey: "price"
    },
    {
        key: "tax_value",
        sortKey: "tax_value"
    },
    {
        key: "cm.membership_price",
        sortKey: "cm.membership_price"
    },
]

export const membershipHeaderWithSort = membershipSalesKey.map((item, index) => ({ ...item, title: membershipSalesHeader[index] }));
const membershipListInitialCardValue = [{"field": "total_membership_count", "value": 0}, {"field": "total_membership_revenue", "value": "₹ 0"}]

export const packageSalesHeader = [
    "PACKAGE NAME",
    "CLIENT",
    "MOBILE",
    "START DATE",
    "EXPIRY DATE",
    "NET TOTAL",
    "TAX VALUE",
    "GROSS TOTAL"
]
const packageSalesKey = [
    {
        key: "cm.package_name",
        sortKey: "cm.package_name"
    },
    {
        key: "bc.name",
        sortKey: "bc.name"
    },
    {
        key: "bc.mobile_1",
        sortKey: "bc.mobile_1"
    },
    {
        key: "valid_from",
        sortKey: "valid_from"
    },
    {
        key: "valid_till",
        sortKey: "valid_till"
    },
    {
        key: "package_price",
        sortKey: "package_price"
    },
    {
        key: "tax_value",
        sortKey: "tax_value"
    },
    {
        key: "total_price",
        sortKey: "total_price"
    },
]

export const packageHeaderWithSort = packageSalesKey.map((item, index) => ({ ...item, title: packageSalesHeader[index] }));
const packageListInitialCardValue = [{"field": "total_package_count", "value": 0}, {"field": "total_package_revenue", "value": "₹ 0"}]
export const prepaidSalesHeader = [
    "DATE",
    "CLIENT",
    "MOBILE",
    "STAFF NAME",
    "AMOUNT PAID",
    "BONUS VALUE",
    "GROSS VALUE",
    "PAYMENT METHOD",
]
const prepaidSalesKey = [
    {
        key: "date",
        sortKey: "date"
    },
    {
        key: "bc.name",
        sortKey: "bc.name"
    },
    {
        key: "wt.mobile",
        sortKey: "wt.mobile"
    },
    {
        key: "r.name",
        sortKey: "r.name"
    },
    {
        key: "wt.amount_paid",
        sortKey: "wt.amount_paid"
    },
    {
        key: "wt.amount_paid",
        sortKey: "wt.amount_paid"
    },
    {
        key: "wt.wallet_value",
        sortKey: "wt.wallet_value"
    },
    {
        key: "wt.payment_mode",
        sortKey: "wt.payment_mode"
    },
]

export const prepaidHeaderWithSort = prepaidSalesKey.map((item, index) => ({ ...item, title: prepaidSalesHeader[index] }));

const prepaidListInitialCardValue = [{"field": "total_prepaid_count", "value": 0}, {"field": "total_prepaid_revenue", "value": "₹ 0"}]
export const cancelledSalesHeader = [
    "INVOICE #",
    "DATE",
    "CLIENT",
    "CANCELLED REASONS",
    "GROSS VALUE"
]
const cancelledSalesKey = [
    {
        key: "SUBSTRING(substring_index(business_invoice_no,'/',1),5)+0",
        sortKey: "SUBSTRING(substring_index(business_invoice_no,'/',1),5)+0"
    },
    {
        key: "updated_at",
        sortKey: "updated_at"
    },
    {
        key: "name",
        sortKey: "name"
    },
    {
        key: "cancel_status",
        sortKey: "cancel_status"
    },
    {
        key: "total_price",
        sortKey: "total_price"
    }
]

export const cancelledHeaderWithSort = cancelledSalesKey.map((item, index) => ({ ...item, title: cancelledSalesHeader[index] }));

const cancelledListInitialCardValue = [{"field": "total_prepaid_count", "value": 0}, {"field": "total_prepaid_revenue", "value": "₹ 0"}]

export const paymentSalesHeader = [
    "INVOICE",
    "DATE",
    "CLIENT",
    "MOBILE",
    "PAYMENT MODE",
    "GROSS VALUE",
]
const paymentSalesKey = [
    {
        key: "SUBSTRING(substring_index(b.business_invoice_no,'/',1),5)+0",
        sortKey: "SUBSTRING(substring_index(b.business_invoice_no,'/',1),5)+0"
    },
    {
        key: "date",
        sortKey: "date"
    },
    {
        key: "bc.name",
        sortKey: "bc.name"
    },
    {
        key: "bc.mobile_1",
        sortKey: "bc.mobile_1"
    },
    {
        key: "spb.mode_of_payment",
        sortKey: "spb.mode_of_payment"
    },
    {
        key: "spb.amount",
        sortKey: "spb.amount"
    },
]

export const paymentHeaderWithSort = paymentSalesKey.map((item, index) => ({ ...item, title: paymentSalesHeader[index] }));

const formatSalesTableData = (dataList) => {
    return dataList.map((item) => [
        item.date,
        item.invoice,
        item.client,
        item.mobile,
        "₹ " + item.net_total.toString(),
        "₹ " + item.gst.toString(),
        "₹ " + item.gross_total.toString(),
        item.payment_mode,
    ])
};

const formatSaleServiceTableData = (dataList) => {
    return dataList.map((item) => [
        item.service,
        item.category,
        item.service_price.toString(),
        item.service_count.toString(),
        "₹ " + item.discounts.toString(),
        "₹ " + item.gross_sales.toString(),
        "₹ " + item.gst.toString(),
        "₹ " + item.total_sales.toString(),
    ])
};

const formatProductServiceTableData = (dataList) => {
    return dataList.map((item) => [
        item.product_name,
        item.category,
        "₹ " + item.product_cost.toString(),
        item.product_bookings.toString(),
        "₹ " + item.discounts.toString(),
        "₹ " + item.net_total.toString(),
        "₹ " + item.gst_price.toString(),
        "₹ " + item.gross_sales.toString(),
    ])
};

const formatMembershipTableData = (dataList) => {
    return dataList.map((item) => [
        item.membership_name,
        item.customer_name,
        item.customer_mobile,
        item.staff_name,
        item.start_date,
        item.expiry_date,
        "₹ " + item.net_total.toString(),
        "₹ " + item.tax_value.toString(),
        "₹ " + item.gross_total.toString(),
    ])
};
const formatPackageTableData = (dataList) => {
    return dataList.map((item) => [
        item.package_name,
        item.customer_name,
        item.customer_mobile,
        item.start_date,
        item.expiry_date,
        "₹ " + item.net_total.toString(),
        "₹ " + item.tax_value.toString(),
        "₹ " + item.gross_total.toString(),
        
    ])
};

const formatPrepaidTableData = (dataList) => {
    return dataList.map((item) => [
        item.date,
        item.name,
        item.mobile,
        item.staff,
        "₹ " + item.amount_paid.toString(),
        "₹ " + item.bonus_value.toString(),
        "₹ " + item.wallet_value.toString(),
        item.payment_mode,
    ])
};

const formatCancelledTableData = (dataList) => {
    return dataList.map((item) => [
        item.business_invoice_no,
        item.date,
        item.name,
        item.cancellation_reason,
        "₹ " + item.gross_value.toString(),
    ])
};

const formatPaymentTableData = (dataList) => {
    return dataList.map((item) => [
        item.business_invoice_no,
        item.date,
        item.name,
        item.mobile,
        item.payment_mode,
        "₹ " + item.gross_value.toString(),
    ])
};

export const formatAndFilterCardData = (cardData, requiredFields, currencyFields) => {
    const formattedData = requiredFields.map((field) => ({
        field,
        value: currencyFields.includes(field) && typeof cardData[field] === "number"
            ? `₹ ${cardData[field]}`
            : cardData[field]
    }));    
    return formattedData
};

export const formatMandatoryFields = (data) => {
    const mandatoryFields = [
        "totalProductCost",
        "totalProductCount",
        "totalDiscounts",
        "totalNetTotal",
        "totalGstPrice",
        "totalGrossSales",
    ];
    const currencyFields = [
        "totalProductCost",
        "totalDiscounts",
        "totalNetTotal",
        "totalGstPrice",
        "totalGrossSales",
    ];
    const fieldOrder = [
        "totalProductCost",
        "totalProductCount",
        "totalDiscounts",
        "totalNetTotal",
        "totalGstPrice",
        "totalGrossSales",
    ]
    const orderedFields = fieldOrder.filter((field) => mandatoryFields.includes(field));

    const formattedValues = orderedFields.map((field) => {
        if (field in data) {
            if (currencyFields.includes(field)) {
                return `₹ ${data[field]}`;
            }
            return data[field];
        }
        return "";
    });

    return ["", "Total", ...formattedValues];
};


const reportSalesSelection = [
    {
        title: "Sales list report",
        component: CommonReportSaleScreen,
        listName: "sales_report_list",
        cardEnabled: true,
        cardTitleData: salesListCardTitleData,
        cardValueList: salesListCardData,
        cardCurrencyList: salesCurrencyFields,
        initialCardValue: salesListInitialCardValue,
        apiFunction: fetchSalesReportByBusiness,
        apiCountName: "total_count",
        salesListWidthHeader: salesListHeader,
        tableHeader: salesListHeaderWithSort,
        transformTableData: formatSalesTableData,
        searchEnabled: true,
        searchPlaceholder: "Search By Invoice Number"
    },
    {
        title: "Service sales",
        component: CommonReportSaleScreen,
        listName: "sales_summary_data",
        cardEnabled: false,
        apiFunction: fetchSalesByServiceForBusiness,
        apiCountName: "total_count",
        salesListWidthHeader: serviceSalesHeader,
        tableHeader: serviceSalesHeaderWithSort,
        transformTableData: formatSaleServiceTableData,
        searchEnabled: true,
        searchPlaceholder: "Search By Service Name"
    },
    {
        title: "Product sales",
        component: CommonReportSaleScreen,
        listName: "product_summary_data",
        cardEnabled: false,
        searchEnabled: true,
        searchPlaceholder: "Search By Product Name",
        apiFunction: fetchProductSalesSummaryReport,
        apiCountName: "total_count",
        salesListWidthHeader: productSalesHeader,
        tableHeader: productSalesHeaderWithSort,
        transformTableData: formatProductServiceTableData,
        additionalRowEnabled: true,
        initialTotalRow: ["","Total","₹ 0","0","₹ 0","₹ 0","₹ 0","₹ 0"]
    },
    {
        title: "Membership sales",
        component: CommonReportSaleScreen,
        listName: "membership_sales_summary",
        cardEnabled: true,
        cardTitleData: ["Total Clients","Total Value"],
        cardValueList: ["total_membership_count","total_membership_revenue"],
        cardCurrencyList: ["total_membership_revenue"],
        initialCardValue: membershipListInitialCardValue,
        searchEnabled: true,
        searchPlaceholder: "Search Membership",
        apiFunction: fetchSalesByMembershipForBusiness,
        apiCountName: "total_count",
        salesListWidthHeader: membershipSalesHeader,
        tableHeader: membershipHeaderWithSort,
        transformTableData: formatMembershipTableData,
    },
    {
        title: "Package sales",
        component: CommonReportSaleScreen,
        listName: "package_sales_summary",
        cardEnabled: true,
        cardTitleData: ["Total Clients","Total Value"],
        cardValueList: ["total_package_count","total_package_revenue"],
        cardCurrencyList: ["total_package_revenue"],
        initialCardValue: packageListInitialCardValue,
        searchEnabled: true,
        searchPlaceholder: "Search Package",
        apiFunction: fetchSalesByPackagesForBusiness,
        apiCountName: "total_count",
        salesListWidthHeader: packageSalesHeader,
        tableHeader: packageHeaderWithSort,
        transformTableData: formatPackageTableData,
    },
    {
        title: "Prepaid sales",
        component: CommonReportSaleScreen,
        listName: "prepaid_sales_summary",
        cardEnabled: true,
        cardTitleData: ["Prepaid Sales Count","Prepaid Sales Value"],
        cardValueList: ["total_prepaid_count","total_prepaid_revenue"],
        cardCurrencyList: ["total_prepaid_revenue"],
        initialCardValue: prepaidListInitialCardValue,
        searchEnabled: true,
        searchPlaceholder: "Search By Client Name / Mobile Number",
        apiFunction: fetchSalesByPrepaidForBusiness,
        apiCountName: "total_count",
        salesListWidthHeader: prepaidSalesHeader,
        tableHeader: prepaidHeaderWithSort,
        transformTableData: formatPrepaidTableData,
    },
    {
        title: "Payment mode reports",
        component: PaymentModeReportScreen,
        listName: "payment_report_summary",
        initialCardValue: prepaidListInitialCardValue,
        salesListWidthHeader: paymentSalesHeader,
        tableHeader: paymentHeaderWithSort,
        transformTableData: formatPaymentTableData,
    },
    {
        title: "cancelled invoice",
        component: CommonReportSaleScreen,
        listName: "invoice_cancelled_summary",
        cardEnabled: true,
        cardTitleData: ["No. of Bills","Total Bill Value"],
        cardValueList: ["total_inv_cancelled_count","total_inv_cancelled_revenue"],
        cardCurrencyList: ["total_inv_cancelled_revenue"],
        initialCardValue: cancelledListInitialCardValue,
        searchEnabled: true,
        searchPlaceholder: "Search By Invoice Number",
        apiFunction: fetchCancelledInvoiceReportByBusiness,
        apiCountName: "total_count",
        salesListWidthHeader: cancelledSalesHeader,
        tableHeader: cancelledHeaderWithSort,
        transformTableData: formatCancelledTableData,
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
export const titleToDisplay = ["SALES","APPOINTMENTS","TAX","STAFF REPORTS","MEMBERSHIP","CLIENT REPORTS","BUSINESS"]
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
