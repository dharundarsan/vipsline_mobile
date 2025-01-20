import { View, Text, StyleSheet, Image, FlatList, ScrollView, Platform } from "react-native";
import PrimaryButton from "../ui/PrimaryButton";
import Colors from "../constants/Colors";
// import Divider from "../ui/Divider";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import appliedFilter, { chooseFilterCount, clientFilterNames } from "../util/chooseFilter";
import clientFilterDescriptionData from "../data/clientFilterDescriptionData";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import ClientFiltersCategories from "../components/clientSegmentScreen/ClientFiltersCategories";
import ClientCard from "../components/clientSegmentScreen/ClientCard";
import SearchBar from "../ui/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import AddClient from "../components/clientSegmentScreen/AddClient";
import EntryModel from "../components/clientSegmentScreen/EntryModel";
import Pagination from "../components/clientSegmentScreen/Pagination";
import { Bullets } from "react-native-easy-content-loader";
import ClientInfoModal from "../components/clientSegmentScreen/ClientInfoModal";
import {
    clearClientInfo,
    loadAnalyticsClientDetailsFromDb,
    loadClientInfoFromDb,
    resetRewardPageNo,
    updateClientId,
    updateCustomerRewards,
    updateRewardsPointBalance
} from "../store/clientInfoSlice";
import {
    loadClientFiltersFromDb,
    loadSearchClientFiltersFromDb,
    resetClientFilter,
    updateAppliedFilters
} from "../store/clientFilterSlice";
import SearchClientPagination from "../components/clientSegmentScreen/searchClientPagination";
import { clearClientsList, loadClientCountFromDb, loadClientsFromDb } from "../store/clientSlice";
import textTheme from "../constants/TextTheme";
import { clientFilterAPI } from "../apis/ClientSegmentAPIs/clientFilterAPI";
import axios from "axios";
import { checkNullUndefined, convertAppliedFilters } from "../util/Helpers";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import UpdateClientModal from "../components/clientSegmentScreen/UpdateClientModal";
import MoreOptionDropDownModal from "../components/clientSegmentScreen/MoreOptionDropDownModal";
import { useLocationContext } from "../context/LocationContext";
import Toast from "../ui/Toast";
import AdvancedFilters from "../components/clientSegmentScreen/AdvancedFilters";
import CustomTagFilter from "../ui/CustomTagFilter";
import { Divider } from "react-native-paper";
import {loadBusinessNotificationDetails} from "../store/listOfBusinessSlice";


