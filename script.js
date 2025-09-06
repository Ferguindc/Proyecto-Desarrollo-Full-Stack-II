document.addEventListener('DOMContentLoaded', () => {
    const productItems = document.querySelectorAll('.product-item');
    const searchInput = document.getElementById('searchInput');
    const categoryLinks = document.querySelectorAll('.sidebar-filter a');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const sortBy = document.getElementById('sortBy');
    const productGrid = document.getElementById('product-grid');
    const noResults = document.getElementById('no-results');

    let activeCategory = 'todos';

    function filterAndSortProducts() {
        const searchValue = searchInput.value.toLowerCase();
        const maxPrice = parseInt(priceRange.value);
        const sortValue = sortBy.value;

        // 1. Filtrar productos
        let visibleProducts = [];
        productItems.forEach(item => {
            const category = item.dataset.category;
            const name = item.dataset.name.toLowerCase();
            const price = parseInt(item.dataset.price);

            const categoryMatch = activeCategory === 'todos' || category === activeCategory;
            const searchMatch = name.includes(searchValue);
            const priceMatch = price <= maxPrice;

            if (categoryMatch && searchMatch && priceMatch) {
                item.style.display = 'block';
                visibleProducts.push(item);
            } else {
                item.style.display = 'none';
            }
        });
        
        // Mostrar mensaje si no hay resultados
        noResults.style.display = visibleProducts.length === 0 ? 'block' : 'none';

        // 2. Ordenar productos visibles
        if (sortValue === 'price-asc') {
            visibleProducts.sort((a, b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
        } else if (sortValue === 'price-desc') {
            visibleProducts.sort((a, b) => parseInt(b.dataset.price) - parseInt(a.dataset.price));
        }
        
        // 3. Re-insertar los productos ordenados en la grilla
        visibleProducts.forEach(item => productGrid.appendChild(item));
    }

    // Event Listeners
    searchInput.addEventListener('input', filterAndSortProducts);
    sortBy.addEventListener('change', filterAndSortProducts);
    
    priceRange.addEventListener('input', () => {
        priceValue.textContent = `$${parseInt(priceRange.value).toLocaleString()}`;
        filterAndSortProducts();
    });

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            activeCategory = e.target.dataset.category;
            
            categoryLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');

            filterAndSortProducts();
        });
    });

    // Simulación de "Añadir al carrito"
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', (e) => {
            if (e.target.textContent.includes('Añadir al carrito')) {
                e.preventDefault();
                alert('Producto añadido al carrito (simulación)');
            }
        });
    });

    // Activar el filtro "Todos" por defecto y mostrar productos iniciales
    document.querySelector('.sidebar-filter a[data-category="todos"]').classList.add('active');
    filterAndSortProducts();
});