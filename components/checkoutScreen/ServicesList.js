import {ActivityIndicator, FlatList, ScrollView, ScrollViewBase, StyleSheet, Text, TextInput, View} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import {Ionicons} from '@expo/vector-icons';
import PrimaryButton from "../../ui/PrimaryButton";
import {useState} from "react";
import ServiceItem from "./ServiceItem";
import {useSelector, shallowEqual} from "react-redux";
import {useMemo, useCallback, useReducer} from 'react';
import React from "react";
import SearchBar from "../../ui/SearchBar";


const ServicesList = React.memo((props) => {
    const [isFetching, setIsFetching] = useState(false);
    const servicesData = useSelector(state => state.catalogue.services, shallowEqual);
    const womenServicesData = servicesData.women;
    const [filteredWomenServicesData, setFilteredWomenServicesData] = useState(womenServicesData);
    const menServicesData = servicesData.men;
    const [filteredMenServicesData, setFilteredMenServicesData] = useState(menServicesData);
    const kidsServicesData = servicesData.kids
    const [filteredKidsServicesData, setFilteredKidsServicesData] = useState(kidsServicesData);
    const generalServicesData = servicesData.general;
    const [filteredGeneralServicesData, setFilteredGeneralServicesData] = useState(generalServicesData);


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

    return (
        isFetching ?
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <ActivityIndicator color={Colors.darkBlue} size={"large"}/>
            </View>
            :
            <View style={styles.commonSelectTemplate}>
                <View style={styles.headingAndSearchContainer}>
                    <View style={styles.headingAndSearchContainer}>
                        <SearchBar filter={false}
                                   onPressFilter={() => {
                                   }}
                                   onChangeText={filterServicesData}
                                   placeholder={"Search by service name or prices"}/>
                    </View>
                </View>
                <View>
                    <View style={styles.flatListContainer}>
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
                                                                data={item}
                                                            />
                                                        }}>
                                              </FlatList>
                                          </>
                                      }}/>
                        </ScrollView>
                    </View>
                </View>
            </View>
    );
});

const styles = StyleSheet.create({
    commonSelectTemplate: {
        flex: 1,
    },
    headingAndSearchContainer: {
        padding: 15,
    },
    headingText: {
        marginBottom: 10
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
    genderTextContainer: {
        borderWidth: 2,
        borderRadius: 7,
    },
    genderText: {
        paddingVertical: 4,
        paddingHorizontal: 8
    },
    parentCategoryText: {},
    flatListContainer: {
        marginBottom: 120,
    }
});

export default ServicesList;