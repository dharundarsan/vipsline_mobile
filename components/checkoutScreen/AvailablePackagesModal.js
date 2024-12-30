import {ActivityIndicator, FlatList, Modal, Platform, Pressable, StyleSheet, Text, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import Colors from "../../constants/Colors";
import PackageModal from "./PackageModal";
import {useSelector} from "react-redux";
import getPackagesListOfClientAPI from "../../apis/ClientSegmentAPIs/getPackagesListOfClientAPI";
import {shadowStyling} from "../../util/Helpers";
import Divider from "../../ui/Divider";

const AvailablePackagesModal = (props) => {
    const [isPackageModalVisible, setIsPackageModalVisible] = useState(false);
    const clientId = useSelector(state => state.clientInfo.details.id);
    const businessId = useSelector(state => state.authDetails.businessId);
    const [activePackages, setActivePackages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [packages, setPackages] = useState([])
    const [packageModalData, setPackageModalData] = useState([]);


    useEffect(() => {
        async function fetchPackages() {
            setIsLoading(true);
            const activePackages = await getPackagesListOfClientAPI(clientId, businessId);
            setPackages(activePackages);
            setIsLoading(false);
            if (activePackages.length === 1) {
                setPackageModalData(activePackages[0])
                setIsPackageModalVisible(true);
            }
        }

        fetchPackages();
    }, [clientId, businessId]);

    return <Modal style={styles.availablePackagesModal} animationType={"slide"}
                  presentationStyle="pageSheet" onRequestClose={props.onCloseModal}>
        {isPackageModalVisible && <PackageModal redeem={true}
                                                singlePackage={packages.length === 1}
                                                data={packageModalData}
                                                isVisible={isPackageModalVisible}
                                                onCloseModal={() => setIsPackageModalVisible(false)}
                                                closeOverallModal={() => {
                                                    setIsPackageModalVisible(false);
                                                    props.onCloseModal();
                                                }}
        />}
        <View style={[styles.headingAndCloseContainer, shadowStyling]}>
            <Text style={[textTheme.titleLarge, styles.heading]}>Available Packages</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                onPress={props.onCloseModal}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <View style={styles.modalContent}>
            {isLoading ?
                <ActivityIndicator style={{flex: 1, justifyContent: "center", alignItems: "center"}}
                                   size={"large"}/> :
                <FlatList data={packages} renderItem={({item}) =>
                    <>
                        <PrimaryButton buttonStyle={styles.packageItemButtonStyle}
                                       pressableStyle={styles.packageItemPressable}
                                       onPress={() => {
                                           setPackageModalData(item);
                                           setIsPackageModalVisible(true)
                                       }}>
                            <Text style={[textTheme.bodyLarge, styles.packageTitleText]}>{item.package_name}</Text>
                            <Text
                                style={[textTheme.bodyMedium, styles.packageDetailText]}>{item.available_quantity} sessions
                                available</Text>
                            <Text
                                style={[textTheme.bodyMedium]}>This package will expire on <Text
                                style={{color: Colors.error}}>{item.valid_till}</Text></Text>
                        </PrimaryButton>
                        <Divider/>
                    </>
                }/>
            }
        </View>
    </Modal>

}

const styles = StyleSheet.create({
    availablePackagesModal: {
        flex: 1,
    },
    headingAndCloseContainer: {
        // marginTop: Platform.OS === "ios" ? 50 : 0,
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: "center",
    },
    heading: {
        fontWeight: 500
    },
    closeButton: {
        position: "absolute",
        right: 0,
        top: 5,
        backgroundColor: Colors.background,
    },
    modalContent: {
        flex: 1,
    },
    packageItemButtonStyle: {
        backgroundColor: Colors.transparent,
    },
    packageItemPressable: {
        backgroundColor: Colors.transparent,
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    packageTitleText: {
        fontFamily: "Inter-Bold"
    },
    packageDetailText: {
        marginTop: 5,
    }
})

export default AvailablePackagesModal;