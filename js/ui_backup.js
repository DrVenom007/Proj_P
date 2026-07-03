function renderPage(page) {

    const title = document.getElementById("title");
    const subtitle = document.getElementById("subtitle");
    const content = document.getElementById("content");
    const button = document.getElementById("continueBtn");

    title.textContent = page.title;
    subtitle.textContent = page.subtitle;

    content.innerHTML = `
        <div class="loading-text">
            ${page.content}
        </div>
    `;

    button.textContent = page.button;

}