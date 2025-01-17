import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Table } from "react-native-table-component";
import { decrementPageNumber, fetchSalesReportByBusiness, incrementPageNumber, updateDateChangeValue, updateMaxEntry, updatePageNo, updateSalesReportList } from '../../../store/reportSlice'
import { cardTitleData, enableRupeeArray } from '../../../data/ReportData'
import CustomPagination from '../../../components/common/CustomPagination'
import EntryPicker from '../../../components/common/EntryPicker'
import { salesTableSortHeader } from '../../../components/ReportScreen/salesTableSortHeader'
import { fetchAndUpdateSalesReport } from '../../../components/ReportScreen/fetchAndUpdateSalesReport'
import TextTheme from '../../../constants/TextTheme'
import DatePicker from '../../../ui/DatePicker'
import { formatDateYYYYMMDD } from '../../../util/Helpers'
import CustomImageTextCard from '../../../ui/CustomImageTextCard'
import SearchBar from '../../../ui/SearchBar';
import Colors from '../../../constants/Colors';
import useDateRange from '../../../hooks/useDateRange';

const SalesListReportScreen = () => {
    const dispatch = useDispatch();

    const [getSortOrderKey, setGetSortOrderKey] = useState(1);
    const [toggleSortItem, setToggleSortItem] = useState("");
    const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);
    const [query, setQuery] = useState("")

    const [pageNo, setPageNo] = useState(0);
    const [maxEntry, setMaxEntry] = useState(10);
    const [pageSize, setPageSize] = useState(10)
    const totalCount = useSelector((state) => state.report.total_count);
    const totalSalesValue = useSelector((state) => state.report.totalSalesValue);
    const totalNetSalesValue = useSelector((state) => state.report.totalNetSalesValue);
    const salesReportList = useSelector((state) => state.report.salesReportList);
    // const maxEntry = useSelector((state) => state.report.maxEntry);
    // const pageNo = useSelector((state) => state.report.pageNo);

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
        onDateChangeDays: (firstDate, SecondDate) => fetchAndUpdateSalesReport(dispatch, 0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"),
        onDateChangeMonth: (firstDate, SecondDate) => fetchAndUpdateSalesReport(dispatch, 0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"),
        onFirstCustomRangeSelectes: (firstDate, SecondDate) => fetchAndUpdateSalesReport(dispatch, 0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"),
        onFirstOptionCustomChange: (firstDate, SecondDate) => fetchAndUpdateSalesReport(dispatch, 0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"),
        onSecondOptionCustomChange: (firstDate, SecondDate) => fetchAndUpdateSalesReport(dispatch, 0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"),
    });

    useEffect(() => {
        const initialCall = async () => {
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
            const headerWidth = header.length * 20;

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
                                salesTableSortHeader(dispatch, "DATE", toggleSortItem, setToggleSortItem, setGetSortOrderKey, query, currentFromDate, currentToDate),
                                salesTableSortHeader(dispatch, "INVOICE #", toggleSortItem, setToggleSortItem, setGetSortOrderKey, query, currentFromDate, currentToDate),
                                salesTableSortHeader(dispatch, "CLIENT", toggleSortItem, setToggleSortItem, setGetSortOrderKey, query, currentFromDate, currentToDate),
                                salesTableSortHeader(dispatch, "MOBILE", toggleSortItem, setToggleSortItem, setGetSortOrderKey, query, currentFromDate, currentToDate),
                                salesTableSortHeader(dispatch, "NET TOTAL", toggleSortItem, setToggleSortItem, setGetSortOrderKey, query, currentFromDate, currentToDate),
                                salesTableSortHeader(dispatch, "TAX AMOUNT", toggleSortItem, setToggleSortItem, setGetSortOrderKey, query, currentFromDate, currentToDate),
                                salesTableSortHeader(dispatch, "GROSS TOTAL", toggleSortItem, setToggleSortItem, setGetSortOrderKey, query, currentFromDate, currentToDate),
                                salesTableSortHeader(dispatch, "PAYMENT MODE", toggleSortItem, setToggleSortItem, setGetSortOrderKey, query, currentFromDate, currentToDate),
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
                                        let textColor = 'black';
                                        if(cellIndex === 0){
                                            textColor = Colors.highlight;
                                        }
                                        return (
                                            <Text style={[styles.text, {textAlign:'start',paddingHorizontal:10} , cellIndex === 1 ? { color: textColor } : {}]}>
                                                {cell}
                                            </Text>
                                        );
                                    })}
                                    widthArr={widthArr}
                                    style={styles.tableBorder}
                                />
                            ))
                        ) :
                            <Text style={[styles.noDataText, styles.tableBorder]}>No Data Found</Text>
                        }
                    </Table>
                </View>
            </ScrollView>
            {
                totalCount > 10 &&
                <CustomPagination
                    setIsModalVisible={setIsEntryModalVisible}
                    maxEntry={maxEntry}
                    incrementPageNumber={() => setPageNo(prev => prev + 1)}
                    decrementPageNumber={() => setPageNo(prev => prev - 1)}
                    refreshOnChange={async () =>
                        await dispatch(fetchSalesReportByBusiness(pageNo, maxEntry, currentFromDate, currentToDate, query, toggleSortItem === "" ? "invoice_issued_on" : toggleSortItem, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc")).then((res) => {
                            dispatch(updateSalesReportList({ type: 'update', value: res.data[0].sales_report_list }))
                        })
                    }
                    currentCount={salesReportList?.length ?? 1}
                    totalCount={totalCount}
                    resetPageNo={() => {
                        setPageNo(0);
                        setPageSize(10);
                    }}
                    isFetching={false}
                    currentPage={pageNo}
                />
            }
        </ScrollView >
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
    },
    tableBorder: {
        borderColor: Colors.grey250,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    noDataText: {
        textAlign: 'center',
        paddingVertical: 20
    }
})