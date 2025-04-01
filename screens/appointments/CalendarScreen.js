import TimeTable from '@mikezzb/react-native-timetable';
import {Alert} from "react-native";

const CalendarScreen = () => {
    return <TimeTable
        eventGroups={[
            {
                courseId: 'CSCI2100',
                title: 'Data Structures',
                sections: {
                    'A - LEC': {
                        days: [1, 3],
                        startTimes: ['16:30', '14:30'],
                        endTimes: ['17:15', '16:15'],
                        locations: ['Online Teaching', 'Online Teaching'],
                    },
                    'AT02 - TUT': {
                        days: [4],
                        startTimes: ['17:30'],
                        endTimes: ['18:15'],
                        locations: ['Online Teaching'],
                    },
                },
            },
        ]}
        eventOnPress={(event) => Alert.alert(`${JSON.stringify(event)}`)}
    />
}

export default CalendarScreen