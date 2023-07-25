// Proyecto Final 

let elCarrito = []
let totalPrecio = 0
let elCarritoJSON = JSON.parse(localStorage.getItem("elCarrito"))
let totalPrecioJSON = localStorage.getItem("totalPrecio")

if (elCarritoJSON) {
    elCarrito = elCarritoJSON
}

if (totalPrecioJSON !== null) {
    totalPrecio = parseFloat(totalPrecioJSON)
} else {
    totalPrecio = 0
}

let contenedor = document.getElementById("productos")
const urlLocal = "./db.json"
let productos = []

fetch(urlLocal)
    .then(response => response.json())
    .then(data => {
        productos = data.productos
        crearFiltros(productos)
        crearTarjetas(productos)
        renderizarCarrito()
    })
    .catch(error => {
        console.error("Error al obtener los productos:", error);
    });

function crearTarjetas(array) {
    contenedor.innerHTML = ""
    array.forEach(elemento => {
        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.className = "tarjetaProducto"
        tarjetaProducto.innerHTML = `
            <h4 id="nombre-prod">${elemento.nombre}</h4>
            <img class="imagen" src="img/${elemento.rutaImagen}">
            <h4>$${elemento.precio}</h4>
            <button id=${elemento.id} class="a-carrito">Agregar al carrito</button>
            `
        contenedor.appendChild(tarjetaProducto)
        let botonAgregarAlCarrito = document.getElementById(elemento.id)
        botonAgregarAlCarrito.addEventListener("click", agregarAlCarrito)
    })
}

function agregarAlCarrito(e) {
    let productoBuscado = productos.find(elemento => elemento.id === Number(e.target.id))
    let productoEnCarrito = elCarrito.find(elemento => elemento.id === productoBuscado.id)

    if (productoEnCarrito) {
        productoEnCarrito.cantidad = (productoEnCarrito.cantidad || 0) + 1
    } else {
        elCarrito.push({
            id: productoBuscado.id,
            imagen: productoBuscado.rutaImagen,
            nombre: productoBuscado.nombre,
            precio: productoBuscado.precio,
            cantidad: 1
        })
    }
    totalPrecio += productoBuscado.precio
    console.log(elCarrito)
    lanzarTostada()
    renderizarCarrito()

    localStorage.setItem("elCarrito", JSON.stringify(elCarrito))
    localStorage.setItem("totalPrecio", totalPrecio.toString())
}

function renderizarCarrito() {
    let carritoFisico = document.getElementById("elCarrito")
    carritoFisico.innerHTML = ""

    elCarrito.forEach(elemento => {
        let subtotal = elemento.cantidad * elemento.precio
        subtotal = Math.round(subtotal)
        carritoFisico.innerHTML += `
        <div class="carritoFinal"> 
        <img class="imagenCarrito" src="../img/${elemento.imagen}"> ${elemento.nombre} <button class="btn-restar" data-id="${elemento.id}">-</button> ${elemento.cantidad} <button class="btn-sumar" data-id="${elemento.id}">+</button> <div class="carritoSubtotal"> Subtotal: $${subtotal.toFixed(0)}</div> <button class="eliminar" data-id="${elemento.id}">Eliminar</button>
        `
    })

    let cantidadItems = elCarrito.reduce((total, elemento) => total + elemento.cantidad, 0)
    let cantidadCarrito = document.getElementById("cantidadCarrito")
    cantidadCarrito.textContent = cantidadItems

    carritoFisico.innerHTML += `<p class="totales">Total items: ${cantidadItems}</p>`
    carritoFisico.innerHTML += `<p class="totales">Total precio: $${totalPrecio}</p>`
    carritoFisico.innerHTML += `<button id="finalizar" class="compraFinalizada">Finalizar Compra</button>`


    let botonesEliminar = document.getElementsByClassName("eliminar")
    for (const botonEliminar of botonesEliminar) {
        botonEliminar.addEventListener("click", eliminarDelCarrito)
    }

    let botonesSumar = document.getElementsByClassName("btn-sumar")
    for (const botonSumar of botonesSumar) {
        botonSumar.addEventListener("click", sumarItem)
    }

    let botonesRestar = document.getElementsByClassName("btn-restar")
    for (const botonRestar of botonesRestar) {
        botonRestar.addEventListener("click", restarItem)
    }

    let botonesFinalizarCompra = document.getElementsByClassName("compraFinalizada")
    for (const botonFinalizarCompra of botonesFinalizarCompra) {
        botonFinalizarCompra.addEventListener("click", finalizarCompra)
    }
}

