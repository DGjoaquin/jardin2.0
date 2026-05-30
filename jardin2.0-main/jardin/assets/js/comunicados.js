window.onload = () => {

    console.log("JS funcionando");

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

    let tarjetas = comunicados.map((c) => {
        return `
            <div class="card-panel">
                <h5>${c.titulo}</h5>
                <p>${c.descripcion}</p>
                <small>${c.categoria}</small>
            </div>
        `;
    });

    contenedor.innerHTML = tarjetas.join("");

}