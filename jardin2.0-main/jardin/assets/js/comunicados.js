window.onload = () => {

    // Verifica que el archivo JS se cargó correctamente en el navegador
    console.log("JS funcionando");

    // Arreglo principal de comunicados almacenado en localStorage (persistencia)
    let comunicados = JSON.parse(localStorage.getItem("comunicados")) || [];

    // Arreglo que almacena los comunicados marcados como favoritos
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    // Contenedor del DOM donde se renderizan dinámicamente los comunicados
    let contenedor = document.getElementById("contenedor-comunicados");

    // Evita ejecutar el script si el contenedor no existe en la página actual
    if (!contenedor) return;

    // Variable de estado que controla qué vista se muestra (todos o favoritos)
    let mostrando = "todos";

    // Guarda el estado actual en un atributo data-* del DOM para reutilizarlo
    contenedor.dataset.vista = "todos";

    // Función que renderiza una lista de comunicados en el DOM de forma segura
    function mostrarComunicados(lista) {

        // Limpia el contenido previo antes de volver a renderizar
        contenedor.innerHTML = "";

        lista.forEach((c, index) => {

            // Crea contenedor de tarjeta para cada comunicado
            let tarjeta = document.createElement("div");
            tarjeta.className = "card-panel";

            // Crea elementos del comunicado usando textContent (previene XSS)
            let titulo = document.createElement("h5");
            titulo.textContent = c.titulo;

            let descripcion = document.createElement("p");
            descripcion.textContent = c.descripcion;

            let categoria = document.createElement("small");
            categoria.textContent = c.categoria;

            // Botón para agregar o quitar de favoritos
            let btnFav = document.createElement("button");
            btnFav.className = "btn-fav";
            btnFav.dataset.index = index;

            // Verifica si el comunicado ya existe en el arreglo de favoritos
            let esFavorito = favoritos.some(fav =>
                fav.titulo === c.titulo && fav.descripcion === c.descripcion
            );

            // Cambia el texto del botón según estado
            btnFav.textContent = esFavorito
                ? "⭐ Favorito"
                : "☆ Agregar a favoritos";

            // Botón para editar comunicado
            let btnEdit = document.createElement("button");
            btnEdit.className = "btn-edit";
            btnEdit.dataset.index = index;
            btnEdit.textContent = "✏️ Editar";

            // Botón para eliminar comunicado
            let btnDelete = document.createElement("button");
            btnDelete.className = "btn-delete";
            btnDelete.dataset.index = index;
            btnDelete.textContent = "Eliminar";

            // Inserta todos los elementos dentro de la tarjeta
            tarjeta.appendChild(titulo);
            tarjeta.appendChild(descripcion);
            tarjeta.appendChild(categoria);
            tarjeta.appendChild(document.createElement("br"));
            tarjeta.appendChild(btnFav);
            tarjeta.appendChild(btnEdit);
            tarjeta.appendChild(btnDelete);

            // Inserta la tarjeta en el contenedor principal del DOM
            contenedor.appendChild(tarjeta);
        });
    }

    // Función que gestiona la lógica de agregar o quitar favoritos y su persistencia
    function activarBotones(lista) {

        let botones = document.querySelectorAll(".btn-fav");

        botones.forEach((btn) => {

            btn.addEventListener("click", () => {

                // Obtiene el comunicado seleccionado según índice
                let seleccionado = lista[btn.dataset.index];

                // Verifica si ya está en favoritos
                let esFavorito = favoritos.some(fav =>
                    fav.titulo === seleccionado.titulo &&
                    fav.descripcion === seleccionado.descripcion
                );

                // Alterna entre agregar o eliminar del arreglo
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

                // Actualiza la vista para reflejar cambios
                actualizarVista();
            });
        });
    }

    // Función que permite eliminar comunicados y sincronizar con favoritos
    function activarEliminar(lista) {

        let botones = document.querySelectorAll(".btn-delete");

        botones.forEach((btn) => {

            btn.addEventListener("click", (e) => {

                let index = e.target.dataset.index;
                let comunicadoAEliminar = lista[index];

                // Muestra confirmación antes de eliminar
                let confirmar = confirm(`¿Eliminar "${comunicadoAEliminar.titulo}"?`);
                if (!confirmar) return;

                // Elimina el comunicado del arreglo principal
                comunicados = comunicados.filter(c =>
                    !(c.titulo === comunicadoAEliminar.titulo &&
                      c.descripcion === comunicadoAEliminar.descripcion)
                );

                // Elimina también del arreglo de favoritos
                favoritos = favoritos.filter(fav =>
                    !(fav.titulo === comunicadoAEliminar.titulo &&
                      fav.descripcion === comunicadoAEliminar.descripcion)
                );

                // Guarda cambios en localStorage
                localStorage.setItem("comunicados", JSON.stringify(comunicados));
                localStorage.setItem("favoritos", JSON.stringify(favoritos));

                actualizarVista();
            });
        });
    }

    // Función que prepara un comunicado para edición usando localStorage
    function activarEditar(lista) {

        let botones = document.querySelectorAll(".btn-edit");

        botones.forEach((btn) => {

            btn.addEventListener("click", (e) => {

                let index = e.target.dataset.index;
                let seleccionado = lista[index];

                // Guarda el comunicado seleccionado junto a su índice real
                localStorage.setItem("editarComunicado", JSON.stringify({
                    ...seleccionado,
                    index: comunicados.findIndex(c =>
                        c.titulo === seleccionado.titulo &&
                        c.descripcion === seleccionado.descripcion
                    )
                }));

                // Redirige a la página de edición
                window.location.href = "comunicados.html";
            });
        });
    }

    // Función que controla qué datos se muestran y vuelve a renderizar el DOM
    function actualizarVista() {

        let listaActual = mostrando === "favoritos" ? favoritos : comunicados;

        mostrarComunicados(listaActual);
        activarBotones(listaActual);
        activarEliminar(listaActual);
        activarEditar(listaActual);
    }

    // Función global que alterna entre vista de todos y favoritos
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

    // Renderiza los datos al cargar la página
    actualizarVista();

    // Filtro de búsqueda en tiempo real por título
    let buscador = document.getElementById("buscador");

    if (buscador) {

        buscador.addEventListener("input", () => {

            let texto = buscador.value.toLowerCase();

            let listaActual =
                contenedor.dataset.vista === "favoritos"
                    ? favoritos
                    : comunicados;

            // Filtra comunicados según coincidencia en el título
            let filtrados = listaActual.filter(c =>
                c.titulo.toLowerCase().includes(texto)
            );

            // Renderiza resultados filtrados
            mostrarComunicados(filtrados);
            activarBotones(filtrados);
            activarEliminar(filtrados);
            activarEditar(filtrados);
        });
    }

    // Evento que activa el filtro de favoritos desde el botón
    let btnFavoritos = document.getElementById("favoritos");

    if (btnFavoritos) {
        btnFavoritos.addEventListener("click", () => {
            filtrar("favoritos");
        });
    }

    // Control del menú hamburguesa con atributos de accesibilidad (ARIA)
    let btnMenu = document.getElementById("btn-menu");
    let menu = document.getElementById("menu-links");

    if (btnMenu && menu) {

        menu.setAttribute("aria-hidden", "true");
        btnMenu.setAttribute("aria-controls", "menu-links");
        btnMenu.setAttribute("aria-expanded", "false");

        btnMenu.addEventListener("click", () => {

            let isOpen = menu.classList.toggle("activo");

            // Actualiza atributos accesibles según estado
            btnMenu.setAttribute("aria-expanded", isOpen);
            menu.setAttribute("aria-hidden", !isOpen);

            // Mueve el foco al primer enlace al abrir el menú
            if (isOpen) {
                menu.querySelector("a")?.focus();
            }
        });

        // Cierra el menú al hacer clic fuera o en un enlace
        document.addEventListener("click", (e) => {
            const clickEnMenu = e.target.closest("#menu-links");
            const clickEnBoton = e.target.closest("#btn-menu");

            if (e.target.closest("#menu-links a")) {
                menu.classList.remove("activo");
                menu.setAttribute("aria-hidden", "true");
                btnMenu.setAttribute("aria-expanded", "false");
            }
            else if (!clickEnMenu && !clickEnBoton) {
                menu.classList.remove("activo");
                menu.setAttribute("aria-hidden", "true");
                btnMenu.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Validación del formulario de contacto en el cliente
    let form = document.getElementById("form-contacto");

    if (form) {

        form.addEventListener("submit", (e) => {

            e.preventDefault();

            // Obtiene valores ingresados por el usuario
            let nombre = document.getElementById("nombre").value.trim();
            let email = document.getElementById("email").value.trim();
            let mensaje = document.getElementById("mensaje").value.trim();

            let errorNombre = document.getElementById("error-nombre");
            let errorEmail = document.getElementById("error-email");
            let errorMensaje = document.getElementById("error-mensaje");

            let valido = true;

            // Limpia mensajes de error previos
            errorNombre.textContent = "";
            errorEmail.textContent = "";
            errorMensaje.textContent = "";

            // Validación de longitud mínima
            if (nombre.length < 3) {
                errorNombre.textContent = "Nombre mínimo 3 caracteres";
                valido = false;
            }

            // Validación de formato de email mediante expresión regular
            let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!regexEmail.test(email)) {
                errorEmail.textContent = "Email inválido";
                valido = false;
            }

            if (mensaje.length < 10) {
                errorMensaje.textContent = "Mensaje mínimo 10 caracteres";
                valido = false;
            }

            // Si todo es válido, procesa el envío
            if (valido) {

                alert("Formulario enviado correctamente");
                form.reset();

                // Mejora de accesibilidad: devuelve el foco al primer campo
                document.getElementById("nombre").focus();
            }
        });
    }

    // Control del modo oscuro con persistencia en localStorage
    let btnDark = document.getElementById("btn-dark");

    if (btnDark) {

        // Aplica el modo guardado previamente
        if (localStorage.getItem("modo") === "dark") {
            document.body.classList.add("dark");
        }

        btnDark.addEventListener("click", () => {

            document.body.classList.toggle("dark");

            // Guarda preferencia del usuario
            if (document.body.classList.contains("dark")) {
                localStorage.setItem("modo", "dark");
            } else {
                localStorage.setItem("modo", "light");
            }
        });
    }
};