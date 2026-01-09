import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa6";
import Input from "../UI/Input";

const Login = () => {
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState({})
    const [loading, setLoading] = useState()

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_URL)
                const data = response.data

                console.log("data", data)
            } catch (err) {
                console.log("Error fetching Data", err.message)
            }
        }

        fetchUserData()
    }, [])

    const validation = () => {
        let validate = true
        let errorObj = {}

        if (userName.trim() === "") {
            validate = false
            errorObj.userNameError = "Username is required"
            setError(errorObj)
        }

        if (password.trim() === "") {
            validate = false
            errorObj.passwordError = "Password is required"
            setError(errorObj)
        }

        return validate
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            if (validation()) {
                const formValues = {
                    username: userName,
                    password: password,
                    expiresInMins: 1
                }

                const response = await axios.post("https://dummyjson.com/user/login", formValues)
                const data = response.data

                const user = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    token: data.accessToken
                }

                if (data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(user))
                    navigate("/dashboard")
                }
            }

        } catch (err) {
            Swal.fire("Wrong Username or Password", "Please check ur Username and Password combination", "error")
            console.log("Error logging in user", err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleShowHidePassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <section className="flex justify-center items-center min-h-screen w-full bg-blue-200">
            <div className="bg-white rounded-2xl shadow-xl p-10 space-y-5 w-1/3">
                <h1 className="text-2xl font-semibold text-gray-700 text-center">
                    Login
                </h1>
                <div>
                    <Input
                        label="Username"
                        name="username"
                        value={userName}
                        placeholder="Enter Username"
                        onChange={(e) => {
                            setUserName(e.target.value)
                        }}
                        error={error.userNameError}
                    />
                </div>


                <div className="relative">
                    <div className="absolute right-2 top-10">
                        {showPassword ? <FaEye className="cursor-pointer text-blue-500" onClick={handleShowHidePassword} /> : <FaEyeSlash className="cursor-pointer" onClick={handleShowHidePassword} />}
                    </div>

                    <Input
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        placeholder="Enter Password"
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        error={error.passwordError}
                    />
                </div>

                <div className="flex justify-center items-center">
                    <button disabled={loading} type="submit" className="px-8 py-2 cursor-pointer rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition disabled:bg-blue-300"
                        onClick={handleLogin}>{loading ? <div className="flex gap-2 justify-between items-center">Logging in <FaSpinner className="text-white animate-spin" /></div> : "Login"}</button>
                </div>
            </div>
        </section>
    )
}

export default Login