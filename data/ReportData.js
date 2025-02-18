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
import ActiveIndividualMembershipReportScreen
    from '../screens/Reports/Membership/ActiveIndividualMembershipReportScreen';
import AboutToExpireReportScreen from '../screens/Reports/Membership/AboutToExpireReportScreen';
import ExpiredMembershipReportScreen from '../screens/Reports/Membership/ExpiredMembershipReportScreen';
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
import {
    fetchAboutToExpireMembershipReport, fetchActiveIndividualMembershipReport,
    fetchActiveMembershipReport,
    fetchAppointmentByServiceReport,
    fetchAppointmentByStaffReport,
    fetchCancelledInvoiceReportByBusiness,
    fetchClientListReport,
    fetchClientServiceListReport,
    fetchClientSourceListReport,
    fetchExpiredMembershipReport,
    fetchFeedbackReport,
    fetchPackageReport,
    fetchPrepaidReport,
    fetchProductSalesSummaryReport,
    fetchRewardPointsReport,
    fetchSalesByApointmentsReport,
    fetchSalesByMembershipForBusiness,
    fetchSalesByPackagesForBusiness,
    fetchSalesByPrepaidForBusiness,
    fetchSalesByServiceForBusiness,
    fetchSalesReportByBusiness,
    fetchStaffSummaryReport,
    fetchStaffWorkHourReport,
    fetchWANotificationReport
} from "../store/reportSlice"
import commonReportSaleScreen from "../screens/Reports/Sales/CommonReportSaleScreen";
import ClientListReportScreen from "../screens/Reports/Client Reports/ClientListReportScreen";
import {useSelector} from "react-redux";
import {useLayoutEffect} from "react";
import {loadLeadStatusesFromDb} from "../store/leadManagementSlice";

const globalState = {staffs: []};

const ReportData = () => {
    const staffs = useSelector((state) => state.staff.staffs)
    useLayoutEffect(() => {
        globalState.staffs = staffs;
    }, []);
}
const PascalCase = (str) =>
    str
        .replace(/(^\w|[\s-_]\w)/g, match => match.replace(/[\s-_]/, '').toUpperCase());
