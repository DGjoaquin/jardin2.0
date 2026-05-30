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
}

