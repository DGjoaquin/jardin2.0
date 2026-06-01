let form = document.getElementById("form-comunicado");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let titulo = document.getElementById("titulo").value.trim();
    let descripcion = document.getElementById("descripcion").value.trim();
    let categoria = document.getElementById("categoria").value.trim();

    // VALIDACIÓN
    if (titulo.length < 3) {
        alert("El título debe tener al menos 3 caracteres");
        return;
    }

    if (descripcion.length < 5) {
        alert("La descripción debe tener al menos 5 caracteres");
        return;
    }

    if (categoria.length < 3) {
        alert("La categoría debe tener al menos 3 caracteres");
        return;
    }

    let nuevo = {
        titulo,
        descripcion,
        categoria
    };

    let lista = JSON.parse(localStorage.getItem("comunicados")) || [];

    lista.push(nuevo);

    localStorage.setItem("comunicados", JSON.stringify(lista));

    alert("✅ Comunicado guardado correctamente");

    form.reset();
});