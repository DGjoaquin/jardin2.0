window.onload = () => {
    console.log("JS funcionando");

    let comunicados = JSON.parse(localStorage.getItem("comunicados")) || [];
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    let contenedor = document.getElementById("contenedor-comunicados");

    if (!contenedor) return;

    let mostrando = "todos";
    contenedor.dataset.vista = "todos";

    // ✅ SEGURIDAD: usando createElement (no innerHTML)
    function mostrarComunicados(lista) {
        contenedor.innerHTML = "";

        lista.forEach((c, index) => {

            let tarjeta = document.createElement("div");
            tarjeta.className = "card-panel";

            let titulo = document.createElement("h5");
            titulo.textContent = c.titulo;

            let descripcion = document.createElement("p");
            descripcion.textContent = c.descripcion;

            let categoria = document.createElement("small");
            categoria.textContent = c.categoria;

            let btnFav = document.createElement("button");
            btnFav.className = "btn-fav";
            btnFav.dataset.index = index;

            let esFavorito = favoritos.some(fav =>
                fav.titulo === c.titulo && fav.descripcion === c.descripcion
            );

            btnFav.textContent = esFavorito
                ? "⭐ Favorito"
                : "☆ Agregar a favoritos";

            let btnEdit = document.createElement("button");
            btnEdit.className = "btn-edit";
            btnEdit.dataset.index = index;
            btnEdit.textContent = "✏️ Editar";

            let btnDelete = document.createElement("button");
            btnDelete.className = "btn-delete";
            btnDelete.dataset.index = index;
            btnDelete.textContent = "Eliminar";

            tarjeta.appendChild(titulo);
            tarjeta.appendChild(descripcion);
            tarjeta.appendChild(categoria);
            tarjeta.appendChild(document.createElement("br"));
            tarjeta.appendChild(btnFav);
            tarjeta.appendChild(btnEdit);
            tarjeta.appendChild(btnDelete);

            contenedor.appendChild(tarjeta);
        });
    }

    function activarBotones(lista) {
        let botones = document.querySelectorAll(".btn-fav");

        botones.forEach((btn) => {
            btn.addEventListener("click", () => {
                let seleccionado = lista[btn.dataset.index];

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
                let index = e.target.dataset.index;
                let comunicadoAEliminar = lista[index];

                let confirmar = confirm(`¿Eliminar "${comunicadoAEliminar.titulo}"?`);
                if (!confirmar) return;

                comunicados = comunicados.filter(c =>
                    !(c.titulo === comunicadoAEliminar.titulo &&
                      c.descripcion === comunicadoAEliminar.descripcion)
                );

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
                let index = e.target.dataset.index;
                let seleccionado = lista[index];

                localStorage.setItem("editarComunicado", JSON.stringify({
                    ...seleccionado,
                    index: comunicados.findIndex(c =>
                        c.titulo === seleccionado.titulo &&
                        c.descripcion === seleccionado.descripcion
                    )
                }));

                window.location.href = "comunicados.html";
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

    let btnFavoritos = document.getElementById("favoritos");
    if (btnFavoritos) {
        btnFavoritos.addEventListener("click", () => {
            filtrar("favoritos");
        });
    }

    let btnMenu = document.getElementById("btn-menu");
    let menu = document.getElementById("menu-links");

    if (btnMenu && menu) {
        menu.setAttribute("aria-hidden", "true");
        btnMenu.setAttribute("aria-controls", "menu-links");
        btnMenu.setAttribute("aria-expanded", "false");

        btnMenu.addEventListener("click", () => {
            const visible = menu.style.display === "flex";
            menu.style.display = visible ? "none" : "flex";
            btnMenu.setAttribute("aria-expanded", !visible);
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