import {View, Text, StyleSheet, Image, FlatList, ScrollView} from "react-native";
import PrimaryButton from "../ui/PrimaryButton";
import Colors from "../constants/Colors";
import Divider from "../ui/Divider";
import React, {useState, useEffect} from "react";
import appliedFilter, {clientFilterNames} from "../components/clientSegmentScreen/chooseFilter";
import clientFilterDescriptionData from "../data/clientFilterDescriptionData";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import ClientFiltersCategories from "../components/clientSegmentScreen/ClientFiltersCategories";
import ClientCard from "../components/clientSegmentScreen/ClientCard";
import SearchBar from "../ui/SearchBar";
import {useDispatch, useSelector} from "react-redux";
import AddClient from "../components/clientSegmentScreen/AddClient";
import {decrementPageNumber, incrementPageNumber, loadClientFiltersFromDb} from "../store/clientFilterSlice";
import {AntDesign, FontAwesome6} from "@expo/vector-icons";
import EntryModel from "../components/clientSegmentScreen/EntryModel";

export default function ClientSegmentScreen() {

    const dispatch = useDispatch();
    const [filterPressed, setFilterPressed] = useState("all_clients_count");

    const filterClientsList = useSelector(state => state.clientFilter.clients);
    const isFetching = useSelector(state => state.clientFilter.isFetching);

    const [maxEntry, setMaxEntry] = useState(10)


    const clientCount = useSelector(state => state.client.clientCount)[0].all_clients_count;

    const [totalCount, setTotalCount] = useState(0);
    const [upperCount, setUpperCount] = useState(10);
    const [lowerCount, setLowerCount] = useState(1);
    const [pageNo, setPageNo] = useState(0);

    const [isBackwardButtonDisabled, setIsBackwardButtonDisabled]  = useState(true);
    const [isForwardButtonDisabled, setIsForwardButtonDisabled]  = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        setTotalCount(clientCount);
        dispatch(loadClientFiltersFromDb(pageNo, maxEntry, clientFilterNames(filterPressed)));
    }, [totalCount, maxEntry, pageNo, filterPressed]);

    function backwardButtonHandler(){
        if(!isBackwardButtonDisabled) {
            let lowerCountAfter = lowerCount - maxEntry;
            let upperCountAfter = upperCount - maxEntry;
            if (lowerCountAfter <= 1) {
                setLowerCount(1);
                setUpperCount(maxEntry);
                setIsBackwardButtonDisabled(true);
            }
            else {
                setLowerCount(lowerCountAfter);
                setUpperCount(upperCountAfter);
                dispatch(decrementPageNumber());
                setIsBackwardButtonDisabled(false);
            }

        }
    }
    function forwardButtonHandler(){
        if(!isForwardButtonDisabled) {
            let lowerCountAfter = lowerCount + maxEntry;
            let upperCountAfter = upperCount + maxEntry;
            if(upperCountAfter > totalCount) {
                setLowerCount(totalCount - maxEntry);
                setUpperCount(totalCount);
                setIsForwardButtonDisabled(true);
                setIsBackwardButtonDisabled(false)
            }
            else {
                setLowerCount(lowerCountAfter);
                setUpperCount(upperCountAfter);
                dispatch(incrementPageNumber());
                setIsBackwardButtonDisabled(false);
                setIsForwardButtonDisabled(false);
            }
        }
    }

    //
    // const loadMoreClients = useCallback(() => {
    //     if (!isFetching) {
    //
    //     }
    // }, [dispatch, isFetching, maxEntry]);


    function renderItem(itemData) {
        return (
            <ClientCard
                name={itemData.item.name} phone={itemData.item.mobile} email={itemData.item.username}
            />
        );
    }

    const changeSelectedFilter = (filter) => {
        console.log("change", filter);

        setFilterPressed(filter);
    }


    return (
        <ScrollView style={styles.scrollView}>
        <View style={styles.clientSegment}>
            <EntryModel
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                setMaxEntry={setMaxEntry}

            />

            <AddClient/>

            <Divider color={Colors.grey250}/>

            <View style={styles.clientFilterContainer}>
                <ClientFiltersCategories
                    changeSelectedFilter={changeSelectedFilter}
                    filterPressed={filterPressed}
                />
            </View>

            <View style={styles.currentFilter}>
                <View style={styles.descBullet}/>
                <Text
                    style={styles.descText}
                >
                    {appliedFilter(filterPressed) + (filterPressed === "churn_clients_count" ? " (likely to be Inactive)" : "")}
                </Text>
            </View>
            <Text style={styles.filterDescText}>
                {clientFilterDescriptionData[appliedFilter(filterPressed)]}
            </Text>


            <View style={styles.searchClientContainer}>
                <View style={styles.textInputContainer}>
                    <SearchBar
                        placeholder={"search by mobile number name"}
                        searchContainerStyle={styles.searchBarContainer}
                    />
                </View>

                <PrimaryButton
                    buttonStyle={styles.filterButton}
                >
                    <SimpleLineIcons
                        name="equalizer"
                        size={24}
                        color={Colors.darkBlue}
                        style={styles.filterIcon}/>
                </PrimaryButton>

            </View>

            <View style={styles.clientCount}>
                <Image source={require("../assets/icons/menu.png")} style={styles.menuImage}/>
                <Text style={styles.clientCountText}>
                    Client count : {clientCount}
                </Text>
            </View>

            <FlatList
                data={filterClientsList}
                renderItem={renderItem}
                scrollEnabled={false}
            />

            <View style={styles.pagination}>
                <PrimaryButton
                    pressableStyle={styles.entryButton}
                    buttonStyle={styles.entryButtonContainer}
                    onPress={() => setIsModalVisible(true)}
                >
                    <View style={styles.buttonInnerContainer}>
                        <Text style={styles.entryText}>
                            {maxEntry}
                        </Text>
                        <AntDesign name="caretdown" size={14} color="black" style={{marginLeft: 16}}/>
                    </View>
                </PrimaryButton>

                <View style={styles.paginationInnerContainer}>
                    <Text style={styles.pagingText}>
                        {lowerCount} - {upperCount} of {totalCount}
                    </Text>
                    <PrimaryButton
                        buttonStyle={[isBackwardButtonDisabled ? [styles.pageBackwardButton, styles.disabled] : [styles.pageBackwardButton]]}
                        onPress={backwardButtonHandler}
                    >
                        <FontAwesome6 name="angle-left" size={24} color="black" />
                    </PrimaryButton>
                    <PrimaryButton
                        buttonStyle={[isForwardButtonDisabled ? [styles.pageForwardButton, styles.disabled] : [styles.pageForwardButton]]}
                        onPress={forwardButtonHandler}
                    >
                        <FontAwesome6 name="angle-right" size={24} color="black" />
                    </PrimaryButton>

                </View>

            </View>
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
    pagination: {
        height: 90,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
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
    entryText: {
    },
    entryButton: {

    },
    entryButtonContainer: {
        borderWidth: 1,
        borderColor: Colors.grey250,
        marginLeft: 16,
        backgroundColor: Colors.white,
    },
    paginationInnerContainer: {
        flexDirection: 'row',
        marginRight: 16,
        alignItems: "center",
    },
    pageForwardButton: {
        backgroundColor :Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
    },
    pageBackwardButton: {
        backgroundColor :Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
        marginHorizontal: 16
    },
    buttonInnerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
    },
    disabled: {
        opacity: 0.4,
    },
    pagingText: {},
    scrollView: {
        backgroundColor: Colors.white
    }
})

