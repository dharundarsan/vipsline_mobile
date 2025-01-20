import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import useDateRange from '../../../hooks/useDateRange';
import DatePicker from '../../../ui/DatePicker';
import TextTheme from '../../../constants/TextTheme';
import SearchBar from '../../../ui/SearchBar';
import EntryPicker from '../../../components/common/EntryPicker';
import SortableHeader from '../../../components/ReportScreen/SortableHeader';
import CustomPagination from '../../../components/common/CustomPagination';
import { Row, Table } from "react-native-table-component";
import Colors from '../../../constants/Colors';
import CustomImageTextCard from '../../../ui/CustomImageTextCard';
import { fetchPaymentModeReportForBusiness } from '../../../store/reportSlice';
import { formatDateYYYYMMDD } from '../../../util/Helpers';
import moment from 'moment';

const PaymentModeReportScreen = ({ route }) => {

  const {
    tableHeaderList, salesListWidthHeader,
    transformTableData
  } = route.params;
  const dispatch = useDispatch();

  const [getSortOrderKey, setGetSortOrderKey] = useState("");
  const [toggleSortItem, setToggleSortItem] = useState("name");
  const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);
  const [query, setQuery] = useState("")
  const [dataList, setDataList] = useState([])
  const [maxPageCount, setMaxPageCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [maxEntry, setMaxEntry] = useState(10);
  const [modeFilter, setModeFilter] = useState(undefined);
  const [currentCardActive, setCurrentCardActive] = useState("Total Value");
  const cardTitleData = [
    {
      title: "Total Value",
      method: undefined,
    },
    {
      title: "Cash",
      method: "CASH",
    },
    {
      title: "Card",
      method: "CARD",
    },
    {
      title: "Digital Payment",
      method: "DIGITAL PAYMENTS",
    },
    {
      title: "Prepaid Redeemed",
      method: "Prepaid",
    },
    {
      title: "Rewards Redeemed",
      method: "Rewards",
    },
  ]

  const cardInitialValue = [
    {
      value: 0
    },
    {
      mode_of_payment: "CASH",
      value: 0
    },
    {
      mode_of_payment: "CARD",
      value: 0
    },
    {
      mode_of_payment: "DIGITAL PAYMENTS",
      value: 0
    },
    {
      mode_of_payment: "PREPAID",
      value: 0
    },
    {
      mode_of_payment: "REWARDS",
      value: 0
    }
  ]
  const cardValue = useRef(cardInitialValue);
  const sortName = toggleSortItem !== "" ? toggleSortItem : "name"

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
      dispatch(fetchPaymentModeReportForBusiness(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", modeFilter))
        .then(res => {
          setMaxPageCount(res.data[0].total_payment_count)
          const transformedData = transformTableData(res.data[0].payment_report_summary)

          const changedData = cardValue.current.map(desired => {
            const matchingEntry = res.data[0].paymentTotalData.find(item =>
              item.mode_of_payment === desired.mode_of_payment
            );

            if (matchingEntry) {
              if (desired.mode_of_payment === undefined) {
                return { ...desired, value: matchingEntry.total_amount || 0 };
              }
              if (desired.mode_of_payment === "CASH") {
                return { ...desired, value: matchingEntry.cash_amount || 0 };
              }
              if (desired.mode_of_payment === "CARD") {
                return { ...desired, value: matchingEntry.card_amount || 0 };
              }
              if (desired.mode_of_payment === "REWARDS") {
                return { ...desired, value: matchingEntry.rewards_amount || 0 }
              }
              if (desired.mode_of_payment === "DIGITAL PAYMENTS") {
                return { ...desired, value: matchingEntry.digital_amount || 0 }
              }
              if (desired.mode_of_payment === "PREPAID") {
                return { ...desired, value: matchingEntry.amount || 0 }
              }
              // return { ...desired, value: matchingEntry.amount || 0 };
            }
            return desired;
          });
          cardValue.current = res.data[0].paymentTotalData.length > 1 ? changedData : cardInitialValue;
          setDataList(transformedData);
        })
    },
    onDateChangeMonth: (firstDate, SecondDate) => {
      dispatch(fetchPaymentModeReportForBusiness(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", modeFilter))
        .then(res => {
          setMaxPageCount(res.data[0].total_payment_count)
          const transformedData = transformTableData(res.data[0].payment_report_summary)
          setDataList(transformedData);
        })

    },
    onFirstCustomRangeSelected: (firstDate, SecondDate) => {
      dispatch(fetchPaymentModeReportForBusiness(0, 10, moment(firstDate, 'ddd, DD MMM YYYY').format('YYYY-MM-DD'), moment(SecondDate, 'ddd, DD MMM YYYY').format('YYYY-MM-DD'), query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", modeFilter))
        .then(res => {
          setMaxPageCount(res.data[0].total_payment_count)
          const transformedData = transformTableData(res.data[0].payment_report_summary)
          setDataList(transformedData);
        })

    },
    onFirstOptionCustomChange: (firstDate, SecondDate) => {
      dispatch(fetchPaymentModeReportForBusiness(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", modeFilter))
        .then(res => {
          setMaxPageCount(res.data[0].total_payment_count)
          const transformedData = transformTableData(res.data[0].payment_report_summary)
          setDataList(transformedData);
        })

    },
    onSecondOptionCustomChange: (firstDate, SecondDate) => {
      dispatch(fetchPaymentModeReportForBusiness(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", modeFilter))
        .then(res => {
          setMaxPageCount(res.data[0].total_payment_count)
          const transformedData = transformTableData(res.data[0].payment_report_summary)
          setDataList(transformedData);
        })

    },
  });

  function onChangeData(res) {
    const transformedData = transformTableData(res.data[0].payment_report_summary)
    setDataList(transformedData);
  }

  const calculateColumnWidths = useMemo(() => {
    return salesListWidthHeader.map((header, index) => {
      const headerWidth = header.length * 14;
      const maxDataWidth = dataList.reduce((maxWidth, row) => {
        const cellContent = row[index] || '';
        return Math.max(maxWidth, cellContent.length * 16);
      }, 0);
      return Math.max(headerWidth, maxDataWidth);
    });
  }, [dataList]);

  const widthArr = calculateColumnWidths;

  function onPressCard(method) {
    setCurrentCardActive(method)
    if (method === "Total Value") {
      setModeFilter(undefined);
      dispatch(fetchPaymentModeReportForBusiness(0, 10, currentFromDate, currentToDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", undefined))
        .then(res => {
          setMaxPageCount(res.data[0].total_payment_count)
          const transformedData = transformTableData(res.data[0].payment_report_summary)
          setDataList(transformedData);
        })
    }
    else if (method === "Cash") {
      setModeFilter("CASH");
      dispatch(fetchPaymentModeReportForBusiness(0, 10, currentFromDate, currentToDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", "CASH"))
        .then(res => {
          setMaxPageCount(res.data[0].total_payment_count)
          const transformedData = transformTableData(res.data[0].payment_report_summary)
          setDataList(transformedData);
        })
    }
    else if (method === "Card") {
      setModeFilter("CARD");
      dispatch(fetchPaymentModeReportForBusiness(0, 10, currentFromDate, currentToDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", "CARD"))
        .then(res => {
          setMaxPageCount(res.data[0].total_payment_count)
          const transformedData = transformTableData(res.data[0].payment_report_summary)
          setDataList(transformedData);
        })
    }
    else if (method === "Digital Payment") {
      setModeFilter("DIGITAL PAYMENTS")
      dispatch(fetchPaymentModeReportForBusiness(0, 10, currentFromDate, currentToDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", "DIGITAL PAYMENTS"))
        .then(res => {
          setMaxPageCount(res.data[0].total_payment_count)
          const transformedData = transformTableData(res.data[0].payment_report_summary)
          setDataList(transformedData);
        })
    }
    else if (method === "Prepaid Redeemed") {
      setModeFilter("Prepaid Redeemed")
      dispatch(fetchPaymentModeReportForBusiness(0, 10, currentFromDate, currentToDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", "Prepaid"))
        .then(res => {
          setMaxPageCount(res.data[0].total_payment_count)
          const transformedData = transformTableData(res.data[0].payment_report_summary)
          setDataList(transformedData);
        })
    }
    else if (method === "Rewards Redeemed") {
      setModeFilter("REWARDS")
      dispatch(fetchPaymentModeReportForBusiness(0, 10, currentFromDate, currentToDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", "REWARDS"))
        .then(res => {
          setMaxPageCount(res.data[0].total_payment_count)
          const transformedData = transformTableData(res.data[0].payment_report_summary)
          setDataList(transformedData);
        })
    }
  }

  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchPaymentModeReportForBusiness(0, 10, formatDateYYYYMMDD(0), formatDateYYYYMMDD(0)))
        .then((res) => {
          setMaxPageCount(res.data[0].total_payment_count)
          const transformedData = transformTableData(res.data[0].payment_report_summary)
          setDataList(transformedData);
        })
    }
    fetchData()
  }, [])

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
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
          cardTitleData.map((item, index) => {
            return (
              <CustomImageTextCard
                key={index}
                title={item.title}
                value={cardValue.current[index].value}
                containerStyle={[styles.cardContainerStyle, currentCardActive === item.title ? styles.selectedCardStyle : null]}
                imgTextContainerStyle={{ marginBottom: 7 }}
                valueStyle={TextTheme.titleSmall}
                onPress={onPressCard}
                disabled={false}
                enableRupee
              />
            )
          })
        }
      </ScrollView>
      <SearchBar
        onChangeText={(text) => {
          setQuery(text)
          dispatch(fetchPaymentModeReportForBusiness(0, maxPageCount, currentFromDate, currentToDate, text))
            .then(res => {
              setMaxPageCount(res.data[0].total_payment_count)
              const transformedData = transformTableData(res.data[0].payment_report_summary)
              setDataList(transformedData);
            })
        }}
        placeholder="Search By Invoice Number"
        searchContainerStyle={{ marginBottom: 20, marginHorizontal: 20 }}
        logoAndInputContainer={{ borderWidth: 1, borderColor: Colors.grey250 }}
        value={query}
      />
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
        <View style={{ paddingHorizontal: 20 }}>
          <Table borderStyle={{ borderColor: '#c8e1ff' }}>
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
                    onChangeFunction={fetchPaymentModeReportForBusiness}
                    maxEntry={maxEntry}
                    fromDate={currentFromDate}
                    toDate={currentToDate}
                    query={query}
                    onSortChange={setToggleSortItem}
                    onChangeData={onChangeData}
                    setGetSortOrderKey={setGetSortOrderKey}
                    sortOrderKey={getSortOrderKey}
                  />
                ))
              }
              textStyle={{ flex: 1, width: "100%", paddingVertical: 10 }}
              widthArr={dataList.length > 0 ? widthArr : undefined}
              style={{ borderWidth: 1, borderColor: Colors.grey250, backgroundColor: Colors.grey150 }}
            />
            {dataList.length > 0 ? (
              <>
                {
                  dataList.map((rowData, rowIndex) => (
                    <Row
                      key={rowIndex}
                      data={rowData.map((cell, cellIndex) => {
                        return (
                          <Text style={[styles.text, { paddingHorizontal: 10 }]}>
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
      </ScrollView>
      {
        maxPageCount > 10 &&
        <CustomPagination
          setIsModalVisible={setIsEntryModalVisible}
          maxEntry={maxEntry}
          incrementPageNumber={() => setPageNo(prev => prev + 1)}
          decrementPageNumber={() => setPageNo(prev => prev - 1)}
          refreshOnChange={async () =>
            dispatch(fetchPaymentModeReportForBusiness(pageNo, maxEntry, currentFromDate, currentToDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc", modeFilter))
              .then(res => {
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

export default PaymentModeReportScreen

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
    // minWidth: "20%",
    paddingVertical: 15,
    marginRight: 20,
    marginBottom: 20,
  },
  selectedCardStyle: {
    borderColor: '#6950f3',
    backgroundColor: '#e7e8ff'
  }
})