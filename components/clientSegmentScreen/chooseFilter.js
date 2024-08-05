const appliedFilter = (filterPressed) => {
    if(filterPressed === 0) { return "Total clients" }
    if(filterPressed === 1) { return "Total clients" }
    if(filterPressed === 2) { return "Active clients" }
    if(filterPressed === 3) { return "Inactive clients" }
    if(filterPressed === 4) { return "Churn clients" }
    if(filterPressed === 5) { return "All Leads" }
}

export default appliedFilter;