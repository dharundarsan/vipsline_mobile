import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Animated, Easing} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Colors from '../../constants/Colors';
import PrimaryButton from "../../ui/PrimaryButton";
import calender_icon from "../../assets/icons/drawerIcons/calendar.png";
import {useNavigation} from "@react-navigation/native";
import {MaterialIcons} from "@expo/vector-icons";

const CustomDrawer = (props) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Split the routes where you want the dropdown
    const routes = props.state.routes;
    const beforeDropdown = routes.slice(0, 1); // Items before "Appointments"
    const afterDropdown = routes.slice(2, -2);    // Items after "Appointments"
    const navigation = useNavigation();
    const dropdownHeight = useRef(new Animated.Value(0)).current; // Animated value for height

    const toggleDropdown = () => {
        if (isDropdownVisible) {
            // Collapse animation
            Animated.timing(dropdownHeight, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
            }).start(() => setIsDropdownVisible(false));
        } else {
            setIsDropdownVisible(true); // Show dropdown immediately
            // Expand animation
            Animated.timing(dropdownHeight, {
                toValue: 100, // Adjust based on the dropdown content height
                duration: 300,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
            }).start();
        }
    };

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
            {/* Render items before the dropdown */}
            {beforeDropdown.map((route) => {
                const descriptor = props.descriptors[route.key];
                const {drawerLabel, drawerIcon} = descriptor.options;

                return (
                    <DrawerItem
                        key={route.key}
                        label={route.name}
                        labelStyle={{marginLeft: -15}}
                        focused={props.state.routeNames[props.state.index] === route.name}
                        onPress={() => props.navigation.navigate(route.name)}
                        activeTintColor={Colors.highlight}
                        icon={drawerIcon}
                        inactiveTintColor={Colors.white}
                    />
                );
            })}
            <View style={{}}>
                <PrimaryButton
                    onPress={() => toggleDropdown()}
                    buttonStyle={[styles.dropdownHeader, {selfAlign: "left"}]}
                    pressableStyle={{
                        flexDirection: "row",
                        marginLeft: 10,
                        gap: 15,
                        alignItems: "center",
                        justifyContent: "left"
                    }}
                >
                    <Image
                        source={{uri: Image.resolveAssetSource(calender_icon).uri}} width={25}
                        height={25}
                        style={{resizeMode: "contain"}}/>
                    <Text style={styles.dropdownHeaderText}>Appointments</Text>
                    <View style={{flex: 1, marginRight: 20}}>
                        <MaterialIcons name="keyboard-arrow-down" style={{marginLeft: "auto"}} size={24}
                                       color="white"/>
                    </View>
                </PrimaryButton>
                <View style={[styles.dropdownContent]}>
                    {isDropdownVisible && (
                        <Animated.View style={{height: dropdownHeight}}>
                            <PrimaryButton
                                buttonStyle={[styles.dropdownHeader, {
                                    selfAlign: "left",
                                    flex: 1,
                                    marginHorizontal: 10
                                }]}
                                pressableStyle={[{
                                    flexDirection: "row",
                                    gap: 15,
                                    paddingLeft: 30,
                                    alignItems: "center",
                                    justifyContent: "left"
                                }, props.state.routeNames[props.state.index] === 'Active Bookings' && {backgroundColor: "rgba(143,125,243,0.15)"}]}
                                onPress={() => props.navigation.navigate('Active Bookings')}>
                                <Image
                                    source={{uri: Image.resolveAssetSource(calender_icon).uri}} width={25}
                                    height={25}
                                    style={{resizeMode: "contain"}}/>
                                <Text
                                    style={[
                                        styles.dropdownHeaderText,
                                        props.state.routeNames[props.state.index] === 'Active Bookings' && styles.activeItem,
                                    ]}
                                >
                                    Active Bookings
                                </Text>
                            </PrimaryButton>
                            <PrimaryButton
                                buttonStyle={[styles.dropdownHeader, {selfAlign: "left", flex: 1, marginHorizontal: 10},
                                ]}
                                pressableStyle={[{
                                    flexDirection: "row",
                                    gap: 15,
                                    paddingLeft: 30,
                                    alignItems: "center",
                                    justifyContent: "left"

                                }, props.state.routeNames[props.state.index] === 'Booking History' && {backgroundColor: "rgba(143,125,243,0.15)"}]}
                                onPress={() => props.navigation.navigate("Booking History")}>
                                <Image
                                    source={{uri: Image.resolveAssetSource(calender_icon).uri}} width={25}
                                    height={25}
                                    style={{resizeMode: "contain"}}/>
                                <Text
                                    style={[
                                        styles.dropdownHeaderText,
                                        props.state.routeNames[props.state.index] === 'Booking History' && styles.activeItem,
                                    ]}
                                >
                                    Booking History
                                </Text>
                            </PrimaryButton>
                        </Animated.View>
                    )}
                </View>
            </View>

            {/* Render items after the dropdown */}
            {afterDropdown.map((route) => {
                const descriptor = props.descriptors[route.key];
                const {drawerLabel, drawerIcon} = descriptor.options;

                return (
                    <DrawerItem
                        key={route.key}
                        // label={() => (
                        //     typeof drawerLabel === 'function' ? drawerLabel() : drawerLabel || route.name
                        // )}
                        label={route.name}
                        labelStyle={{marginLeft: -15}}
                        focused={props.state.routeNames[props.state.index] === route.name}
                        onPress={() => props.navigation.navigate(route.name)}
                        icon={drawerIcon}
                        activeTintColor={Colors.highlight}
                        inactiveTintColor={Colors.white}
                    />
                );
            })}
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    dropdownHeader: {
        backgroundColor: Colors.transparent,
    },
    dropdownHeaderText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '500'
    },
    dropdownContent: {
        backgroundColor: "#000c1c",
    },
    dropdownItem: {
        paddingVertical: 5,
        color: Colors.error,
        fontSize: 14,
    },
    activeItem: {
        fontWeight: 'bold',
        color: Colors.highlight,
    },
});

export default CustomDrawer;
