///----api externa
 // desde una api externa
 const boton = document.querySelector("#btn4");
  const container2 = document.querySelector(".container2");
const obtenerDatos = ()=>{
    fetch("https://randomuser.me/api")
       .then(response => response.json())
       .then(result => {
           console.log(result)
           let datos = result.results;
           datos.forEach(user =>{
               container2.innerHTML += `
               <img src="${user.picture.medium}">
               <h3>${user.name.first}</h3>
               <p>${user.cell}</p>
               <p>${user.email}<p>

               `
           })
       })
       .catch(error => console.log(error))

    }

  boton.onclick = () =>{
      obtenerDatos();
  }