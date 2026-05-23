import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
    const [carrito, setCarrito] = useState([])

    const añadir = (producto, variante = null) => {
        setCarrito(prev => {
            const existe = prev.find(item =>
                item.producto.id === producto.id &&
                item.variante?.id === variante?.id
            )
            if (existe) {
                return prev.map(item =>
                    item.producto.id === producto.id && item.variante?.id === variante?.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            }
            return [...prev, { producto, variante, cantidad: 1 }]
        })
    }

    const quitar = (productoId, varianteId = null) => {
        setCarrito(prev => prev.filter(item =>
            !(item.producto.id === productoId && item.variante?.id === varianteId)
        ))
    }

    const actualizar = (productoId, varianteId, cantidad) => {
        if (cantidad <= 0) { quitar(productoId, varianteId); return }
        setCarrito(prev => prev.map(item =>
            item.producto.id === productoId && item.variante?.id === varianteId
                ? { ...item, cantidad }
                : item
        ))
    }

    const vaciar = () => setCarrito([])

    const total = carrito.reduce((sum, item) =>
        sum + parseFloat(item.producto.precio_base) * item.cantidad, 0
    )

    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)

    return (
        <CartContext.Provider value={{ carrito, añadir, quitar, actualizar, vaciar, total, totalItems }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}