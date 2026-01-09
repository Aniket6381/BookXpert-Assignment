import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const RootLayout = () => {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const userIsLoggedIn = localStorage.getItem("user")
        if (!userIsLoggedIn) {
            navigate("/")
        }
    }, [])

    return (
        <>
            <Navbar location={location} />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default RootLayout