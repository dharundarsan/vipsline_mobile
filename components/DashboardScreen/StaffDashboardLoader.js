import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ContentLoader from 'react-native-easy-content-loader'
import Colors from '../../constants/Colors'

const StaffDashboardLoader = () => {
    return (
        <View style={styles.container}>
            <View style={[{ flexDirection: "row", columnGap: 0, width: "50%", marginBottom: 10 }]}>
                <ContentLoader
                    pRows={1}
                    pHeight={[45]}
                    pWidth={["100%"]}
                    active
                    title={false}

                />
                <ContentLoader
                    pRows={1}
                    pHeight={[45]}
                    pWidth={["100%"]}
                    active
                    title={false}

                />
            </View>
            <View style={{ rowGap: 10 }}>
                <ContentLoader
                    pRows={1}
                    pHeight={[120]}
                    pWidth={["100%"]}
                    active
                    title={false}
                />
                <ContentLoader
                    pRows={1}
                    pHeight={[120]}
                    pWidth={["100%"]}
                    active
                    title={false}
                />
                <ContentLoader
                    pRows={1}
                    pHeight={[120]}
                    pWidth={["100%"]}
                    active
                    title={false}
                />
            </View>
        </View>
    )
}

export default StaffDashboardLoader

const styles = StyleSheet.create({
    container: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: Colors.white,
    }
})