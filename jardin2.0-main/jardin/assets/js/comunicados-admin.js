let form = document.getElementById("form-comunicado");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let nuevo = {
        titulo: document.getElementById("titulo").value,
        descripcion: document.getElementById("descripcion").value,
        categoria: document.getElementById("categoria").value
    };

    let lista = JSON.parse(localStorage.getItem("comunicados")) || [];
    lista.push(nuevo);
    localStorage.setItem("comunicados", JSON.stringify(lista));
    alert("Comunicado guardado");
    form.reset();
});