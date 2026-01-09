import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../UI/Input";
import Select from "../../UI/Select";

const AddEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        fullName: "",
        gender: "",
        dob: "",
        state: "",
        status: "active"
    });

    const [states, setStates] = useState([]);
    const [profileFile, setProfileFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios
            .get("https://dummyjson.com/users?limit=0")
            .then(res => {
                const uniqueStates = [
                    ...new Set(res.data.users.map(u => u.address?.state))
                ];
                setStates(uniqueStates.filter(Boolean));
            });
    }, []);

    useEffect(() => {
        if (!isEditMode) return;

        axios
            .get(`${import.meta.env.VITE_API_URL}/${id}`)
            .then(res => {
                const emp = res.data;
                console.log("emp", emp)
                setFormData({
                    fullName: `${emp.firstName} ${emp.lastName}`,
                    gender: emp.gender,
                    dob: new Date(emp.birthDate).toISOString().split("T")[0],
                    state: emp?.address?.state,
                    status: emp.status
                });
                setProfilePreview(emp.image);
            })
            .catch(err => console.log(err.message));
    }, [id, isEditMode]);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = e => {
        const file = e.target.files[0];
        if (file) {
            setProfileFile(file);
            setProfilePreview(URL.createObjectURL(file));
        }
    };

    const validate = () => {
        const err = {};
        if (!formData.fullName) err.fullName = "Full name required";
        if (!formData.gender) err.gender = "Gender required";
        if (!formData.dob) err.dob = "DOB required";
        if (!formData.state) err.state = "State required";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                ...formData,
                image: profilePreview
            };

            if (isEditMode) {
                await axios.put(`${import.meta.env.VITE_API_URL}/${id}`, payload);
            } else {
                await axios.post(import.meta.env.VITE_API_URL, payload);
            }

            navigate("/dashboard");
        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-8 transition-all">
                <h1 className="text-3xl font-bold mb-6 text-gray-700">
                    {isEditMode ? "Edit Employee" : "Add Employee"}
                </h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

                    <div className="col-span-2 flex flex-col items-center">
                        <label className="cursor-pointer">
                            <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center overflow-hidden shadow-md hover:shadow-lg transition">
                                {profilePreview ? (
                                    <img
                                        src={profilePreview}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-500 text-sm">
                                        Upload Photo
                                    </span>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    <Input
                        label="Full Name"
                        name="fullName"
                        placeholder="Enter Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={errors.fullName}
                    />

                    <Select
                        label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        options={["male", "female"]}
                        error={errors.gender}
                    />

                    <Input
                        label="Date of Birth"
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        error={errors.dob}
                    />

                    <Select
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        options={states}
                        error={errors.state}
                    />

                    <Select
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        options={["active", "inactive"]}
                    />

                    <div className="col-span-2 flex justify-end mt-4">
                        <button
                            disabled={loading}
                            className="px-8 py-2 cursor-pointer rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition disabled:bg-blue-300"
                        >
                            {loading
                                ? "Saving..."
                                : isEditMode
                                    ? "Update Employee"
                                    : "Add Employee"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AddEmployee;
