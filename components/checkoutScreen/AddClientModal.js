import {FlatList, Modal, Platform, StyleSheet, Text, View} from "react-native";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import textTheme from "../../constants/TextTheme";
import React, {useCallback, useEffect, useState, useRef} from "react";
import Colors from "../../constants/Colors";
import Divider from "../../ui/Divider";
import SearchBar from "../../ui/SearchBar";
import Feather from '@expo/vector-icons/Feather';
import {useSelector, useDispatch} from "react-redux";
import ClientCard from "../clientSegmentScreen/ClientCard";
import {loadClientsFromDb} from "../../store/clientSlice";
import CreateClientModal from "./CreateClientModal";
import {loadAnalyticsClientDetailsFromDb, loadClientInfoFromDb, updateClientId} from "../../store/clientInfoSlice";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {shadowStyling} from "../../util/Helpers";

const AddClientModal = (props) => {
    // const pageNo = useSelector(state => state.client.pageNo);
    const clientsList = useSelector(state => state.client.clients);
    const [isCreateClientModalVisible, setIsCreateClientModalVisible] = useState(false);
    const dispatch = useDispatch();
    // const [searchClientQuery, setSearchClientQuery] = useState("");
    const [searchedClients, setSearchedClients] = useState([]);
    const [searchClientPageNo, setSearchClientPageNo] = useState(0);
    const queryRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);

    const searchClientFromDB = useCallback(async (query, pageNo) => {
        if (isLoading) return; // Prevent initiating another request if one is already ongoing


        let authToken = ""
        try {
            const value = await AsyncStorage.getItem('authKey');
            if (value !== null) {
                authToken = value;
            }
        } catch (e) {
            console.log("auth token fetching error. (inside calculateCartPriceAPI)" + e);
        }

        let businessId = ""
        try {
            const value = await AsyncStorage.getItem('businessId');
            if (value !== null) {
                businessId = value;
            }
        } catch (e) {
            console.log("business token fetching error." + e);
        }


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
            setIsLoading(false);
        } catch (e) {
            console.error("Error fetching clients:", e);
            setIsLoading(false);
        } finally {
            setIsLoading(false); // Ensure loading state is reset after completion or failure
        }
    }, [isLoading]);

    useEffect(() => {
        if (props.searchClientQuery !== queryRef.current) {
            queryRef.current = props.searchClientQuery;
            setSearchedClients([]);
            setSearchClientPageNo(0);
            searchClientFromDB(props.searchClientQuery, 0).then(r => null);
        }
    }, [props.searchClientQuery, searchClientFromDB]);

    const loadMoreClients = () => {
        const newPageNo = searchClientPageNo + 1;
        setSearchClientPageNo(newPageNo);
        searchClientFromDB(props.searchClientQuery, newPageNo).then(r => null);
    };

    return (
        <Modal visible={props.isVisible} animationType={"slide"}
        presentationStyle="pageSheet" onRequestClose={props.closeModal}>
            <CreateClientModal isVisible={isCreateClientModalVisible} onCloseModal={() => {
                setIsCreateClientModalVisible(false);
            }}/>
            <View style={[styles.closeAndHeadingContainer, shadowStyling]}>
                <Text style={[textTheme.titleLarge, styles.selectClientText]}>Select Client</Text>
                <PrimaryButton
                    buttonStyle={styles.closeButton}
                    pressableStyle={styles.closeButtonPressable}
                    onPress={() => {
                        props.setSearchClientQuery("");
                        props.closeModal()
                    }}
                >
                    <Ionicons name="close" size={25} color="black"/>
                </PrimaryButton>
            </View>
            <View style={styles.modalContent}>
                <SearchBar placeholder={"Search by email or mobile"} onChangeText={(text) => {
                    props.setSearchClientQuery(text);
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
                {props.searchClientQuery === "" ? (
                    <FlatList
                        data={clientsList}
                        keyExtractor={(item) => item.id.toString()}
                        // onEndReachedThreshold={0.7}
                        renderItem={({item}) => (
                            <ClientCard
                                clientId={item.id}
                                name={item.name}
                                phone={item.mobile_1}
                                email={item.username}
                                divider={true}
                                onPress={(clientId) => {
                                    props.closeModal();
                                    dispatch(loadClientInfoFromDb(item.id));
                                    dispatch(loadAnalyticsClientDetailsFromDb(10, 0, item.id));
                                    dispatch(updateClientId(item.id))
                                }}
                            />
                        )}
                    />
                ) : (
                    <FlatList
                        data={searchedClients}
                        keyExtractor={(item) => item.id.toString()}
                        onEndReachedThreshold={0.7}
                        onEndReached={loadMoreClients}
                        renderItem={({item}) => (
                            <ClientCard
                                clientId={item.id}
                                name={item.name}
                                phone={item.mobile_1}
                                email={item.username}
                                divider={true}
                                onPress={(clientId) => {
                                    props.closeModal();
                                    dispatch(loadClientInfoFromDb(item.id));
                                    dispatch(loadAnalyticsClientDetailsFromDb(10, 0, item.id));
                                    props.setSearchClientQuery("");
                                    dispatch(updateClientId(item.id))
                                }}
                            />
                        )}
                    />
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    closeAndHeadingContainer: {
        // marginTop: Platform.OS === "ios" ? 50 : 0,
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
