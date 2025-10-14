const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;

    const body = {
        name: form.target.children.name.value,
        email: form.target.childrenemail.value,
        user: form.target.children.user.value,
        password: form.target.children.password.value
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
})