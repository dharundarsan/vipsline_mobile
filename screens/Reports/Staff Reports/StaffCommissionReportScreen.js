import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import {ScrollView} from 'react-native';
import {Table, TableWrapper, Col, Cols, Cell, Row, Rows} from 'react-native-table-component';
import PrimaryButton from "../../../ui/PrimaryButton";
import Colors from "../../../constants/Colors";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {checkAPIError} from "../../../util/Helpers";
import CustomPagination from "../../../components/common/CustomPagination";
import EntryPicker from "../../../components/common/EntryPicker";
import TextTheme from "../../../constants/TextTheme";
import DatePicker from "../../../ui/DatePicker";
import useDateRange from "../../../hooks/useDateRange";
import {formatAndFilterCardData} from "../../../data/ReportData";
import moment from "moment/moment";
import textTheme from "../../../constants/TextTheme";
import CustomImageTextCard from "../../../ui/CustomImageTextCard";

const StaffCommissionReportScreen = () => {
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
            staffCommissionReportAPI(firstDate, SecondDate)
        },
        onDateChangeMonth: (firstDate, SecondDate) => {
            staffCommissionReportAPI(firstDate, SecondDate)
        },
        onFirstCustomRangeSelected: (firstDate, SecondDate) => {

        },
        onFirstOptionCustomChange: (firstDate, SecondDate) => {
            staffCommissionReportAPI(firstDate, SecondDate)
        },
        onSecondOptionCustomChange: (firstDate, SecondDate) => {
            staffCommissionReportAPI(firstDate, SecondDate)
        },
    });

    const staffCommissionReportAPI = async (fromDate, toDate) => {
        try {
            setIsLoading(true);
            const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + `/analytics/getStaffCommissionReportsByBusiness`, {
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
            setResponse(response.data.data)
            setFormatedData(response.data.data.map(item => [
                item.resource_name,
                [item.commission_type, "₹" + item.service_value.toString(), "₹" + item.total_commission.toString()],
                "₹" + item.total_commission.toString()
            ]))
            return response;
        } catch (e) {
            console.error("Error: Staff commission report API")
        }
    }

    const tableHeader = [
        'STAFF NAME',
        {
            title: "PROFILE",
            children: ["PROFILE NAME", "ELIGIBLE SALES VALUE", "COMMISSION VALUE"]
        },
        'TOTAL COMMISSION VALUE',
    ]

    return (
        <View style={styles.container}>
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

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flexGrow: 0}}>
                <Table style={{}}>
                    <Row
                        widthArr={[150, 400, 145]}
                        data={tableHeader.map(header => {
                            if (typeof header === "string") {
                                return <Text style={{
                                    textAlign: "center",
                                    // paddingHorizontal: 5,
                                    // paddingVertical: 5,
                                    borderColor: "rgba(213, 215, 218, 1)",
                                    textAlignVertical: "center",
                                    height: "100%",
                                    borderRightWidth: 1
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
                                        borderRightWidth: 1,
                                        height: "100%",
                                        textAlignVertical: "center",
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
                            widthArr={[150, 400, 145]}
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
        </View>
    )
}

export default StaffCommissionReportScreen

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