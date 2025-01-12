import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDateDDMMYYYY, formatDateYYYYMMDD, formatDateYYYYMMDDD, getFirstAndLastDateOfCurrentMonthDDMMYYYY, getFirstDateOfCurrentMonthYYYYMMDD, getLastDateOfCurrentMonthYYYYMMMDD } from '../util/Helpers';
import { fetchSalesReportByBusiness, updateDateChangeValue, updateSalesReportList } from '../store/reportSlice';

const useDateRange = ({
    query = '',
    sortName = 'desc',
    getSortOrderKey = 1,
}) => {
    const [isCustomRange, setIsCustomRange] = useState(false);
    const [selectedFromCustomDate, setSelectedFromCustomDate] = useState("0");
    const [selectedToCustomDate, setSelectedToCustomDate] = useState("0");
    const [customFromPassData, setCustomFromPassData] = useState(formatDateYYYYMMDD(0));
    const [customToPassData, setCustomToPassData] = useState(formatDateYYYYMMDD(0));
    const [date, setDate] = useState(formatDateDDMMYYYY().toString());
    const [selectedValue, setSelectedValue] = useState("today");
    const [isLoading, setIsLoading] = useState(false);
    const [isDateDataLoading, setIsDateDataLoading] = useState(false);
    const [currentFromDate, setCurrentFromDate] = useState(formatDateYYYYMMDD(0));
    const [currentToDate, setCurrentToDate] = useState(formatDateYYYYMMDD(0));
    const dateData = useSelector((state) => state.dashboardDetails.dateData);

    const { firstDateDDMMYYYY, lastDateDDMMYYYY } = getFirstAndLastDateOfCurrentMonthDDMMYYYY();
    const firstMonthDate = getFirstDateOfCurrentMonthYYYYMMDD();
    const lastMonthDate = getLastDateOfCurrentMonthYYYYMMMDD();

    const dispatch = useDispatch();

    const handleSelection = async (item) => {
        setIsDateDataLoading(true);
        setSelectedValue(item.value);
        if (item.day1 === undefined) {
            setIsCustomRange(false);
            if (item.value !== "Current month" && item.value !== "Custom range") {
                setDate(
                    item.day !== -6 && item.day !== -29
                        ? formatDateDDMMYYYY(item.day)
                        : formatDateDDMMYYYY(item.day) + " - " + formatDateDDMMYYYY(0)
                );
                const fromDate = formatDateYYYYMMDD(item.day);
                const toDate = item.day !== -6 && item.day !== -29
                    ? formatDateYYYYMMDD(item.day)
                    : formatDateYYYYMMDD(0);
                setCurrentFromDate(fromDate);
                setCurrentToDate(toDate);
                setIsLoading(true);
                // Call the passed-in query, fromDate, and toDate
                dispatch(fetchSalesReportByBusiness(0, 10, fromDate, toDate, query, sortName, getSortOrderKey === 1 ? "desc" : "asc")).then((res) => {
                    dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list }));
                    dispatch(updateDateChangeValue({
                        type: 'update',
                        values: {
                            total_count: res.data[0].total_count,
                            totalSalesValue: res.data[0].total_revenue,
                            totalNetSalesValue: res.data[0].net_revenue,
                        }
                    }));
                });
            }
        } else if (item.value === "Current month") {
            setIsCustomRange(false);
            setIsLoading(true);
            setDate(firstDateDDMMYYYY + " - " + lastDateDDMMYYYY);
            setCurrentFromDate(firstMonthDate);
            setCurrentToDate(lastMonthDate);
            dispatch(fetchSalesReportByBusiness(0, 10, firstMonthDate, lastMonthDate, query, sortName, getSortOrderKey === 1 ? "desc" : "asc")).then((res) => {
                dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list }));
                dispatch(updateDateChangeValue({
                    type: 'update',
                    values: {
                        total_count: res.data[0].total_count,
                        totalSalesValue: res.data[0].total_revenue,
                        totalNetSalesValue: res.data[0].net_revenue,
                    }
                }));
            });
        }
        else {
            setIsLoading(true);
            setIsCustomRange(true);
            const customDay1 = formatDateToWeekDayDDMMMYYYY(item.day1);
            const customDay2 = formatDateToWeekDayDDMMMYYYY(item.day2);
            setSelectedFromCustomDate(customDay1);
            setSelectedToCustomDate(customDay2);
            setCurrentFromDate(customDay1);
            setCurrentToDate(customDay2);
            dispatch(fetchSalesReportByBusiness(0, 10, formatDateYYYYMMDD(item.day2), formatDateYYYYMMDD(item.day1), query, sortName, getSortOrderKey === 1 ? "desc" : "asc")).then((res) => {
                dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list }));
                dispatch(updateDateChangeValue({
                    type: 'update',
                    values: {
                        total_count: res.data[0].total_count,
                        totalSalesValue: res.data[0].total_revenue,
                        totalNetSalesValue: res.data[0].net_revenue,
                    }
                }));
            });
        }
        setIsLoading(false);
        setIsDateDataLoading(false);
    };

    const handleCustomDate = async (type, date) => {
        setIsDateDataLoading(true);
        if (type === 1) {
            setCustomFromPassData(date);
            setCurrentFromDate(date);
            setCurrentToDate(customToPassData);
            dispatch(fetchSalesReportByBusiness(0, 10, date, customToPassData, query, sortName, getSortOrderKey === 1 ? "desc" : "asc")).then((res) => {
                dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list }));
                dispatch(updateDateChangeValue({
                    type: 'update',
                    values: {
                        total_count: res.data[0].total_count,
                        totalSalesValue: res.data[0].total_revenue,
                        totalNetSalesValue: res.data[0].net_revenue,
                    }
                }));
            });
        }
        else if (type === 2) {
            setCustomToPassData(date);
            setCurrentFromDate(customFromPassData);
            setCurrentToDate(date);
            dispatch(fetchSalesReportByBusiness(0, 10, customFromPassData, date, query, sortName, getSortOrderKey === 1 ? "desc" : "asc")).then((res) => {
                dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list }));
                dispatch(updateDateChangeValue({
                    type: 'update',
                    values: {
                        total_count: res.data[0].total_count,
                        totalSalesValue: res.data[0].total_revenue,
                        totalNetSalesValue: res.data[0].net_revenue,
                    }
                }));
            });
        }
        else {
            setIsDateDataLoading(false);
            return;
        }
        setIsDateDataLoading(false);
    };

    const handleCustomDateConfirm = async (num, date) => {
        const formatted = date.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
        if (num === 1) {
            setSelectedFromCustomDate(formatted);
        }
        else if (num === 2) {
            setSelectedToCustomDate(formatted);
        }
        await handleCustomDate(num, formatDateYYYYMMDDD(date));
    };

    return {
        isCustomRange,
        isLoading,
        dateData,
        selectedValue,
        date,
        selectedFromCustomDate,
        selectedToCustomDate,
        handleSelection,
        handleCustomDateConfirm,
        currentFromDate,
        currentToDate,
        handleCustomDate
    };
};

export default useDateRange;
