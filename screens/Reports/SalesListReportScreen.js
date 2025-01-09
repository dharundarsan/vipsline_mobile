import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TextTheme from '../../constants/TextTheme'
import DatePicker from '../../ui/DatePicker'
import { formatDateDDMMYYYY, formatDateToWeekDayDDMMMYYYY, formatDateYYYYMMDD, formatDateYYYYMMDDD, getFirstAndLastDateOfCurrentMonthDDMMYYYY, getFirstDateOfCurrentMonthYYYYMMDD, getLastDateOfCurrentMonthYYYYMMMDD } from '../../util/Helpers'
import { useDispatch, useSelector } from 'react-redux'
import CustomImageTextCard from '../../ui/CustomImageTextCard'
import SearchBar from '../../ui/SearchBar'
import Colors from '../../constants/Colors'
import { Row, Table, TableWrapper, Cell, Rows } from "react-native-table-component";
import { TouchableOpacity } from 'react-native-gesture-handler'
import { decrementPageNumber, fetchSalesReportByBusiness, incrementPageNumber, updateDateChangeValue, updateMaxEntry, updatePageNo, updateSalesReportList } from '../../store/reportSlice'
import { cardTitleData } from '../../data/ReportData'
import { Divider } from 'react-native-paper'
import CustomPagination from '../../components/common/CustomPagination'
import EntryPicker from '../../components/common/EntryPicker'

