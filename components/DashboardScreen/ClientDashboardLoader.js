import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ContentLoader from 'react-native-easy-content-loader'

const ClientDashboardLoader = () => {
    return (
        <View style={{ marginVertical: "5%", rowGap: 20, width: '100%' }}>
            <ContentLoader
                pRows={1}
                pHeight={[40]}
                pWidth={["100%"]}
                active
                title={false}
            />
            <ContentLoader
                pRows={1}
                pHeight={[40]}
                pWidth={["100%"]}
                active
                title={false}

            />
            <ContentLoader
                pRows={1}
                pHeight={[40]}
                pWidth={["100%"]}
                active
                title={false}
            />
        </View>
    )
}

export default ClientDashboardLoader