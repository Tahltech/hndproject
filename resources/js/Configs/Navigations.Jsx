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
        { label: "Dashboard", href: route("bnkadmindashboard"), icon: "dashboard" },
        { label: "Create Branch", href: route("createbranch"), icon: "bank" },
        { label: "Branch Admins", href: route("allbranchadmin"),icon: "users" },
        {label: "Settings", href: route("settings"),icon: "settings"},
    ],

    branch_admin: [
        { label: "Dashboard", href: "/branch/dashboard", icon: "dashboard" },
        { label: "Accounts", href: "/branch/accounts", icon: "wallet" },
    ],
};
