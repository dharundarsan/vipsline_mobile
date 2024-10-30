import {StyleSheet} from "react-native";
import Toast from "react-native-toast-message";

export const capitalizeFirstLetter = (string) => {
    if (string === undefined) return;
    return string[0].toUpperCase() + string.slice(1, string.length).toLowerCase();
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

export function convertTo12HourFormatWithSeconds(railwayTime) {
    if(railwayTime === undefined || railwayTime === null || railwayTime === "") return "";
    let [hours, minutes, seconds] = railwayTime.split(":").map(Number);

    let period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
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

export const shadowStylingTop = StyleSheet.create({
    backgroundColor: '#fff',    // Background color
    shadowColor: '#000',        // Shadow color
    shadowOffset: {width: 0, height: -10}, // Move shadow to the top (negative height)
    shadowOpacity: 0.1,         // Shadow opacity
    shadowRadius: 3.84,         // Shadow blur radius
    borderColor: 'rgba(0,0,0,0.1)',  // Subtle color to simulate the shadow effect
});



export const formatDateWithAddedMonths = (monthsToAdd) => {
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + parseInt(monthsToAdd));
    const formattedDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(currentDate);
    return formattedDate;
}

export const showToast = (toastOptions) => {
    Toast.show({
        type: toastOptions.type,
        text1: toastOptions.text1,
        text2: toastOptions.text2,
        text1Style:{fontSize:15},
        text2Style:{fontSize:12}
    });
}

export const formatNumber = (number) => {
    return number % 1 === 0 ? number.toFixed(0) : number.toFixed(2);
}

export function convertAppliedFilters(fromDate, toDate, selectedOptions) {
    return {
        fromDate: (fromDate !== null && fromDate !== "") ? formatDate(fromDate, "yyyy-mm-dd").toString() : "",
        toDate: (toDate !== null && toDate !== "") ? formatDate(toDate, "yyyy-mm-dd").toString() : "",
        filter1: selectedOptions.includes("Male client") ? "male" : undefined,
        filter2: selectedOptions.includes("Female client") ? "female" : undefined,
        filter3: selectedOptions.includes("Membership") ? "membership" : undefined,
        filter4: selectedOptions.includes("Non-Membership") ? "non-membership" : undefined,
        filter5: selectedOptions.includes("New client") ? "new client" : undefined,
    }
}

export function convertDate(dateStr) {
    const monthMap = {
        January: "Jan", February: "Feb", March: "Mar", April: "Apr",
        May: "May", June: "Jun", July: "Jul", August: "Aug",
        September: "Sep", October: "Oct", November: "Nov", December: "Dec"
    };

    const [day, monthYear] = dateStr.split(" ");
    const month = monthYear.slice(0, -5); // Remove ",YYYY" part from monthYear
    const year = monthYear.slice(-4);     // Get the year from monthYear

    return `${day} ${monthMap[month]} ${year}`;
}
