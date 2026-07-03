let currentPage = 0;

const card = document.getElementById("card");
const button = document.getElementById("continueBtn");

renderPage(pages[currentPage]);

button.addEventListener("click", () => {

    card.classList.add("fade-out");

    setTimeout(() => {

        currentPage++;

        if (currentPage >= pages.length) {

            currentPage = 0;

        }

        renderPage(pages[currentPage]);

        card.classList.remove("fade-out");

    }, 300);

});