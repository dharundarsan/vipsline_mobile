import {View, Text, StyleSheet, Image, FlatList, ScrollView} from "react-native";
import PrimaryButton from "../ui/PrimaryButton";
import Colors from "../constants/Colors";
import Divider from "../ui/Divider";
import React, {useState} from "react";
import appliedFilter from "../util/chooseFilter";
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
import {loadClientInfoFromDb} from "../store/clientInfoSlice";


export default function ClientSegmentScreen() {

    const dispatch = useDispatch();
    const [filterPressed, setFilterPressed] = useState("all_clients_count");

    const filterClientsList = useSelector(state => state.clientFilter.clients);
    const isFetching = useSelector(state => state.clientFilter.isFetching);

    const clientCount = useSelector(state => state.client.clientCount)[0].all_clients_count;

    const [isModalVisible, setIsModalVisible] = useState(false);

    const maxEntry = useSelector(state => state.clientFilter.maxEntry);

    const [isClientInfoModalVisible,setIsClientInfoModalVisible ] = useState(false);

    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");

    const [clientId, setClientId] = useState("");

    function renderItem(itemData) {
        return (
            <ClientCard
                name={itemData.item.name}
                phone={itemData.item.mobile}
                email={itemData.item.username}
                onPress={() => {
                    clientInfoHandler();
                    clientNamePhoneHandler(itemData.item.name, itemData.item.mobile);
                    dispatch(loadClientInfoFromDb(itemData.item.id));
                }}
                divider={true}
            />
        );
    }

    function clientInfoHandler() {
        console.log("clientInfoHandler");
        setIsClientInfoModalVisible(true);
    }

    function clientNamePhoneHandler(name, phone) {
        setClientName(name);
        setClientPhone(phone);
    }

    const changeSelectedFilter = (filter) => {
        // console.log("change", filter);
        setFilterPressed(filter);
    }

    return (
        <ScrollView style={styles.scrollView}>
        <View style={styles.clientSegment}>
            <EntryModel
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                filterPressed={filterPressed}
            />

            <ClientInfoModal
                visible={isClientInfoModalVisible}
                setVisible={setIsClientInfoModalVisible}
                closeModal={() => {
                    setIsClientInfoModalVisible(false)

                }}
                name={clientName}
                phone={clientPhone}
                id={clientId}
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
                        style={styles.filterIcon}
                    />
                </PrimaryButton>

            </View>

            <View style={styles.clientCount}>
                <Image source={require("../assets/icons/menu.png")} style={styles.menuImage}/>
                <Text style={styles.clientCountText}>
                    Client count : {clientCount}
                </Text>
            </View>

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
                        containerStyles={{paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.grey250}}
                        avatarStyles={{marginLeft: 16}}
                    />
            }

            <Pagination
                filterPressed={filterPressed}
                setIsModalVisible={setIsModalVisible}
            />


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

