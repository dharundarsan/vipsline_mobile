import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SalesListReport from '../screens/Reports/SalesListReport';
import SalesListReportScreen from '../screens/Reports/SalesListReportScreen';
import { BackButton } from './StaffManagementStack';

const ReportStack = ({ navigation }) => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName='Reports' screenOptions={{ headerShown: true }}>
            <Stack.Screen name='Reports' component={SalesListReport} options={{
                headerShown: true, headerLeft: () => <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                    <Image
                        source={require('../assets/icons/drawerIcons/drawer.png')}
                        style={{ width: 24, height: 24 }}
                    />
                </TouchableOpacity>,
            }} />
            <Stack.Screen name='Sales list report' component={SalesListReportScreen} options={{
                headerShown: true, 
                headerTitleAlign: 'center',
                headerLeft: () => <BackButton />
            }}
            />
        </Stack.Navigator>
    )
}

export default ReportStack

const styles = StyleSheet.create({})