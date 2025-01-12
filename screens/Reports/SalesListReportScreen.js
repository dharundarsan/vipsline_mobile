import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import TextTheme from '../../constants/TextTheme'
import DatePicker from '../../ui/DatePicker'
import { formatDateYYYYMMDD } from '../../util/Helpers'
import { useDispatch, useSelector } from 'react-redux'
import CustomImageTextCard from '../../ui/CustomImageTextCard'
import SearchBar from '../../ui/SearchBar'
import Colors from '../../constants/Colors'
import { Row, Table } from "react-native-table-component";
import { TouchableOpacity } from 'react-native-gesture-handler'
import { decrementPageNumber, fetchSalesReportByBusiness, incrementPageNumber, updateDateChangeValue, updateMaxEntry, updatePageNo, updateSalesReportList } from '../../store/reportSlice'
import { cardTitleData, enableRupeeArray } from '../../data/ReportData'
import CustomPagination from '../../components/common/CustomPagination'
import EntryPicker from '../../components/common/EntryPicker'
import sortIcon from "../../assets/icons/reportIcons/sort.png"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useDateRange from '../../hooks/useDateRange'
import { fetchAndUpdateSalesReport } from '../../components/ReportScreen/fetchAndUpdateSalesReport'


const SalesListReportScreen = () => {
    const dispatch = useDispatch();

    // const [isCustomRange, setIsCustomRange] = useState(false);
    // const [selectedFromCustomDate, setSelectedFromCustomDate] = useState("0");
    // const [selectedToCustomDate, setSelectedToCustomDate] = useState("0");
    // const [customFromPassData, setCustomFromPassData] = useState(formatDateYYYYMMDD(0));
    // const [customToPassData, setCustomToPassData] = useState(formatDateYYYYMMDD(0));
    // const [date, setDate] = useState(formatDateDDMMYYYY().toString());
    // const [selectedValue, setSelectedValue] = useState("today");
    // const dateData = useSelector((state) => state.dashboardDetails.dateData);
    // const [isLoading, setIsLoading] = useState(false);
    // const [isDateDataLoading, setIsDateDataLoading] = useState(false);
    // const { firstDateDDMMYYYY, lastDateDDMMYYYY } = getFirstAndLastDateOfCurrentMonthDDMMYYYY();
    // const firstMonthDate = getFirstDateOfCurrentMonthYYYYMMDD();
    // const lastMonthDate = getLastDateOfCurrentMonthYYYYMMMDD();
    // const [currentFromDate, setCurrentFromDate] = useState(formatDateYYYYMMDD(0));
    // const [currentToDate, setCurrentToDate] = useState(formatDateYYYYMMDD(0));

    const [getSortOrderKey, setGetSortOrderKey] = useState(1);
    const [toggleSortItem, setToggleSortItem] = useState("");
    const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);
    const [query, setQuery] = useState("")

    const totalCount = useSelector((state) => state.report.total_count);
    const totalSalesValue = useSelector((state) => state.report.totalSalesValue);
    const totalNetSalesValue = useSelector((state) => state.report.totalNetSalesValue);
    const salesReportList = useSelector((state) => state.report.salesReportList);
    const maxEntry = useSelector((state) => state.report.maxEntry);
    const pageNo = useSelector((state) => state.report.pageNo);
    const [dateSortOrderKey, setDateSortOrderKey] = useState(1);
    const [clientSortOrderKey, setClientSortOrderKey] = useState(1);
    const [grossTotalSortOrderKey, setGrossTotalSortOrderKey] = useState(1);

    const sortName = toggleSortItem !== "" ? toggleSortItem : "invoice_issued_on"

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

    const finalCardData = useMemo(() => cardTitleData.map((item, index) => ({ ...item, value: cardData[index].value, key: index + 1 })), [cardData])

    // const handleSelection = async (item) => {
    //     setIsDateDataLoading(true)
    //     setSelectedValue(item.value);
    //     if (item.day1 === undefined) {
    //         setIsCustomRange(false);
    //         if (item.value !== "Current month" && item.value !== "Custom range") {
    //             // dispatch(updateLoadingState(true));
    //             setDate(
    //                 item.day !== -6 && item.day !== -29
    //                     ? formatDateDDMMYYYY(item.day)
    //                     : formatDateDDMMYYYY(item.day) + " - " + formatDateDDMMYYYY(0)
    //             );
    //             const fromDate = formatDateYYYYMMDD(item.day);
    //             const toDate = item.day !== -6 && item.day !== -29
    //                 ? formatDateYYYYMMDD(item.day)
    //                 : formatDateYYYYMMDD(0);
    //             setCurrentFromDate(fromDate);
    //             setCurrentToDate(toDate);
    //             setIsLoading(true);
    //             dispatch(fetchSalesReportByBusiness(0, 10, fromDate, toDate, query, sortName, getSortOrderKey === 1 ? "desc" : "asc")).then((res) => {
    //                 dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list },))
    //                 dispatch(updateDateChangeValue({
    //                     type: 'update',
    //                     values: {
    //                         total_count: res.data[0].total_count,
    //                         totalSalesValue: res.data[0].total_revenue,
    //                         totalNetSalesValue: res.data[0].net_revenue,
    //                     }
    //                 }));
    //             });
    //         }
    //     } else if (item.value === "Current month") {
    //         setIsCustomRange(false);
    //         setIsLoading(true);
    //         setDate(firstDateDDMMYYYY + " - " + lastDateDDMMYYYY);
    //         setCurrentFromDate(firstMonthDate);
    //         setCurrentToDate(lastMonthDate);
    //         dispatch(fetchSalesReportByBusiness(0, 10, firstMonthDate, lastMonthDate, query, sortName, getSortOrderKey === 1 ? "desc" : "asc")).then((res) => {
    //             dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list },))
    //             dispatch(updateDateChangeValue({
    //                 type: 'update',
    //                 values: {
    //                     total_count: res.data[0].total_count,
    //                     totalSalesValue: res.data[0].total_revenue,
    //                     totalNetSalesValue: res.data[0].net_revenue,
    //                 }
    //             }));
    //         })
    //     }
    //     else {
    //         setIsLoading(true);
    //         setIsCustomRange(true);
    //         const customDay1 = formatDateToWeekDayDDMMMYYYY(item.day1);
    //         const customDay2 = formatDateToWeekDayDDMMMYYYY(item.day2);
    //         setSelectedFromCustomDate(customDay1);
    //         setSelectedToCustomDate(customDay2);
    //         setCurrentFromDate(customDay1);
    //         setCurrentToDate(customDay2);
    //         dispatch(fetchSalesReportByBusiness(0, 10, formatDateYYYYMMDD(item.day2), formatDateYYYYMMDD(item.day1), query, sortName, getSortOrderKey === 1 ? "desc" : "asc")).then((res) => {
    //             dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list },))
    //             dispatch(updateDateChangeValue({
    //                 type: 'update',
    //                 values: {
    //                     total_count: res.data[0].total_count,
    //                     totalSalesValue: res.data[0].total_revenue,
    //                     totalNetSalesValue: res.data[0].net_revenue,
    //                 }
    //             }));
    //         })
    //     }
    //     setIsLoading(false);
    //     setIsDateDataLoading(false);
    // };

    // const handleCustomDate = async (type, date) => {
    //     setIsDateDataLoading(true)
    //     if (type === 1) {
    //         setCustomFromPassData(date);
    //         setCurrentFromDate(date);
    //         setCurrentToDate(customToPassData);
    //         dispatch(fetchSalesReportByBusiness(0, 10, date, customToPassData, query, sortName, getSortOrderKey === 1 ? "desc" : "asc")).then((res) => {
    //             dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list },))
    //             dispatch(updateDateChangeValue({
    //                 type: 'update',
    //                 values: {
    //                     total_count: res.data[0].total_count,
    //                     totalSalesValue: res.data[0].total_revenue,
    //                     totalNetSalesValue: res.data[0].net_revenue,
    //                 }
    //             }));
    //         });
    //     }
    //     else if (type === 2) {
    //         setCustomToPassData(date);
    //         setCurrentFromDate(customFromPassData);
    //         setCurrentToDate(date);
    //         dispatch(fetchSalesReportByBusiness(0, 10, customFromPassData, date, query, sortName, getSortOrderKey === 1 ? "desc" : "asc")).then((res) => {
    //             dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list },))
    //             dispatch(updateDateChangeValue({
    //                 type: 'update',
    //                 values: {
    //                     total_count: res.data[0].total_count,
    //                     totalSalesValue: res.data[0].total_revenue,
    //                     totalNetSalesValue: res.data[0].net_revenue,
    //                 }
    //             }));
    //         });
    //     }
    //     else {
    //         setIsDateDataLoading(false)
    //         return
    //     }
    //     setIsDateDataLoading(false)
    // }

    // async function handleCustomDateConfirm(num, date) {
    //     const formatted = date.toLocaleDateString("en-GB", {
    //         weekday: "short",
    //         day: "2-digit",
    //         month: "short",
    //         year: "numeric",
    //     });
    //     if (num === 1) {
    //         setSelectedFromCustomDate(formatted)
    //     }
    //     else if (num === 2) {
    //         setSelectedToCustomDate(formatted)
    //     }
    //     await handleCustomDate(num, formatDateYYYYMMDDD(date))
    // }

    const f = (str) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (str === "DATE") {
                        setToggleSortItem("invoice_issued_on");
                        setDateSortOrderKey((prev) => {
                            const newOrderKey = prev + 1 > 3 ? 1 : prev + 1;
                            console.log(newOrderKey);

                            const sortOrder = newOrderKey === 1 ? "reset" : newOrderKey === 2 ? "asc" : "desc";
                            if (newOrderKey === 1) {
                                setToggleSortItem(null);
                            } else {
                                fetchAndUpdateSalesReport(
                                    dispatch,
                                    {
                                        page: pageNo,
                                        limit: maxEntry,
                                        fromDate: currentFromDate,
                                        toDate: currentToDate,
                                        query,
                                        sortName: "invoice_issued_on",
                                        sortOrder: sortOrder === "reset" ? "desc" : sortOrder
                                    }
                                );
                                // dispatch(
                                //     fetchSalesReportByBusiness(
                                //         pageNo,
                                //         maxEntry,
                                //         currentFromDate,
                                //         currentToDate,
                                //         query,
                                //         "invoice_issued_on",
                                //         sortOrder === "reset" ? "desc" : sortOrder
                                //     )
                                // ).then((res) => {
                                //     dispatch(
                                //         updateDateChangeValue({
                                //             type: "update",
                                //             values: {
                                //                 total_count: res.data[0].total_count,
                                //                 totalSalesValue: res.data[0].total_revenue,
                                //                 totalNetSalesValue: res.data[0].net_revenue,
                                //                 salesReportList: res.data[0].sales_report_list,
                                //             },
                                //         })
                                //     );
                                // });
                            }
                            setGetSortOrderKey(newOrderKey);
                            return newOrderKey;
                        });
                    } else if (str === "CLIENT") {
                        setToggleSortItem("name");

                        setClientSortOrderKey((prev) => {
                            const newOrderKey = prev + 1 > 3 ? 1 : prev + 1;
                            const sortOrder = newOrderKey === 1 ? "reset" : newOrderKey === 2 ? "asc" : "desc";
                            if (newOrderKey === 1) {
                                setToggleSortItem(null);
                            } else {
                                fetchAndUpdateSalesReport(
                                    dispatch,
                                    {
                                        page: pageNo,
                                        limit: maxEntry,
                                        fromDate: currentFromDate,
                                        toDate: currentToDate,
                                        query,
                                        sortName: "name",
                                        sortOrder: sortOrder === "reset" ? "desc" : sortOrder
                                    }
                                );
                                // dispatch(
                                //     fetchSalesReportByBusiness(
                                //         pageNo,
                                //         maxEntry,
                                //         currentFromDate,
                                //         currentToDate,
                                //         query,
                                //         "name",
                                //         sortOrder === "reset" ? "desc" : sortOrder
                                //     )
                                // ).then((res) => {
                                //     dispatch(
                                //         updateDateChangeValue({
                                //             type: "update",
                                //             values: {
                                //                 total_count: res.data[0].total_count,
                                //                 totalSalesValue: res.data[0].total_revenue,
                                //                 totalNetSalesValue: res.data[0].net_revenue,
                                //                 salesReportList: res.data[0].sales_report_list,
                                //             },
                                //         })
                                //     );
                                // });
                            }
                            setGetSortOrderKey(newOrderKey);
                            return newOrderKey;
                        });
                    } else if (str === "GROSS TOTAL") {
                        setToggleSortItem("net_total");

                        setGrossTotalSortOrderKey((prev) => {
                            const newOrderKey = prev + 1 > 3 ? 1 : prev + 1;
                            const sortOrder = newOrderKey === 1 ? "reset" : newOrderKey === 2 ? "asc" : "desc";
                            if (newOrderKey === 1) {
                                setToggleSortItem(null);
                            } else {
                                fetchAndUpdateSalesReport(
                                    dispatch,
                                    {
                                        page: pageNo,
                                        limit: maxEntry,
                                        fromDate: currentFromDate,
                                        toDate: currentToDate,
                                        query,
                                        sortName: "net_total",
                                        sortOrder: sortOrder === "reset" ? "desc" : sortOrder
                                    }
                                );
                                // dispatch(
                                //     fetchSalesReportByBusiness(
                                //         pageNo,
                                //         maxEntry,
                                //         currentFromDate,
                                //         currentToDate,
                                //         query,
                                //         "net_total",
                                //         sortOrder === "reset" ? "desc" : sortOrder
                                //     )
                                // ).then((res) => {
                                //     dispatch(
                                //         updateDateChangeValue({
                                //             type: "update",
                                //             values: {
                                //                 total_count: res.data[0].total_count,
                                //                 totalSalesValue: res.data[0].total_revenue,
                                //                 totalNetSalesValue: res.data[0].net_revenue,
                                //                 salesReportList: res.data[0].sales_report_list,
                                //             },
                                //         })
                                //     );
                                // });
                            }
                            setGetSortOrderKey(newOrderKey);
                            return newOrderKey;
                        });
                    }
                }}
                style={{
                    flex: 1,
                    height: "100%",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    width: "100%",
                }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 5,
                    }}
                >
                    <Text
                        style={[
                            TextTheme.bodyMedium,
                            { textAlign: "center", flexWrap: "wrap" },
                            toggleSortItem === "invoice_issued_on" && str === "DATE"
                                ? { color: Colors.highlight }
                                : toggleSortItem === "name" && str === "CLIENT"
                                    ? { color: Colors.highlight }
                                    : toggleSortItem === "net_total" && str === "GROSS TOTAL"
                                        ? { color: Colors.highlight }
                                        : { color: Colors.black },
                        ]}
                        numberOfLines={1}
                    >
                        {str}
                    </Text>

                    {str === "DATE" && (
                        toggleSortItem === "invoice_issued_on" ? (
                            dateSortOrderKey === 1 ? (
                                <Image source={sortIcon} style={{ width: 20, height: 20 }} />
                            ) : dateSortOrderKey === 2 ? (
                                <FontAwesome name="sort-amount-asc" size={14} color="black" />
                            ) : (
                                <FontAwesome name="sort-amount-desc" size={14} color="black" />
                            )
                        ) : (
                            <Image source={sortIcon} style={{ width: 20, height: 20 }} />
                        )
                    )}

                    {str === "CLIENT" && (
                        toggleSortItem === "name" ? (
                            clientSortOrderKey === 1 ? (
                                <Image source={sortIcon} style={{ width: 20, height: 20 }} />
                            ) : clientSortOrderKey === 2 ? (
                                <FontAwesome name="sort-amount-asc" size={14} color="black" />
                            ) : (
                                <FontAwesome name="sort-amount-desc" size={14} color="black" />
                            )
                        ) : (
                            <Image source={sortIcon} style={{ width: 20, height: 20 }} />
                        )
                    )}

                    {str === "GROSS TOTAL" && (
                        toggleSortItem === "net_total" ? (
                            grossTotalSortOrderKey === 1 ? (
                                <Image source={sortIcon} style={{ width: 20, height: 20 }} />
                            ) : grossTotalSortOrderKey === 2 ? (
                                <FontAwesome name="sort-amount-asc" size={14} color="black" />
                            ) : (
                                <FontAwesome name="sort-amount-desc" size={14} color="black" />
                            )
                        ) : (
                            <Image source={sortIcon} style={{ width: 20, height: 20 }} />
                        )
                    )}
                </View>
            </TouchableOpacity>
        )
    }

    const {
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
        handleCustomDate,
    } = useDateRange({
        query,
        sortName,
        getSortOrderKey
    });



    useEffect(() => {
        const initialCall = async () => {
            // setCurrentFromDate(formatDateYYYYMMDD(0));
            // setCurrentToDate(formatDateYYYYMMDD(0));
            dispatch(fetchSalesReportByBusiness(0, 10, formatDateYYYYMMDD(0), formatDateYYYYMMDD(0))).then((res) => {
                dispatch(updateDateChangeValue({
                    type: 'update',
                    values: {
                        total_count: res.data[0].total_count,
                        totalSalesValue: res.data[0].total_revenue,
                        totalNetSalesValue: res.data[0].net_revenue,
                        salesReportList: res.data[0].sales_report_list,
                    }
                }));
            });
        };
        initialCall();
    }, []);
    const tableHeaders = ["DATE", "INVOICE #", "CLIENT", "MOBILE", "NET TOTAL", "TAX AMOUNT", "GROSS TOTAL", "PAYMENT MODE"];
    const tableData = useMemo(() => salesReportList.map((item) => [
        item.date,
        item.invoice,
        item.client,
        item.mobile,
        "₹ " + item.net_total.toString(),
        "₹ " + item.gst.toString(),
        "₹ " + item.gross_total.toString(),
        item.payment_mode,
    ]), [salesReportList])

    const calculateColumnWidths = () => {
        return tableHeaders.map((header, index) => {
            const headerWidth = header.length * 14;

            const maxDataWidth = tableData.reduce((maxWidth, row) => {
                const cellContent = row[index] || '';
                return Math.max(maxWidth, cellContent.length * 14);
            }, 0);

            return Math.max(headerWidth, maxDataWidth);
        });
    };

    const widthArr = useMemo(() => calculateColumnWidths(), [tableData])


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
                                enableRupee
                                rupeeArray={enableRupeeArray}
                            />
                        )
                    })
                }
            </ScrollView>
            <SearchBar
                onChangeText={(text) => {
                    setQuery(text)
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
                value={query}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
                <View style={{ paddingHorizontal: 20 }}>
                    <Table borderStyle={{ borderColor: '#c8e1ff' }}>
                        <Row
                            data={[
                                f("DATE"),
                                f("INVOICE #"),
                                f("CLIENT"),
                                f("MOBILE"),
                                f("NET TOTAL"),
                                f("TAX AMOUNT"),
                                f("GROSS TOTAL"),
                                f("PAYMENT MODE"),
                            ]}
                            textStyle={{ flex: 1, width: "100%", paddingVertical: 10 }}
                            widthArr={tableData.length > 0 ? widthArr : undefined}
                            style={{ borderWidth: 1, borderColor: Colors.grey250, backgroundColor: Colors.grey150 }}
                        />
                        {tableData.length > 0 ? (
                            tableData.map((rowData, rowIndex) => (
                                <Row
                                    key={rowIndex}
                                    data={rowData.map((cell, cellIndex) => {
                                        // Determine the text color based on conditions
                                        let textColor = 'black'; // Default color

                                        if (cellIndex === 1) { // Transaction type
                                            textColor = Colors.highlight;
                                        }
                                        // } else if (cellIndex === 8) { // Invoice number
                                        //     textColor = Colors.highlight;
                                        // }

                                        return (
                                            <Text style={[styles.text, { color: textColor }]}>
                                                {cell}
                                            </Text>
                                        );
                                    })}
                                    widthArr={widthArr}
                                    style={{
                                        borderColor: Colors.grey250,
                                        borderBottomWidth: 1,
                                        borderLeftWidth: 1,
                                        borderRightWidth: 1,
                                    }}
                                />
                            ))
                        ) :
                            <Text style={{ textAlign: 'center', paddingVertical: 20, borderColor: Colors.grey250, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, }}>No Data Found </Text>}
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
                        await dispatch(fetchSalesReportByBusiness(pageNo, maxEntry, currentFromDate, currentToDate, query, toggleSortItem === "" ? "invoice_issued_on" : toggleSortItem, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc")).then((res) => {
                            dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list }))
                        })
                    }
                    currentCount={salesReportList?.length ?? 1}
                    totalCount={totalCount}
                    resetPageNo={() => dispatch(updatePageNo({ type: 'reset' }))}
                    isFetching={false}
                    currentPage={pageNo}
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
    },
    text: {
        textAlign: 'center',
        paddingVertical: 10,
        fontSize: 14,
        flex: 1,
        width: '100%',
    }
})