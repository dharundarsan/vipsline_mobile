import {View, Text, StyleSheet, Image, FlatList, ScrollView} from "react-native";
import PrimaryButton from "../ui/PrimaryButton";
import Colors from "../constants/Colors";
import Divider from "../ui/Divider";
import React, {useCallback, useEffect, useLayoutEffect, useState} from "react";
import appliedFilter, {chooseFilterCount, clientFilterNames} from "../util/chooseFilter";
import clientFilterDescriptionData from "../data/clientFilterDescriptionData";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import ClientFiltersCategories from "../components/clientSegmentScreen/ClientFiltersCategories";
import ClientCard from "../components/clientSegmentScreen/ClientCard";
import SearchBar from "../ui/SearchBar";
import {useDispatch, useSelector} from "react-redux";
import AddClient from "../components/clientSegmentScreen/AddClient";
import EntryModel from "../components/clientSegmentScreen/EntryModel";
import Pagination from "../components/clientSegmentScreen/Pagination";
import {Bullets} from "react-native-easy-content-loader";
import ClientInfoModal from "../components/clientSegmentScreen/ClientInfoModal";
import {
    clearClientInfo,
    loadAnalyticsClientDetailsFromDb,
    loadClientInfoFromDb,
    updateClientId
} from "../store/clientInfoSlice";
import {loadClientFiltersFromDb, loadSearchClientFiltersFromDb} from "../store/clientFilterSlice";
import SearchClientPagination from "../components/clientSegmentScreen/searchClientPagination";
import {loadClientCountFromDb} from "../store/clientSlice";
import textTheme from "../constants/TextTheme";
import {clientFilterAPI} from "../util/apis/clientFilterAPI";
import axios from "axios";
import {checkNullUndefined} from "../util/Helpers";


