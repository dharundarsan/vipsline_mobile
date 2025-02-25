import {Button, Modal, ScrollView, StyleSheet, Text, View} from 'react-native'
import React, {useEffect, useMemo, useReducer, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import useDateRange from '../../../hooks/useDateRange';
import DatePicker from '../../../ui/DatePicker';
import TextTheme from '../../../constants/TextTheme';
import SearchBar from '../../../ui/SearchBar';
import Colors from '../../../constants/Colors';
import EntryPicker from '../../../components/common/EntryPicker';
import CustomPagination from '../../../components/common/CustomPagination';
import {Row, Table} from "react-native-table-component";
import SortableHeader from '../../../components/ReportScreen/SortableHeader';
import {formatDateYYYYMMDD, shadowStyling} from '../../../util/Helpers';
import {formatAndFilterCardData} from '../../../data/ReportData';
import CustomImageTextCard from '../../../ui/CustomImageTextCard';
import moment from 'moment';
import textTheme from "../../../constants/TextTheme";
import PrimaryButton from "../../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import {clearAdvancedFilters, loadLeadsFromDb} from "../../../store/leadManagementSlice";
import CustomTextInput from "../../../ui/CustomTextInput";
import {setIsFilterModalVisible} from "../../../store/reportSlice";
import {clearSchedulesForStaff} from "../../../store/staffSlice";
import AppointmentsDatePicker from "../../../components/appointments/AppointmentsDatePicker";
import AttendanceReportDatePicker from "../../../components/ReportScreen/AttendanceReportDatePicker";

const CommonReportSaleScreen = ({route}) => {
    const {
        listName, cardEnabled = false, apiFunction, apiCountName,
        tableHeaderList, salesListWidthHeader, cardTitleData,
        cardValueList, initialCardValue, cardCurrencyList,
        transformTableData, searchEnabled, searchPlaceholder,
        initialTotalRow, additionalRowEnabled = false,
        formatMandatoryFields, filterItems, useEffectFunction,
        isFilterEnabled, disableDate, rowComponents,
        CustomDateComponent, formatCustomFromDate, formatCustomToDate
    } = route.params;

    const dispatch = useDispatch();

    const [getSortOrderKey, setGetSortOrderKey] = useState("");
    const [toggleSortItem, setToggleSortItem] = useState("");
    const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);
    const [query, setQuery] = useState("")
    const [dataList, setDataList] = useState([])
    const [maxPageCount, setMaxPageCount] = useState(0);
    const [pageNo, setPageNo] = useState(0);
    const [maxEntry, setMaxEntry] = useState(10);
    // const [isFilterModalVisible, setIsFilterModalVisible] = useState(true)
    const [isUseEffectLoading, setIsUseEffectLoading] = useState(false);
    const isFilterModalVisible = useSelector(state => state.report.isFilterModalVisible)

    const filterReducer = (state, action) => {
        return state.map(item => {
            if (item.type === "dropdown") {
                if (item.label === action.type) {
                    return {
                        ...item,
                        selectedValue: action.payload
                    }
                }
                return item;
            } else if (item.type === "checkboxDropdown") {
                if (item.label === action.type) {
                    return {
                        ...item,
                        items: selectedValue.map(sel => {
                            if (sel.value === action.payload.value) {
                                return {
                                    ...sel,
                                    enabled: !sel.enabled
                                }
                            }
                            return sel;
                        })
                    }
                }
            }
        })
    }
    const [filterData, setFilterData] = useReducer(filterReducer, filterItems && filterItems.map(filter => {
        if (filter.type === "dropdown") {
            if (filter.items === undefined) {
                return {
                    type: filter.type,
                    label: filter.label,
                    apiName: filter.apiName,
                    items: [...filter.appendingFilterItems, ...useSelector(filter.useSelectorFunction).map(filter.mapFunction)],
                    selectedValue: filter.selectedValue ? filter.selectedValue : [...filter.appendingFilterItems, ...useSelector(filter.useSelectorFunction).map(filter.mapFunction)][0],
                }
            } else {
                return {
                    type: filter.type,
                    label: filter.label,
                    apiName: filter.apiName,
                    items: [...filter.appendingFilterItems, ...filter.items],
                    selectedValue: filter.selectedValue ? filter.selectedValue : [...filter.appendingFilterItems, ...filter.items][0],
                }
            }
        } else if (filter.type === "checkboxDropdown") {
            return {
                type: filter.type,
                label: filter.label,
                items: filter.items,
            }
        }
    }))

    // useEffect(() => {
    //     if (useEffectFunction !== undefined) {
    //         setIsUseEffectLoading(true);
    //         console.log("hello")
    //         useEffectFunction().then(() => {
    //             setIsUseEffectLoading(false);
    //         })
    //     }
    // }, []);

    const cardValue = useRef(initialCardValue ?? []);
    const additionalRowDataList = useRef(initialTotalRow ?? []);
    const sortName = toggleSortItem !== "" ? toggleSortItem : undefined

    const [customDate, setCustomDate] = useState(moment());

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
        onDateChangeDays: (firstDate, SecondDate) => {
            console.log("c1");
            dispatch(apiFunction(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", filterData))
                .then(res => {
                    setMaxPageCount(res.data[0][apiCountName])
                    const transformedData = transformTableData(res.data[0][listName])
                    if (cardEnabled) {
                        cardValue.current = formatAndFilterCardData(res.data[0], cardValueList, cardCurrencyList);
                    }
                    if (additionalRowEnabled) {
                        additionalRowDataList.current = formatMandatoryFields(res.data[0])
                    }
                    setDataList(transformedData);
                })
        },
        onDateChangeMonth: (firstDate, SecondDate) => {
            console.log("c2");
            dispatch(apiFunction(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", filterData))
                .then(res => {
                    setMaxPageCount(res.data[0][apiCountName])
                    const transformedData = transformTableData(res.data[0][listName])
                    if (cardEnabled) {
                        cardValue.current = formatAndFilterCardData(res.data[0], cardValueList, cardCurrencyList);
                    }
                    if (additionalRowEnabled) {
                        additionalRowDataList.current = formatMandatoryFields(res.data[0])
                    }
                    setDataList(transformedData);
                })

        },
        onFirstCustomRangeSelected: (firstDate, SecondDate) => {
            console.log("c3");
            dispatch(apiFunction(0, 10, moment(firstDate, 'ddd, DD MMM YYYY').format('YYYY-MM-DD'), moment(SecondDate, 'ddd, DD MMM YYYY').format('YYYY-MM-DD'), query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", filterData))
                .then(res => {
                    setMaxPageCount(res.data[0][apiCountName])
                    const transformedData = transformTableData(res.data[0][listName])
                    if (cardEnabled) {
                        cardValue.current = formatAndFilterCardData(res.data[0], cardValueList, cardCurrencyList);
                    }
                    if (additionalRowEnabled) {
                        additionalRowDataList.current = formatMandatoryFields(res.data[0])
                    }
                    setDataList(transformedData);
                })

        },
        onFirstOptionCustomChange: (firstDate, SecondDate) => {
            console.log("c4");
            dispatch(apiFunction(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", filterData))
                .then(res => {
                    setMaxPageCount(res.data[0][apiCountName])
                    const transformedData = transformTableData(res.data[0][listName])
                    if (cardEnabled) {
                        cardValue.current = formatAndFilterCardData(res.data[0], cardValueList, cardCurrencyList);
                    }
                    if (additionalRowEnabled) {
                        additionalRowDataList.current = formatMandatoryFields(res.data[0])
                    }
                    setDataList(transformedData);
                })
        },
        onSecondOptionCustomChange: (firstDate, SecondDate) => {
            console.log("c5");
            dispatch(apiFunction(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", filterData))
                .then(res => {
                    setMaxPageCount(res.data[0][apiCountName])
                    const transformedData = transformTableData(res.data[0][listName])
                    if (cardEnabled) {
                        cardValue.current = formatAndFilterCardData(res.data[0], cardValueList, cardCurrencyList);
                    }
                    if (additionalRowEnabled) {
                        additionalRowDataList.current = formatMandatoryFields(res.data[0])
                    }
                    setDataList(transformedData);
                })

        },
    });

    function onChangeData(res) {
        console.log("c6");
        const transformedData = transformTableData(res.data[0][listName])
        setDataList(transformedData);
    }

    const calculateColumnWidths = useMemo(() => {
        return salesListWidthHeader.map((header, index) => {
            const headerWidth = header.length * 14;
            const maxDataWidth = dataList.reduce((maxWidth, row) => {
                const cellContent = row[index]?.toString() || '';
                return Math.max(maxWidth, cellContent.length * 14);
            }, 0);
            return Math.max(headerWidth, maxDataWidth);
        });
    }, [dataList]);

    const widthArr = calculateColumnWidths;

    const fetchData = () => {
        dispatch(apiFunction(0, 10, CustomDateComponent ? formatCustomFromDate(customDate) : formatDateYYYYMMDD(0), CustomDateComponent ? formatCustomToDate(customDate) : formatDateYYYYMMDD(0), undefined, undefined, undefined, filterData))
            .then((res) => {
                setMaxPageCount(res.data[0][apiCountName])
                const transformedData = transformTableData(res.data[0][listName])
                if (cardEnabled) {
                    cardValue.current = formatAndFilterCardData(res.data[0], cardValueList, cardCurrencyList);
                }
                if (additionalRowEnabled) {
                    additionalRowDataList.current = formatMandatoryFields(res.data[0])
                }
                setDataList(transformedData);
                console.log("c8");
            })
    }
    useEffect(() => {
        fetchData()
    }, [customDate])

    // useEffect(() => {
    //     console.log(filterData);
    // }, [filterData]);
    console.log("getSortOrderKey123123")
    console.log(getSortOrderKey)
    console.log(CustomDateComponent)

    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            {isFilterEnabled && isFilterModalVisible && <Modal visible={isFilterModalVisible}
                                                               animationType={"slide"}
                                                               presentationStyle={"pageSheet"}
                                                               onRequestClose={() => {
                                                                   dispatch(setIsFilterModalVisible(false))
                                                               }}
                                                               onClose={() => {
                                                                   dispatch(setIsFilterModalVisible(false))
                                                               }}>
                <View style={[styles.closeAndHeadingContainer, shadowStyling]}>
                    <Text style={[textTheme.titleMedium, styles.titleText]}>Advanced Filters</Text>
                    <PrimaryButton
                        buttonStyle={styles.closeButton}
                        pressableStyle={styles.closeButtonPressable}
                        onPress={() => {
                            dispatch(setIsFilterModalVisible(false))
                        }}
                    >
                        <Ionicons name="close" size={25} color="black"/>
                    </PrimaryButton>
                </View>
                <View style={styles.modalContent}>
                    <ScrollView style={{flex: 1, paddingHorizontal: 18}}>
                        {filterData.map(filter => {
                            if (filter.type === "dropdown") {
                                return <CustomTextInput
                                    type="dropdown"
                                    label={filter.label}
                                    labelTextStyle={textTheme.bodyMedium}
                                    value={filter.selectedValue}
                                    onChangeValue={(object) => {
                                        setFilterData({type: filter.label, payload: object})
                                    }}
                                    object={true}
                                    objectName="name"
                                    dropdownItems={filter.items}
                                />
                            } else if (filter.type === "checkboxDropdown") {
                                // console.log(filter.items)
                                // return <Text>hhh</Text>
                                console.log(filter.items.length)
                                console.log(filter.items)
                                return filter.items.map(checkbox => {
                                    console.log("yfgbh")
                                    return <Text>{"checkbox.name"}</Text>
                                })
                            }
                        })}
                    </ScrollView>
                </View>
                <View style={styles.saveButtonContainer}>
                    {/*<PrimaryButton onPress={async () => {*/}
                    {/*    setIsFilterModalVisible(false)*/}
                    {/*}}*/}
                    {/*               buttonStyle={{*/}
                    {/*                   backgroundColor: "white",*/}
                    {/*                   borderWidth: 1,*/}
                    {/*                   borderColor: Colors.grey400,*/}
                    {/*                   flex: 1*/}
                    {/*               }}*/}
                    {/*               pressableStyle={{paddingHorizontal: 8, paddingVertical: 8}}>*/}
                    {/*    <Text style={{fontWeight: "bold"}}>Clear</Text>*/}
                    {/*</PrimaryButton>*/}
                    <PrimaryButton onPress={() => {
                        setIsFilterModalVisible(false)
                        dispatch(apiFunction(0, maxPageCount === 0 ? 10 : maxPageCount, CustomDateComponent ? formatCustomFromDate(customDate) : currentFromDate, CustomDateComponent ? formatCustomToDate(customDate) : currentToDate, query, undefined, undefined, filterData))
                            .then(res => {
                                setMaxPageCount(res.data[0][apiCountName])
                                const transformedData = transformTableData(res.data[0][listName])
                                if (cardEnabled) {
                                    cardValue.current = formatAndFilterCardData(res.data[0], cardValueList, cardCurrencyList);
                                }
                                setDataList(transformedData);
                            })
                        dispatch(setIsFilterModalVisible(false))
                    }} label="Apply" buttonStyle={{flex: 3}}/>
                </View>
            </Modal>}
            <View style={{marginTop: 20, paddingHorizontal: 20}}>
                <Text style={[TextTheme.bodyMedium, {alignSelf: 'center', marginBottom: 20}]}>Shows complete list of all
                    sales transactions.</Text>
                {disableDate ? <></> : <DatePicker
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
                />}
                {CustomDateComponent ? <CustomDateComponent
                    date={customDate}
                    setSelectedDate={setCustomDate}
                /> : <></>}
            </View>
            {
                cardEnabled &&
                <ScrollView horizontal contentContainerStyle={{paddingHorizontal: 20}}
                            showsHorizontalScrollIndicator={false}>
                    {
                        cardTitleData.map((item, index) => {
                            return (
                                <CustomImageTextCard
                                    key={index}
                                    title={item}
                                    value={cardValue.current[index]?.value ?? 0}
                                    containerStyle={styles.cardContainerStyle}
                                    imgTextContainerStyle={{marginBottom: 7}}
                                    valueStyle={TextTheme.titleSmall}
                                    disabled
                                />
                            )
                        })
                    }
                </ScrollView>
            }
            {
                searchEnabled &&
                <SearchBar
                    onChangeText={(text) => {
                        setQuery(text)
                        dispatch(apiFunction(0, maxPageCount, CustomDateComponent ? formatCustomFromDate(customDate) : currentFromDate, CustomDateComponent ? formatCustomToDate(customDate) : currentToDate, text, undefined, undefined, filterData))
                            .then(res => {
                                setMaxPageCount(res.data[0][apiCountName])
                                const transformedData = transformTableData(res.data[0][listName])
                                setDataList(transformedData);
                            })
                    }}
                    placeholder={searchPlaceholder}
                    searchContainerStyle={{marginBottom: 20, marginHorizontal: 20}}
                    logoAndInputContainer={{borderWidth: 1, borderColor: Colors.grey250}}
                    value={query}
                />
            }
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
                                        onChangeFunction={apiFunction}
                                        maxEntry={maxEntry}
                                        fromDate={currentFromDate}
                                        toDate={currentToDate}
                                        query={query}
                                        onSortChange={setToggleSortItem}
                                        onChangeData={onChangeData}
                                        setGetSortOrderKey={setGetSortOrderKey}
                                        sortOrderKey={getSortOrderKey}
                                        filterData={filterData}
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
                                                    if (rowComponents) {
                                                        const customComponent = rowComponents.find(item => {
                                                            return item.index === cellIndex
                                                        })
                                                        if (customComponent) {
                                                            console.log(customComponent)
                                                            console.log(typeof customComponent)
                                                            return customComponent.component(cell);
                                                        }
                                                    }
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
                                    {
                                        additionalRowEnabled && <Row
                                            data={additionalRowDataList.current.map((cell, cellIndex) => {
                                                return (
                                                    <Text
                                                        style={[styles.text, TextTheme.titleSmall, {paddingHorizontal: 10}]}>
                                                        {cell}
                                                    </Text>
                                                );
                                            })}
                                            widthArr={widthArr}
                                            style={styles.tableBorder}
                                        />
                                    }
                                </>
                            ) :
                            <Text style={[styles.noDataText, styles.tableBorder]}>No Data Found</Text>
                        }
                    </Table>
                </View>
            </ScrollView>
            {
                maxPageCount > 10 &&
                <CustomPagination
                    setIsModalVisible={setIsEntryModalVisible}
                    maxEntry={maxEntry}
                    incrementPageNumber={() => setPageNo(prev => prev + 1)}
                    decrementPageNumber={() => setPageNo(prev => prev - 1)}
                    refreshOnChange={async () =>
                        dispatch(apiFunction(pageNo, maxEntry, CustomDateComponent ? formatCustomFromDate(customDate) : currentFromDate, CustomDateComponent ? formatCustomToDate(customDate) : currentToDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", filterData))
                            .then(res => {
                                console.log("c9")
                                console.log("getSortOrderKey")
                                console.log(getSortOrderKey)
                                onChangeData(res)
                            })
                    }
                    currentCount={dataList?.length ?? 1}
                    totalCount={maxPageCount}
                    resetPageNo={() => {
                        setPageNo(0);
                    }}
                    isFetching={false}
                    currentPage={pageNo}
                />
            }
        </ScrollView>
    )
}

export default CommonReportSaleScreen

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