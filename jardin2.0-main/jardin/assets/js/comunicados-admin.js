document.addEventListener("DOMContentLoaded", () => {

    let form = document.getElementById("form-comunicado");

    let inputTitulo = document.getElementById("titulo");
    let inputDescripcion = document.getElementById("descripcion");
    let inputCategoria = document.getElementById("categoria");

    let errorTitulo = document.getElementById("error-titulo");
    let errorDescripcion = document.getElementById("error-descripcion");
    let errorCategoria = document.getElementById("error-categoria");

    // ♿ accesibilidad: live region
    [errorTitulo, errorDescripcion, errorCategoria].forEach(el => {
        if (el) el.setAttribute("aria-live", "polite");
    });

    // 🔒 sanitización básica (evita scripts simples)
    function limpiar(input) {
        return input
            .replace(/</g, "")
            .replace(/>/g, "")
            .replace(/script/gi, "")
            .trim();
    }

    let editando = JSON.parse(localStorage.getItem("editarComunicado"));

    if (editando) {
        inputTitulo.value = editando.titulo;
        inputDescripcion.value = editando.descripcion;
        inputCategoria.value = editando.categoria;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let titulo = limpiar(inputTitulo.value);
        let descripcion = limpiar(inputDescripcion.value);
        let categoria = limpiar(inputCategoria.value);

        let valido = true;

        errorTitulo.textContent = "";
        errorDescripcion.textContent = "";
        errorCategoria.textContent = "";

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

        if (editando) {
            lista[editando.index] = { titulo, descripcion, categoria };

            localStorage.removeItem("editarComunicado");
            alert("✏️ Comunicado actualizado");
        } else {
            lista.push({ titulo, descripcion, categoria });
            alert("✅ Comunicado guardado");
        }

        localStorage.setItem("comunicados", JSON.stringify(lista));

        form.reset();

        window.location.href = "jardin.html";
    });

    window.addEventListener("beforeunload", () => {
        localStorage.removeItem("editarComunicado");
    });
});