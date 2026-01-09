import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../UI/Card";
import { PiUsersBold } from "react-icons/pi";
import { FaCheckDouble } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import EmployeeList from "../components/EmployeeManagement/EmployeeList";

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState([])
    const [totalEmployees, setTotalEmployees] = useState(0)
    const [activeEmployees, setActiveEmployees] = useState(0)
    const [inactiveEmployees, setInactiveEmployees] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchText, setSearchText] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [genderFilter, setGenderFilter] = useState("all")

    const limit = 10

    const totalPages = Math.ceil(totalEmployees / limit)

    useEffect(() => {
        const fetchUserDataForCards = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}?limit=0&skip=0`)
                const data = response.data

                const updatedEmployees = data.users.map((employee, idx) => ({
                    ...employee,
                    status: employee.id % 2 === 0 ? "active" : "inactive"
                }))

                setTotalEmployees(updatedEmployees.length)

                const countActiveEmployees = updatedEmployees.filter((employee, idx) => {
                    return employee.status === "active"
                })

                setActiveEmployees(countActiveEmployees.length)

                const countInactiveEmployees = updatedEmployees.filter((employee, idx) => {
                    return employee.status === "inactive"
                })

                setInactiveEmployees(countInactiveEmployees.length)

            } catch (err) {
                console.log("Error fetching Data", err.message)
            }
        }

        fetchUserDataForCards()
    }, [currentPage])

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const skip = (currentPage - 1) * limit

                let url = searchText
                    ? `${import.meta.env.VITE_API_URL}/search?q=${searchText}`
                    : `${import.meta.env.VITE_API_URL}`

                const separator = url.includes("?") ? "&" : "?"
                const response = await axios.get(
                    `${url}${separator}limit=${limit}&skip=${skip}`
                )

                let users = response.data.users.map(emp => ({
                    ...emp,
                    status: emp.id % 2 === 0 ? "active" : "inactive"
                }))

                if (genderFilter !== "all") {
                    users = users.filter(emp => emp.gender === genderFilter)
                }

                if (statusFilter !== "all") {
                    users = users.filter(emp => emp.status === statusFilter)
                }

                setDashboardData(users)
                setTotalEmployees(response.data.total)

            } catch (err) {
                console.log("Error fetching Data", err.message)
            }
        }

        fetchUserData()
    }, [currentPage, searchText, genderFilter, statusFilter])



    const cardContent = [
        {
            title: "Total Employees",
            data: totalEmployees,
            css: {
                cardCSS: "shadow bg-blue-500 p-5 rounded-lg flex justify-between items-center group",
                headingCSS: "text-white text-xl font-semibold",
                dataCSS: "text-white text-lg font-medium",
                iconCSS: "text-4xl text-gray-200"
            },
            icon: PiUsersBold
        },
        {
            title: "Active Employees",
            data: activeEmployees,
            css: {
                cardCSS: "shadow bg-green-500 p-5 rounded-lg flex justify-between items-center group",
                headingCSS: "text-white text-xl font-semibold",
                dataCSS: "text-white text-lg font-medium",
                iconCSS: "text-3xl text-gray-200"
            },
            icon: FaCheckDouble
        },
        {
            title: "Inactive Employees",
            data: inactiveEmployees,
            css: {
                cardCSS: "shadow bg-red-500 p-5 rounded-lg flex justify-between items-center group",
                headingCSS: "text-white text-xl font-semibold",
                dataCSS: "text-white text-lg font-medium",
                iconCSS: "text-3xl text-gray-200"
            },
            icon: ImCross
        }
    ]

    return (
        <section className="p-10">
            <div className="p-5 shadow-xl border border-gray-100 rounded-2xl">
                <h1 className="text-3xl font-bold text-gray-700">EMPLOYEE MANAGEMENT DASHBOARD</h1>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <Card inputData={cardContent} />
                </div>
                <div className="w-full">
                    <EmployeeList data={dashboardData} setData={setDashboardData} totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} genderFilter={genderFilter} setGenderFilter={setGenderFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} searchText={searchText} setSearchText={setSearchText} />
                </div>
            </div>
        </section>
    )
}

export default Dashboard