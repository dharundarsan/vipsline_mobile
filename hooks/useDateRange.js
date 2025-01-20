import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    formatDateDDMMYYYY,
    formatDateToWeekDayDDMMMYYYY,
    formatDateYYYYMMDD,
    formatDateYYYYMMDDD,
    getFirstAndLastDateOfCurrentMonthDDMMYYYY,
    getFirstDateOfCurrentMonthYYYYMMDD,
    getLastDateOfCurrentMonthYYYYMMMDD
} from '../util/Helpers';

const useDateRange = ({
    onDateChangeDays = () => { },
    onDateChangeMonth = () => { },
    onFirstCustomRangeSelected = () => { },
    onFirstOptionCustomChange = () => { },
    onSecondOptionCustomChange = () => { },
}) => {
    const [isCustomRange, setIsCustomRange] = useState(false);
    const [selectedFromCustomDate, setSelectedFromCustomDate] = useState("0");
    const [selectedToCustomDate, setSelectedToCustomDate] = useState("0");
    const [customFromPassData, setCustomFromPassData] = useState(formatDateYYYYMMDD(0));
    const [customToPassData, setCustomToPassData] = useState(formatDateYYYYMMDD(0));
    const [date, setDate] = useState(formatDateDDMMYYYY().toString());
    const [selectedValue, setSelectedValue] = useState("today");
    const [isLoading, setIsLoading] = useState(false);
    const [currentFromDate, setCurrentFromDate] = useState(formatDateYYYYMMDD(0));
    const [currentToDate, setCurrentToDate] = useState(formatDateYYYYMMDD(0));
    const dateData = useSelector((state) => state.dashboardDetails.dateData);

    const { firstDateDDMMYYYY, lastDateDDMMYYYY } = getFirstAndLastDateOfCurrentMonthDDMMYYYY();
    const firstMonthDate = getFirstDateOfCurrentMonthYYYYMMDD();
    const lastMonthDate = getLastDateOfCurrentMonthYYYYMMMDD();

    const handleSelection = async (item) => {
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
                onDateChangeDays(fromDate, toDate);
            }
        } else if (item.value === "Current month") {
            setIsCustomRange(false);
            setIsLoading(true);
            setDate(firstDateDDMMYYYY + " - " + lastDateDDMMYYYY);
            setCurrentFromDate(firstMonthDate);
            setCurrentToDate(lastMonthDate);
            onDateChangeMonth(firstMonthDate, lastMonthDate);
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
            onFirstCustomRangeSelected(customDay1, customDay2);
        }
        setIsLoading(false);
    };

    const handleCustomDate = async (type, date) => {
        if (type === 1) {
            setCustomFromPassData(date);
            setCurrentFromDate(date);
            setCurrentToDate(customToPassData);
            onFirstOptionCustomChange(date, customToPassData);
        }
        else if (type === 2) {
            setCustomToPassData(date);
            setCurrentFromDate(customFromPassData);
            setCurrentToDate(date);
            onSecondOptionCustomChange(customFromPassData, date);
        }
        else {
            return;
        }
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
