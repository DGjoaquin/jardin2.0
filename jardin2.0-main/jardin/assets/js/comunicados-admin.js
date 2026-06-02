document.addEventListener("DOMContentLoaded", () => {

    let form = document.getElementById("form-comunicado");

    let inputTitulo = document.getElementById("titulo");
    let inputDescripcion = document.getElementById("descripcion");
    let inputCategoria = document.getElementById("categoria");

    let errorTitulo = document.getElementById("error-titulo");
    let errorDescripcion = document.getElementById("error-descripcion");
    let errorCategoria = document.getElementById("error-categoria");

    // 🔥 detectar edición (SIN referrer raro)
    let editando = JSON.parse(localStorage.getItem("editarComunicado"));

    // ✏️ cargar datos si está editando
    if (editando) {
        inputTitulo.value = editando.titulo;
        inputDescripcion.value = editando.descripcion;
        inputCategoria.value = editando.categoria;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let titulo = inputTitulo.value.trim();
        let descripcion = inputDescripcion.value.trim();
        let categoria = inputCategoria.value.trim();

        let valido = true;

        // limpiar errores
        errorTitulo.textContent = "";
        errorDescripcion.textContent = "";
        errorCategoria.textContent = "";

        // ✅ VALIDACIONES
        if (titulo.length < 3) {
            errorTitulo.textContent = "Mínimo 3 caracteres";
            valido = false;
        }

        if (descripcion.length < 5) {
            errorDescripcion.textContent = "Mínimo 5 caracteres";
            valido = false;
        }

        if (categoria.length < 3) {
            errorCategoria.textContent = "Mínimo 3 caracteres";
            valido = false;
        }

        if (!valido) return;

        let lista = JSON.parse(localStorage.getItem("comunicados")) || [];

        // 🔥 EDITAR
        if (editando) {
            lista[editando.index] = {
                titulo,
                descripcion,
                categoria
            };

            localStorage.removeItem("editarComunicado");
            alert("✏️ Comunicado actualizado");
        } 
        // 🆕 CREAR
        else {
            lista.push({
                titulo,
                descripcion,
                categoria
            });

            alert("✅ Comunicado guardado");
        }

        localStorage.setItem("comunicados", JSON.stringify(lista));

        form.reset();

        // 🔙 volver
        window.location.href = "jardin.html";
    });

    // 🧹 LIMPIAR edición si sales sin guardar
    window.addEventListener("beforeunload", () => {
        localStorage.removeItem("editarComunicado");
    });
});