let filters = document.querySelectorAll(".filter");

for (let filter of filters) {
    filter.addEventListener("click", () => {
        window.location.href = `/listings/category/${filter.innerText}`;
    })
}
