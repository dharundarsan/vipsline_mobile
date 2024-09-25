import {StyleSheet} from "react-native";

export const capitalizeFirstLetter = (string) => {
    if (string === undefined) return;
    return string[0].toUpperCase() + string.slice(1, string.length);
}


export const formatDate = (date, format) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();

    const padZero = (num) => num.toString().padStart(2, '0')

    switch (format) {
        case "yyyy-mm-dd":
            return `${year}-${padZero(month + 1)}-${padZero(day)}`;
        case "yyyy/mm/dd":
            return `${year}/${padZero(month + 1)}/${padZero(day)}`;
        case "yyyy-month-dd":
            return `${year}-${months[month]}-${padZero(day)}`;
        case "dd-month-yyyy":
            return `${padZero(day)}-${months[month]}-${year}`;
        case "dd-mm-yyyy":
            return `${padZero(day)}-${padZero(month + 1)}-${year}`
        case "yyyy-dd-mm":
            return `${year}-${padZero(day)}-${padZero(month + 1)}`
        case "d month yyyy":
            return `${day} ${months[month]} ${year}`;
        case "yyyy-d-m":
            return `${day}-${month + 1}-${year}`;
        case "dd short-month year":
            return `${day} ${months[month].slice(0,3)} ${year}`;
        default:
            return `${day} ${months[month]} ${year}`;
    }
}


export function dateFormatter(date, monthType) {
    if(date === undefined) return;
    date = new Date(date);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: monthType,
        year: 'numeric'
    });
}

export const checkNullUndefined = (value) => {
    if(value === undefined) return false;
    return value !== null;
}

export const shadowStyling = StyleSheet.create({
    elevation: 4,             // Shadow strength
    backgroundColor: '#fff',  // Background color
    shadowColor: '#000',      // Shadow color
    shadowOffset: {width: 0, height: 10}, // Offset for bottom shadow
    shadowOpacity: 0.1,       // Opacity (optional for cross-platform)
    shadowRadius: 3.84,       // Blur radius (optional for cross-platform)
    borderBottomWidth: 0.5,     // Helps define a stronger bottom line
    borderColor: 'rgba(0,0,0,0.1)' // Subtle color to simulate the bottom shadow
})

export const formatDateWithAddedMonths = (monthsToAdd) => {
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + parseInt(monthsToAdd));
    const formattedDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(currentDate);
    return formattedDate;
}


