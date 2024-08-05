import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Image,
    FlatList,
    ActivityIndicator
} from "react-native";
import PrimaryButton from "../ui/PrimaryButton";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Colors from "../constants/Colors";
import Divider from "../ui/Divider";
import {useEffect, useState} from "react";
import appliedFilter from "../components/clientSegmentScreen/chooseFilter";
import clientFilterDescriptionData from "../data/clientFilterDescriptionData";
import Ionicons from '@expo/vector-icons/Ionicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import ClientFiltersCategories from "../components/clientSegmentScreen/ClientFiltersCategories";
import ClientCard from "../components/clientSegmentScreen/ClientCard";
import axios from "axios";
import AntDesign from '@expo/vector-icons/AntDesign';
import EntryModel from "../components/clientSegmentScreen/EntryModel";
import {Bullets} from "react-native-easy-content-loader";

export default function ClientSegmentScreen() {

    const [filterPressed, setFilterPressed] = useState(0);

    const clientCount = 22330;

    const [isLoading, setIsLoading] = useState(false);
    const [fetchData, setFetchData] = useState();
    const [maxEntry, setMaxEntry] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [value, setValue] = useState("")
    const [totalCount,setTotalCount] = useState(0);

    const [lowerCount, setLowerCount] = useState(1);
    const [upperCount, setUpperCount] = useState(maxEntry);


    useEffect(() => {
        async function getClientListApi() {
            const baseURL = `${process.env.EXPO_PUBLIC_API_URI}`
            const api = `/client/getClientReportBySegmentForBusiness?pageNo=${0}&pageSize=${maxEntry}`;
            setIsLoading(true);
            const response = await axios.post(baseURL + api,
                {
                    business_id: "9359e749-b190-40f4-9953-f0c24fd1a1db",
                    fromDate: "",
                    sortItem: "name",
                    sortOrder: "asc",
                    toDate: "",
                    type: "All",
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`

                    }
                })
            setIsLoading(false);
            setFetchData(response.data.data);
            length = response.data.data.length;
            setTotalCount(response.data.data[length - 1].count);
        }

        getClientListApi().then();

    }, [maxEntry, lowerCount, upperCount]);

    function calculateUpperAndLowerCount() {

    }

    function nextPageHandler(){

    }

    function prevPageHandler(){

    }


    function renderItem(itemData) {
        return (
            <ClientCard
                name={itemData.item.firstName}
                phone={itemData.item.mobile}
                email={itemData.item.email}
            />
        );
    }

    return (
        <View style={{flex: 1, alignItems: "center" ,justifyContent: 'center'}}>
        <ScrollView style={styles.clientSegment} bounces={false}>

            <EntryModel
                setMaxEntry={setMaxEntry}
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
            />

            <View style={styles.addClientContainer}>
                <PrimaryButton buttonStyle={styles.addClientButton}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.addTextContainer}>
                            <Text style={styles.addText}>Add </Text>
                        </View>
                        <View style={styles.addSymbolContainer}>
                            <FontAwesome6 name="add" size={14} color={Colors.darkBlue}/>
                        </View>
                    </View>
                </PrimaryButton>
            </View>

            <Divider color={Colors.grey250}/>

            <View style={styles.clientFilterContainer}>
                <ClientFiltersCategories setFilterPressed={setFilterPressed} filterPressed={filterPressed}/>
            </View>

            <View style={styles.currentFilter}>
                <View style={styles.descBullet}/>
                <Text
                    style={styles.descText}>{appliedFilter(filterPressed) + (filterPressed === 4 ? " (likely to be Inactive)" : "")}</Text>
            </View>
            <Text style={styles.filterDescText}>
                {clientFilterDescriptionData[appliedFilter(filterPressed)]}
            </Text>


            <View style={styles.searchClientContainer}>
                <View style={styles.textInputContainer}>
                    <Ionicons name="search" size={24} color={Colors.grey250} style={styles.searchIcon}/>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Search by name email or mobile "
                        placeholderTextColor={Colors.grey250}
                        cursorColor={Colors.black}
                        selectionColor={Colors.black}
                        value={value}
                        onChangeText={(text) => setValue(value)}
                    />
                </View>
                <PrimaryButton
                    buttonStyle={styles.filterButton}
                >
                    <SimpleLineIcons name="equalizer" size={24} color={Colors.darkBlue} style={styles.filterIcon}/>
                </PrimaryButton>

            </View>

            <View style={styles.clientCount}>
                <Image source={require("../assets/icons/menu.png")} style={styles.menuImage}/>
                <Text style={styles.clientCountText}>
                    Client count : {clientCount}
                </Text>
            </View>

            <View style={styles.clientList}>
                {
                    !isLoading ?
                        <FlatList
                            data={fetchData}
                            renderItem={renderItem}
                            scrollEnabled={false}
                        /> :
                        // <ActivityIndicator/>
                        <Bullets active listSize={maxEntry}/>
                }
            </View>

            <View style={styles.pagination}>
                <PrimaryButton
                    pressableStyle={styles.entryButton}
                    buttonStyle={styles.entryButtonContainer}
                    onPress={() => setIsModalVisible(true)}
                >
                    <Text style={styles.entryText}>
                        {maxEntry}
                    </Text>
                    <AntDesign name="caretdown" size={14} color="black"/>
                </PrimaryButton>
                <View style={styles.paginationInnerContainer}>
                <Text>
                    {lowerCount} - {upperCount} of {totalCount}
                </Text>
                <PrimaryButton buttonStyle={styles.pageForwardButton}>
                    <FontAwesome6 name="angle-left" size={24} color="black" />
                </PrimaryButton>
                <PrimaryButton buttonStyle={styles.pageBackwardButton}>
                    <FontAwesome6 name="angle-right" size={24} color="black" />
                </PrimaryButton>
                </View>
            </View>

        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    clientSegment: {
        flex: 1,
        backgroundColor: 'white',
    },
    addClientContainer: {
        alignItems: 'flex-end',
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
        // borderWidth: 1
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
    clientList: {},
    pagination: {
        height: 90,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: "center",
    },


    addClientButton: {
        width: '25%',
        height: 38,
        margin: 20,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.highlight,
    },
    addTextContainer: {
        width: 28,
        height: 18
    },
    addText: {
        fontSize: 13,
        fontWeight: '700',
        // ...Platform.select({
        //     ios: {
        //         paddingTop: 2,
        //     }
        // }),
        includeFontPadding: false,
        paddingTop: 2

    },
    addSymbolContainer: {
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center"
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
        flexDirection: 'row',
        width: '75%',
        borderWidth: 1,
        borderRadius: 32,
        marginVertical: 12,
        marginHorizontal: 10,
        borderColor: Colors.grey250
    },
    searchIcon: {
        marginVertical: 12,
        marginHorizontal: 16
    },
    filterIcon: {},
    filterButton: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.grey250,
        marginVertical: 13,
        marginHorizontal: 10,
    },
    menuImage: {
        width: 24,
        height: 24,
        marginLeft: 24
    },
    clientCountText: {
        marginLeft: 8,
        fontWeight: '500'
    },
    entryButton: {
        flexDirection: 'row',
        justifyContent:"flex-start",
        gap:32,
    },
    entryButtonContainer: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
    },
    entryText: {
        fontWeight: '600'
    },
    paginationInnerContainer: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center'
    },
    pageForwardButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
    },
    pageBackwardButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
    }

})

