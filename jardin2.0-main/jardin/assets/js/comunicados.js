window.onload = () => {
    console.log("JS funcionando");

    let comunicados = JSON.parse(localStorage.getItem("comunicados")) || [];
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    let contenedor = document.getElementById("contenedor-comunicados");

    if (!contenedor) return;

    let mostrando = "todos";
    contenedor.dataset.vista = "todos";

    function mostrarComunicados(lista) {
        let tarjetas = lista.map((c, index) => {
            let esFavorito = favoritos.some(fav =>
                fav.titulo === c.titulo && fav.descripcion === c.descripcion
            );

            let botonFav = esFavorito
                ? `<button class="btn-fav btn-fav-activo" data-index="${index}">⭐ Favorito</button>`
                : `<button class="btn-fav" data-index="${index}">☆ Agregar a favoritos</button>`;

            return `
                <div class="card-panel">
                    <h5>${c.titulo}</h5>
                    <p>${c.descripcion}</p>
                    <small>${c.categoria}</small>
                    <br>
                    ${botonFav}
                    <button class="btn-edit" data-index="${index}">✏️ Editar</button>
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
                    fav.titulo === seleccionado.titulo &&
                    fav.descripcion === seleccionado.descripcion
                );

                if (esFavorito) {
                    favoritos = favoritos.filter(fav =>
                        !(fav.titulo === seleccionado.titulo &&
                          fav.descripcion === seleccionado.descripcion)
                    );
                } else {
                    favoritos.push(seleccionado);
                }

                localStorage.setItem("favoritos", JSON.stringify(favoritos));

                actualizarVista();
            });
        });
    }

    function activarEliminar(lista) {
        let botones = document.querySelectorAll(".btn-delete");

        botones.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                let index = e.target.getAttribute("data-index");
                let comunicadoAEliminar = lista[index];

                let confirmar = confirm(`¿Eliminar "${comunicadoAEliminar.titulo}"?`);
                if (!confirmar) return;

                // eliminar del array principal
                comunicados = comunicados.filter(c =>
                    !(c.titulo === comunicadoAEliminar.titulo &&
                      c.descripcion === comunicadoAEliminar.descripcion)
                );

                // eliminar de favoritos
                favoritos = favoritos.filter(fav =>
                    !(fav.titulo === comunicadoAEliminar.titulo &&
                      fav.descripcion === comunicadoAEliminar.descripcion)
                );

                localStorage.setItem("comunicados", JSON.stringify(comunicados));
                localStorage.setItem("favoritos", JSON.stringify(favoritos));

                actualizarVista();
            });
        });
    }

    function activarEditar(lista) {
        let botones = document.querySelectorAll(".btn-edit");

        botones.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                let index = e.target.getAttribute("data-index");
                let seleccionado = lista[index];

                let nuevoTitulo = prompt("Editar título:", seleccionado.titulo);
                if (nuevoTitulo === null) return;

                let nuevaDescripcion = prompt("Editar descripción:", seleccionado.descripcion);
                if (nuevaDescripcion === null) return;

                let nuevaCategoria = prompt("Editar categoría:", seleccionado.categoria);
                if (nuevaCategoria === null) return;

                // actualizar en comunicados reales
                comunicados = comunicados.map(c => {
                    if (c.titulo === seleccionado.titulo &&
                        c.descripcion === seleccionado.descripcion) {
                        return {
                            titulo: nuevoTitulo,
                            descripcion: nuevaDescripcion,
                            categoria: nuevaCategoria
                        };
                    }
                    return c;
                });

                localStorage.setItem("comunicados", JSON.stringify(comunicados));

                actualizarVista();
            });
        });
    }

    function actualizarVista() {
        let listaActual = mostrando === "favoritos" ? favoritos : comunicados;

        mostrarComunicados(listaActual);
        activarBotones(listaActual);
        activarEliminar(listaActual);
        activarEditar(listaActual);
    }

    window.filtrar = (tipo) => {
        let btnFav = document.getElementById("favoritos");

        if (tipo === "favoritos") {
            if (mostrando === "favoritos") {
                mostrando = "todos";
                contenedor.dataset.vista = "todos";
                if (btnFav) btnFav.classList.remove("activo");
            } else {
                mostrando = "favoritos";
                contenedor.dataset.vista = "favoritos";
                if (btnFav) btnFav.classList.add("activo");
            }

            actualizarVista();
        }
    };

    actualizarVista();

    // 🔎 BUSCADOR
    let buscador = document.getElementById("buscador");
    if (buscador) {
        buscador.addEventListener("input", () => {
            let texto = buscador.value.toLowerCase();

            let listaActual =
                contenedor.dataset.vista === "favoritos"
                    ? favoritos
                    : comunicados;

            let filtrados = listaActual.filter(c =>
                c.titulo.toLowerCase().includes(texto)
            );

            mostrarComunicados(filtrados);
            activarBotones(filtrados);
            activarEliminar(filtrados);
            activarEditar(filtrados);
        });
    }

    // ⭐ FAVORITOS
    let btnFavoritos = document.getElementById("favoritos");
    if (btnFavoritos) {
        btnFavoritos.addEventListener("click", () => {
            filtrar("favoritos");
        });
    }

    // 📱 MENÚ
    let btnMenu = document.getElementById("btn-menu");
    let menu = document.getElementById("menu-links");

    if (btnMenu && menu) {
        menu.setAttribute("aria-hidden", "true");
        btnMenu.setAttribute("aria-controls", "menu-links");
        btnMenu.setAttribute("aria-expanded", "false");

        btnMenu.addEventListener("click", () => {
            const activo = menu.classList.toggle("activo");
            btnMenu.setAttribute("aria-expanded", activo);
            menu.setAttribute("aria-hidden", !activo);
        });

        document.addEventListener("click", (e) => {
            const clickEnLink = e.target.closest("#menu-links a");

            if (clickEnLink) {
                menu.classList.remove("activo");
                menu.setAttribute("aria-hidden", "true");
                btnMenu.setAttribute("aria-expanded", "false");
            }
        });
    }

    // 📩 FORMULARIO
    let form = document.getElementById("form-contacto");

    if (form) {
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
    }

    // 🌙 DARK MODE
    let btnDark = document.getElementById("btn-dark");

    if (btnDark) {
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
};