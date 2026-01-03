import { route } from "ziggy-js";

export const navigationByRole = {
    it_admin: [
        {
            label: "Dashboard",
            href: route("itadmin.admindashboard"),
            icon: "dashboard",
        },
        {
            label: "Create Bank",
            href: route("itadmin.createbank"),
            icon: "bank",
        },
        {
            label: "Bank Admins",
            href: route("itadmin.allbankadmins"),
            icon: "users",
        },
        {
            label: "Settings",
            href: route("settings"),
            icon: "settings",
        },
    ],

    overall_admin: [
        {
            label: "Dashboard",
            href: route("bnkadmindashboard"),
            icon: "dashboard",
        },
        { label: "Create Branch", href: route("createbranch"), icon: "bank" },
        { label: "Bank Profile", href: route("bankprofile"), icon: "bank" },
        {
            label: "Branch Admins",
            href: route("allbranchadmin"),
            icon: "users",
        },
        { label: "Settings", href: route("settings"), icon: "settings" },
    ],

    branch_manager: [
        {
            label: "Dashboard",
            href: route("branchadmindashboard"),
            icon: "dashboard",
        },
        { label: "Branch Users", href: route("availableusers"), icon: "users" },
        { label: "Create Staff", href: route("createstaff"), icon: "users" },
        { label: "Create Zone", href: route("createzone"), icon: "map" },
        {
            label: "Pending Users",
            href: route("bank.users.pending"),
            icon: "users",
        },
        { label: "Settings", href: route("settings"), icon: "settings" },
    ],
    loan_officer: [
        { label: "Dashboard", href: route("loanadmindashboard"), icon: "dashboard"},
        {label: "Branch Users",  href: route("availableusers"), icon: "users"},
        {label: "Loan Requests",  href: route("showrequests"), icon: "bell"},
        { label: "Settings", href: route("settings"), icon: "settings" },

    ],
};
