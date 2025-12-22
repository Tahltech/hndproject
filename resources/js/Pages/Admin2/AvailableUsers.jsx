import React, { useEffect, useState } from "react";
import axios from "axios";
//import Layout from "../Layout/Layout";

export default function AvailableUsers() {
    const [Users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios
            .get("/available/branchusers")
            .then((response) => {
                setUsers(response.data.users || []);
            })
            .catch((error) => {
                console.error("Error getting the users for this branch", error);
            });
    }, []);

    // Filter users by search term (fullname or username)
    const filteredUsers = Users.filter((user) =>
        (user.full_name + " " + user.username)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Users of This Branch</h2>

            {/*  Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search user by name..."
                    className="w-80 px-3 py-2 border border-gray-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md mt-2">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="py-3 px-4 text-left">Full Name</th>
                        <th className="py-3 px-4 text-left">User Name</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Phone Number</th>
                        <th className="py-3 px-4 text-left">Registration Date</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredUsers.map((user) => (
                        <tr
                            key={user.user_id}
                            className="border-b hover:bg-gray-100 transition"
                        >
                            <td className="py-2 px-4">{user.full_name}</td>
                            <td className="py-2 px-4">{user.username}</td>
                            <td className="py-2 px-4">{user.email}</td>
                            <td className="py-2 px-4">{user.phone_number}</td>
                            <td className="py-2 px-4">
                                {new Date(user.created_at).toISOString().split("T")[0]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

//AvailableUsers.layout = (page) => <Layout>{page}</Layout>;
