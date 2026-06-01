window.onload = () => {
    console.log("JS funcionando");
    let comunicados = JSON.parse(localStorage.getItem("comunicados")) || [];
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    let contenedor = document.getElementById("contenedor-comunicados");
    let mostrando = "todos";

    function mostrarComunicados(lista) {
        let tarjetas = lista.map((c, index) => {
            let esFavorito = favoritos.some(fav => 
                fav.titulo === c.titulo && fav.descripcion === c.descripcion
            );
            let botónFav = esFavorito 
                ? `<button class="btn-fav btn-fav-activo" data-index="${index}">⭐ Favorito</button>`
                : `<button class="btn-fav" data-index="${index}">☆ Agregar a favoritos</button>`;
            
            return `
                <div class="card-panel">
                    <h5>${c.titulo}</h5>
                    <p>${c.descripcion}</p>
                    <small>${c.categoria}</small>
                    <br>
                    ${botónFav}
                    <button class="btn-delete" data-index="${index}">Eliminar</button>
                </div>
            `;
        });
        contenedor.innerHTML = tarjetas.join("");
    }

    function activarBotones(lista) {
        let botones = document.querySelectorAll(".btn-fav");
        botones.forEach((btn, index) => {
            btn.addEventListener("click", () => {
                let seleccionado = lista[index];
                let esFavorito = favoritos.some(fav => 
                    fav.titulo === seleccionado.titulo && fav.descripcion === seleccionado.descripcion
                );
                
                if (esFavorito) {
                    favoritos = favoritos.filter(fav => 
                        !(fav.titulo === seleccionado.titulo && fav.descripcion === seleccionado.descripcion)
                    );
                } else {
                    favoritos.push(seleccionado);
                }
                
                localStorage.setItem("favoritos", JSON.stringify(favoritos));
                console.log("Favoritos actualizado:", favoritos);
                
                if (mostrando === "todos") {
                    mostrarComunicados(comunicados);
                    activarBotones(comunicados);
                } else if (mostrando === "favoritos") {
                    mostrarComunicados(favoritos);
                    activarBotones(favoritos);
                }
            });
        });
    }

    function activarEliminar(lista) {
        let botones = document.querySelectorAll(".btn-delete");

        botones.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                let index = e.target.getAttribute("data-index");
                let comunicadoAEliminar = lista[index];

                lista.splice(index, 1);

                favoritos = favoritos.filter(fav => 
                    !(fav.titulo === comunicadoAEliminar.titulo && fav.descripcion === comunicadoAEliminar.descripcion)
                );

                localStorage.setItem("comunicados", JSON.stringify(lista));
                localStorage.setItem("favoritos", JSON.stringify(favoritos));

                if (mostrando === "todos") {
                    mostrarComunicados(lista);
                    activarBotones(lista);
                    activarEliminar(lista);
                } else if (mostrando === "favoritos") {
                    mostrarComunicados(favoritos);
                    activarBotones(favoritos);
                    activarEliminar(favoritos);
                }
            });
        });
    }

    window.filtrar = (tipo) => {
        if (tipo === "favoritos") {
            if (mostrando === "favoritos") {
                mostrando = "todos";
                document.getElementById("favoritos").classList.remove("activo");
                mostrarComunicados(comunicados);
                activarBotones(comunicados);
                activarEliminar(comunicados);
            } else {
                mostrando = "favoritos";
                document.getElementById("favoritos").classList.add("activo");
                mostrarComunicados(favoritos);
                activarBotones(favoritos);
                activarEliminar(favoritos);
            }
        }
    };

    mostrarComunicados(comunicados);
    activarBotones(comunicados);
    activarEliminar(comunicados);

    let buscador = document.getElementById("buscador");
    buscador.addEventListener("input", () => {
        let texto = buscador.value.toLowerCase();
        let listaActual = mostrando === "favoritos" ? favoritos : comunicados;
        let filtrados = listaActual.filter((c) => {
            return c.titulo.toLowerCase().includes(texto);
        });

        mostrarComunicados(filtrados);
        activarBotones(filtrados);
    });
    
    let btnMenu = document.getElementById("btn-menu");
    let menu = document.getElementById("menu-links");

    console.log(btnMenu);

    btnMenu.addEventListener("click", () => {
        console.log("click en menu");
        menu.classList.toggle("activo");
    });

    document.addEventListener("click", (e) => {
        const menu = document.getElementById("menu-links");
        const btn = document.getElementById("btn-menu");
        const clickEnLink = e.target.closest("#menu-links a");
        if (clickEnLink) {
            menu.classList.remove("activo");
        }
    });

    let form = document.getElementById("form-contacto");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let nombre = document.getElementById("nombre").value.trim();
        let email = document.getElementById("email").value.trim();
        let mensaje = document.getElementById("mensaje").value.trim();

        let errorNombre = document.getElementById("error-nombre");
        let errorEmail = document.getElementById("error-email");
        let errorMensaje = document.getElementById("error-mensaje");

        let valido = true;

        errorNombre.textContent = "";
        errorEmail.textContent = "";
        errorMensaje.textContent = "";

        if (nombre.length < 3) {
            errorNombre.textContent = "Nombre mínimo 3 caracteres";
            valido = false;
        }

        let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            errorEmail.textContent = "Email inválido";
            valido = false;
        }

        if (mensaje.length < 10) {
            errorMensaje.textContent = "Mensaje mínimo 10 caracteres";
            valido = false;
        }

        if (valido) {
            alert("Formulario enviado correctamente");

            form.reset();
        }
    });
    let btnDark = document.getElementById("btn-dark");
    if (localStorage.getItem("modo") === "dark") {
        document.body.classList.add("dark");
    }
    btnDark.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        if (document.body.classList.contains("dark")) {
            localStorage.setItem("modo", "dark");
        } else {
            localStorage.setItem("modo", "light");
        }
    });
}
