const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById( 'footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

//---Eventos
//---Ejecuto fetchData
document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
cards.addEventListener('click', e =>{
    addCarrito(e)
})
// botones + -
items.addEventListener('click', e =>{
    btnAccion(e)
})

//---Accedo a la api.json
const fetchData = async() =>{
    //realizo peticion
    try{
        const res = await fetch('api.json')
        const data = await res.json()
       
        pintarCards(data)
    }catch(error) {
        console.log(error)
    }
}
//Imprimo las card en pantalla
const pintarCards = data =>{
        //console.log(data)
        
        data.forEach(producto => {
           // console.log(producto)
           templateCard.querySelector('h5').textContent = producto.title
           templateCard.querySelector('p').textContent = producto.precio
           templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
           templateCard.querySelector('.btn-dark').dataset.id = producto.id
           
        const clone = templateCard.cloneNode(true)
           //una vez q tengo el clone lo paso al fragment
           fragment.appendChild(clone)
        })
        cards.appendChild(fragment)
}
//--Agregar al carrito
const addCarrito = e =>{
    //console.log(e.target)
   // console.log(e.target.classList.contains('btn-dark'))
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()

}

// funcion q Manipula nuestro carrito
 const setCarrito = objeto =>{
    //console.log(objeto)
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad:1
        }
        //Para que aumente su cantidad
        if(carrito.hasOwnProperty(producto.id)){
            producto.cantidad = carrito[producto.id].cantidad + 1
        }
        //adquiero la informacion y hago una copia del producto con {...}Spread Operator
        carrito[producto.id]= {...producto}
    //console.log(carrito)
    pintarCarrito()
 }

 //imprimir carrito en pantalla

 const pintarCarrito = () =>{
    //console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    //funcionalidad al mensaje del footer en el carrito
    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
   
}

 const pintarFooter = () =>{
    footer.innerHTML = ''
    //si no existen elementos
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
    //sumar cantidades:
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad})=> acc + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)
    //console.log(nPrecio)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    //vaciar carrito
    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener ('click', () =>{
        carrito = {}
        pintarCarrito()
    })
}
const btnAccion = e =>{
    //console.log(e.target)
    //aumentar
    if(e.target.classList.contains('btn-info')){
       // console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++ 
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    //disminuir
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad-- 
        if(producto.cantidad === 0){
            alert('se eliminara del carrito!!')
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}

