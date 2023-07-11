// Tercera Pre-Entrega

const productos = [
    { id: 1, nombre: "Miura", marca: "La Sportiva", categoria: "Pédulas", precio: 85000, stock: 87, rutaImagen: "miura-lasportiva.jpg" },
    { id: 5, nombre: "Katana", marca: "La Sportiva", categoria: "Pédulas", precio: 106000, stock: 150, rutaImagen: "katana-lasportiva.jpg" },
    { id: 10, nombre: "Otaki", marca: "La Sportiva", categoria: "Pédulas",precio: 101000, stock: 237, rutaImagen: "otaki-lasportiva.jpg" },
    { id: 15, nombre: "Selena", marca: "Petzl", categoria: "Arneses", precio: 42000, stock: 132, rutaImagen: "selena-petzl.jpeg" },
    { id: 20, nombre: "Ray", marca: "Singing Rock", categoria: "Arneses", precio: 45500, stock: 103, rutaImagen: "ray-singingrock.jpg" },
    { id: 25, nombre: "Jayne 3", marca: "Edelrid", categoria: "Arneses", precio: 63000, stock: 85, rutaImagen: "jayne3-edelrid.jpg" },
    { id: 30, nombre: "Colt Negro", marca: "Singing Rock", categoria: "Mosquetones", precio: 7500, stock: 326, rutaImagen: "colt-singingrock.jpg" },
    { id: 35, nombre: "Link", marca: "Edelweiss", categoria: "Mosquetones", precio: 9225, stock: 125, rutaImagen: "link-edelweiss.jpg" },
    { id: 40, nombre: "Argon S Black", marca: "Kong", categoria: "Mosquetones", precio: 13450, stock: 238, rutaImagen: "kong-mosqueton.jpg" }
]

let elCarrito = []
let totalPrecio = 0
let elCarritoJSON= JSON.parse(localStorage.getItem("elCarrito"))
let totalPrecioJSON = localStorage.getItem("totalPrecio")


if (elCarritoJSON) {
    elCarrito = elCarritoJSON
}

if (totalPrecioJSON) {
    totalPrecio = parseFloat(totalPrecioJSON)
} else {
    totalPrecio = 0
}

let contenedor = document.getElementById("productos")

crearFiltros (productos)
crearTarjetas(productos, contenedor)
renderizarCarrito()


function crearTarjetas(array) {
    contenedor.innerHTML = ""
    array.forEach(elemento => {
        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.className = "tarjetaProducto"
        tarjetaProducto.innerHTML =`
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
        nombre: productoBuscado.nombre,
        precio: productoBuscado.precio,
        cantidad: 1
    })
}

    totalPrecio += productoBuscado.precio
    console.log(elCarrito)
    renderizarCarrito()

    localStorage.setItem("elCarrito", JSON.stringify(elCarrito))
    localStorage.setItem("totalPrecio", totalPrecio.toString())
}

function renderizarCarrito() {
    let carritoFisico = document.getElementById("elCarrito")
    carritoFisico.innerHTML = ""

    elCarrito.forEach(elemento => {
        carritoFisico.innerHTML += `
        <p>${elemento.nombre} (${elemento.cantidad}) ${elemento.precio.toString()}</p>
        <button class="btn-restar" data-id="${elemento.id}">-</button>
        <button class="btn-sumar" data-id="${elemento.id}">+</button>
        <button class="eliminar" data-id="${elemento.id}">Eliminar</button>
        `
    })

    let cantidadItems = elCarrito.reduce((total, elemento) => total + elemento.cantidad, 0)
    let cantidadCarrito = document.getElementById("cantidadCarrito")
    cantidadCarrito.textContent = cantidadItems
    
    carritoFisico.innerHTML += `<p>Total items: ${cantidadItems}</p>`
    carritoFisico.innerHTML += `<p>Total precio: $${totalPrecio}</p>`

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

function crearFiltros (arrayDeElementos) {
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

function mostrarOcultar () {
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


 