const SalesListReportScreen = () => {
    const dispatch = useDispatch();
    const [isCustomRange, setIsCustomRange] = useState(false);
    const [selectedFromCustomDate, setSelectedFromCustomDate] = useState("0");
    const [selectedToCustomDate, setSelectedToCustomDate] = useState("0");
    const [customFromPassData, setCustomFromPassData] = useState(formatDateYYYYMMDD(0));
    const [customToPassData, setCustomToPassData] = useState(formatDateYYYYMMDD(0));
    const [date, setDate] = useState(formatDateDDMMYYYY().toString());
    const [selectedValue, setSelectedValue] = useState("today");
    const dateData = useSelector((state) => state.dashboardDetails.dateData);
    const [isLoading, setIsLoading] = useState(false);
    const [isDateDataLoading, setIsDateDataLoading] = useState(false);
    const { firstDateDDMMYYYY, lastDateDDMMYYYY } = getFirstAndLastDateOfCurrentMonthDDMMYYYY();
    const firstMonthDate = getFirstDateOfCurrentMonthYYYYMMDD();
    const lastMonthDate = getLastDateOfCurrentMonthYYYYMMMDD();

    const [currentFromDate, setCurrentFromDate] = useState(formatDateYYYYMMDD(0));
    const [currentToDate, setCurrentToDate] = useState(formatDateYYYYMMDD(0));
    const [toggleOrder, setToggleOrder] = useState(false);
    const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);

    const totalCount = useSelector((state) => state.report.total_count);
    const totalSalesValue = useSelector((state) => state.report.totalSalesValue);
    const totalNetSalesValue = useSelector((state) => state.report.totalNetSalesValue);
    const salesReportList = useSelector((state) => state.report.salesReportList);
    const maxEntry = useSelector((state) => state.report.maxEntry);
    const pageNo = useSelector((state) => state.report.pageNo);

    const cardData = [
        {
            value: totalCount
        },
        {
            value: totalNetSalesValue
        },
        {
            value: totalSalesValue
        },
    ]

    const finalCardData = cardTitleData.map((item, index) => ({ ...item, value: cardData[index].value, key: index + 1 }))

    const handleSelection = async (item) => {
        setIsDateDataLoading(true)
        setSelectedValue(item.value);
        if (item.day1 === undefined) {
            setIsCustomRange(false);
            if (item.value !== "Current month" && item.value !== "Custom range") {
                // dispatch(updateLoadingState(true));
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
                dispatch(fetchSalesReportByBusiness(0, 10, fromDate, toDate)).then((res) => {
                    dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list },))
                    dispatch(fetchSalesReportByBusiness(0, res.data[0].total_count, fromDate, toDate)).then((data) => {
                        dispatch(updateDateChangeValue({
                            type: 'update',
                            values: {
                                total_count: data.data[0].total_count,
                                totalSalesValue: data.data[0].total_revenue,
                                totalNetSalesValue: data.data[0].net_revenue,
                                // salesReportList: data.data[0].sales_report_list,
                            }
                        }));
                    });
                });
            }
        } else if (item.value === "Current month") {
            setIsCustomRange(false);
            setIsLoading(true);
            setDate(firstDateDDMMYYYY + " - " + lastDateDDMMYYYY);
            setCurrentFromDate(firstMonthDate);
            setCurrentToDate(lastMonthDate);
            dispatch(fetchSalesReportByBusiness(0, 10, firstMonthDate, lastMonthDate)).then((res) => {
                dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list },))
                dispatch(fetchSalesReportByBusiness(0, res.data[0].total_count, firstMonthDate, lastMonthDate)).then((data) => {
                    dispatch(updateDateChangeValue({
                        type: 'update',
                        values: {
                            total_count: data.data[0].total_count,
                            totalSalesValue: data.data[0].total_revenue,
                            totalNetSalesValue: data.data[0].net_revenue,
                            // salesReportList: data.data[0].sales_report_list,
                        }
                    }));
                });
            })
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
            dispatch(fetchSalesReportByBusiness(0, 10, formatDateYYYYMMDD(item.day2), formatDateYYYYMMDD(item.day1))).then((res) => {
                dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list },))
                dispatch(fetchSalesReportByBusiness(0, res.data[0].total_count, formatDateYYYYMMDD(item.day2), formatDateYYYYMMDD(item.day1))).then((data) => {
                    dispatch(updateDateChangeValue({
                        type: 'update',
                        values: {
                            total_count: data.data[0].total_count,
                            totalSalesValue: data.data[0].total_revenue,
                            totalNetSalesValue: data.data[0].net_revenue,
                            // salesReportList: data.data[0].sales_report_list,
                        }
                    }));
                });
            })
        }
        setIsLoading(false);
        setIsDateDataLoading(false);
    };

    const handleCustomDate = async (type, date) => {
        setIsDateDataLoading(true)
        if (type === 1) {
            setCustomFromPassData(date);
            setCurrentFromDate(date);
            setCurrentToDate(customToPassData);
            dispatch(fetchSalesReportByBusiness(0, 10, date, customToPassData)).then((res) => {
                dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list },))
                dispatch(fetchSalesReportByBusiness(0, res.data[0].total_count, date, customToPassData)).then((data) => {
                    dispatch(updateDateChangeValue({
                        type: 'update',
                        values: {
                            total_count: data.data[0].total_count,
                            totalSalesValue: data.data[0].total_revenue,
                            totalNetSalesValue: data.data[0].net_revenue,
                            // salesReportList: data.data[0].sales_report_list,
                        }
                    }));
                });
            });
        }
        else if (type === 2) {
            setCustomToPassData(date);
            setCurrentFromDate(customFromPassData);
            setCurrentToDate(date);
            dispatch(fetchSalesReportByBusiness(0, 10, customFromPassData, date)).then((res) => {
                dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list },))
                dispatch(fetchSalesReportByBusiness(0, res.data[0].total_count, date, customToPassData)).then((data) => {
                    dispatch(updateDateChangeValue({
                        type: 'update',
                        values: {
                            total_count: data.data[0].total_count,
                            totalSalesValue: data.data[0].total_revenue,
                            totalNetSalesValue: data.data[0].net_revenue,
                            // salesReportList: data.data[0].sales_report_list,
                        }
                    }));
                });
            });
        }
        else {
            setIsDateDataLoading(false)
            return
        }
        setIsDateDataLoading(false)
    }

    async function handleCustomDateConfirm(num, date) {
        const formatted = date.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
        if (num === 1) {
            setSelectedFromCustomDate(formatted)
        }
        else if (num === 2) {
            setSelectedToCustomDate(formatted)
        }
        await handleCustomDate(num, formatDateYYYYMMDDD(date))
    }

    const f = (str) => {
        return (
            <TouchableOpacity onPress={() => {
                console.log(str);
            }} style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                <Text>{str}</Text>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        const initialCall = async () => {
            console.log(123123);
            
            setCurrentFromDate(formatDateYYYYMMDD(0));
            setCurrentToDate(formatDateYYYYMMDD(0));
            dispatch(fetchSalesReportByBusiness(0, 10, formatDateYYYYMMDD(0), formatDateYYYYMMDD(0))).then((res) => {
                dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list }))

                dispatch(updateDateChangeValue({
                    type: 'update',
                    values: {
                        total_count: res.data[0].total_count,
                        totalSalesValue: res.data[0].total_revenue,
                        totalNetSalesValue: res.data[0].net_revenue,
                        // salesReportList: data.data[0].sales_report_list,
                    }
                }));
                // dispatch(fetchSalesReportByBusiness(0, res.data[0].total_count, formatDateYYYYMMDD(0), formatDateYYYYMMDD(0))).then((data) => {
                // });
            });
        };
        initialCall();
    }, []);

    console.log("salesReportList");
    console.log(salesReportList);
    const tableData = salesReportList.map((item) => [
        item.date,
        item.invoice,
        item.client,
        item.mobile,
        item.net_total,
        item.gross_total,
        item.payment_mode,
    ]);

    console.log("tableData");
    console.log(tableData);



    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            {isEntryModalVisible && (
                <EntryPicker
                    setIsModalVisible={setIsEntryModalVisible}
                    onPress={(number) => {
                        dispatch(updateMaxEntry(number));
                        setIsEntryModalVisible(false);
                    }}
                    maxEntry={maxEntry}
                    isVisible={isEntryModalVisible}
                />
            )}
            <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
                <Text style={[TextTheme.bodyMedium, { alignSelf: 'center', marginBottom: 20 }]}>Shows complete list of all sales transactions.</Text>
                <DatePicker
                    isCustomRange={isCustomRange}
                    handleSelection={handleSelection}
                    isLoading={isLoading}
                    handleCustomDateConfirm={handleCustomDateConfirm}
                    handleCustomDate={handleCustomDate}
                    dateData={dateData}
                    selectedValue={selectedValue}
                    date={date}
                    selectedToCustomDate={selectedToCustomDate}
                    selectedFromCustomDate={selectedFromCustomDate}
                />
            </View>
            <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 20 }} showsHorizontalScrollIndicator={false}>
                {
                    finalCardData.map((item) => {
                        return (
                            <CustomImageTextCard
                                key={item.key}
                                title={item.title}
                                value={item.value}
                                containerStyle={styles.cardContainerStyle}
                                imgTextContainerStyle={{ marginBottom: 7 }}
                                valueStyle={TextTheme.titleSmall}
                            />
                        )
                    })
                }
            </ScrollView>
            <SearchBar
                onChangeText={(text) => {
                    console.log(text);
                    dispatch(fetchSalesReportByBusiness(0, 10, currentFromDate, currentToDate, text)).then((res) => {
                        dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list }))
                        dispatch(fetchSalesReportByBusiness(0, res.data[0].total_count, currentFromDate, currentToDate, text)).then((data) => {
                            dispatch(updateDateChangeValue({
                                type: 'update',
                                values: {
                                    total_count: data.data[0].total_count,
                                    totalSalesValue: data.data[0].total_revenue,
                                    totalNetSalesValue: data.data[0].net_revenue,
                                    // salesReportList: data.data[0].sales_report_list,
                                }
                            }));
                        });
                    });
                }}
                placeholder='Search by Invoice number'
                searchContainerStyle={{ margin: 20 }}
                logoAndInputContainer={{ borderWidth: 1, borderColor: Colors.grey250 }}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
                <View style={{ paddingHorizontal: 20 }}>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
                        <Row
                            data={[f("DATE"), "INVOICE #", "CLIENT", "MOBILE", "NET TOTAL", "TAX AMOUNT", "GROSS TOTAL", "PAYMENT MODE"]}
                            textStyle={{ paddingVertical: 10, paddingHorizontal: 20 }}
                        />
                        <Rows data={tableData} textStyle={styles.text} />
                    </Table>
                </View>
            </ScrollView>
                {
                    totalCount > 10 &&
                    <CustomPagination
                    setIsModalVisible={setIsEntryModalVisible}
                    maxEntry={maxEntry}
                    incrementPageNumber={() => dispatch(incrementPageNumber())}
                    decrementPageNumber={() => dispatch(decrementPageNumber())}
                    refreshOnChange={async () =>
                        // await dispatch(getRewardHistory(props.details.id, maxEntry))
                        await dispatch(fetchSalesReportByBusiness(pageNo, maxEntry, currentFromDate,currentToDate )).then((res) => {
                            dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list }))
                        })
                    }
                    currentCount={salesReportList?.length ?? 1}
                    totalCount={totalCount}
                    resetPageNo={() => dispatch(updatePageNo({ type: 'reset' }))}
                    isFetching={false}
                />
                }
        </ScrollView>
    )
}

export default SalesListReportScreen

const styles = StyleSheet.create({
    cardContainerStyle: {
        borderRadius: 8,
        borderColor: '#D5D7DA',
        width: 150,
        paddingVertical: 15,
        marginRight: 20
    }
})