export default function ClientSegmentScreen(props) {

    const dispatch = useDispatch();
    const [filterPressed, setFilterPressed] = useState("all_clients_count");

    const filterClientsList = useSelector(state => state.clientFilter.clients);
    const isFetching = useSelector(state => state.clientFilter.isFetching);
    const [clientCount, setClientCount] = useState(0);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const maxEntry = useSelector(state => state.clientFilter.maxEntry);
    const searchMaxEntry = useSelector(state => state.clientFilter.searchMaxEntry);

    const pageNo = useSelector(state => state.clientFilter.pageNo);
    const searchPageNo = useSelector(state => state.clientFilter.searchPageNo);

    const [isClientInfoModalVisible, setIsClientInfoModalVisible] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const searchClientList = useSelector(state => state.clientFilter.searchClients);

    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");

    const [clientId, setClientId] = useState("");

    const [modalVisibility, setModalVisibility] = useState(false)
    const [editClientModalVisibility, setEditClientModalVisibility] = useState(false);
    const [advancedFilterVisibility, setAdvancedFiltersVisibility] = useState(false);

    const details = useSelector(state => state.clientInfo.details);
    const isSearchClientFetching = useSelector(state => state.clientFilter.isFetchingSearchClient);

    const allClientCountHelper = useSelector(state => state.client.clientCount)
    const activeClientCountHelper = useSelector(state => state.client.clientCount)
    const inActiveClientCountHelper = useSelector(state => state.client.clientCount)
    const churnClientCountHelper = useSelector(state => state.client.clientCount)
    const leadsClientCountHelper = useSelector(state => state.client.clientCount)


    const allClientCount = checkNullUndefined(allClientCountHelper) ? allClientCountHelper[0].all_clients_count : 0;
    const activeClientCount = checkNullUndefined(activeClientCountHelper) ? activeClientCountHelper[0].active_clients_count : 0;
    const inActiveClientCount = checkNullUndefined(inActiveClientCountHelper) ? inActiveClientCountHelper[0].inactive_clients_count : 0;
    const churnClientCount = checkNullUndefined(churnClientCountHelper) ? churnClientCountHelper[0].churn_clients_count : 0;
    const leadsClientCount = checkNullUndefined(leadsClientCountHelper) ? leadsClientCountHelper[0].leads_clients_count : 0;

    const currentFilterClientCount = useSelector(state => state.clientFilter.totalClients);


    const [searchClientTotalCount, setSearchClientTotalCount] = useState(0);

    const businessId = useSelector(state => state.authDetails.businessId);
    const [selectedOption, setSelectedOption] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const toastRef = useRef(null);

    const [selectedFilters, setSelectedFilters] = useState([]);

    const appliedFilterStore = useSelector(state => state.clientFilter.appliedFilters);

    const handleSelectionChange = (updatedFilters) => {

        setSelectedFilters(updatedFilters);

        dispatch(updateAppliedFilters(convertAppliedFilters(appliedFilterStore.fromDate, appliedFilterStore.toDate, updatedFilters)));
    };

    // useEffect(() => {
    //     dispatch(updateAppliedFilters(convertAppliedFilters(appliedFilterStore.fromDate, appliedFilterStore.toDate, selectedFilters)));
    // }, [selectedFilters]);

    const { getLocation, currentLocation } = useLocationContext();
    useFocusEffect(useCallback(() => {
        dispatch(loadClientFiltersFromDb(10, "All"));
        getLocation("Clients");
        dispatch(clearClientInfo())
        dispatch(loadBusinessNotificationDetails())
        // return () => {
        //     dispatch(clearClientInfo());
        // }

    }, []))

    useEffect(() => {
        // setClientCount(chooseFilterCount(filterPressed, allClientCount, activeClientCount, inActiveClientCount, churnClientCount, leadsClientCount));
        // setClientCount(currentFilterClientCount);
    }, [filterPressed]);


    useFocusEffect(
        useCallback(() => {
            dispatch(loadClientCountFromDb())
        }, [businessId])
    );


    useEffect(() => {
        const clientCount = chooseFilterCount(filterPressed, allClientCount, activeClientCount, inActiveClientCount, churnClientCount, leadsClientCount);
        // setClientCount(clientCount);
        // setClientCount(currentFilterClientCount)
        setSearchQuery("");

        async function func() {
            setIsLoading(true)
            await dispatch(loadClientCountFromDb());
            if (currentFilterClientCount <= 10) {
                await dispatch(loadClientFiltersFromDb(10, clientFilterNames(filterPressed)));
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 400)
        }

        func();


    }, [filterPressed]);


    // useEffect(() => {
    //     // dispatch(loadClientFiltersFromDb(10, clientFilterNames(filterPressed)));
    //     // setTimeout(() => {
    //         if(clientCount !== currentFilterClientCount) {
    //             dispatch(loadClientFiltersFromDb(10, clientFilterNames(filterPressed)));
    //         }
    //     // }, 1000)
    // }, [currentFilterClientCount]);

    useEffect(() => {
        async function f() {
            setIsSearchLoading(true);
            if (searchClientTotalCount <= 10) {
                await dispatch(loadSearchClientFiltersFromDb(maxEntry, clientFilterNames(filterPressed), searchQuery));
            }
            // if (currentFilterClientCount !== clientCount) {
            //     dispatch(loadSearchClientFiltersFromDb(maxEntry, clientFilterNames(filterPressed), searchQuery));
            // }
            setTimeout(() => {
                setIsSearchLoading(false);
            }, 200)
        }
        f();

    }, [searchQuery]);


    useFocusEffect(
        useCallback(() => {
            return () => {
                setFilterPressed("all_clients_count");
                dispatch(clearClientInfo());
            }
        }, [])
    )

    // useEffect(() => {
    //     if (clientCount !== currentFilterClientCount) {
    //         dispatch(loadClientFiltersFromDb(10, clientFilterNames(filterPressed)));
    //     }
    // }, [clientCount, currentFilterClientCount, filterPressed]);

    // useEffect(() => {
    //     if (currentFilterClientCount !== clientCount) {
    //         if(searchQuery === "") {
    //             dispatch(loadClientFiltersFromDb(10, clientFilterNames(filterPressed)));
    //         }
    //     }
    // }, [toggle]);


    function renderItem(itemData) {
        return (
            <ClientCard
                name={itemData.item.name}
                phone={itemData.item.mobile}
                email={itemData.item.email}
                onPress={async () => {
                    // if (searchQuery === "") {
                    //     dispatch(loadAnalyticsClientDetailsFromDb(itemData.item.id));
                    // } else {
                    //     dispatch(loadAnalyticsClientDetailsFromDb(itemData.item.id));
                    // }
                    dispatch(loadAnalyticsClientDetailsFromDb(itemData.item.id));
                    dispatch(updateClientId(itemData.item.id));
                    setClientId(itemData.item.id);
                    dispatch(loadClientInfoFromDb(itemData.item.id));
                    clientInfoHandler();
                    clientNamePhoneHandler(itemData.item.name, itemData.item.mobile);
                }}
            // divider={true}
            />
        );
    }

    function clientInfoHandler() {
        setIsClientInfoModalVisible(true);
    }

    function clientNamePhoneHandler(name, phone) {
        setClientName(name);
        setClientPhone(phone);
    }

    const changeSelectedFilter = (filter) => {
        setFilterPressed(filter);
    }

    function editClientOption(option) {
        if (option === "edit") {
            // setIsClientInfoModalVisible(false);
            {
                setEditClientModalVisibility(true);
            }

        }
    }

    function clientSegmentToast(message, duration) {
        toastRef.current.show(message, duration);
    }



    return (
        <ScrollView style={styles.scrollView}>


            <View style={styles.clientSegment}>
                {
                    isModalVisible &&
                    <EntryModel
                        isModalVisible={isModalVisible}
                        setIsModalVisible={setIsModalVisible}
                        filterPressed={filterPressed}
                        query={searchQuery}
                    />
                }

                {/*{*/}
                {/*    editClientModalVisibility &&*/}
                {/*    <UpdateClientModal*/}
                {/*        isVisible={editClientModalVisibility}*/}
                {/*        onCloseModal={() => {*/}
                {/*            dispatch(loadClientInfoFromDb(clientId))*/}
                {/*            dispatch(loadClientFiltersFromDb(10, "All"));*/}
                {/*            dispatch(loadSearchClientFiltersFromDb(10, "All", ""));*/}
                {/*            setEditClientModalVisibility(false);*/}
                {/*            setModalVisibility(false);*/}
                {/*        }}*/}
                {/*        details={details}*/}

                {/*    />*/}
                {/*}*/}


                {
                    isClientInfoModalVisible &&
                    <ClientInfoModal
                        selectedOption={selectedOption}
                        modalVisibility={modalVisibility}
                        setSelectedOption={setSelectedOption}
                        setModalVisibility={setModalVisibility}
                        setEditClientModalVisibility={setEditClientModalVisibility}
                        visible={isClientInfoModalVisible}
                        setVisible={setIsClientInfoModalVisible}
                        closeModal={() => {
                            setIsClientInfoModalVisible(false);
                            dispatch(clearClientInfo());
                            dispatch(loadClientFiltersFromDb(10, "All"));
                        }}
                        editClientOption={editClientOption}
                        name={clientName}
                        phone={clientPhone}
                        id={clientId}
                        setSearchQuery={setSearchQuery}
                        setFilterPressed={setFilterPressed}
                        onClose={() => {
                            setIsClientInfoModalVisible(false)
                            dispatch(clearClientInfo())
                            dispatch(resetRewardPageNo());
                            dispatch(updateCustomerRewards({customerRewardList:[],count:0}))
                            dispatch(updateRewardsPointBalance(0))
                        }}
                        deleteClientToast={() => {
                            clientSegmentToast("client deleted successfully.", 2000);
                        }}
                    />
                }

                {
                    modalVisibility &&
                    <MoreOptionDropDownModal
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                        isVisible={modalVisibility}
                        onCloseModal={() => setModalVisibility(false)}
                        dropdownItems={[
                            "Edit client",
                            "Delete client",
                        ]}
                        setOption={setSelectedOption}
                        setModalVisibility={setModalVisibility}
                    />
                }

                {
                    advancedFilterVisibility &&
                    <AdvancedFilters
                        isVisible={advancedFilterVisibility}
                        onClose={() => setAdvancedFiltersVisibility(false)}
                        selectedOptions={setSelectedFilters}
                        filterPressed={filterPressed}
                        setVisibility={setAdvancedFiltersVisibility}

                    />
                }

                <AddClient />

                <Divider color={Colors.grey250} />
                <Toast ref={toastRef} />

                <View style={styles.clientFilterContainer}>
                    <ClientFiltersCategories
                        changeSelectedFilter={changeSelectedFilter}
                        filterPressed={filterPressed}
                        isLoading={isLoading}
                        searchLoading={isSearchLoading}
                        clientSegmentToast={clientSegmentToast}
                    />
                </View>

                <View style={styles.currentFilter}>
                    <View style={styles.descBullet} />
                    <Text
                        style={[textTheme.titleSmall, styles.descText]}
                    >
                        {appliedFilter(filterPressed) + (filterPressed === "churn_clients_count" ? " (likely to be Inactive)" : "")}
                    </Text>
                </View>
                <Text style={[textTheme.bodyMedium, styles.filterDescText]}>
                    {clientFilterDescriptionData[appliedFilter(filterPressed)]}
                </Text>


                <View style={styles.searchClientContainer}>
                    <SearchBar
                        Bar
                        filter
                        onPressFilter={() => setAdvancedFiltersVisibility(true)}
                        placeholder={"Search by name email or mobile"}
                        searchContainerStyle={[textTheme.bodyMedium, styles.searchBarContainer]}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                        }}
                        value={searchQuery}
                    />
                </View>

                <CustomTagFilter
                    options={selectedFilters}
                    onSelectionChange={handleSelectionChange}
                    filter={clientFilterNames(filterPressed)}
                />

                <View style={styles.clientCount}>
                    <Image source={require("../assets/icons/menu.png")} style={styles.menuImage} />
                    <Text style={[textTheme.bodyMedium, styles.clientCountText]}>
                        Client count : {
                            searchQuery === "" ?
                                currentFilterClientCount :
                                searchClientTotalCount
                        }
                    </Text>
                </View>


                {

                    searchQuery === "" ?
                        <>
                            {
                                currentFilterClientCount === 0 ?
                                    <View style={{ justifyContent: "center", alignItems: "center", marginTop: 32 }}>
                                        <Text style={[textTheme.titleSmall]}>
                                            No clients to display
                                        </Text>
                                    </View> :
                                    !isFetching ?
                                        <FlatList
                                            data={filterClientsList}
                                            renderItem={renderItem}
                                            scrollEnabled={false}
                                            ItemSeparatorComponent={<Divider />}
                                        /> :
                                        <Bullets
                                            tHeight={35}
                                            tWidth={"75%"}
                                            listSize={maxEntry}
                                            aSize={35}
                                            animationDuration={500}
                                            containerStyles={{
                                                paddingVertical: 16,
                                                borderBottomWidth: 1,
                                                borderBottomColor: Colors.grey250
                                            }}
                                            avatarStyles={{ marginLeft: 16 }}
                                        />
                            }

                            {
                                currentFilterClientCount > 10 ?
                                    <>
                                    {!isFetching && 
                                        <Divider />
                                    }
                                        <Pagination
                                            filterPressed={filterPressed}
                                            setIsModalVisible={setIsModalVisible}
                                            totalCount={currentFilterClientCount}
                                        /></>
                                    : null
                            }
                        </> :

                        <>
                            {
                                searchClientTotalCount === 0 ?
                                    <View style={{ justifyContent: "center", alignItems: "center", marginTop: 32 }}>
                                        <Text style={[textTheme.titleSmall]}>
                                            No clients to display
                                        </Text>
                                    </View> :
                                    !isSearchClientFetching ?
                                        <FlatList
                                            data={searchClientList}
                                            scrollEnabled={false}
                                            renderItem={renderItem}
                                        /> :
                                        <Bullets
                                            tHeight={35}
                                            tWidth={"75%"}
                                            listSize={maxEntry}
                                            aSize={35}
                                            animationDuration={500}
                                            containerStyles={{
                                                paddingVertical: 16,
                                                borderBottomWidth: 1,
                                                borderBottomColor: Colors.grey250
                                            }}
                                            avatarStyles={{ marginLeft: 16 }}
                                        />

                            }

                            {
                                <SearchClientPagination
                                    filterPressed={filterPressed}
                                    setIsModalVisible={setIsModalVisible}
                                    query={searchQuery}
                                    setSearchClientTotalCount={setSearchClientTotalCount}
                                />

                            }

                        </>
                }
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    clientSegment: {
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
    },

    clientFilterContainer: {
        marginTop: 20,
    },

    currentFilter: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchClientContainer: {
        marginVertical: 20,
        marginHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    searchBarContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 32,
    },
    clientCount: {
        height: 60,
        borderTopWidth: 1,
        borderTopColor: Colors.grey250,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey250,
        flexDirection: 'row',
        alignItems: 'center',

    },
    clientList: {
        flex: 1,
    },

    addSymbol: {},

    descBullet: {
        width: 12,
        height: 12,
        backgroundColor: Colors.grey400,
        borderRadius: 3,
        marginLeft: 10
    },
    descText: {
        marginLeft: 8,
        fontWeight: '600'
    },
    filterDescText: {
        marginHorizontal: 10
    },
    textInput: {
        width: '75%'
    },
    textInputContainer: {
        width: '80%',
        marginVertical: 15,
    },
    menuImage: {
        width: 24,
        height: 24,
        marginLeft: 24
    },
    clientCountText: {
        marginLeft: 8
    },
    scrollView: {
        backgroundColor: Colors.white
    }
})

