const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;

    const body = {
        name: form.elements.name.value,
        email: form.elements.email.value,
        user: form.elements.user.value,
        password: form.elements.password.value
    };

    const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) return mensajeError.classList.toggle("escondido", false);

    const resJson = await res.json();
    if (resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});
