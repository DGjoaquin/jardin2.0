window.onload = () => {
    console.log("JS funcionando");
    let favoritos = [];
    let comunicados = [
        {
            titulo: "Reunión de apoderados",
            descripcion: "Se realizará el viernes a las 10:00 hrs.",
            categoria: "Reuniones"
        },
        {
            titulo: "Vacunación infantil",
            descripcion: "Campaña de salud el día lunes.",
            categoria: "Salud"
        },
        {
            titulo: "Salida pedagógica",
            descripcion: "Visita al parque educativo.",
            categoria: "Actividades"
        }
    ];

    let contenedor = document.getElementById("contenedor-comunicados");
    function mostrarComunicados(lista) {
        let tarjetas = lista.map((c) => {
            return `
                <div class="card-panel">
                    <h5>${c.titulo}</h5>
                    <p>${c.descripcion}</p>
                    <small>${c.categoria}</small>
                    <br>
                    <button class="btn-fav">Agregar a favoritos</button>
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
                favoritos.push(seleccionado);
                localStorage.setItem("favoritos", JSON.stringify(favoritos));
                console.log(favoritos);
            });
        });
    }
    mostrarComunicados(comunicados);
    activarBotones(comunicados);

    let buscador = document.getElementById("buscador");
    buscador.addEventListener("input", () => {
        let texto = buscador.value.toLowerCase();
        let filtrados = comunicados.filter((c) => {
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

