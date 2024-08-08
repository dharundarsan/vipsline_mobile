

const appliedFilter = (filterPressed) => {
    if(filterPressed === "all_clients_count") { return "Total clients" }
    if(filterPressed === "active_clients_count") { return "Active clients" }
    if(filterPressed === "inactive_clients_count") { return "Inactive clients" }
    if(filterPressed === "churn_clients_count") { return "Churn clients" }
    if(filterPressed === "leads_clients_count") { return "All Leads" }
}

export const clientFilterNames = (filterPressed) =>  {
    if(filterPressed === "all_clients_count") { return "All" }
    if(filterPressed === "active_clients_count") { return "Active" }
    if(filterPressed === "inactive_clients_count") { return "Inactive" }
    if(filterPressed === "churn_clients_count") { return "Churn" }
    if(filterPressed === "leads_clients_count") { return "Leads" }
}

export const clientFilterNames2 = (filterPressed) =>  {
    if(filterPressed === "All") { return "all_clients_count" }
    if(filterPressed === "Active") { return "active_clients_count" }
    if(filterPressed === "Inactive") { return "inactive_clients_count" }
    if(filterPressed === "Churn") { return "churn_clients_count" }
    if(filterPressed === "Leads") { return "leads_clients_count" }
}

export const chooseFilterCount = (filterPressed, all, active, inactive, churn, leads) =>  {
    if(filterPressed === "all_clients_count") { return  all}
    if(filterPressed === "active_clients_count") { return active}
    if(filterPressed === "inactive_clients_count") { return  inactive}
    if(filterPressed === "churn_clients_count") { return  churn}
    if(filterPressed === "leads_clients_count") { return  leads}
}
export default appliedFilter;