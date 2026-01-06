"use client";

import { useState } from "react";
import { createuser } from "./test.api";

export default function FormUsers() {
    const [formData, setFormData] = useState({
        name:  Number(""),//cambiar a string si quieres que funcione bien
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            //  Convertir a número antes de enviar para el dto
            const dataToSend = {
                name: Number(formData.name), //  cambiar a string si quieres que funcione bien
                email: formData.email,
                password: formData.password,
            };

            const response = await createuser(dataToSend);
            alert(response.message);
            
            setFormData({ name: Number(""), email: "", password: "" });//cambiar a string si quieres que funcione bien
        } catch (error) {
            alert("Error al crear usuario");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
            <h2 className="text-2xl font-bold text-white">Crear Usuario</h2>

            <div>
                <label htmlFor="name" className="block text-white mb-2">
                    Nombre
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-white mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-white mb-2">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300"
            >
                {loading ? "Creando..." : "Crear Usuario"}
            </button>
        </form>
    );
}