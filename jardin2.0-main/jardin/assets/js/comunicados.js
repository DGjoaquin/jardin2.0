window.onload = () => {

    // Mensaje de confirmación de carga del JS
    console.log("JS funcionando");

    // Obtiene los comunicados guardados en localStorage o inicializa array vacío
    let comunicados = JSON.parse(localStorage.getItem("comunicados")) || [];

    // Obtiene la lista de favoritos desde localStorage o inicializa array vacío
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    // Referencia al contenedor donde se renderizan los comunicados en el DOM
    let contenedor = document.getElementById("contenedor-comunicados");

    // Si no existe el contenedor en la página, detiene la ejecución del script
    if (!contenedor) return;

    // Estado de vista actual (todos o favoritos)
    let mostrando = "todos";

    // Guarda el estado de vista en dataset del contenedor
    contenedor.dataset.vista = "todos";

    // Función que renderiza los comunicados en pantalla
    function mostrarComunicados(lista) {

        // Limpia el contenedor antes de renderizar
        contenedor.innerHTML = "";

        // Recorre cada comunicado para crear su tarjeta
        lista.forEach((c, index) => {

            // Crea tarjeta contenedora del comunicado
            let tarjeta = document.createElement("div");
            tarjeta.className = "card-panel";

            // Título del comunicado
            let titulo = document.createElement("h5");
            titulo.textContent = c.titulo;

            // Descripción del comunicado
            let descripcion = document.createElement("p");
            descripcion.textContent = c.descripcion;

            // Categoría del comunicado
            let categoria = document.createElement("small");
            categoria.textContent = c.categoria;

            // Botón de favoritos
            let btnFav = document.createElement("button");
            btnFav.className = "btn-fav";
            btnFav.dataset.index = index;

            // Verifica si el comunicado ya está en favoritos
            let esFavorito = favoritos.some(fav =>
                fav.titulo === c.titulo && fav.descripcion === c.descripcion
            );

            // Texto dinámico del botón favorito
            btnFav.textContent = esFavorito
                ? "⭐ Favorito"
                : "☆ Agregar a favoritos";

            // Botón editar comunicado
            let btnEdit = document.createElement("button");
            btnEdit.className = "btn-edit";
            btnEdit.dataset.index = index;
            btnEdit.textContent = "✏️ Editar";

            // Botón eliminar comunicado
            let btnDelete = document.createElement("button");
            btnDelete.className = "btn-delete";
            btnDelete.dataset.index = index;
            btnDelete.textContent = "Eliminar";

            // Se agregan elementos a la tarjeta
            tarjeta.appendChild(titulo);
            tarjeta.appendChild(descripcion);
            tarjeta.appendChild(categoria);
            tarjeta.appendChild(document.createElement("br"));
            tarjeta.appendChild(btnFav);
            tarjeta.appendChild(btnEdit);
            tarjeta.appendChild(btnDelete);

            // Se agrega la tarjeta al DOM
            contenedor.appendChild(tarjeta);
        });
    }

    // Activa funcionalidad del botón favoritos
    function activarBotones(lista) {

        let botones = document.querySelectorAll(".btn-fav");

        botones.forEach((btn) => {

            btn.addEventListener("click", () => {

                // Obtiene el comunicado seleccionado
                let seleccionado = lista[btn.dataset.index];

                // Verifica si ya está en favoritos
                let esFavorito = favoritos.some(fav =>
                    fav.titulo === seleccionado.titulo &&
                    fav.descripcion === seleccionado.descripcion
                );

                // Alterna entre agregar o quitar de favoritos
                if (esFavorito) {
                    favoritos = favoritos.filter(fav =>
                        !(fav.titulo === seleccionado.titulo &&
                          fav.descripcion === seleccionado.descripcion)
                    );
                } else {
                    favoritos.push(seleccionado);
                }

                // Guarda cambios en localStorage
                localStorage.setItem("favoritos", JSON.stringify(favoritos));

                // Actualiza vista
                actualizarVista();
            });
        });
    }

    // Activa eliminación de comunicados
    function activarEliminar(lista) {

        let botones = document.querySelectorAll(".btn-delete");

        botones.forEach((btn) => {

            btn.addEventListener("click", (e) => {

                let index = e.target.dataset.index;

                // Comunicado a eliminar
                let comunicadoAEliminar = lista[index];

                // Confirmación de eliminación
                let confirmar = confirm(`¿Eliminar "${comunicadoAEliminar.titulo}"?`);
                if (!confirmar) return;

                // Elimina del array principal
                comunicados = comunicados.filter(c =>
                    !(c.titulo === comunicadoAEliminar.titulo &&
                      c.descripcion === comunicadoAEliminar.descripcion)
                );

                // Elimina también de favoritos
                favoritos = favoritos.filter(fav =>
                    !(fav.titulo === comunicadoAEliminar.titulo &&
                      fav.descripcion === comunicadoAEliminar.descripcion)
                );

                // Guarda cambios
                localStorage.setItem("comunicados", JSON.stringify(comunicados));
                localStorage.setItem("favoritos", JSON.stringify(favoritos));

                // Refresca vista
                actualizarVista();
            });
        });
    }

    // Activa edición de comunicados
    function activarEditar(lista) {

        let botones = document.querySelectorAll(".btn-edit");

        botones.forEach((btn) => {

            btn.addEventListener("click", (e) => {

                let index = e.target.dataset.index;

                let seleccionado = lista[index];

                // Guarda comunicado a editar en localStorage
                localStorage.setItem("editarComunicado", JSON.stringify({
                    ...seleccionado,
                    index: comunicados.findIndex(c =>
                        c.titulo === seleccionado.titulo &&
                        c.descripcion === seleccionado.descripcion
                    )
                }));

                // Redirige a página de edición
                window.location.href = "comunicados.html";
            });
        });
    }

    // Refresca la vista según estado actual
    function actualizarVista() {

        let listaActual = mostrando === "favoritos" ? favoritos : comunicados;

        mostrarComunicados(listaActual);
        activarBotones(listaActual);
        activarEliminar(listaActual);
        activarEditar(listaActual);
    }

    // Filtro entre todos y favoritos
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

    // Render inicial
    actualizarVista();

    // Filtro de búsqueda en tiempo real
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

    // Botón favoritos
    let btnFavoritos = document.getElementById("favoritos");

    if (btnFavoritos) {
        btnFavoritos.addEventListener("click", () => {
            filtrar("favoritos");
        });
    }

    // Menú hamburguesa accesible con ARIA
    let btnMenu = document.getElementById("btn-menu");
    let menu = document.getElementById("menu-links");

    if (btnMenu && menu) {

        menu.setAttribute("aria-hidden", "true");
        btnMenu.setAttribute("aria-controls", "menu-links");
        btnMenu.setAttribute("aria-expanded", "false");

        btnMenu.addEventListener("click", () => {

            // Alterna visibilidad del menú
            const isOpen = menu.classList.toggle("activo");

            // Accesibilidad dinámica
            btnMenu.setAttribute("aria-expanded", isOpen);
            menu.setAttribute("aria-hidden", !isOpen);

            // Mejora UX: foco al primer enlace
            if (isOpen) {
                menu.querySelector("a")?.focus();
            }
        });

        // Cierra menú al hacer click en un link
        document.addEventListener("click", (e) => {

            const clickEnLink = e.target.closest("#menu-links a");

            if (clickEnLink) {
                menu.classList.remove("activo");
                menu.setAttribute("aria-hidden", "true");
                btnMenu.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Validación de formulario de contacto
    let form = document.getElementById("form-contacto");

    if (form) {

        form.addEventListener("submit", (e) => {

            e.preventDefault();

            // Obtiene valores del formulario
            let nombre = document.getElementById("nombre").value.trim();
            let email = document.getElementById("email").value.trim();
            let mensaje = document.getElementById("mensaje").value.trim();

            // Errores
            let errorNombre = document.getElementById("error-nombre");
            let errorEmail = document.getElementById("error-email");
            let errorMensaje = document.getElementById("error-mensaje");

            let valido = true;

            // Limpia errores previos
            errorNombre.textContent = "";
            errorEmail.textContent = "";
            errorMensaje.textContent = "";

            // Validación nombre
            if (nombre.length < 3) {
                errorNombre.textContent = "Nombre mínimo 3 caracteres";
                valido = false;
            }

            // Validación email
            let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!regexEmail.test(email)) {
                errorEmail.textContent = "Email inválido";
                valido = false;
            }

            // Validación mensaje
            if (mensaje.length < 10) {
                errorMensaje.textContent = "Mensaje mínimo 10 caracteres";
                valido = false;
            }

            // Si todo es válido
            if (valido) {

                alert("Formulario enviado correctamente");

                form.reset();

                // UX: devuelve foco al primer campo
                document.getElementById("nombre").focus();
            }
        });
    }

    // Botón modo oscuro
    let btnDark = document.getElementById("btn-dark");

    if (btnDark) {

        // Mantiene estado guardado
        if (localStorage.getItem("modo") === "dark") {
            document.body.classList.add("dark");
        }

        // Alterna modo oscuro
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