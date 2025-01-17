import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import useDateRange from '../../../hooks/useDateRange';
import DatePicker from '../../../ui/DatePicker';
import TextTheme from '../../../constants/TextTheme';
import SearchBar from '../../../ui/SearchBar';
import Colors from '../../../constants/Colors';
import EntryPicker from '../../../components/common/EntryPicker';
import CustomPagination from '../../../components/common/CustomPagination';
import { Row, Table } from "react-native-table-component";
import SortableHeader from '../../../components/ReportScreen/SortableHeader';
import { formatDateYYYYMMDD } from '../../../util/Helpers';
import { formatAndFilterCardData, formatMandatoryFields } from '../../../data/ReportData';
import CustomImageTextCard from '../../../ui/CustomImageTextCard';
import moment from 'moment';

const CommonReportSaleScreen = ({ route }) => {
  const { listName, cardEnabled = false, apiFunction, apiCountName,
    tableHeaderList, salesListWidthHeader, cardTitleData,
    cardValueList, initialCardValue, cardCurrencyList,
    transformTableData, searchEnabled, searchPlaceholder,
    initialTotalRow, additionalRowEnabled = false
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

  const cardValue = useRef(initialCardValue ?? []);
  const additionalRowDataList = useRef(initialTotalRow ?? []);
  const sortName = toggleSortItem !== "" ? toggleSortItem : undefined

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
      dispatch(apiFunction(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"))
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
      dispatch(apiFunction(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"))
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
      dispatch(apiFunction(0, 10, moment(firstDate, 'ddd, DD MMM YYYY').format('YYYY-MM-DD'), moment(SecondDate, 'ddd, DD MMM YYYY').format('YYYY-MM-DD'), query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"))
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
      dispatch(apiFunction(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"))
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
      dispatch(apiFunction(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"))
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
    const transformedData = transformTableData(res.data[0][listName])
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

  useEffect(() => {
    const fetchData = () => {
      dispatch(apiFunction(0, 10, formatDateYYYYMMDD(0), formatDateYYYYMMDD(0)))
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
      {
        cardEnabled &&
        <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 20 }} showsHorizontalScrollIndicator={false}>
          {
            cardTitleData.map((item, index) => {
              return (
                <CustomImageTextCard
                  key={index}
                  title={item}
                  value={cardValue.current[index]?.value ?? 0}
                  containerStyle={styles.cardContainerStyle}
                  imgTextContainerStyle={{ marginBottom: 7 }}
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
            dispatch(apiFunction(0, maxPageCount, currentFromDate, currentToDate, text))
              .then(res => {
                setMaxPageCount(res.data[0][apiCountName])
                const transformedData = transformTableData(res.data[0][listName])
                setDataList(transformedData);
              })
          }}
          placeholder={searchPlaceholder}
          searchContainerStyle={{ marginBottom: 20, marginHorizontal: 20 }}
          logoAndInputContainer={{ borderWidth: 1, borderColor: Colors.grey250 }}
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
                    onChangeFunction={apiFunction}
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
                {
                  additionalRowEnabled && <Row
                    data={additionalRowDataList.current.map((cell, cellIndex) => {
                      return (
                        <Text style={[styles.text, TextTheme.titleSmall, { paddingHorizontal: 10 }]}>
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
            dispatch(apiFunction(pageNo, maxEntry, currentFromDate, currentToDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"))
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
})