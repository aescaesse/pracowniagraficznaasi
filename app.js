document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("product-grid");
    const filterButtons = document.querySelectorAll(".filter-btn");

    // Funkcja renderująca produkty
    function renderProducts(filter = "all") {
        grid.innerHTML = "";
        
        const filtered = filter === "all" 
            ? productsData 
            : productsData.filter(p => p.category === filter);

        if (filtered.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #777;">Brak produktów w tej kategorii.</p>`;
            return;
        }

        filtered.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">${product.price}</div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Inicjalizacja widoku
    renderProducts();

    // Obsługa kliknięć filtrów
    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            
            const filterValue = e.target.getAttribute("data-filter");
            renderProducts(filterValue);
        });
    });
});