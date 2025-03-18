import {FlatList, Modal, ScrollView, StyleSheet, Text, View} from "react-native";
import {shadowStyling} from "../../util/Helpers";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import React, {useCallback, useState} from "react";
import Colors from "../../constants/Colors";
import ServiceItem from "../checkoutScreen/ServiceItem";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SearchBar from "../../ui/SearchBar";
import {addBooking} from "../../store/newBookingSlice";

const SelectServiceModal = (props) => {
    const servicesData = useSelector(state => state.catalogue.services, shallowEqual);
    const womenServicesData = servicesData.women;
    const [filteredWomenServicesData, setFilteredWomenServicesData] = useState(womenServicesData);
    const menServicesData = servicesData.men;
    const [filteredMenServicesData, setFilteredMenServicesData] = useState(menServicesData);
    const kidsServicesData = servicesData.kids
    const [filteredKidsServicesData, setFilteredKidsServicesData] = useState(kidsServicesData);
    const generalServicesData = servicesData.general;
    const [filteredGeneralServicesData, setFilteredGeneralServicesData] = useState(generalServicesData);
    const dispatch = useDispatch();

    const filterServicesData = useCallback((filterValue) => {
        const lowerCaseFilterValue = filterValue.toLowerCase();

        // Filter function to apply on each category
        const filterCategory = (categoryData) => {
            return categoryData.reduce((acc, item) => {
                const filteredResourceCategories = item.resource_categories.filter((category) => {
                    return category.name.toLowerCase().includes(lowerCaseFilterValue) ||
                        category.price.toString().includes(filterValue);
                });

                if (filteredResourceCategories.length > 0) {
                    acc.push({
                        ...item,
                        resource_categories: filteredResourceCategories
                    });
                }

                return acc;
            }, []);
        };

        // Apply filtering to each category's data
        const filteredWomen = filterCategory(womenServicesData);
        const filteredMen = filterCategory(menServicesData);
        const filteredKids = filterCategory(kidsServicesData);
        const filteredGeneral = filterCategory(generalServicesData);

        // Batch state updates to avoid multiple re-renders
        setFilteredWomenServicesData(filteredWomen);
        setFilteredMenServicesData(filteredMen);
        setFilteredKidsServicesData(filteredKids);
        setFilteredGeneralServicesData(filteredGeneral);

    }, [womenServicesData, menServicesData, kidsServicesData, generalServicesData]);

    return <Modal style={{flex: 1}} visible={props.isVisible} animationType={"slide"}
                  presentationStyle={"pageSheet"}>
        <View style={[styles.closeAndHeadingContainer, shadowStyling]}>
            <Text style={[textTheme.titleLarge, styles.selectClientText]}>Select Service</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={() => {
                    props.onClose()
                }}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <View style={{flex: 1}}>
            <SearchBar filter={false}
                       searchContainerStyle={{
                           marginTop: 20,
                           marginHorizontal: 15,
                       }}
                       onChangeText={filterServicesData}
                       placeholder={"Search by service name or prices"}/>
            <ScrollView fadingEdgeLength={75}>
                <FlatList data={filteredWomenServicesData}
                          scrollEnabled={false}
                          renderItem={({item}) => {
                              return item.resource_categories.length === 0 ? <></> : <>
                                  <View style={styles.parentCategoryAndGenderContainer}>
                                      <Text
                                          style={[textTheme.titleMedium, styles.parentCategoryText]}>{item.parent_category}</Text>
                                      <View
                                          style={[styles.genderTextContainer, {borderColor: Colors.orange}]}>
                                          <Text
                                              style={[textTheme.labelMedium, styles.genderText]}>Women</Text>
                                      </View>
                                  </View>
                                  <FlatList data={item.resource_categories}
                                            renderItem={({item}) => {
                                                return <ServiceItem
                                                    closeOverallModal={props.closeOverallModal}
                                                    leftBarColor={Colors.orange}
                                                    data={item}
                                                    overrideOnPress={() => {
                                                        props.onPress(item)
                                                        props.onClose()
                                                    }}
                                                />
                                            }}>
                                  </FlatList>
                              </>
                          }}/>
                <FlatList data={filteredMenServicesData}
                          scrollEnabled={false}
                          renderItem={({item}) => {
                              return item.resource_categories.length === 0 ? <></> : <>
                                  <View style={styles.parentCategoryAndGenderContainer}>
                                      <Text
                                          style={[textTheme.titleMedium, styles.parentCategoryText]}>{item.parent_category}</Text>
                                      <View
                                          style={[styles.genderTextContainer, {borderColor: Colors.blue}]}>
                                          <Text
                                              style={[textTheme.labelMedium, styles.genderText]}>Men</Text>
                                      </View>
                                  </View>
                                  <FlatList data={item.resource_categories}
                                            renderItem={({item}) => {
                                                return <ServiceItem
                                                    closeOverallModal={props.closeOverallModal}
                                                    leftBarColor={Colors.blue}
                                                    data={item}
                                                    overrideOnPress={() => {
                                                        props.onPress(item);
                                                        props.onClose();
                                                    }}
                                                />
                                            }}>
                                  </FlatList>
                              </>
                          }}/>
                <FlatList data={filteredKidsServicesData}
                          scrollEnabled={false}
                          renderItem={({item}) => {
                              return item.resource_categories.length === 0 ? <></> : <>
                                  <View style={styles.parentCategoryAndGenderContainer}>
                                      <Text
                                          style={[textTheme.titleMedium, styles.parentCategoryText]}>{item.parent_category}</Text>
                                      <View
                                          style={[styles.genderTextContainer, {borderColor: Colors.purple}]}>
                                          <Text
                                              style={[textTheme.labelMedium, styles.genderText]}>Kids</Text>
                                      </View>
                                  </View>
                                  <FlatList data={item.resource_categories}
                                            renderItem={({item}) => {
                                                return <ServiceItem
                                                    closeOverallModal={props.closeOverallModal}
                                                    leftBarColor={Colors.purple}
                                                    data={item}
                                                    overrideOnPress={() => {
                                                        props.onPress(item);
                                                        props.onClose()
                                                    }}
                                                />
                                            }}>
                                  </FlatList>
                              </>
                          }}/>
                <FlatList data={filteredGeneralServicesData}
                          scrollEnabled={false}
                          renderItem={({item}) => {
                              return item.resource_categories.length === 0 ? <></> : <>
                                  <View style={styles.parentCategoryAndGenderContainer}>
                                      <Text
                                          style={[textTheme.titleMedium, styles.parentCategoryText]}>{item.parent_category}</Text>
                                      <View
                                          style={[styles.genderTextContainer, {borderColor: Colors.brown}]}>
                                          <Text
                                              style={[textTheme.labelMedium, styles.genderText]}>General</Text>
                                      </View>
                                  </View>
                                  <FlatList data={item.resource_categories}
                                            renderItem={({item}) => {
                                                return <ServiceItem
                                                    closeOverallModal={props.closeOverallModal}
                                                    leftBarColor={Colors.brown}
                                                    overrideOnPress={() => {
                                                        props.onPress(item);
                                                        props.onClose();
                                                    }}
                                                    data={item}
                                                />
                                            }}>
                                  </FlatList>
                              </>
                          }}/>
            </ScrollView>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    closeAndHeadingContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 60,
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
    genderTextContainer: {
        borderWidth: 2,
        borderRadius: 7,
    },
    parentCategoryAndGenderContainer: {
        marginHorizontal: 20,
        marginVertical: 20,
        width: '65%',
        flexDirection: "row",
        // justifyContent:"center",
        alignItems: "center",
        gap: 15,
    },
    genderText: {
        paddingVertical: 4,
        paddingHorizontal: 8
    },
})

export default SelectServiceModal