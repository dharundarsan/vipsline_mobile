import {ScrollView, Text, View, StyleSheet} from "react-native";
import CampaignReportTable from "./CampaignReportTable";
import React, {useEffect, useState} from "react";
import whatsappReportByBusinessAPI from "../../apis/marketingAPI/serviceRemindersAPI/whatsappReportByBusinessAPI";
import useDateRange from "../../hooks/useDateRange";
import {formatAndFilterCardData} from "../../data/ReportData";
import moment from "moment/moment";
import DatePicker from "../../ui/DatePicker";
import Colors from "../../constants/Colors";
import EntryPicker from "../../components/common/EntryPicker";
import CustomPagination from "../../components/common/CustomPagination";
import SMSReminderAPI from "../../apis/marketingAPI/serviceRemindersAPI/SMSReminderAPI";

export default function SMSReminderReport() {
    const whatsAppListHeader = ["SENT DATE & TIME", "CUSTOMER  ", "MATCHING SERVICES", "REMINDER SEQUENCE", "CHANNEL", "DELIVERY STATUS", "WHATSAPP DEDUCTED"];

    const tableHeaderList = [
        {key: "r.name", sortKey: "r.name", title: "SENT DATE & TIME"},
        {key: "shift", sortKey: "shift", title: "CUSTOMER"},
        {key: "firstCheckinTime", sortKey: "firstCheckinTime", title: "MATCHING SERVICES"},
        {key: "lastCheckoutTime", sortKey: "lastCheckoutTime", title: "REMINDER SEQUENCE"},
        {key: "duration", sortKey: "duration", title: "CHANNEL"},
        {key: "status", sortKey: "", title: "DELIVERY STATUS"},
        {key: "lk,ominujbhytg", sortKey: "", title: "WHATSAPP DEDUCTED"},
    ]

    const [dataList, setDataList] = useState([]);
    const [maxPageCount, setMaxPageCount] = useState(0);
    const [pageNo, setPageNo] = useState(0);
    const [maxEntry, setMaxEntry] = useState(10);
    const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);



    function renderItem(data, index) {
        if (index === 2) {
            const formatted_data = data.split("\n");
            const first_line = formatted_data[0];
            const second_line = formatted_data[1];
            return <View style={{padding: 8}}>
                <Text>
                    {first_line}
                </Text>
                <Text style={{color: Colors.grey500}}>
                    Serviced on {second_line}
                </Text>
            </View>
        }
        else if (index === 3) {
            const formatted_data = data.split("\n");
            const first_line = formatted_data[0];
            const second_line = formatted_data[1];
            return <View style={{padding: 8}}>
                <Text>
                    {first_line}
                </Text>
                <Text style={{color: Colors.grey500}}>
                    After {second_line} of service
                </Text>
            </View>
        }
        return (
            <Text style={{padding: 8}}>{data}</Text>
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
        onDateChangeDays: (firstDate, SecondDate) => {
            fetchData(firstDate, SecondDate, pageNo, maxEntry);
        },
        onDateChangeMonth: (firstDate, SecondDate) => {
            fetchData(firstDate, SecondDate, pageNo, maxEntry);
        },
        onFirstCustomRangeSelected: (firstDate, SecondDate) => {
            fetchData(firstDate, SecondDate, pageNo, maxEntry);
        },
        onFirstOptionCustomChange: (firstDate, SecondDate) => {
            fetchData(firstDate, SecondDate, pageNo, maxEntry);
        },
        onSecondOptionCustomChange: (firstDate, SecondDate) => {
            fetchData(firstDate, SecondDate, pageNo, maxEntry);
        },
    });

    function fetchData(fromDate, toDate, pageNo, pageSize) {
        SMSReminderAPI(
            fromDate,
            toDate,
            pageNo,
            pageSize,
        ).then((res) => {
            setDataList(res.data.data[0].campaign)
            setMaxPageCount(res.data.data[0].count)
        })
    }

    useEffect(() => {
        fetchData(currentFromDate, currentToDate, 0, 10);
    }, []);

    return (
        <View style={styles.whatsappReport}>
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
            <ScrollView horizontal={true} style={{flexGrow: 0}} showsHorizontalScrollIndicator={false}>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <CampaignReportTable
                        pageNo={10}
                        dataList={dataList}
                        tableHeaderList={tableHeaderList}
                        currentToDate={new Date()}
                        apiFunction={() => {}}
                        currentFromDate={new Date()}
                        maxEntry={10}
                        onChangeData={(data) => {}}
                        tableWidthHeader = {whatsAppListHeader}
                        renderItem={renderItem}
                        mergedColumns={["date", "client_name + mobile", "services + service_date", "reminder_no + next_reminder", "channel", "status", "credit_deducted"]}

                    />
                </ScrollView>
            </ScrollView>

            {
                maxPageCount > 10 &&
                <CustomPagination
                    setIsModalVisible={setIsEntryModalVisible}
                    maxEntry={maxEntry}
                    incrementPageNumber={() => setPageNo(prev => prev + 1)}
                    decrementPageNumber={() => setPageNo(prev => prev - 1)}
                    refreshOnChange={async () => {
                        fetchData(currentFromDate, currentToDate, pageNo, maxEntry);
                    }}
                    currentCount={dataList?.length ?? 1}
                    totalCount={maxPageCount}
                    resetPageNo={() => {
                        setPageNo(0);
                    }}
                    isFetching={isPageLoading}
                    currentPage={pageNo}
                />
            }

        </View>
    )
}

const styles = StyleSheet.create({
    whatsappReport: {
        flex: 1,
        padding: 12,
        backgroundColor: Colors.white
    }
})