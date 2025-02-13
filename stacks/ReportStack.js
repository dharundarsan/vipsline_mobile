import {Image, StyleSheet, TouchableOpacity, View} from 'react-native'
import React, {useState} from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SalesListReport from '../screens/Reports/SalesListReport';
import {reportStackDisplay} from '../data/ReportData';
import {BackButton} from './StaffManagementStack';
import PrimaryButton from "../ui/PrimaryButton";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Colors from "../constants/Colors";
import {setIsFilterModalVisible} from "../store/reportSlice";
import {useDispatch} from "react-redux";

const ReportStack = ({navigation}) => {
    const Stack = createNativeStackNavigator();
    const dispatch = useDispatch()
    return (
        <Stack.Navigator initialRouteName='ReportScreen' screenOptions={{headerShown: true}}>
            <Stack.Screen name='ReportScreen' component={SalesListReport} options={{
                headerTitle: 'Reports',
                headerTitleAlign: 'center',
                headerShown: true, headerLeft: () => <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                    <Image
                        source={require('../assets/icons/drawerIcons/drawer.png')}
                        style={{width: 24, height: 24}}
                    />
                </TouchableOpacity>,
            }}/>
            {
                reportStackDisplay.map((item) => item.data.map((dataItem, index) => (
                    <Stack.Screen name={dataItem.navigation} key={index} component={dataItem.component} options={{
                        headerTitle: dataItem.title,
                        headerTitleAlign: 'center',
                        headerShown: true,
                        headerRight: dataItem?.isFilterEnabled ? () => <PrimaryButton
                            buttonStyle={{
                                backgroundColor: Colors.white,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: Colors.grey250,
                            }}
                            pressableStyle={{
                                paddingHorizontal: 7,
                                paddingVertical: 7
                            }}
                            onPress={() => {
                                dispatch(setIsFilterModalVisible(true));
                            }}
                        >
                            <SimpleLineIcons
                                name="equalizer"
                                size={18}
                                // color={Colors.darkBlue}
                            />
                        </PrimaryButton> : null,
                        headerLeft: () => <BackButton/>,
                    }}
                                  initialParams={{
                                      listName: dataItem?.listName,
                                      cardEnabled: dataItem?.cardEnabled,
                                      apiFunction: dataItem?.apiFunction,
                                      apiCountName: dataItem?.apiCountName,
                                      tableHeaderList: dataItem?.tableHeader,
                                      salesListWidthHeader: dataItem?.salesListWidthHeader,
                                      transformTableData: dataItem?.transformTableData,
                                      searchEnabled: dataItem?.searchEnabled,
                                      searchPlaceholder: dataItem?.searchPlaceholder,
                                      cardTitleData: dataItem?.cardTitleData,
                                      cardValueList: dataItem?.cardValueList,
                                      cardCurrencyList: dataItem?.cardCurrencyList,
                                      initialCardValue: dataItem?.initialCardValue,
                                      additionalRowEnabled: dataItem?.additionalRowEnabled,
                                      initialTotalRow: dataItem?.initialTotalRow,
                                      formatMandatoryFields: dataItem?.formatMandatoryFields,
                                      filterItems: dataItem?.filterItems,
                                      useEffectFunction: dataItem?.useEffectFunction,
                                      isFilterEnabled: dataItem?.isFilterEnabled,
                                      disableDate: dataItem?.disableDate,
                                  }}
                    />
                )))
            }
        </Stack.Navigator>
    )
}

export default ReportStack

const styles = StyleSheet.create({})