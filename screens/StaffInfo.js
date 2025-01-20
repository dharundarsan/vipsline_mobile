import {View, StyleSheet, Text} from "react-native";
import {useLayoutEffect, useState} from "react";
import Swiper from 'react-native-swiper'
import Colors from "../constants/Colors";
import PrimaryButton from "../ui/PrimaryButton";
import textTheme from "../constants/TextTheme";
import StaffProfile from "../components/staffManagementScreen/StaffProfile";
import Workspace from "../components/staffManagementScreen/Workspace";
import CustomSwiper from "../components/common/CustomSwiper";

export default function StaffInfo(props) {
    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerTitle: props.route.params.name,
        })
    }, []);

    return <View style={styles.staffInfo}>

        <CustomSwiper
            tabContainerStyle={{backgroundColor: Colors.white}}
            tabTextStyle={[textTheme.titleMedium]}
        >
            <StaffProfile tabLabel={"Staff profile"} id={props.route.params.id}/>
            <Workspace tabLabel={"Workspace"} staffName={props.route.params.name} id={props.route.params.id}/>
        </CustomSwiper>
    </View>
}

const styles = StyleSheet.create({
    staffInfo: {
        flex: 1,
    },
    topNavigationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    topNavigationSegmentContainer: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 0,
        backgroundColor: Colors.white,
    },
    topNavigationLabel: {
    }
})