let buscador = document.getElementById("buscador")
buscador.addEventListener("input", filtrar)

function filtrar() {
    let terminoBusqueda = buscador.value.toLowerCase()
    let arrayFiltrado = productos.filter(producto => producto.nombre.toLowerCase().includes(terminoBusqueda))
    crearTarjetas(arrayFiltrado)
}

let botonesFiltros = document.getElementsByClassName("filtro")
for (const botonFiltro of botonesFiltros) {
    botonFiltro.addEventListener("click", filtrarPorCategoria)
}

function filtrarPorCategoria(e) {
    if (e.target.id === "Todos") {
        crearTarjetas(productos)
    } else {
        let elementosFiltrados = productos.filter(tarjetaProducto => tarjetaProducto.categoria === e.target.id)
        crearTarjetas(elementosFiltrados)
    }
}

function crearFiltros(arrayDeElementos) {
    let filtros = ["Todos"]
    arrayDeElementos.forEach(tarjetaProducto => {
        if (!filtros.includes(tarjetaProducto.categoria)) {
            filtros.push(tarjetaProducto.categoria)
        }
    })

    let contenedorFiltros = document.getElementById("filtros")
    filtros.forEach(filtro => {
        let boton = document.createElement("button")
        boton.id = filtro
        boton.innerText = filtro
        boton.classList.add("btn-filtro")
        contenedorFiltros.appendChild(boton)

        let botonCapturado = document.getElementById(filtro)
        botonCapturado.addEventListener("click", filtrarPorCategoria)
    })
}

let botonCarrito = document.getElementById("botonCarrito")
botonCarrito.addEventListener("click", mostrarOcultar)

function mostrarOcultar() {
    let padreContenedor = document.getElementById("prod")
    let elCarrito = document.getElementById("elCarrito")
    padreContenedor.classList.toggle("oculto")
    elCarrito.classList.toggle("oculto")
}

function eliminarDelCarrito(e) {
    let idProducto = Number(e.target.dataset.id)
    let productoEliminado = productos.find((producto) => producto.id === idProducto)

    let productoEnCarrito = elCarrito.find((elemento) => elemento.id === idProducto)
    if (productoEnCarrito) {
        totalPrecio -= productoEliminado.precio * productoEnCarrito.cantidad
        elCarrito = elCarrito.filter((elemento) => elemento.id !== idProducto)

        if (elCarrito.length === 0) {
            totalPrecio = 0
        }
    }
    renderizarCarrito()
    localStorage.setItem("elCarrito", JSON.stringify(elCarrito))
    localStorage.setItem("totalPrecio", totalPrecio.toString())
}

function sumarItem(e) {
    let idProducto = Number(e.target.dataset.id)
    let productoBuscado = elCarrito.find(elemento => elemento.id === idProducto)

    if (productoBuscado) {
        productoBuscado.cantidad = (productoBuscado.cantidad || 0) + 1
        totalPrecio += productoBuscado.precio
    }

    renderizarCarrito()
}

function restarItem(e) {
    let idProducto = Number(e.target.dataset.id)
    let productoBuscado = elCarrito.find(elemento => elemento.id === idProducto)

    if (productoBuscado && productoBuscado.cantidad) {
        productoBuscado.cantidad -= 1
        totalPrecio -= productoBuscado.precio

        if (productoBuscado.cantidad === 0) {
            elCarrito = elCarrito.filter(elemento => elemento.id !== idProducto)
        }
    }

    renderizarCarrito()
}

function lanzarTostada() {
    Toastify({
        text: "Producto agregado al carrito",
        gravity: "bottom",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        duration: 3000
    }).showToast();
}

function finalizarCompra(e) {
    let carritoFisico = document.getElementById("elCarrito")
    carritoFisico.innerHTML = ""

    if (e.target.id === "finalizar") {
        Swal.fire({
            icon: 'success',
            title: '¡Compra Exitosa!',
            text: '¡Muchas gracias por su Compra!',
            showConfirmButton: false,
            timer: 1500
        })
    }

    elCarrito = []
    localStorage.clear()

    let cantidadCarrito = document.getElementById("cantidadCarrito")
    cantidadCarrito.textContent = 0
}