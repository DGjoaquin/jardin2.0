// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {

    // Referencia al formulario de creación/edición de comunicados
    let form = document.getElementById("form-comunicado");

    // Botón de envío (se usa para evitar envíos múltiples)
    let btnEnviar = document.getElementById("btn-enviar");

    // Inputs del formulario
    let inputTitulo = document.getElementById("titulo");
    let inputDescripcion = document.getElementById("descripcion");
    let inputCategoria = document.getElementById("categoria");

    // Elementos donde se mostrarán mensajes de error por campo
    let errorTitulo = document.getElementById("error-titulo");
    let errorDescripcion = document.getElementById("error-descripcion");
    let errorCategoria = document.getElementById("error-categoria");

    // Accesibilidad: permite que lectores de pantalla anuncien cambios dinámicos en los errores
    [errorTitulo, errorDescripcion, errorCategoria].forEach(el => {
        if (el) el.setAttribute("aria-live", "polite");
    });

    // Función de sanitización básica para prevenir inyección de código (XSS simple)
    function limpiar(input) {
        return input
            .replace(/</g, "")        // elimina caracteres peligrosos "<"
            .replace(/>/g, "")        // elimina caracteres peligrosos ">"
            .replace(/script/gi, "")  // elimina intentos de insertar scripts
            .trim();                  // elimina espacios innecesarios al inicio y final
    }

    // Detecta si existe un comunicado en modo edición guardado en localStorage
    let editando = JSON.parse(localStorage.getItem("editarComunicado"));

    // Si existe, precarga los datos en el formulario para editar
    if (editando) {
        inputTitulo.value = editando.titulo;
        inputDescripcion.value = editando.descripcion;
        inputCategoria.value = editando.categoria;
    }

    // Evento que se ejecuta al enviar el formulario
    form.addEventListener("submit", (e) => {

        e.preventDefault(); // evita recarga de la página (manejo JS)

        btnEnviar.disabled = true; // desactiva el botón para evitar envíos duplicados

        // Obtiene y sanitiza los valores ingresados por el usuario
        let titulo = limpiar(inputTitulo.value);
        let descripcion = limpiar(inputDescripcion.value);
        let categoria = limpiar(inputCategoria.value);

        let valido = true; // bandera de validación

        // Limpia mensajes de error anteriores
        errorTitulo.textContent = "";
        errorDescripcion.textContent = "";
        errorCategoria.textContent = "";

        // Validación: longitud mínima del título
        if (titulo.length < 3) {
            errorTitulo.textContent = "Mínimo 3 caracteres";
            valido = false;
        }

        // Validación: longitud mínima de la descripción
        if (descripcion.length < 5) {
            errorDescripcion.textContent = "Mínimo 5 caracteres";
            valido = false;
        }

        // Validación: longitud mínima de la categoría
        if (categoria.length < 3) {
            errorCategoria.textContent = "Mínimo 3 caracteres";
            valido = false;
        }

        // Si hay errores, se cancela el envío y se reactiva el botón
        if (!valido) { 
            btnEnviar.disabled = false; 
            return;
        }

        // Obtiene la lista actual de comunicados desde localStorage
        let lista = JSON.parse(localStorage.getItem("comunicados")) || [];

        // Si está en modo edición, reemplaza el comunicado existente
        if (editando) {
            lista[editando.index] = { titulo, descripcion, categoria };

            // Limpia el estado de edición para evitar conflictos
            localStorage.removeItem("editarComunicado");

            alert("✏️ Comunicado actualizado");
        } 
        // Si no, crea un nuevo comunicado
        else {
            lista.push({ titulo, descripcion, categoria });

            alert("✅ Comunicado guardado");
        }

        // Guarda la lista actualizada en localStorage (persistencia)
        localStorage.setItem("comunicados", JSON.stringify(lista));

        // Limpia el formulario después de guardar
        form.reset();

        // Reactiva el botón antes de redirigir
        btnEnviar.disabled = false;

        // Redirige a la página principal donde se listan los comunicados
        window.location.href = "jardin.html";
    });

    // Limpia el estado de edición si el usuario abandona la página sin guardar
    window.addEventListener("beforeunload", () => {
        localStorage.removeItem("editarComunicado");
    });
});