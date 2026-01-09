import React, { useState, useRef } from "react";
import Toggle from "../../UI/ToggleBtn";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdPrint } from "react-icons/io";
import Swal from "sweetalert2";
import axios from "axios";
import Input from "../../UI/Input";
import Select from "../../UI/Select";
import { useReactToPrint } from "react-to-print";

const EmployeeList = ({ data, setData, totalPages, currentPage, setCurrentPage, genderFilter, setGenderFilter, statusFilter, setStatusFilter, searchText, setSearchText }) => {
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate()
    const printRef = useRef(null);

    const getPaginationPages = (currentPage, totalPages) => {
        const pages = new Set()

        pages.add(1)
        pages.add(2)

        pages.add(currentPage - 1)
        pages.add(currentPage)
        pages.add(currentPage + 1)

        pages.add(totalPages - 1)
        pages.add(totalPages)

        return [...pages]
            .filter(p => p >= 1 && p <= totalPages)
            .sort((a, b) => a - b)
    }

    const pages = getPaginationPages(currentPage, totalPages)

    const handleDelete = (ID) => {
        Swal.fire({
            title: "Are you sure you want to remove this Employee from list?",
            text: "Deleting this will permanently remove this Employee from list",
            focusCancel: true,
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            reverseButtons: true,
            cancelButtonColor: "#808080",
            cancelButtonText: "No, don't delete",
            confirmButtonColor: "#f00",
            confirmButtonText: "Delete it!"
        }).then(async (result) => {
            try {
                if (result.isConfirmed) {
                    console.log(ID)
                    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/${ID}`)
                    const data = response.data

                    console.log("data deleted", data)

                    if (data.isDeleted) {
                        Swal.fire("Success", `Employee ID : ${ID} has been successfully deleted!`, "success")
                    }
                } else if (result.isDenied) {
                    Swal.fire("Operation cancelled", "", "info")
                }
            } catch (error) {
                console.log("Error", error)
                Swal.fire("Error Deleting Employee", "Please try again", "error")
            }
        }).catch((error) => {
            console.log("Error deleting employee")
        })
    }

    const handleStatusToggle = (employeeId) => {
        setData(prevData =>
            prevData.map(emp =>
                emp.id === employeeId
                    ? { ...emp, status: emp.status === "active" ? "inactive" : "active" }
                    : emp
            )
        )
    }

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: "Employee List",
        pageStyle: `
        @page {
            size: A4;
            margin: 20mm;
        }
        @media print {
            body {
                -webkit-print-color-adjust: exact;
            }
            table {
                border-collapse: collapse;
                width: 100%;
            }
            th, td {
                border: 1px solid #000;
                padding: 6px;
            }
            th {
                background-color: #0891b2 !important;
                color: white !important;
            }
        }
    `
    });


    return (
        <section className="mt-10">
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl font-semibold text-gray-700">
                        Employee List
                    </h1>
                    <Link to="/employee/add-employee"
                        className="px-8 py-2 cursor-pointer rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition disabled:bg-blue-300"
                    >
                        Add Employee
                    </Link>
                </div>
                <div className="flex justify-end gap-4">
                    <Input
                        label="Search :"
                        name="search"
                        value={searchText}
                        placeholder="Search Employee..."
                        onChange={(e) => {
                            setSearchText(e.target.value)
                            setCurrentPage(1)
                        }}
                        error=""
                    />

                    <div className="flex gap-4">
                        <Select
                            label="Gender :"
                            name="gender"
                            value={genderFilter}
                            onChange={(e) => {
                                setGenderFilter(e.target.value)
                                setCurrentPage(1)
                            }}
                            options={["all", "male", "female"]}
                            error=""
                        />

                        <Select
                            label="Status :"
                            name="status"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value)
                                setCurrentPage(1)
                            }}
                            options={["all", "active", "inactive"]}
                            error=""
                        />
                        <div className="mt-5 flex justify-end items-center me-5">
                            <IoMdPrint onClick={() => handlePrint()} className="text-2xl text-gray-500 hover:text-blue-500 cursor-pointer" />
                        </div>
                    </div>

                </div>
                <div ref={printRef} className="mt-5 bg-white rounded-xl shadow-lg overflow-hidden">
                    <table className="w-full text-sm table-auto">
                        <thead className="bg-cyan-600 text-white sticky top-0">
                            <tr className="text-left bg-cyan-600 text-white">
                                <th className="px-4 py-3 text-left">Employee ID</th>
                                <th className="px-4 py-3 text-left">Profile Image</th>
                                <th className="px-4 py-3 text-left">Full Name</th>
                                <th className="px-4 py-3 text-left">Gender</th>
                                <th className="px-4 py-3 text-left">Date of Birth (DOB)</th>
                                <th className="px-4 py-3 text-left">State</th>
                                <th className="px-4 py-3 text-left">Active/Inactive</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((employee, idx) => {
                                return (
                                    <tr key={idx} className="even:bg-gray-200 hover:even:bg-gray-300 hover:odd:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{employee?.id}</td>
                                        <td className="px-4 py-3"><Link to={employee.image} className="hover:underline"><img
                                            src={employee.image}
                                            alt="profile"
                                            className="w-10 h-10 rounded-full object-cover shadow"
                                        /></Link></td>
                                        <td className="px-4 py-3">{employee?.firstName + " " + employee.lastName}</td>
                                        <td className="px-4 py-3">{employee.gender}</td>
                                        <td className="px-4 py-3">{employee.birthDate}</td>
                                        <td className="px-4 py-3">{employee.address.state}</td>
                                        <td className="px-4 py-3"><Toggle
                                            value={employee.status === "active"}
                                            onChange={() => handleStatusToggle(employee.id)}
                                        /></td>
                                        <td className="px-4 py-3">{<div className="flex gap-2 items-center text-lg"><MdOutlineEdit className="cursor-pointer text-green-400 hover:text-green-500" onClick={() => {
                                            navigate("/employee/edit-employee/" + employee.id)
                                        }} /><RiDeleteBin6Line className="cursor-pointer text-red-400 hover:text-red-500" onClick={() => { handleDelete(employee.id) }} />
                                        </div>}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="flex gap-2 justify-center mt-6">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:hover:opacity-40 disabled:cursor-not-allowed rounded disabled:opacity-50 cursor-pointer"
                    >
                        Prev
                    </button>
                    {pages.map((page, index) => {
                        const prevPage = pages[index - 1]

                        return (
                            <React.Fragment key={page}>
                                {prevPage && page - prevPage > 1 && (
                                    <span className="px-2">...</span>
                                )}

                                <button
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded ${currentPage === page
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200"
                                        }`}
                                >
                                    {page}
                                </button>
                            </React.Fragment>
                        )
                    })}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:hover:opacity-40 disabled:cursor-not-allowed rounded disabled:opacity-50 cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            </div>

        </section>
    )
}

export default EmployeeList