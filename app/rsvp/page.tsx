"use client";
import React, { useState } from "react";

const RSVPForm: React.FC = () => {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        numberOfCompanions: 0,
        dietaryRestrictions: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            const res = await fetch("/api/guests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed to submit RSVP");
            setSuccess(true);
            setForm({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                numberOfCompanions: 0,
                dietaryRestrictions: "",
            });
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Wedding RSVP</h1>
            {success && <div className="mb-4 text-green-600">RSVP submitted! Check your email for your QR code.</div>}
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number (optional)"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                <input
                    type="number"
                    name="numberOfCompanions"
                    placeholder="Number of Companions"
                    value={form.numberOfCompanions}
                    onChange={handleChange}
                    min={0}
                    max={5}
                    className="w-full border p-2 rounded"
                />
                <textarea
                    name="dietaryRestrictions"
                    placeholder="Dietary Restrictions (optional)"
                    value={form.dietaryRestrictions}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Submitting..." : "Submit RSVP"}
                </button>
            </form>
        </div>
    );
};

export default RSVPForm; 