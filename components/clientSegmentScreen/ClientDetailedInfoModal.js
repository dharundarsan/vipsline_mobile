import {View, StyleSheet} from "react-native";
import Colors from "../../constants/Colors";
import ClientStatistics from "./ClientStatistics";


export default function ClientDetailedInfoModal(props) {


    let content;
    const selectedCategory = props.selectedCategory;
    if(selectedCategory === "seeMoreStats") {
        content = <ClientStatistics
            title={selectedCategory}
        />;
    }
    else {
        content = <View></View>;
    }

    return(
        <>
            <View style={styles.modalContent}>
                {content}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        alignItems: "center",
    },
    closeAndHeadingContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        flexDirection: "row",
    },
    closeButton: {
        position: "absolute",
        right: 6,
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
        alignItems: "center"
    },
    statisticsCard: {},

})