const camelCase = (str) => {
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

const salesListCardData = ["total_count", "net_revenue", "total_revenue"]
const salesListInitialCardValue = [{"field": "total_count", "value": 0}, {
    "field": "net_revenue",
    "value": "₹ 0"
}, {"field": "total_revenue", "value": "₹ 0"}]
const salesCurrencyFields = ['net_revenue', 'total_revenue'];

const salesListHeaderWithSort = salesKey.map((item, index) => ({...item, title: salesListHeader[index]}))


const serviceSalesHeader = [
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

const serviceSalesHeaderWithSort = serviceSalesKey.map((item, index) => ({
    ...item,
    title: serviceSalesHeader[index]
}));

const productSalesHeader = [
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

const productSalesHeaderWithSort = productSalesKey.map((item, index) => ({
    ...item,
    title: productSalesHeader[index]
}));
const membershipSalesHeader = [
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

const membershipHeaderWithSort = membershipSalesKey.map((item, index) => ({
    ...item,
    title: membershipSalesHeader[index]
}));
const membershipListInitialCardValue = [{
    "field": "total_membership_count",
    "value": 0
}, {"field": "total_membership_revenue", "value": "₹ 0"}]

const packageSalesHeader = [
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

const packageHeaderWithSort = packageSalesKey.map((item, index) => ({
    ...item,
    title: packageSalesHeader[index]
}));
const packageListInitialCardValue = [{"field": "total_package_count", "value": 0}, {
    "field": "total_package_revenue",
    "value": "₹ 0"
}]
const prepaidSalesHeader = [
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

const prepaidHeaderWithSort = prepaidSalesKey.map((item, index) => ({
    ...item,
    title: prepaidSalesHeader[index]
}));

const prepaidListInitialCardValue = [{"field": "total_prepaid_count", "value": 0}, {
    "field": "total_prepaid_revenue",
    "value": "₹ 0"
}]
const cancelledSalesHeader = [
    "INVOICE #",
    "DATE",
    "CLIENT",
    "CANCELLED REASONS",
    "GROSS VALUE"
]

const appointmentSalesListHeader = [
    "REF #",
    "CLIENT",
    "MOBILE",
    "SERVICES",
    "CREATED DATE",
    "SCHEDULED DATE",
    "APPT SLOT",
    "DURATION",
    "STAFF",
    "PRICE",
    "STATUS",
    "PAYMENT_STATUS"
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

const cancelledHeaderWithSort = cancelledSalesKey.map((item, index) => ({
    ...item,
    title: cancelledSalesHeader[index]
}));

const appointmentSalesListKey = [
    {
        key: "ref",
        sortKey: "ag.reference",
    },
    {
        key: "client",
        sortKey: "bc.name",
    },
    {
        key: "mobile",
        sortKey: "bc.mobile1",
    },
    {
        key: "service",
        sortKey: "service",
    },
    {
        key: "created_date",
        sortKey: "created_date"
    },
    {
        key: "schedule_date",
        sortKey: "schedule_date"
    },
    {
        key: "appt_slot",
        sortKey: "",
    },
    {
        key: "duration",
        sortKey: "service_time",
    },
    {
        key: "staff",
        sortKey: "r.name",
    },
    {
        key: "price",
        sortKey: "discounted_price"
    },
    {
        key: "status",
        sortKey: "a.status",
    },
    {
        key: "payment_status",
        sortKey: "b.transaction_status"
    }
]

const appointmentSalesListWithSort = appointmentSalesListKey.map((item, index) => ({
    ...item,
    title: appointmentSalesListHeader[index]
}));

const cancelledListInitialCardValue = [
    {"field": "total_prepaid_count", "value": 0},
    {
        "field": "total_prepaid_revenue",
        "value": "₹ 0"
    }]
const salesAppointment = [{"field": "total_prepaid_count", "value": 0}, {
    "field": "total_prepaid_revenue",
    "value": "₹ 0"
}]

const appointmentByServiceListHeader = [
    "SERVICE NAME",
    "CATEGORY",
    "APPOINTMENTS",
    "TOTAL VALUE"
]

const appointmentByServiceListKey = [
    {
        key: "service_name",
        sortKey: "name",
    },
    {
        key: "category",
        sortKey: "category",
    },
    {
        key: "appointments",
        sortKey: "count",
    },
    {
        key: "total_sales",
        sortKey: "total_sales",
    }
]

const appointmentByServiceListWithSort = appointmentByServiceListKey.map((item, index) => ({
    ...item,
    title: appointmentByServiceListHeader[index]
}))

const formatAppointmentByServiceListTableData = (dataList) => {
    return dataList.map((item) => [
        item.resource_category_name,
        item.gender,
        item.total_count,
        "₹ " + item.price.toString(),
    ])
};

const appointmentByStaffListHeader = [
    "STAFF NAME",
    "APPOINTMENTS",
    "TOTAL VALUE"
]

const appointmentByStaffListKey = [
    {
        key: "staff_name",
        sortKey: "staff_name",
    },
    {
        key: "appointments",
        sortKey: "count",
    },
    {
        key: "total_value",
        sortKey: "price",
    }
]

const appointmentByStaffListWithSort = appointmentByStaffListKey.map((item, index) => ({
    ...item,
    title: appointmentByStaffListHeader[index]
}))

const formatAppointmentByStaffListTableData = (dataList) => {
    return dataList.map((item) => [
        item.staff,
        item.count,
        "₹ " + item.price.toString(),
    ])
};

const paymentSalesHeader = [
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

const paymentHeaderWithSort = paymentSalesKey.map((item, index) => ({
    ...item,
    title: paymentSalesHeader[index]
}));

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
        item?.service,
        item?.category,
        item?.service_price?.toString(),
        item?.service_count?.toString(),
        "₹ " + item?.discounts?.toString(),
        "₹ " + item?.gross_sales?.toString(),
        "₹ " + item?.gst?.toString(),
        "₹ " + item?.total_sales?.toString(),
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

const formatAppointmentSalesListTableData = (dataList) => {
    return dataList.map((item) => [
        item.reference,
        item.client_name,
        item.mobile,
        item.service_name,
        item.created_date,
        item.scheduled_date,
        item.appt_slot,
        item.duration,
        item.staff_name,
        "₹ " + item.price.toString(),
        item.appointment_status,
        item.transaction_status,

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

const formatMandatoryFields = (data) => {
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

const formatMandatoryFieldServiceSales = (data) => {
    const salesData = data?.sales_summary_data;
    const totalQty = salesData.reduce((acc, item) => acc + item.count, 0);
    const totalDiscount = salesData.reduce((acc, item) => acc + item.discounts, 0);
    const totalNetSales = salesData.reduce((acc, item) => acc + item.gross_sales, 0);
    const totalTax = salesData.reduce((acc, item) => acc + item.gst, 0);
    const totalSales = salesData.reduce((acc, item) => acc + item.total_sales, 0);
    const mandatoryFields = [
        totalQty,
        totalDiscount,
        totalNetSales,
        totalTax,
        totalSales
    ];
    // const orderedFields = fieldOrder.filter((field) => mandatoryFields.includes(field));

    const formattedValues = mandatoryFields.map((field, index) => {
        if (index !== 0) {
            return `₹ ${field}`;
        }
        return field;
        return "";
    });
    return ["", "", "Total", ...formattedValues];
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
        searchPlaceholder: "Search By Service Name",
        additionalRowEnabled: true,
        initialTotalRow: ["", "", "Total", "0", "₹ 0", "₹ 0", "₹ 0", "₹ 0"],
        formatMandatoryFields: formatMandatoryFieldServiceSales,
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
        initialTotalRow: ["", "Total", "₹ 0", "0", "₹ 0", "₹ 0", "₹ 0", "₹ 0"],
        formatMandatoryFields: formatMandatoryFields,
    },
    {
        title: "Membership sales",
        component: CommonReportSaleScreen,
        listName: "membership_sales_summary",
        cardEnabled: true,
        cardTitleData: ["Total Clients", "Total Value"],
        cardValueList: ["total_membership_count", "total_membership_revenue"],
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
        cardTitleData: ["Total Clients", "Total Value"],
        cardValueList: ["total_package_count", "total_package_revenue"],
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
        cardTitleData: ["Prepaid Sales Count", "Prepaid Sales Value"],
        cardValueList: ["total_prepaid_count", "total_prepaid_revenue"],
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
        cardTitleData: ["No. of Bills", "Total Bill Value"],
        cardValueList: ["total_inv_cancelled_count", "total_inv_cancelled_revenue"],
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
].map((item, index) => ({
    ...item,
    id: index + 1,
    navigation: camelCase(item.title),
    headerTitle: toPascalCase(item.title)
}));

const appointmentStaffSelection = [
    {
        title: "Appointment List",
        component: CommonReportSaleScreen,
        listName: "appointment_sales_summary",
        cardEnabled: true,
        cardTitleData: ["No of Services", "Total Revenue"],
        cardValueList: ["total_appointment_count", "total_appointment_revenue"],
        cardCurrencyList: ["total_appointment_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchSalesByApointmentsReport,
        apiCountName: "total_count",
        salesListWidthHeader: appointmentSalesListHeader,
        tableHeader: appointmentSalesListWithSort,
        transformTableData: formatAppointmentSalesListTableData,
        isFilterEnabled: true,
        filterItems: [
            {
                type: "dropdown",
                label: "Staff",
                apiName: "resource_id",
                useSelectorFunction: (state) => state.staff.staffs,
                mapFunction: (item) => {
                    return {name: item.name, value: item.id}
                },
                appendingFilterItems: [{name: "All Staffs", value: ""}],
                selectedValue: {name: "All Staffs", value: undefined}
            },
            {
                type: "dropdown",
                label: "Status",
                apiName: "status",
                items: [
                    {name: "All Status", value: ""},
                    {name: "Booked", value: "Booked"},
                    {name: "Confirmed", value: "Confirmed"},
                    {name: "In Service", value: "In Service"},
                    {name: "No Show", value: "No Show"},
                    {name: "Cancelled", value: "Cancelled"},
                    {name: "Completed", value: "Completed"},
                ],
                selectedValue: {name: "All Status", value: ""},
                appendingFilterItems: [],
            },
        ]
    },
    {
        title: "Appointment by service",
        component: CommonReportSaleScreen,
        listName: "appt_list",
        cardEnabled: false,
        // cardTitleData: ["No of Services", "Total Revenue"],
        // cardValueList: ["total_appointment_count", "total_appointment_revenue"],
        // cardCurrencyList: ["total_appointment_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchAppointmentByServiceReport,
        apiCountName: "total_count",
        salesListWidthHeader: appointmentByServiceListHeader,
        tableHeader: appointmentByServiceListWithSort,
        transformTableData: formatAppointmentByServiceListTableData,
    },
    {
        title: "Appointment by staff",
        component: CommonReportSaleScreen,
        listName: "staff_appointment_summary",
        cardEnabled: false,
        // cardTitleData: ["No of Services", "Total Revenue"],
        // cardValueList: ["total_appointment_count", "total_appointment_revenue"],
        // cardCurrencyList: ["total_appointment_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchAppointmentByStaffReport,
        apiCountName: "total_staff_appt_count",
        salesListWidthHeader: appointmentByStaffListHeader,
        tableHeader: appointmentByStaffListWithSort,
        transformTableData: formatAppointmentByStaffListTableData,
    }
].map((item, index) => ({
    ...item,
    id: index + 1,
    navigation: camelCase(item.title),
    headerTitle: toPascalCase(item.title)
}));

const taxStaffSelection = [
    {
        title: "Taxes summary reports",
        component: TaxesSummaryReportsReportScreen
    }
].map((item, index) => ({
    ...item,
    id: index + 1,
    navigation: camelCase(item.title),
    headerTitle: toPascalCase(item.title)
}));

const staffSummaryListHeader = [
    "STAFF NAME",
    "DATE",
    "INVOICE #",
    "CATEGORY",
    "ITEMS",
    "NET AMOUNT",
    "DISCOUNT AMOUNT",
    "TAX AMOUNT",
    "PREPAID AMOUNT",
    "GROSS TOTAL"
]

const staffSummaryListKey = [
    {
        key: "staff_name",
        sortKey: "staff_name",
    },
    {
        key: "date",
        sortKey: "date",
    },
    {
        key: "business_invoice_no",
        sortKey: "business_invoice_no",
    },
    {
        key: "category",
        sortKey: "category"
    },
    {
        key: "services",
        sortKey: "services"
    },
    {
        key: "net_amount",
        sortKey: "net_amount"
    },
    {
        key: "discount",
        sortKey: "discount"
    },
    // {
    //     key: "discount",
    //     sortKey: "discount"
    // },
    {
        key: "tax_amount",
        sortKey: ""
    },
    {
        key: "prepaid_amount",
        sortKey: ""
    },
    {
        key: "gross_sales",
        sortKey: "gross_sales"
    },
]

const staffSummaryListWithSort = staffSummaryListKey.map((item, index) => ({
    ...item,
    title: staffSummaryListHeader[index]
}))

const formatStaffSummaryListTableData = (dataList) => {
    return dataList.map((item) => [
        item.staff_name,
        item.appointment_date,
        item.invoice_no,
        item.category,
        item.services,
        item.net_total,
        item.discounts,
        item.tax,
        item.wallet_redeemed,
        item.total_revenue
    ])
};

const staffWorkHourListHeader = [
    "DATE",
    "START TIME",
    "END TIME",
    "DURATION",
]

const staffWorkHourListKey = [
    {
        key: "staff_name",
        sortKey: "",
    },
    {
        key: "date",
        sortKey: "",
    },
    {
        key: "business_invoice_no",
        sortKey: "",
    },
    {
        key: "category",
        sortKey: ""
    },
]

const staffWorkHourListWithSort = staffWorkHourListKey.map((item, index) => ({
    ...item,
    title: staffSummaryListHeader[index]
}))

const formatStaffWorkHourListTableData = (dataList) => {
    return dataList.map((item) => [
        item.date,
        item.start_time,
        item.end_time,
        item.working_hours,
    ])
};

const staffReportSelection = [
    {
        title: "Staff sales summary",
        component: StaffSalesSummaryReportScreen
    },
    {
        title: "Staff summary",
        component: CommonReportSaleScreen,
        listName: "staff_summary_data",
        cardEnabled: true,
        cardTitleData: ["Total Items", "Total Net Value", "Total Value"],
        cardValueList: ["total_staff_summary_count", "net_revenue", "total_revenue"],
        cardCurrencyList: ["net_revenue", "total_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchStaffSummaryReport,
        apiCountName: "total_staff_summary_count",
        salesListWidthHeader: staffSummaryListHeader,
        tableHeader: staffSummaryListWithSort,
        transformTableData: formatStaffSummaryListTableData,
        isFilterEnabled: true,
        filterItems: [
            {
                type: "dropdown",
                label: "Staff",
                apiName: "staffName",
                useSelectorFunction: (state) => state.staff.staffs,
                mapFunction: (item) => {
                    return {name: item.name, value: item.id}
                },
                appendingFilterItems: [{name: "All Staffs", value: "All"}],
                selectedValue: {name: "All Staffs", value: "All"}
            },
            {
                type: "dropdown",
                label: "Category",
                apiName: "category",
                items: [
                    {name: "All Category", value: undefined},
                    {name: "Service", value: "Service"},
                    {name: "Packages", value: "Packages"},
                    {name: "Membership", value: "Membership"},
                    {name: "Prepaid", value: "Prepaid"},
                    {name: "Product", value: "Product"},
                    {name: "Custom Service", value: "custom_service"},
                ],
                selectedValue: {name: "All Category", value: undefined},
                appendingFilterItems: [],
            },
        ]
    },
    {
        title: "Staff working hours",
        component: CommonReportSaleScreen,
        listName: "workingHrs",
        // cardEnabled: true,
        // cardTitleData: ["Total Items", "Total Net Value", "Total Value"],
        // cardValueList: ["total_staff_summary_count", "net_revenue", "total_revenue"],
        // cardCurrencyList: ["net_revenue", "total_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchStaffWorkHourReport,
        apiCountName: "count",
        salesListWidthHeader: staffWorkHourListHeader,
        tableHeader: staffWorkHourListWithSort,
        transformTableData: formatStaffWorkHourListTableData,
        isFilterEnabled: true,
        filterItems: [
            {
                type: "dropdown",
                label: "Staff",
                apiName: "resource_id",
                useSelectorFunction: (state) => state.staff.staffs,
                mapFunction: (item) => {
                    return {name: item.name, value: item.id}
                },
                appendingFilterItems: [],
            },
        ]
    },
    {
        title: "Staff commission",
        component: StaffCommissionReportScreen
    },
].map((item, index) => ({
    ...item,
    id: index + 1,
    navigation: camelCase(item.title),
    headerTitle: toPascalCase(item.title)
}));

const activeMembershipListHeader = [
    "MEMBERSHIP NAME",
    "CLIENT",
    "MOBILE",
    "START DATE",
    "EXPIRY DATE",
    "NO. OF VISITS",
    "PRICE",
    "SOLD BY"
]

const activeMembershipListKey = [
    {
        key: "membership_name",
        sortKey: "cm.membership_name",
    },
    {
        key: "client",
        sortKey: "bc.name",
    },
    {
        key: "mobile",
        sortKey: "",
    },
    {
        key: "start_date",
        sortKey: ""
    },
    {
        key: "expiry_date",
        sortKey: ""
    },
    {
        key: "no_of_visits",
        sortKey: ""
    },
    {
        key: "price",
        sortKey: "cm.membership_price"
    },
    {
        key: "sold_by",
        sortKey: ""
    },
]

const activeMembershipListWithSort = activeMembershipListKey.map((item, index) => ({
    ...item,
    title: activeMembershipListHeader[index]
}))

const formatActiveMembershipListTableData = (dataList) => {
    return dataList.map((item) => [
        item.membership_name,
        item.customer_name,
        item.customer_mobile,
        item.start_date,
        item.expiry_date,
        item.no_of_visits,
        item.total,
        item.staff_name
    ])
};


const aboutToExpireMembershipListHeader = [
    "MEMBERSHIP NAME",
    "CLIENT",
    "MOBILE",
    "START DATE",
    "EXPIRY DATE",
    "NO. OF VISITS",
    "PRICE",
]

const aboutToExpireMembershipListKey = [
    {
        key: "membership_name",
        sortKey: "cm.membership_name",
    },
    {
        key: "client",
        sortKey: "bc.name",
    },
    {
        key: "mobile",
        sortKey: "",
    },
    {
        key: "start_date",
        sortKey: ""
    },
    {
        key: "expiry_date",
        sortKey: ""
    },
    {
        key: "no_of_visits",
        sortKey: ""
    },
    {
        key: "price",
        sortKey: "cm.membership_price"
    },
]

const aboutToExpireMembershipListWithSort = aboutToExpireMembershipListKey.map((item, index) => ({
    ...item,
    title: aboutToExpireMembershipListHeader[index]
}))

const formatAboutToExpireMembershipListTableData = (dataList) => {
    return dataList.map((item) => [
        item.membership_name,
        item.customer_name,
        item.customer_mobile,
        item.start_date,
        item.expiry_date,
        item.no_of_visits,
        item.gross_total,
    ])
};

const expiredMembershipListHeader = [
    "MEMBERSHIP NAME",
    "CLIENT",
    "MOBILE",
    "START DATE",
    "EXPIRY DATE",
    "NO. OF VISITS",
    "PRICE",
]

const expiredMembershipListKey = [
    {
        key: "membership_name",
        sortKey: "cm.membership_name",
    },
    {
        key: "client",
        sortKey: "bc.name",
    },
    {
        key: "mobile",
        sortKey: "",
    },
    {
        key: "start_date",
        sortKey: ""
    },
    {
        key: "expiry_date",
        sortKey: ""
    },
    {
        key: "no_of_visits",
        sortKey: ""
    },
    {
        key: "price",
        sortKey: "cm.membership_price"
    },
]

const expiredMembershipListWithSort = expiredMembershipListKey.map((item, index) => ({
    ...item,
    title: expiredMembershipListHeader[index]
}))

const formatExpiredMembershipListTableData = (dataList) => {
    return dataList.map((item) => [
        item.membership_name,
        item.customer_name,
        item.customer_mobile,
        item.start_date,
        item.expiry_date,
        item.no_of_visits,
        item.gross_total,
    ])
};

const activeIndividualMembershipListHeader = [
    "MEMBERSHIP NAME",
    "CLIENT",
    "MOBILE",
    "START DATE",
    "EXPIRY DATE",
    "NO. OF VISITS",
    "PRICE",
    "SOLD BY"
]

const activeIndividualMembershipListKey = [
    {
        key: "membership_name",
        sortKey: "cm.membership_name",
    },
    {
        key: "client",
        sortKey: "bc.name",
    },
    {
        key: "mobile",
        sortKey: "",
    },
    {
        key: "start_date",
        sortKey: ""
    },
    {
        key: "expiry_date",
        sortKey: ""
    },
    {
        key: "no_of_visits",
        sortKey: ""
    },
    {
        key: "price",
        sortKey: "cm.membership_price"
    },
    {
        key: "sold_by",
        sortKey: ""
    },
]

const activeIndividualMembershipListWithSort = activeIndividualMembershipListKey.map((item, index) => ({
    ...item,
    title: activeIndividualMembershipListHeader[index]
}))

const formatActiveIndividualMembershipListTableData = (dataList) => {
    return dataList.map((item) => [
        item.membership_name,
        item.customer_name,
        item.customer_mobile,
        item.start_date,
        item.expiry_date,
        item.no_of_visits,
        item.gross_total,
        item.staff
    ])
};


const membershipStaffSelection = [
    {
        title: "All active Membership",
        component: CommonReportSaleScreen,
        listName: "activeMembershipData",
        cardEnabled: true,
        cardTitleData: ["Active Membership Count", "New Membership this month", "Membership expired this month"],
        cardValueList: ["total_count", "new_members", "expired_members"],
        // cardCurrencyList: ["net_revenue", "total_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchActiveMembershipReport,
        apiCountName: "total_members",
        salesListWidthHeader: activeMembershipListHeader,
        tableHeader: activeMembershipListWithSort,
        transformTableData: formatActiveMembershipListTableData,
    },
    {
        title: "Active Individual Membership",
        component: CommonReportSaleScreen,
        listName: "activeMembershipData",
        cardEnabled: true,
        cardTitleData: ["Active Membership Count", "New Membership this month", "Membership expired this month"],
        cardValueList: ["total_count", "new_members", "expired_members"],
        cardCurrencyList: [],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchActiveIndividualMembershipReport,
        apiCountName: "total_members",
        salesListWidthHeader: activeIndividualMembershipListHeader,
        tableHeader: activeIndividualMembershipListWithSort,
        transformTableData: formatActiveIndividualMembershipListTableData,
        disableDate: true,
        isFilterEnabled: true,
        filterItems: [
            {
                type: "dropdown",
                label: "Membership",
                apiName: "membership_id",
                useSelectorFunction: (state) => state.catalogue.memberships.items,
                mapFunction: (item) => {
                    return {name: item.name, value: item.id}
                },
                appendingFilterItems: [],
            },
        ]
    },
    {
        title: "About to expire",
        component: CommonReportSaleScreen,
        listName: "duetoExpireMembershipData",
        // cardEnabled: true,
        // cardTitleData: ["Active Membership Count", "New Membership this month", "Membership expired this month"],
        // cardValueList: ["total_count", "new_members", "expired_members"],
        // cardCurrencyList: ["net_revenue", "total_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchAboutToExpireMembershipReport,
        apiCountName: "total_count",
        salesListWidthHeader: aboutToExpireMembershipListHeader,
        tableHeader: aboutToExpireMembershipListWithSort,
        transformTableData: formatAboutToExpireMembershipListTableData,
    },
    {
        title: "Expired Membership",
        component: CommonReportSaleScreen,
        listName: "expiredMembershipData",
        // cardEnabled: true,
        // cardTitleData: ["Active Membership Count", "New Membership this month", "Membership expired this month"],
        // cardValueList: ["total_count", "new_members", "expired_members"],
        // cardCurrencyList: ["net_revenue", "total_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchExpiredMembershipReport,
        apiCountName: "total_count",
        salesListWidthHeader: expiredMembershipListHeader,
        tableHeader: expiredMembershipListWithSort,
        transformTableData: formatExpiredMembershipListTableData,
    },
].map((item, index) => ({
    ...item,
    id: index + 1,
    navigation: camelCase(item.title),
    headerTitle: toPascalCase(item.title)
}));

const ClientServiceListHeader = [
    "CLIENT NAME",
    "MOBILE",
    "VISIT DATE",
    "TIME",
    "BOOKING REF",
    "INVOICE NUMBER",
    "INVOICE ITEMS",
    "VALUES",
    "STATUS",
    "STAFF ASSIGNED"
]

const ClientServiceListKey = [
    {
        key: "client_name",
        sortKey: "",
    },
    {
        key: "mobile",
        sortKey: "",
    },
    {
        key: "appointment_date",
        sortKey: "appointment_date",
    },
    {
        key: "",
        sortKey: "",
    },
    {
        key: "",
        sortKey: "",
    },
    {
        key: "invoice_no",
        sortKey: "invoice_no"
    },
    {
        key: "",
        sortKey: "",
    },
    {
        key: "price",
        sortKey: "price",
    },
    {
        key: "",
        sortKey: "",
    },
    {
        key: "staff_name",
        sortKey: "staff_name",
    },
]

const ClientServiceListWithSort = ClientServiceListKey.map((item, index) => ({
    ...item,
    title: ClientServiceListHeader[index]
}))

const formatClientServiceListTableData = (dataList) => {
    return dataList.map((item) => [
        item.client_name,
        item.mobile,
        item.appointment_date,
        item.start_time,
        item.reference,
        item.invoice_no,
        item.services,
        item.price,
        item.status,
        item.staff_name,
    ])
};

const ClientSourceListHeader = [
    "CLIENT NAME",
    "GENDER",
    "MOBILE NUMBER",
    "SOURCE",
    "TOTAL VISITS",
    "LAST VISIT",
    "TOTAL REVENUE",
]

const ClientSourceListKey = [
    {
        key: "name",
        sortKey: "name",
    },
    {
        key: "gender",
        sortKey: "gender",
    },
    {
        key: "age",
        sortKey: "age",
    },
    {
        key: "client_source",
        sortKey: "client_source",
    },
    {
        key: "total_count",
        sortKey: "total_count",
    },
    {
        key: "last_visit",
        sortKey: "last_visit"
    },
    {
        key: "price",
        sortKey: "price",
    },
]

const ClientSourceListWithSort = ClientSourceListKey.map((item, index) => ({
    ...item,
    title: ClientSourceListHeader[index]
}))

const formatClientSourceListTableData = (dataList) => {
    return dataList.map((item) => [
        item.client_name,
        item.gender,
        item.mobile,
        item.client_source,
        item.booking_count,
        item.last_visit,
        item.total_price,
    ])
};

const ClientListHeader = [
    "CLIENT NAME",
    "GENDER",
    "AGE",
    "MOBILE",
    "EMAIL",
    "ADDED ON",
    "FIRST VISITED",
    "LAST VISITED",
    "TOTAL VISITS",
    "TOTAL SALES",
]

const ClientListKey = [
    {
        key: "name",
        sortKey: "name",
    },
    {
        key: "gender",
        sortKey: "gender",
    },
    {
        key: "age",
        sortKey: "age",
    },
    {
        key: "",
        sortKey: "",
    },
    {
        key: "",
        sortKey: "",
    },
    {
        key: "date",
        sortKey: "date"
    },
    {
        key: "first_visit",
        sortKey: "first_visit",
    },
    {
        key: "last_visit",
        sortKey: "last_visit",
    },
    {
        key: "total_count",
        sortKey: "total_count",
    },
    {
        key: "price",
        sortKey: "price",
    },
]

const ClientListWithSort = ClientListKey.map((item, index) => ({
    ...item,
    title: ClientListHeader[index]
}))

const formatClientListTableData = (dataList) => {
    return dataList.map((item) => [
        item.name,
        item.gender,
        item.age,
        item.mobile,
        item.email,
        item.added_on,
        item.first_visit,
        item.last_visit,
        item.total_count,
        item.total_price,
    ])
};

const clientReportSelection = [
    {
        title: "Client list report",
        component: CommonReportSaleScreen,
        listName: "client_list",
        // cardEnabled: true,
        // cardTitleData: ["Active Membership Count", "New Membership this month", "Membership expired this month"],
        // cardValueList: ["total_count", "new_members", "expired_members"],
        // cardCurrencyList: ["net_revenue", "total_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchClientListReport,
        apiCountName: "no_of_bookings",
        salesListWidthHeader: ClientListHeader,
        tableHeader: ClientListWithSort,
        transformTableData: formatClientListTableData,
        // isFilterEnabled: true,
        // filterItems: [
        //     {
        //         type: "checkboxDropdown",
        //         label: "Type",
        //         items: [
        //             {name: "Male Clients", value: "male", apiName: "filter1", enabled: false},
        //             {name: "Female Clients", value: "female", apiName: "filter2", enabled: false},
        //             {name: "Membership", value: "member", apiName: "filter3", enabled: false},
        //             {name: "Non Membership", value: "non_member", apiName: "filter4", enabled: false},
        //         ],
        //         // appendingFilterItems: [],
        //     },
        // ]

    },
    {
        title: "Client service list",
        component: CommonReportSaleScreen,
        listName: "list_of_clients",
        // cardEnabled: true,
        // cardTitleData: ["Active Membership Count", "New Membership this month", "Membership expired this month"],
        // cardValueList: ["total_count", "new_members", "expired_members"],
        // cardCurrencyList: ["net_revenue", "total_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchClientServiceListReport,
        apiCountName: "noOfServices",
        salesListWidthHeader: ClientServiceListHeader,
        tableHeader: ClientServiceListWithSort,
        transformTableData: formatClientServiceListTableData,
    },
    {
        title: "Client source list",
        component: CommonReportSaleScreen,
        listName: "list_of_clients",
        // cardEnabled: true,
        // cardTitleData: ["Active Membership Count", "New Membership this month", "Membership expired this month"],
        // cardValueList: ["total_count", "new_members", "expired_members"],
        // cardCurrencyList: ["net_revenue", "total_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchClientSourceListReport,
        apiCountName: "noOfServices",
        salesListWidthHeader: ClientSourceListHeader,
        tableHeader: ClientSourceListWithSort,
        transformTableData: formatClientSourceListTableData,
        isFilterEnabled: true,
        filterItems: [
            {
                type: "dropdown",
                label: "Resource",
                apiName: "client_source",
                items: [
                    {name: "All Source", value: "All"},
                    {name: "Justdial", value: "Justdial"},
                    {name: "Google", value: "Google"},
                    {name: "Membership", value: "Membership"},
                    {name: "Facebook", value: "Facebook"},
                    {name: "Instagram", value: "Instagram"},
                    {name: "Walk-in", value: "Walk-in"},
                    {name: "SMS Campaign", value: "SMS Campaign"},
                    {name: "Others", value: "Others"},
                ],
                selectedValue: {name: "All Source", value: "All"},
                appendingFilterItems: [],
            },
        ]
    },
].map((item, index) => ({
    ...item,
    id: index + 1,
    navigation: camelCase(item.title),
    headerTitle: toPascalCase(item.title)
}));

const WANotificationListHeader = [
    "MESSAGE TYPE",
    "TOTAL COUNT",
    "SENT",
    "FAILED",
    "WHATSAPP DEDUCTED"
]

const WANotificationListKey = [
    {
        key: "message_type",
        sortKey: "",
    },
    {
        key: "count",
        sortKey: "",
    },
    {
        key: "sent",
        sortKey: "",
    },
    {
        key: "failed",
        sortKey: "",
    },
    {
        key: "deducted",
        sortKey: ""
    }
]

const WANotificationListWithSort = WANotificationListKey.map((item, index) => ({
    ...item,
    title: WANotificationListHeader[index]
}))

const formatWANotificationListTableData = (dataList) => {
    return dataList.map((item) => [
        item.message_type,
        item.total_count,
        item.success_count,
        item.failure_count,
        item.whatsapp_deducted,
    ])
};

const feedbackListHeader = [
    "CUSTOMER NAME",
    "MOBILE NUMBER",
    "INVOICE NUMBER",
    "RESPONSE DATE",
    "FEEDBACK"
]

const feedbackListKey = [
    {
        key: "customer_name",
        sortKey: "",
    },
    {
        key: "mobile_number",
        sortKey: "",
    },
    {
        key: "invoice",
        sortKey: "",
    },
    {
        key: "response_date",
        sortKey: "",
    },
    {
        key: "feedback",
        sortKey: ""
    }
]

const feedbackListWithSort = feedbackListKey.map((item, index) => ({
    ...item,
    title: feedbackListHeader[index]
}))

const formatfeedbackListTableData = (dataList) => {
    return dataList.map((item) => [
        item.client_name,
        item.contact,
        item.invoice_no,
        item.feedback_date,
        item.feedback,
    ])
};

const rewardPointsListHeader = [
    "CUSTOMER NAME",
    "MOBILE",
    "REWARD POINTS",
]

const rewardPointsListKey = [
    {
        key: "customer_name",
        sortKey: "",
    },
    {
        key: "mobile_number",
        sortKey: "",
    },
    {
        key: "POINTS",
        sortKey: "",
    },
]

const rewardPointsListWithSort = rewardPointsListKey.map((item, index) => ({
    ...item,
    title: rewardPointsListHeader[index]
}))

const formatRewardPointsListTableData = (dataList) => {
    return dataList.map((item) => [
        item.name,
        item.mobile_1,
        item.reward_balance,
    ])
};

const packageListHeader = [
    "PACKAGE NAME",
    "CLIENT",
    "MOBILE",
    "NO OF SITTINGS",
    "AVAILABLE SITTINGS",
    "PUCHASE DATE",
    "EXPIRY DATE",
    "PRICE",
    "STATUS"
]

const packageListKey = [
    {
        key: "package_name",
        sortKey: "name",
    },
    {
        key: "client_name",
        sortKey: "client_name",
    },
    {
        key: "mobile_number",
        sortKey: "",
    },
    {
        key: "mobile",
        sortKey: "",
    },
    {
        key: "No of sittings",
        sortKey: "",
    },
    {
        key: "Available sittings",
        sortKey: "",
    },
    {
        key: "puchase_date",
        sortKey: "valid_from",
    },
    {
        key: "price",
        sortKey: "price",
    },
    {
        key: "status",
        sortKey: "status"
    }
]

const packageListWithSort = packageListKey.map((item, index) => ({
    ...item,
    title: packageListHeader[index]
}))

const formatPackageListTableData = (dataList) => {
    return dataList.map((item) => [
        item.package_name,
        item.client_name,
        item.contact,
        item.total_quantity,
        item.available_quantity,
        item.valid_from,
        item.valid_till,
        item.price,
        item.validity,
    ])
};

const prepaidListHeader = [
    "CREATED DATE",
    "CLIENT",
    "MOBILE",
    "PREPAID BALANCE",
    // "ACTION"
]

const prepaidListKey = [
    {
        key: "created_date",
        sortKey: "date",
    },
    {
        key: "client_name",
        sortKey: "name",
    },
    {
        key: "mobile",
        sortKey: "",
    },
    {
        key: "wallet_balance",
        sortKey: "wallet_balance",
    },
    // {
    //     key: "action",
    //     sortKey: "",
    // },
]

const prepaidListWithSort = prepaidListKey.map((item, index) => ({
    ...item,
    title: prepaidListHeader[index]
}))

const formatPrepaidListTableData = (dataList) => {
    return dataList.map((item) => [
        item.date,
        item.name,
        item.mobile,
        item.wallet_balance,
        item.empty,
    ])
};

const businessStaffSelection = [
    {
        title: "Prepaid",
        component: CommonReportSaleScreen,
        listName: "wallet_balance_summary",
        // cardEnabled: true,
        // cardTitleData: ["Total Items", "Total Net Value", "Total Value"],
        // cardValueList: ["total_staff_summary_count", "net_revenue", "total_revenue"],
        // cardCurrencyList: ["net_revenue", "total_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchPrepaidReport,
        apiCountName: "count",
        salesListWidthHeader: prepaidListHeader,
        tableHeader: prepaidListWithSort,
        transformTableData: formatPrepaidListTableData,
    },
    {
        title: "Packages",
        component: CommonReportSaleScreen,
        listName: "clientPackageSummary",
        // cardEnabled: true,
        // cardTitleData: ["Total Items", "Total Net Value", "Total Value"],
        // cardValueList: ["total_staff_summary_count", "net_revenue", "total_revenue"],
        // cardCurrencyList: ["net_revenue", "total_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchPackageReport,
        apiCountName: "total_count",
        salesListWidthHeader: packageListHeader,
        tableHeader: packageListWithSort,
        transformTableData: formatPackageListTableData,
        isFilterEnabled: true,
        filterItems: [
            {
                type: "dropdown",
                label: "Package Name",
                apiName: "package_id",
                useSelectorFunction: (state) => state.catalogue.packages.items,
                mapFunction: (item) => {
                    return {name: item.name, value: item.id}
                },
                appendingFilterItems: [{name: "All Package", value: -1}],
                selectedValue: {name: "All Package", value: -1}
            },
            {
                type: "dropdown",
                label: "Order by",
                apiName: "status",
                items: [
                    {name: "All", value: ""},
                    {name: "Active", value: "active"},
                    {name: "Expired", value: "expired"},
                    {name: "Cancelled", value: "cancelled"},
                    {name: "Redeemed", value: "redeemed"},
                ],
                appendingFilterItems: [],
            },
        ]
    },
    {
        title: "Reward points",
        component: CommonReportSaleScreen,
        listName: "customerRewardList",
        // cardEnabled: true,
        // cardTitleData: ["Total Items", "Total Net Value", "Total Value"],
        // cardValueList: ["total_staff_summary_count", "net_revenue", "total_revenue"],
        // cardCurrencyList: ["net_revenue", "total_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchRewardPointsReport,
        apiCountName: "count",
        salesListWidthHeader: rewardPointsListHeader,
        tableHeader: rewardPointsListWithSort,
        transformTableData: formatRewardPointsListTableData,
    },
    {
        title: "Notifications",
        component: CommonReportSaleScreen,
        listName: "data",
        // cardEnabled: true,
        // cardTitleData: ["Total Items", "Total Net Value", "Total Value"],
        // cardValueList: ["total_staff_summary_count", "net_revenue", "total_revenue"],
        // cardCurrencyList: ["net_revenue", "total_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchWANotificationReport,
        apiCountName: "count",
        salesListWidthHeader: WANotificationListHeader,
        tableHeader: WANotificationListWithSort,
        transformTableData: formatWANotificationListTableData,
    },
    {
        title: "Feedback",
        component: CommonReportSaleScreen,
        listName: "feedback_list",
        // cardEnabled: true,
        // cardTitleData: ["Total Items", "Total Net Value", "Total Value"],
        // cardValueList: ["total_staff_summary_count", "net_revenue", "total_revenue"],
        // cardCurrencyList: ["net_revenue", "total_revenue"],
        // initialCardValue: cancelledListInitialCardValue,
        searchEnabled: false,
        searchPlaceholder: "",
        apiFunction: fetchFeedbackReport,
        apiCountName: "no_of_feedbacks",
        salesListWidthHeader: feedbackListHeader,
        tableHeader: feedbackListWithSort,
        transformTableData: formatfeedbackListTableData,
    },
].map((item, index) => ({
    ...item,
    id: index + 1,
    navigation: camelCase(item.title),
    headerTitle: toPascalCase(item.title)
}));
export const titleToDisplay = ["SALES", "APPOINTMENTS", "TAX", "STAFF REPORTS", "MEMBERSHIP", "CLIENT REPORTS", "BUSINESS"]

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

const enableRupeeArray = [
    "Total Net Sales",
    "Total Sales Value"
]

const toggleFunctions = [
    "DATE",
    "CLIENT",
    "GROSS TOTAL"
]
