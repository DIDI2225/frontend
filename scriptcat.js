document.addEventListener('DOMContentLoaded', function() {
    // ===== SYSTÈME PANIER =====
    let cart = [];
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.querySelector('#cart-sidebar .cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    // Gestion de l'icône panier
    cartIcon.addEventListener('click', function() {
        cartSidebar.classList.toggle('active');
    });

    document.getElementById('close-cart').addEventListener('click', function() {
        cartSidebar.classList.remove('active');
    });

    // Ajout au panier
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product');
            const productName = product.querySelector('h3').textContent;
            const productPrice = parseInt(this.getAttribute('data-price')) || 0;
            const productImage = product.querySelector('img')?.src || '';

            const existingItem = cart.find(item => item.name === productName);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }

            updateCart();
            cartSidebar.classList.add('active');
            
            // Feedback visuel
            const originalText = this.textContent;
            this.textContent = 'Ajouté !';
            setTimeout(() => {
                this.textContent = originalText;
            }, 1000);
        });
    });

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                ${item.image ? `<img src="${item.image}" width="50">` : ''}
                <span>${item.name}</span>
                <div>
                    <button class="change-quantity" data-index="${index}" data-change="-1">-</button>
                    <span>${item.quantity}</span>
                    <button class="change-quantity" data-index="${index}" data-change="1">+</button>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)} DH</span>
                <button class="remove-item" data-index="${index}">X</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalElement.textContent = total.toFixed(2);
        updateCartIcon();
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
        }

        // Gestion des boutons de quantité
        document.querySelectorAll('.change-quantity').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const change = parseInt(this.getAttribute('data-change'));
                changeQuantity(index, change);
            });
        });

        // Gestion des boutons de suppression
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromCart(index);
            });
        });
    }

    function changeQuantity(index, change) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        updateCart();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart();
    }

    function updateCartIcon() {
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('#cart-icon i').setAttribute('data-count', itemCount);
    }

    // Validation du panier
    document.getElementById('validate-cart').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Votre panier est vide !');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
     alert(`Merci pour votre commande. Le montant total ${total.toFixed(2)} DH !
  passez à le paiement`);
    // Redirection vers une autre page ( paiement.html)
    window.location.href = "paiement.html";
    });

    // ===== SYSTÈME FAVORIS =====
    let favorites = [];
    const favoritesIcon = document.getElementById('favorites-icon');
    const favoritesSidebar = document.getElementById('favorites-sidebar');
    const favoritesItemsContainer = document.querySelector('#favorites-sidebar .cart-items');

    // Gestion des coeurs favoris
    document.querySelectorAll('.favori').forEach(heart => {
        heart.addEventListener('click', function(e) {
            e.stopPropagation();
            const product = this.closest('.product');
            const productName = product.querySelector('h3').textContent;
            const productImage = product.querySelector('img')?.src || '';
            
            toggleFavorite(productName, productImage, this);
        });
    });

    function toggleFavorite(name, image, heartElement) {
        const index = favorites.findIndex(item => item.name === name);
        
        if (index >= 0) {
            favorites.splice(index, 1);
            heartElement.classList.remove('active');
        } else {
            favorites.push({ 
                name: name, 
                image: image 
            });
            heartElement.classList.add('active');
        }
        
        updateFavoritesDisplay();
    }

    function updateFavoritesDisplay() {
        favoritesItemsContainer.innerHTML = '';
        
        favorites.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'favorite-item';
            itemElement.innerHTML = `
                ${item.image ? `<img src="${item.image}" width="50">` : ''}
                <span>${item.name}</span>
                <button class="remove-favorite" data-index="${index}">X</button>
            `;
            favoritesItemsContainer.appendChild(itemElement);
        });

        // Gestion des boutons de suppression
        document.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromFavorites(index);
            });
        });
        
        // Met à jour le compteur
        document.querySelector('#favorites-icon i').setAttribute('data-count', favorites.length);
        
        if (favorites.length === 0) {
            favoritesItemsContainer.innerHTML = '<p class="empty-favorites">Aucun favori pour le moment</p>';
        }
    }

    function removeFromFavorites(index) {
        const removedItem = favorites.splice(index, 1)[0];
        updateFavoritesDisplay();
        
        // Met à jour le coeur dans la liste des produits
        document.querySelectorAll('.product').forEach(product => {
            if (product.querySelector('h3').textContent === removedItem.name) {
                product.querySelector('.favori').classList.remove('active');
            }
        });
    }

    // Gestion de la sidebar des favoris
    favoritesIcon.addEventListener('click', () => {
        favoritesSidebar.classList.toggle('active');
    });

    document.getElementById('close-favorites').addEventListener('click', () => {
        favoritesSidebar.classList.remove('active');
    });

    document.getElementById('clear-favorites').addEventListener('click', () => {
        favorites = [];
        updateFavoritesDisplay();
        document.querySelectorAll('.favori').forEach(heart => {
            heart.classList.remove('active');
        });
    });
});heartElement.classList.toggle('active');