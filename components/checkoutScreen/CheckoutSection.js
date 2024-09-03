import {KeyboardAvoidingView, ScrollView, StyleSheet, Text, View} from "react-native";
import {DataTable} from "react-native-paper";
import Divider from "../../ui/Divider";
import textTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import {Entypo} from '@expo/vector-icons';
import {Feather} from '@expo/vector-icons';
import {Keyboard} from "react-native";
import {useState, useEffect} from "react";
import PaymentModal from "./PaymentModal";
import DropdownModal from "../../ui/DropdownModal";
import MiniActionTextModal from "./MiniActionTextModal";
import DeleteClient from "../clientSegmentScreen/DeleteClientModal";
import {loadClientInfoFromDb} from "../../store/clientInfoSlice";

const CheckoutSection = (props) => {
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

    const styles = StyleSheet.create({
        checkoutSection: {
            justifyContent: "flex-end"
        },
        checkoutDetailRow: {
            flexDirection: "row",
            justifyContent: "space-around",
            // borderBottomWidth: 1,
            // borderBottomColor: Colors.grey600,
            // borderStyle: "dashed",
            paddingVertical: 5,
        },
        checkoutDetailText: {},
        buttonContainer: {
            flexDirection: "row", margin: 10, gap: 10,
        },
        optionButton: {
            backgroundColor: Colors.transparent, borderColor: Colors.grey900, borderWidth: 1,
        },
        checkoutButton: {
            flex: 1,
        },
        checkoutButtonPressable: {
            // flex:1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "space-between", // alignItems:"stretch",
            // alignSelf:"auto",
        },
        checkoutButtonAmountAndArrowContainer: {
            flexDirection: "row", gap: 25,
        },
        checkoutButtonText: {
            color: Colors.white
        },
        primaryViewChildrenStyle: {
            flexDirection: "row",
            alignItems: "center"
        }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ActionModal,setActionModal] = useState(false);
    const [title, setTitle] = useState("")
    const [isDelete, setIsDelete] = useState(false);
    const [data, setData] = useState([{}])
    function openModal(title){
        setTitle(title);
    }
    return <View style={styles.checkoutSection}>
        {
            ActionModal && <MiniActionTextModal isVisible={ActionModal}
                onCloseModal={()=>{setActionModal(false)}}
                title={title}
                data={data}
            />
        }
        {
            isDelete && <DeleteClient
                isVisible={isDelete}
                onCloseModal={() => {
                    setIsDelete(false)
                    // setModalVisibility(false);
                    // console.log("Fetched")
                    // dispatch(loadClientInfoFromDb(props.id))
                }}
                header={"Cancel Sale"}
                content={"If you cancel this sale transaction will not be processed. Do you wish to exit?"}
                onCloseClientInfoAfterDeleted={() => {
                    // props.setVisible(false);
                    // props.setSearchQuery("");
                    // props.setFilterPressed("all_clients_count");
                }}
            />
        }
        {
            isModalOpen ?
                <DropdownModal
                    isVisible={isModalOpen}
                    onCloseModal={() => {
                        setIsModalOpen(false)
                    }}
                    dropdownItems={[
                        "Apply Discount",
                        "Add Charges",
                        "Add Sales Notes",
                        "Cancel Sales"
                    ]}
                    onChangeValue={(value) => {
                        console.log(value)
                        if (value === "Apply Discount") {
                            openModal("Add Discount")
                            setData([{
                                header:"Enter Discount",
                                boxType:"textBox",
                                typeToggle:1,
                            }])
                            setActionModal(true)
                        } else if (value === "Add Charges") {
                            openModal("Add extra charges")
                            setData([
                            {
                                header:"Item name",
                                boxType:"textBox",
                                typeToggle:0,
                            },
                            {
                                header:"Price",
                                boxType:"priceBox",
                                typeToggle:0
                            }
                        ])
                            setActionModal(true)
                        } else if (value === "Add Sales Notes") {
                            openModal("Add a note")
                            setData([{
                                header:"Sales notes",
                                boxType:"multiLineBox",
                                typeToggle:0,
                            }])
                            setActionModal(true)
                        } else if (value === "Cancel Sales") {
                            setIsDelete(true);
                        }
                    }}
                    iconImage={[
                        require("../../assets/icons/checkout/actionmenu/applydiscount.png"),
                        require("../../assets/icons/checkout/actionmenu/addcharges.png"),
                        require("../../assets/icons/checkout/actionmenu/salesnote.png"),
                        require("../../assets/icons/checkout/actionmenu/cancelsale.png")
                    ]}
                    primaryViewChildrenStyle={styles.primaryViewChildrenStyle}
                    imageWidth={25}
                    imageHeight={25}
                />

                :
                <>
                    <PaymentModal isVisible={isPaymentModalVisible} onCloseModal={() => {
                        setIsPaymentModalVisible(false)
                    }}
                                  price={props.data[0].total_price}/>
                    <View style={styles.checkoutDetailRow}>
                        <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Discount</Text>
                        <Text
                            style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ {props.data[0].total_discount_in_price}</Text>
                    </View>
                    <Divider/>
                    <View style={styles.checkoutDetailRow}>
                        <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Sub Total</Text>
                        <Text
                            style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ {props.data[0].total_price_after_discount}</Text>
                    </View>
                    <View style={styles.checkoutDetailRow}>
                        <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>GST (18%)</Text>
                        <Text
                            style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ {props.data[0].gst_charges}</Text>
                    </View>
                    {/*<View style={styles.checkoutDetailRow}>*/}
                    {/*    <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Charges</Text>*/}
                    {/*    <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ 5000</Text>*/}
                    {/*</View>*/}
                    <View style={styles.buttonContainer}>
                        <PrimaryButton buttonStyle={styles.optionButton} onPress={() => setIsModalOpen(true)}>
                            <Entypo name="dots-three-horizontal" size={24} color="black"/>
                        </PrimaryButton>
                        <PrimaryButton buttonStyle={styles.checkoutButton}
                                       pressableStyle={styles.checkoutButtonPressable}
                                       onPress={() => {
                                           setIsPaymentModalVisible(true)
                                       }}>
                            <Text style={[textTheme.titleMedium, styles.checkoutButtonText]}>Total Amount</Text>
                            <View style={styles.checkoutButtonAmountAndArrowContainer}>
                                <Text
                                    style={[textTheme.titleMedium, styles.checkoutButtonText]}>₹ {props.data[0].total_price}</Text>
                                <Feather name="arrow-right-circle" size={24} color={Colors.white}/>
                            </View>
                        </PrimaryButton>
                    </View>
                </>
        }
    </View>
}


export default CheckoutSection;