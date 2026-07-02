let currentPage = 0;

const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const content = document.getElementById("content");
const button = document.getElementById("continueBtn");
const card = document.getElementById("card");

function renderPage(){

    const page = pages[currentPage];

    title.textContent = page.title;

    subtitle.textContent = page.subtitle;

    content.innerHTML = `<div class="loading-text">${page.content}</div>`;

    button.textContent = page.button;

}

button.addEventListener("click",()=>{

    card.classList.add("fade-out");

    setTimeout(()=>{

        currentPage++;

        if(currentPage>=pages.length){

            currentPage=0;

        }

        renderPage();

        card.classList.remove("fade-out");

    },300);

});

renderPage();