export default function ClientSegmentScreen() {

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

    const [pageNo1, setPageNo1] = useState(0);
    const [maxEntry1, setMaxEntry1] = useState(10);

    const [isLoading, setIsLoading] = useState(false);

    const [toggle, setToggle] = useState(false);

    // const clientFilter = useCallback(async (pageSize, pageNo, filter) => {
    //     if (isLoading) return; // Prevent initiating another request if one is already ongoing
    //
    //     setIsLoading(true);
    //     try {
    //         const response = await axios.post(
    //             `${process.env.EXPO_PUBLIC_API_URI}/client/getClientReportBySegmentForBusiness?pageNo=${pageNo}&pageSize=${pageSize}`,
    //             {
    //                 business_id: `${process.env.EXPO_PUBLIC_BUSINESS_ID}`,
    //                 fromDate: "",
    //                 sortItem: "name",
    //                 sortOrder: "asc",
    //                 toDate: "",
    //                 type: filter,
    //             },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
    //                 }
    //             }
    //         );
    //         let count = response.data.data.pop();
    //         return response.data.data;
    //     } catch (error) {
    //         console.error("Error fetching data1: ", error);
    //
    //     } finally {
    //         setIsLoading(false); // Ensure loading state is reset after completion or failure
    //     }
    // }, [isLoading]);
    //
    // const loadMoreClients = () => {
    //     const newPageNo = pageNo1 + 1;
    //     setPageNo1(newPageNo);
    //     clientFilter(maxEntry1, newPageNo, clientFilterNames(filterPressed));
    // };




    const [searchClientTotalCount, setSearchClientTotalCount] = useState(0);



    useLayoutEffect(() => {
        dispatch(loadClientCountFromDb());
    }, []);


    useEffect(() => {
        dispatch(loadClientCountFromDb());
        setClientCount(chooseFilterCount(filterPressed, allClientCount, activeClientCount, inActiveClientCount, churnClientCount, leadsClientCount));
    }, [filterPressed]);

    useEffect(() => {
        dispatch(loadSearchClientFiltersFromDb(maxEntry, clientFilterNames(filterPressed), searchQuery));
        if (currentFilterClientCount !== clientCount) {
            dispatch(loadSearchClientFiltersFromDb(maxEntry, clientFilterNames(filterPressed), searchQuery));
        }
    }, [searchQuery]);

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


        // if(searchQuery === "" && (currentFilterClientCount !== clientCount)) {
        //     if(toggle) {
        //         setToggle(false)
        //     }
        //     else{
        //         setToggle(true);
        //     }
        //             //     return ;
        // }

        return (
            <ClientCard
                name={itemData.item.name}
                phone={itemData.item.mobile}
                email={itemData.item.email}
                onPress={() => {
                    if (searchQuery === "") {
                        dispatch(loadAnalyticsClientDetailsFromDb(maxEntry, pageNo, itemData.item.id));
                    } else {
                        dispatch(loadAnalyticsClientDetailsFromDb(searchMaxEntry, searchPageNo, itemData.item.id));
                    }
                    dispatch(updateClientId(itemData.item.id === undefined ? "" : itemData.item.id));
                    setClientId(itemData.item.id);
                    dispatch(loadClientInfoFromDb(itemData.item.id));
                    clientInfoHandler();
                    clientNamePhoneHandler(itemData.item.name, itemData.item.mobile);
                }}
                divider={true}
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



    return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.clientSegment}>
                    <EntryModel
                        isModalVisible={isModalVisible}
                        setIsModalVisible={setIsModalVisible}
                        filterPressed={filterPressed}
                        query={searchQuery}
                    />

            <ClientInfoModal
                visible={isClientInfoModalVisible}
                setVisible={setIsClientInfoModalVisible}
                closeModal={() => {
                    setIsClientInfoModalVisible(false);
                    dispatch(clearClientInfo());
                    dispatch(loadClientFiltersFromDb(10, "All"));
                }}
                name={clientName}
                phone={clientPhone}
                id={clientId}
                setSearchQuery={setSearchQuery}
                setFilterPressed={setFilterPressed}
                onClose={() => setIsClientInfoModalVisible(false)}
            />

                    <AddClient />

                    <Divider color={Colors.grey250}/>

                    <View style={styles.clientFilterContainer}>
                        <ClientFiltersCategories
                            changeSelectedFilter={changeSelectedFilter}
                            filterPressed={filterPressed}
                            isLoading={isFetching}
                            searchLoading={isSearchClientFetching}
                        />
                    </View>

                    <View style={styles.currentFilter}>
                        <View style={styles.descBullet}/>
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
                        <View style={styles.textInputContainer}>
                            <SearchBar
                                placeholder={"search by mobile number name"}
                                searchContainerStyle={[textTheme.bodyMedium, styles.searchBarContainer]}
                                onChangeText={(text) => {
                                    setSearchQuery(text);
                                }}
                                value={searchQuery}
                            />
                        </View>

                        <PrimaryButton
                            buttonStyle={styles.filterButton}
                        >
                            <SimpleLineIcons
                                name="equalizer"
                                size={24}
                                color={Colors.darkBlue}
                                style={styles.filterIcon}
                            />
                        </PrimaryButton>

                    </View>

                    <View style={styles.clientCount}>
                        <Image source={require("../assets/icons/menu.png")} style={styles.menuImage}/>
                        <Text style={[textTheme.bodyMedium, styles.clientCountText]}>
                            Client count : {
                            searchQuery === "" ?
                                clientCount :
                                searchClientTotalCount
                        }
                        </Text>
                    </View>


                    {
                        searchQuery === "" ?
                            <>
                                {
                                    !isFetching ?
                                        <FlatList
                                            data={filterClientsList}
                                            renderItem={renderItem}
                                            scrollEnabled={false}

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
                                            avatarStyles={{marginLeft: 16}}
                                        />
                                }

                                {
                                    clientCount >= 10 ?
                                    <Pagination
                                        filterPressed={filterPressed}
                                        setIsModalVisible={setIsModalVisible}
                                    /> : null
                                }
                                </> :

                            <>
                                {
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
                                            avatarStyles={{marginLeft: 16}}
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
        marginTop: 20,
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

    filterIcon: {},
    filterButton: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.grey250,
        marginVertical: 15,
        marginRight: 8,
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

