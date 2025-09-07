// single-script.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Lógica de la Galería de Imágenes
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail-image');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Cambiar la imagen principal
            const largeSrc = this.dataset.largeSrc;
            mainImage.style.opacity = '0'; // Inicia la transición

            setTimeout(() => {
                mainImage.src = largeSrc;
                mainImage.style.opacity = '1'; // Finaliza la transición
            }, 300); // Coincide con la duración de la transición en CSS

            // Actualizar la clase 'active' en las miniaturas
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 2. Lógica del Selector de Tallas
    const sizeButtons = document.querySelectorAll('.size-btn');
    let selectedSize = null;

    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            selectedSize = this.dataset.size;
        });
    });

    // 3. Lógica del Selector de Cantidad
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const quantityInput = document.getElementById('quantity-input');

    btnMinus.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    btnPlus.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    // 4. Lógica del Botón "Añadir al carrito"
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    addToCartBtn.addEventListener('click', () => {
        const quantity = quantityInput.value;
        
        // Verificación: ¿El usuario seleccionó una talla?
        if (!selectedSize) {
            alert('Por favor, selecciona una talla antes de añadir al carrito.');
            return; // Detiene la ejecución si no hay talla
        }
        
        // Simulación: Mostrar los datos que se enviarían
        const productInfo = {
            name: document.querySelector('.product-title').textContent,
            size: selectedSize,
            quantity: quantity,
            price: document.querySelector('.new-price').textContent
        };

        alert(`Producto añadido al carrito (simulación):\n\n- Producto: ${productInfo.name}\n- Talla: ${productInfo.size}\n- Cantidad: ${productInfo.quantity}\n- Precio: ${productInfo.price}`);
        
        console.log('Datos del producto a añadir:', productInfo);
    });
});