import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import {ScrollView} from 'react-native';
import {Table, TableWrapper, Col, Cols, Cell, Row, Rows} from 'react-native-table-component';
import PrimaryButton from "../../../ui/PrimaryButton";
import Colors from "../../../constants/Colors";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {checkAPIError, formatDateYYYYMMDD} from "../../../util/Helpers";
import CustomPagination from "../../../components/common/CustomPagination";
import EntryPicker from "../../../components/common/EntryPicker";
import TextTheme from "../../../constants/TextTheme";
import DatePicker from "../../../ui/DatePicker";
import useDateRange from "../../../hooks/useDateRange";
import {formatAndFilterCardData} from "../../../data/ReportData";
import moment from "moment/moment";
import textTheme from "../../../constants/TextTheme";
import CustomImageTextCard from "../../../ui/CustomImageTextCard";

const TaxesSummaryReportsReportScreen = () => {
    const [pageNo, setPageNo] = useState(0);
    const [isEntryModalVisible, setIsEntryModalVisible] = useState(false)
    const [maxEntry, setMaxEntry] = useState(10);
    const [response, setResponse] = useState();
    const [formatedData, setFormatedData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const {
        isCustomRange,
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
            taxSummaryReportAPI(firstDate, SecondDate)
        },
        onDateChangeMonth: (firstDate, SecondDate) => {
            taxSummaryReportAPI(firstDate, SecondDate)
        },
        onFirstCustomRangeSelected: (firstDate, SecondDate) => {

        },
        onFirstOptionCustomChange: (firstDate, SecondDate) => {
            taxSummaryReportAPI(firstDate, SecondDate)
        },
        onSecondOptionCustomChange: (firstDate, SecondDate) => {
            taxSummaryReportAPI(firstDate, SecondDate)
        },
    });

    useEffect(() => {
        const fetchData = () => {
            taxSummaryReportAPI(currentFromDate, currentToDate)
        }
        fetchData()
    }, [])

    const taxSummaryReportAPI = async (fromDate, toDate) => {
        try {
            setIsLoading(true);
            const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + `/analytics/getTaxesAnalyticsByServiceForBusiness?pageNo=${pageNo}&pageSize=${maxEntry}`, {
                business_id: await SecureStore.getItemAsync('businessId'),
                fromDate: fromDate,
                toDate: toDate
            }, {
                headers: {
                    'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
                }
            })
            setIsLoading(false);
            checkAPIError(response)
            setResponse(response.data.data[0])
            setFormatedData(response.data.data[0].appointment_list.map(item => [
                item.appointment_date,
                item.invoice_no,
                item.name,
                item.mobile,
                ["₹" + item.service_value.toString(), "₹" + item.service_tax.toString()],
                ["₹" + item.product_value.toString(), "₹" + item.product_tax.toString()],
                ["₹" + item.custom_service_value.toString(), "₹" + item.custom_service_tax.toString()],
                ["₹" + item.membership_value.toString(), "₹" + item.membership_tax.toString()],
                ["₹" + item.packages_value.toString(), "₹" + item.packages_tax.toString()],
                ["₹" + item.prepaid_value.toString(), "₹" + item.prepaid_tax.toString()],
                "₹" + item.discount.toString(),
                [item.total_tax_percent.toString() + " %", "₹" + item.total_tax_value.toString(), "₹" + item.total_price.toString()],
                ["₹" + item.payment_modes.cash.toString(), "₹" + item.payment_modes.card.toString(), "₹" + item.payment_modes.digital_amount.toString(), "₹" + item.payment_modes.prepaid.toString(), "₹" + item.payment_modes.rewards.toString()]
            ]))
            return response;
        } catch (e) {
            console.error("Error: Tax summary report API")
        }
    }

    const tableHeader = [
        'DATE',
        'INVOICE NO',
        'CLIENT NAME',
        'CONTACT NO',
        {
            title: "SERVICE",
            children: ["VALUE", "TAX"]
        },
        {
            title: "PRODUCTS",
            children: ["VALUE", "TAX"]
        },
        {
            title: "CUSTOM ITEMS",
            children: ["VALUE", "TAX"]
        },
        {
            title: "MEMBERSHIP",
            children: ["VALUE", "TAX"]
        },
        {
            title: "PACKAGES",
            children: ["VALUE", "TAX"]
        },
        {
            title: "PREPAID",
            children: ["VALUE", "TAX"]
        },
        "TOTAL DISCOUNT",
        {
            title: "TOTAL",
            children: ["TOTAL TAX (%)", "TOTAL TAX", "INVOICE VALUE"]
        },
        {
            title: "PAYMENT MODE",
            children: ["CASH", "CARD", "DIGITAL", "PREPAID", "REWARDS"]
        },
    ]

    return (
        <View style={styles.container}>
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
            <View style={{marginTop: 0, paddingHorizontal: 20}}>
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
            <ScrollView horizontal style={{flexGrow: 0}} contentContainerStyle={{paddingHorizontal: 20, flexGrow: 0}}
                        showsHorizontalScrollIndicator={false}>
                <CustomImageTextCard
                    title={"Total Bills"}
                    value={response?.total_records ?? 0}
                    containerStyle={styles.cardContainerStyle}
                    imgTextContainerStyle={{marginBottom: 7}}
                    valueStyle={TextTheme.titleSmall}
                    disabled
                />
                <CustomImageTextCard
                    title={"Total Value"}
                    value={response?.total_revenue ?? 0}
                    containerStyle={styles.cardContainerStyle}
                    imgTextContainerStyle={{marginBottom: 7}}
                    valueStyle={TextTheme.titleSmall}
                    disabled
                />
                <CustomImageTextCard
                    title={"Total Tax Value"}
                    value={response?.total_tax ?? 0}
                    containerStyle={styles.cardContainerStyle}
                    imgTextContainerStyle={{marginBottom: 7}}
                    valueStyle={TextTheme.titleSmall}
                    disabled
                />
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flexGrow: 0}}>
                <Table style={{}}>
                    <Row
                        widthArr={[150, 140, 140, 120, 130, 130, 130, 130, 130, 130, 100, 250, 400]}
                        data={tableHeader.map(header => {
                            if (typeof header === "string") {
                                return <Text style={{
                                    textAlign: "center",
                                    // paddingHorizontal: 5,
                                    // paddingVertical: 5,
                                    borderColor: "rgba(213, 215, 218, 1)",
                                    textAlignVertical: "center",
                                    height: "100%",
                                    borderRightWidth: 1,
                                    borderLeftWidth: 1
                                }}>{header}</Text>
                            } else {
                                return <Col style={{}} data={[
                                    <Row data={[header.title]} style={{
                                        height: "100%",
                                        borderBottomWidth: 1,
                                        borderRightWidth: 1,
                                        borderColor: "rgba(213, 215, 218, 1)",
                                        // paddingHorizontal: 5,
                                        // paddingVertical: 5,
                                    }}
                                         textStyle={{textAlign: "center"}}/>,
                                    <Row style={{}} data={header.children.map(subHeader => <Text style={{
                                        // borderRightWidth: 1,
                                        height: "100%",
                                        textAlignVertical: "center",
                                        borderLeftWidth: 1,
                                        borderColor: "rgba(213, 215, 218, 1)",
                                        // paddingHorizontal: 5,
                                        // paddingVertical: 5,
                                        textAlign: "center"
                                    }}>{subHeader}</Text>)}
                                    />
                                ]}/>
                            }
                        })}
                        style={{
                            borderWidth: 1,
                            borderColor: "rgba(213, 215, 218, 1)",
                            backgroundColor: "rgba(248, 248, 251, 1)",
                            height: 70,
                        }}
                    />
                    <ScrollView>
                        <Rows
                            style={{
                                width: "100%",
                                borderBottomWidth: 1,
                                borderRightWidth: 1,
                                borderLeftWidth: 1,
                                borderColor: "rgba(213, 215, 218, 1)",
                                // height:"100%"
                            }}
                            widthArr={[150, 140, 140, 120, 130, 130, 130, 130, 130, 130, 100, 250, 400]}
                            height={40}
                            textStyle={{textAlign: "center", textAlignVertical: "center"}}
                            data={formatedData.map(row => row.map(data => {
                                if (typeof data === "string") {
                                    return <Text
                                        style={{
                                            flex: 1,
                                            height: "100%",
                                            textAlign: "center",
                                            textAlignVertical: "center",
                                            overflow: "hidden",
                                        }}
                                        numberOfLines={2}
                                        ellipsizeMode='tail'
                                    >{data}</Text>
                                } else {
                                    return <View style={{flexDirection: "row", height: "100%",}}>
                                        {data.map(subData => <Text
                                            style={{
                                                flex: 1,
                                                height: "100%",
                                                textAlign: "center",
                                                textAlignVertical: "center",
                                                overflow: "hidden",
                                            }}
                                            numberOfLines={1}
                                            ellipsizeMode='tail'
                                        >
                                            {subData}
                                        </Text>)}
                                    </View>
                                }
                            }))}
                        />
                    </ScrollView>
                </Table>
            </ScrollView>
            {formatedData.length === 0 &&
                <Text style={[textTheme.titleSmall, {textAlign: "center", marginTop: 20}]}>No Data</Text>}
            {response?.total_records > 10 && <CustomPagination
                setIsModalVisible={setIsEntryModalVisible}
                maxEntry={maxEntry}
                incrementPageNumber={() => setPageNo(prev => prev + 1)}
                decrementPageNumber={() => setPageNo(prev => prev - 1)}
                refreshOnChange={async () => {
                    taxSummaryReportAPI(currentFromDate, currentToDate);
                }}
                currentCount={formatedData.length ?? 0}
                totalCount={response?.total_records}
                resetPageNo={() => {
                    setPageNo(0);
                }}
                isFetching={false}
                currentPage={pageNo}
            />}
        </View>
    )
}

export default TaxesSummaryReportsReportScreen

const styles = StyleSheet.create({
    container: {flex: 1, paddingTop: 20, backgroundColor: '#fff'},
    singleHead: {width: 80, height: 40, backgroundColor: '#c8e1ff'},
    head: {flex: 1, backgroundColor: '#c8e1ff'},
    title: {flex: 2, backgroundColor: '#f6f8fa'},
    titleText: {marginRight: 6, textAlign: 'right'},
    text: {textAlign: 'center'},
    btn: {width: 58, height: 18, marginLeft: 15, backgroundColor: '#c8e1ff', borderRadius: 2},
    btnText: {textAlign: 'center'},
    cardContainerStyle: {
        borderRadius: 8,
        borderColor: '#D5D7DA',
        width: 150,
        height: 80,
        paddingVertical: 15,
        marginRight: 20,
        marginBottom: 20,
    },
});