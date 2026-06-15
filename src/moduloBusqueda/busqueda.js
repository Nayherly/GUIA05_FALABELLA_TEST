// Lógica para el motor de Búsqueda y Filtros
function buscarProducto(termino, catalogo) {
    if (!termino || termino.trim() === '') {
        return { procesado: false, redireccionar: false, productos: [] };
    }
 
    // Sanitización básica para prevenir XSS e inyecciones
    const terminoSanitizado = termino.replace(/<[^>]*>/g, "").trim();
 
    // Si tras sanitizar queda vacío (era puro script/XSS)
    if (terminoSanitizado === '') {
        return {
            htmlSanitizado: terminoSanitizado, // string vacío, sin <script>
            productos: [],
            estadoVacio: true
        };
    }
 
    const productosFiltrados = catalogo.filter(p =>
        p.nombre.toLowerCase().includes(terminoSanitizado.toLowerCase())
    );
 
    if (productosFiltrados.length === 0) {
        return {
            htmlSanitizado: terminoSanitizado, // ← agregado aquí también
            productos: [],
            paginaSinResultados: true,
            estadoVacio: true,
            sugerencias: ['Tecnología', 'Moda Hombre', 'Calzado Deportivo']
        };
    }
 
    return {
        htmlSanitizado: terminoSanitizado,     // ← y aquí
        productos: productosFiltrados,
        totalResultados: productosFiltrados.length,
        procesado: true
    };
}
 
function gestionarFiltroURL(urlStr) {
    try {
        const url = new URL(urlStr);
        let min = parseInt(url.searchParams.get('minPrecio'));
        let max = parseInt(url.searchParams.get('maxPrecio'));
 
        // Si los valores no son numéricos o están corruptos, se asigna el fallback por defecto
        if (isNaN(min)) min = 0;
        if (isNaN(max)) max = 1000;
 
        return { minPrecio: min, maxPrecio: max, errorServidor: false };
    } catch (e) {
        return { minPrecio: 0, maxPrecio: 1000, errorServidor: true };
    }
}
 
module.exports = { buscarProducto, gestionarFiltroURL };
 