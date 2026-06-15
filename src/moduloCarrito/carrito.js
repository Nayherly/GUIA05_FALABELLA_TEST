// Lógica para la gestión comercial del Carrito de Compras
function agregarAlCarrito(producto, carrito, variantes, cantidad) {
    // Regla de negocio: Variante obligatoria para ropa y calzado
    if ((producto.categoria === 'Vestir' || producto.categoria === 'Calzado') && !variantes.talla) {
        return { adicionPermitida: false, resaltarSelectorRojo: true, carrito };
    }

    carrito.push({ productoId: producto.id, variantes, cantidad });
    return {
        carrito,
        contadorVisual: carrito.reduce((acc, item) => acc + item.cantidad, 0),
        popupConfirmacion: true,
        adicionPermitida: true
    };
}

function actualizarCantidad(productoId, nuevaCantidad, carrito, stockDisponible) {
    const item = carrito.find(i => i.productoId === productoId);
    
    if (!item) return { carrito };

    // Regla de negocio: Límite mínimo de 1 artículo
    if (nuevaCantidad < 1) {
        return { cantidadFinal: item.cantidad, botonDecrementoBloqueado: true, adicionPermitida: false };
    }

    // Regla de negocio: Límite máximo según stock físico disponible
    if (nuevaCantidad > stockDisponible) {
        return { cantidadFinal: item.cantidad, alertaInventario: true, adicionPermitida: false };
    }

    item.cantidad = nuevaCantidad;
    return { cantidadFinal: item.cantidad, adicionPermitida: true };
}

function eliminarProducto(productoId, carrito) {
    const indice = carrito.findIndex(i => i.productoId === productoId);
    if (indice !== -1) {
        carrito.splice(indice, 1);
    }

    return {
        carrito,
        contadorBolsa: carrito.length,
        mensajeAlerta: carrito.length === 0 ? 'Tu carrito está vacío' : 'Producto eliminado'
    };
}

module.exports = { agregarAlCarrito, actualizarCantidad, eliminarProducto };
