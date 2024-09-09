import { FlatList, Modal, Platform, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../../ui/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import textTheme from "../../constants/TextTheme";
import React, { useCallback, useEffect, useState, useRef } from "react";
import Colors from "../../constants/Colors";
import Divider from "../../ui/Divider";
import SearchBar from "../../ui/SearchBar";
import Feather from '@expo/vector-icons/Feather';
import { useSelector, useDispatch } from "react-redux";
import ClientCard from "../clientSegmentScreen/ClientCard";
import { loadClientsFromDb } from "../../store/clientSlice";
import CreateClientModal from "./CreateClientModal";
import {
    loadAnalyticsClientDetailsFromDb,
    loadClientInfoFromDb,
    updateClientId
} from "../../store/clientInfoSlice";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddClientModal = (props) => {
    const [pageNo, setPageNo] = useState(0)
    // const clientsList = useSelector(state => state.client.clients);
    const [isCreateClientModalVisible, setIsCreateClientModalVisible] = useState(false);
    const dispatch = useDispatch();
    const [searchClientQuery, setSearchClientQuery] = useState("");
    const [searchedClients, setSearchedClients] = useState([]);
    const [clientsList, setClientsList] = useState([]);
    const [searchClientPageNo, setSearchClientPageNo] = useState(0);
    const queryRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const [clientIsLoading, setClientIsLoading] = useState(false);
    const businessId = useSelector(state => state.authDetails.businessId);

    async function getBusinessId() {
        let businessId = ""
        try {
            const value = await AsyncStorage.getItem('businessId');
            if (value !== null) {
                return value;
            }
        } catch (e) {
            console.log("business token fetching error." + e);
        }
    }

    const searchClientFromDB = useCallback(async (query, pageNo) => {
        let authToken = ""
        try {
            const value = await AsyncStorage.getItem('authKey');
            if (value !== null) {
                authToken = value;
            }
        } catch (e) {
            console.log("auth token fetching error. (inside AddClientModal)" + e);
        }

        if (isLoading) return; // Prevent initiating another request if one is already ongoing

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_API_URI}/business/searchCustomersOfBusiness?pageSize=50&pageNo=${pageNo}`,
                {
                    business_id: businessId,
                    query,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );
            setSearchedClients(prev => [...prev, ...response.data.data]);
        } catch (e) {
            console.error("Error fetching clients:", e);
        } finally {
            setIsLoading(false); // Ensure loading state is reset after completion or failure
        }
    }, [isLoading]);

    const loadClients = useCallback(async () => {
        let authToken = ""
        try {
            const value = await AsyncStorage.getItem('authKey');
            if (value !== null) {
                authToken = value;
            }
        } catch (e) {
            console.log("auth token fetching error. (inside clientSlice loadClientFromDb)" + e);
        }

        if(clientIsLoading) return;


        try {
            setClientIsLoading(true);
            console.log(pageNo + " inside the func")
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_API_URI}/business/getClientDetailsOfBusiness?pageNo=${pageNo}&pageSize=50`,
                {
                    business_id: businessId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            // console.log("business id inside the slice: " + await getBusinessId());
            setClientsList(prev => [...prev, ...response.data.data]);
            setClientIsLoading(false)
        } catch (error) {
            console.error("Error fetching data: ", error);
            setClientIsLoading(false)
        }
    },[]);



    useEffect(() => {
        if (searchClientQuery !== queryRef.current) {
            queryRef.current = searchClientQuery;
            setSearchedClients([]);
            setSearchClientPageNo(0);
            searchClientFromDB(searchClientQuery, 0);
        }
    }, [searchClientQuery, searchClientFromDB, businessId]);

    useEffect(() => {
        loadClients();
    }, [businessId]);


    const loadMoreClients = () => {
        const newPageNo = searchClientPageNo + 1;
        setSearchClientPageNo(newPageNo);
        searchClientFromDB(searchClientQuery, newPageNo);
    };

    const loadMoreClientList = () => {
        const newPageNo = pageNo + 1;
        setPageNo(newPageNo);
        loadClients();
        console.log("pageNo" + pageNo)
    };

    return (
        <Modal visible={props.isVisible} animationType={"slide"}>
            <CreateClientModal isVisible={isCreateClientModalVisible} onCloseModal={() => {
                setIsCreateClientModalVisible(false);
            }}/>
            <View style={styles.closeAndHeadingContainer}>
                <Text style={[textTheme.titleLarge, styles.selectClientText]}>Select Client</Text>
                <PrimaryButton
                    buttonStyle={styles.closeButton}
                    pressableStyle={styles.closeButtonPressable}
                    onPress={() => {
                        props.closeModal();
                        setSearchClientQuery("");
                    }}
                >
                    <Ionicons name="close" size={25} color="black"/>
                </PrimaryButton>
            </View>
            <Divider/>
            <View style={styles.modalContent}>
                <SearchBar placeholder={"Search by email or mobile"} onChangeText={(text) => {
                    setSearchClientQuery(text);
                }}
                           searchContainerStyle={styles.searchContainerStyle}/>
                <Divider/>
                <PrimaryButton buttonStyle={styles.createClientButton} pressableStyle={styles.createClientPressable}
                               onPress={() => {
                                   setIsCreateClientModalVisible(true);
                               }}>
                    <Feather name="plus" size={24} color={Colors.highlight}/>
                    <Text style={[textTheme.titleMedium, styles.createClientText]}>Create new client</Text>
                </PrimaryButton>
                <Divider/>
                {searchClientQuery === "" ? (
                    <FlatList
                        data={clientsList}
                        keyExtractor={(item) =>
                            // console.log(item)
                            item.id.toString()
                        }
                        onEndReachedThreshold={0.7}
                        onEndReached={loadMoreClientList}
                        renderItem={({ item }) => (
                            <ClientCard
                                clientId={item.id}
                                name={item.name}
                                phone={item.mobile_1}
                                email={item.username}
                                divider={true}
                                onPress={(clientId) => {
                                    dispatch(loadAnalyticsClientDetailsFromDb(10, 0, item.id));
                                    dispatch(updateClientId(item.id));
                                    dispatch(loadClientInfoFromDb(item.id));
                                    props.closeModal();
                                }}
                            />
                        )}
                    />
                ) : (
                    <FlatList
                        data={searchedClients}
                        keyExtractor={(item) =>
                            item.id.toString()
                            // console.log(item);
                        }
                        onEndReachedThreshold={0.7}
                        onEndReached={loadMoreClients}
                        renderItem={({ item }) => {
                            console.log(item.name)
                            return(
                                <ClientCard
                                    clientId={item.id}
                                    name={item.name}
                                    phone={item.mobile_1}
                                    email={item.username}
                                    divider={true}
                                    onPress={(clientId) => {
                                        dispatch(loadAnalyticsClientDetailsFromDb(10, 0, item.id))
                                        dispatch(loadClientInfoFromDb(item.id));
                                        props.closeModal();
                                    }}
                                />
                            )
                        }}
                    />
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    closeAndHeadingContainer: {
        marginTop: Platform.OS === "ios" ? 50 : 0,
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
    selectClientText: {
        fontWeight: "500",
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
    },
    modalContent: {
        flex: 1,
    },
    searchContainerStyle: {
        marginVertical: 15,
        marginHorizontal: 15,
    },
    createClientButton: {
        backgroundColor: Colors.background,
    },
    createClientPressable: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 15,
    },
    createClientText: {
        color: Colors.highlight,
    },
});

export default AddClientModal;
