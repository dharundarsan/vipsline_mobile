import {ScrollView, StyleSheet, Text, View} from "react-native";
import {Dropdown} from "react-native-element-dropdown";
import Colors from "../../../constants/Colors";
import React, {useEffect, useMemo, useState} from "react";
import AppointmentsDatePicker from "../../../components/appointments/AppointmentsDatePicker";
import {clearSchedulesForStaff} from "../../../store/staffSlice";
import moment from "moment";
import {Row, Table} from "react-native-table-component";
import SortableHeader from "../../../components/ReportScreen/SortableHeader";
import TextTheme from "../../../constants/TextTheme";
import {useDispatch} from "react-redux";
import CustomPagination from "../../../components/common/CustomPagination";
import EntryPicker from "../../../components/common/EntryPicker";
import axios from "axios";
import {getBusinessId} from "../../../store/cartSlice";
import * as SecureStore from "expo-secure-store";

const AttendanceReportScreen = () => {
    const [selectedDropdownValue, setSelectedDropdownValue] = useState({
        label: "Daily Attendance",
        value: "Daily Attendance"
    })
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [getSortOrderKey, setGetSortOrderKey] = useState("");
    const [toggleSortItem, setToggleSortItem] = useState("");
    const [dataList, setDataList] = useState([])
    const [query, setQuery] = useState("")
    const [maxPageCount, setMaxPageCount] = useState(0);
    const [pageNo, setPageNo] = useState(0);
    const [maxEntry, setMaxEntry] = useState(10);
    const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setSelectedDate(new Date());
    }, [selectedDropdownValue]);


    const tableHeaderList = [
        {key: "r.name", sortKey: "r.name", title: "STAFF NAME"},
        {key: "shift", sortKey: "shift", title: "SHIFT TIME"},
        {key: "firstCheckinTime", sortKey: "firstCheckinTime", title: "FIRST CHECK-IN"},
        {key: "lastCheckoutTime", sortKey: "lastCheckoutTime", title: "LAST CHECK-OUT"},
        {key: "duration", sortKey: "duration", title: "TOTAL HOURS"},
        {key: "status", sortKey: "", title: "STATUS"},
    ]

    const transformTableData = () => {
        return dataList.map((item) => [])
    }

    function onChangeData(res) {
        console.log("c6");
        const transformedData = transformTableData(res.data[0][listName])
        setDataList(transformedData);
    }

    const sortName = toggleSortItem !== "" ? toggleSortItem : undefined

    useEffect(() => {
        fetchDailyAttendanceReportAPI()
    }, []);

    const calculateColumnWidths = useMemo(() => {
        return tableHeaderList.map(item => item.title).map((header, index) => {
            const headerWidth = header.length * 14;
            const maxDataWidth = dataList.reduce((maxWidth, row) => {
                const cellContent = row[index]?.toString() || '';
                return Math.max(maxWidth, cellContent.length * 14);
            }, 0);
            return Math.max(headerWidth, maxDataWidth);
        });
    }, [dataList]);

    const widthArr = calculateColumnWidths;

    const fetchDailyAttendanceReportAPI = async () => {
        try {
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_API_URI}/analytics/getDailyAttendanceReportForBusiness?pageNo=${pageNo}&pageSize=${maxEntry}`,
                {
                    business_id: `${await getBusinessId()}`,
                    sortItem: sortName === null ? "r.name" : sortName,
                    sortOrder: getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc",
                    fromDate: selectedDropdownValue.value === "Daily Attendance" ? moment(selectedDate).format("YYYY-MM-DD") : moment(new Date(selectedDate.setDate(0))).format("YYYY-MM-DD"),
                    search_term: "",
                    toDate: selectedDropdownValue.value === "Daily Attendance" ? moment(selectedDate).format("YYYY-MM-DD") : moment(new Date(selectedDate.setDate(0))).format("YYYY-MM-DD"),
                },
                {
                    headers: {
                        Authorization: `Bearer ${await SecureStore.getItemAsync("authKey")}`,
                    },
                }
            );
            setMaxPageCount(response.data[0].total_count)
            const transformedData = transformTableData(response.data[0].attendance_summary_data)
            setDataList(transformedData);
        } catch (e) {
            console.error(e.response?.data || "Error fetching sales report");
            throw e;
        }
    }

    return <ScrollView style={{backgroundColor: 'white'}}>
        {isEntryModalVisible && (
            <EntryPicker
                setIsModalVisible={setIsEntryModalVisible}
                onPress={(number) => {
                    setMaxEntry(number);
                    setIsEntryModalVisible(false);
                }}
                maxEntry={maxEntry}
                isVisible={isEntryModalVisible}
            />
        )}
        <View style={{flexDirection: "row", margin: 15, gap: 20}}>
            <Dropdown
                style={[{
                    flex: 1,
                    backgroundColor: Colors.grey150,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: Colors.grey250,
                    paddingHorizontal: 10,
                }]}
                data={[{
                    label: "Daily Attendance",
                    value: "Daily Attendance"
                }, {
                    label: "Monthly Attendance",
                    value: "Monthly Attendance"
                }]}
                labelField="label"
                valueField="value"
                value={selectedDropdownValue}
                onChange={(object) => {
                    setSelectedDropdownValue(object)
                }}
                // placeholder="Today"
                disable={false}
            />
            <AppointmentsDatePicker
                date={selectedDate}
                onRightArrowPress={() => {
                    if (selectedDropdownValue.value === "Daily Attendance")
                        setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
                    else
                        setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
                }}
                onLeftArrowPress={() => {
                    if (selectedDropdownValue.value === "Daily Attendance")
                        setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
                    else
                        setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
                }}
                range={selectedDropdownValue.value === "Daily Attendance" ? "day" : "month"}
                displayText={selectedDropdownValue.value === "Daily Attendance" ? moment(selectedDate).format("DD MMM, YYYY") : moment(selectedDate).format("MMM, YYYY")}
                containerStyle={{flex: 1, marginBottom: 0}}
            />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{alignItems: 'center'}}>
            <View style={{paddingHorizontal: 20}}>
                <Table borderStyle={{borderColor: '#c8e1ff'}}>
                    <Row
                        data={
                            tableHeaderList.map((item, index) => (
                                <SortableHeader
                                    key={item.key}
                                    title={item.title}
                                    sortKey={item.sortKey}
                                    currentSortKey={toggleSortItem}
                                    dispatch={dispatch}
                                    pageNo={pageNo}
                                    onChangeFunction={(...data) => {
                                        console.log(data)
                                    }}
                                    maxEntry={maxEntry}
                                    fromDate={selectedDropdownValue.value === "Daily Attendance" ? moment(selectedDate).format("YYYY-MM-DD") : moment(new Date(selectedDate.setDate(0))).format("YYYY-MM-DD")}
                                    toDate={selectedDropdownValue.value === "Daily Attendance" ? moment(selectedDate).format("YYYY-MM-DD") : moment(new Date(selectedDate.setDate(0))).format("YYYY-MM-DD")}
                                    query={query}
                                    onSortChange={setToggleSortItem}
                                    onChangeData={onChangeData}
                                    setGetSortOrderKey={setGetSortOrderKey}
                                    sortOrderKey={getSortOrderKey}
                                />
                            ))
                        }
                        textStyle={{flex: 1, width: "100%", paddingVertical: 10}}
                        widthArr={dataList.length > 0 ? widthArr : undefined}
                        style={{borderWidth: 1, borderColor: Colors.grey250, backgroundColor: Colors.grey150}}
                    />
                    {dataList.length > 0 ? (
                            <>
                                {
                                    dataList.map((rowData, rowIndex) => (
                                        <Row
                                            key={rowIndex}
                                            data={rowData.map((cell, cellIndex) => {
                                                return (
                                                    <Text style={[styles.text, {paddingHorizontal: 10}]}>
                                                        {cell}
                                                    </Text>
                                                );

                                            })}
                                            widthArr={widthArr}
                                            style={styles.tableBorder}
                                        />
                                    ))
                                }
                            </>
                        ) :
                        <Text style={[styles.noDataText, styles.tableBorder]}>No Data Found</Text>
                    }
                </Table>
            </View>
            <CustomPagination
                setIsModalVisible={setIsEntryModalVisible}
                maxEntry={maxEntry}
                incrementPageNumber={() => setPageNo(prev => prev + 1)}
                decrementPageNumber={() => setPageNo(prev => prev - 1)}
                refreshOnChange={() => {}}
                currentCount={dataList?.length ?? 1}
                totalCount={maxPageCount}
                resetPageNo={() => {
                    setPageNo(0);
                }}
                isFetching={false}
                currentPage={pageNo}
            />
        </ScrollView>
    </ScrollView>
}

export default AttendanceReportScreen;

const styles = StyleSheet.create({
    text: {
        textAlign: 'left',
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
    },
    cardContainerStyle: {
        borderRadius: 8,
        borderColor: '#D5D7DA',
        width: 150,
        paddingVertical: 15,
        marginRight: 20,
        marginBottom: 20,
    },
    closeAndHeadingContainer: {
        // marginTop: Platform.OS === "ios" ? 40 : 0,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        flexDirection: "row",
    },
    closeButton: {
        position: "absolute",
        right: 0,
        backgroundColor: Colors.white,
    },
    closeButtonPressable: {
        alignItems: "flex-end",
    },
    modalContent: {
        flex: 1,
        marginTop: 14,
    },
    saveButtonContainer: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: Colors.grey300,
        flexDirection: "row",
        gap: 12,
    },
})