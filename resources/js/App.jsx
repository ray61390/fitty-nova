import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Vendedor from './pages/Vendedor'
import Admin from './pages/Admin'
import Producto from './pages/Producto'
import Outfits from './pages/Outfits'
import Ruleta from './pages/Ruleta'
import Carrito from './pages/Carrito'
import Perfil from './pages/Perfil'
import Tendencias from './pages/Tendencias'
import { LangProvider } from './context/LangContext'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
export default function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <LangProvider>
                    <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/vendedor" element={<Vendedor />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/producto/:id" element={<Producto />} />
                    <Route path="/outfits" element={<Outfits />} />
                    <Route path="/ruleta" element={<Ruleta />} />
                    <Route path="/carrito" element={<Carrito />} />
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/tendencias" element={<Tendencias />} />
                </Routes>
                 </LangProvider>
            </CartProvider>
        </AuthProvider>
    )
}