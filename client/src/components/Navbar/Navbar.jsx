import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        window.localStorage.removeItem("user")
        navigate("/")
    }


    return (
        <section className="sticky top-0 bg-gray-200 z-50">
            <nav className="py-5 grid grid-cols-3">
                <div></div>
                <div className="flex justify-center items-center text-cyan-500 text-2xl font-bold">BookXpert</div>
                <div className="flex justify-end items-center me-10">
                    {location.pathname !== "/" && <button type="submit" className="px-8 py-2 cursor-pointer rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition disabled:bg-blue-300"
                        onClick={handleLogout}>Logout</button>}
                </div>
            </nav>
        </section>
    )
}

export default Navbar