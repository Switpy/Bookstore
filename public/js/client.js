// Connexion
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('userId', data.userId);
    window.location.href = `${data.redirectUrl}?userId=${data.userId}`;
  } else {
    alert(data.message || 'Erreur lors de la connexion');
  }
});

// Inscription
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('userId', data.userId);
    window.location.href = `${data.redirectUrl}?userId=${data.userId}`;
  } else {
    alert(data.message || 'Erreur lors de l’inscription');
  }
});

// Mise à jour du profil
document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.querySelector('input[name="userId"]').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value || undefined;
  const res = await fetch('/api/users/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, name, email, password })
  });
  const data = await res.json();
  if (res.ok) {
    alert(data.message);
    window.location.reload();
  } else {
    alert(data.message || 'Erreur lors de la mise à jour');
  }
});

// Ajouter un livre
document.getElementById('addBookForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.querySelector('input[name="userId"]').value;
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const genre = document.getElementById('genre').value;
  const price = document.getElementById('price').value;
  const description = document.getElementById('description').value;
  const stock = document.getElementById('stock').value;
  const res = await fetch('/api/books/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, author, genre, price, description, stock })
  });
  const data = await res.json();
  if (res.ok) {
    alert(data.message);
    window.location.reload();
  } else {
    alert(data.message || 'Erreur lors de l’ajout du livre');
  }
});

// Modifier un livre
async function editBook(bookId) {
  const row = document.querySelector(`tr[data-book-id="${bookId}"]`);
  const cells = row.getElementsByTagName('td');
  const currentTitle = cells[0].innerText;
  const currentAuthor = cells[1].innerText;
  const currentGenre = cells[2].innerText;
  const currentPrice = cells[3].innerText;
  const currentStock = cells[4].innerText;

  const newTitle = prompt('Nouveau titre :', currentTitle) || currentTitle;
  const newAuthor = prompt('Nouvel auteur :', currentAuthor) || currentAuthor;
  const newGenre = prompt('Nouveau genre :', currentGenre) || currentGenre;
  const newPrice = prompt('Nouveau prix (€) :', currentPrice) || currentPrice;
  const newStock = prompt('Nouveau stock :', currentStock) || currentStock;

  const res = await fetch(`/api/books/${bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: newTitle, author: newAuthor, genre: newGenre, price: newPrice, stock: newStock })
  });
  const data = await res.json();
  if (res.ok) {
    alert(data.message);
    window.location.reload();
  } else {
    alert(data.message || 'Erreur lors de la mise à jour');
  }
}

// Supprimer un livre
async function deleteBook(bookId) {
  if (confirm('Voulez-vous vraiment supprimer ce livre ?')) {
    const res = await fetch(`/api/books/${bookId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      window.location.reload();
    } else {
      alert(data.message || 'Erreur lors de la suppression');
    }
  }
}

// Rechercher des livres
document.getElementById('searchBooksForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.getElementById('searchQuery').value;
  const res = await fetch(`/api/books/search?query=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const books = await res.json();
  const tbody = document.getElementById('booksTableBody');
  tbody.innerHTML = '';
  books.forEach(book => {
    tbody.innerHTML += `
      <tr data-book-id="${book._id}">
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.price}</td>
        <td>${book.stock}</td>
        <td>
          <button onclick="editBook('${book._id}')" class="btn btn-sm btn-primary">Modifier</button>
          <button onclick="deleteBook('${book._id}')" class="btn btn-sm btn-danger">Supprimer</button>
          <a href="/book/${book._id}" class="btn btn-sm btn-info">Détails</a>
        </td>
      </tr>
    `;
  });
});

// Ajouter au panier
document.getElementById('addToCartForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = localStorage.getItem('userId');
  const bookId = document.querySelector('input[name="bookId"]').value;
  const quantity = document.getElementById('quantity').value;
  const res = await fetch('/api/orders/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, bookId, quantity })
  });
  const data = await res.json();
  if (res.ok) window.location.href = `/cart?userId=${userId}`;
  else alert(data.message || 'Erreur lors de l’ajout au panier');
});

document.getElementById('addToCartForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.querySelector('input[name="userId"]').value;
  const bookId = document.getElementById('bookId').value;
  const quantity = document.getElementById('quantity').value;
  const res = await fetch('/api/orders/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, bookId, quantity })
  });
  const data = await res.json();
  if (res.ok) {
    alert(data.message);
    window.location.reload();
  } else {
    alert(data.message || 'Erreur lors de l’ajout au panier');
  }
});
// Valider la commande
async function checkout() {
  const userId = localStorage.getItem('userId');
  const res = await fetch('/api/orders/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  const data = await res.json();
  if (res.ok) window.location.href = `/orders?userId=${userId}`;
  else alert(data.message || 'Erreur lors de la validation');
}
async function checkout() {
  const userId = localStorage.getItem('userId');
  const res = await fetch('/api/orders/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  const data = await res.json();
  if (res.ok) {
    alert(data.message);
    window.location.reload();
  } else {
    alert(data.message || 'Erreur lors de la validation');
  }
}

// Déconnexion
function logout() {
  localStorage.removeItem('userId');
  window.location.href = '/';
}

// Gestion des utilisateurs (activer/désactiver)
async function toggleUser(userId, isActive) {
  const res = await fetch(`/api/admin/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive })
  });
  const data = await res.json();
  if (res.ok) window.location.reload();
  else alert(data.message || 'Erreur lors de la mise à jour');
}

// Mise à jour du stock (pour la vue stock admin)
async function updateStock(e, bookId) {
  e.preventDefault();
  const stock = e.target.querySelector('input[name="stock"]').value;
  const res = await fetch(`/api/admin/books/${bookId}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock })
  });
  const data = await res.json();
  if (res.ok) window.location.reload();
  else alert(data.message || 'Erreur lors de la mise à jour');
}

async function redirectToDashboard(userId) {
  const res = await fetch('/api/users/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  const data = await res.json();
  if (res.ok && data.user) {
    if (data.user.role === 1) {
      window.location.href = `/admin/users?userId=${userId}`;
    } else {
      window.location.href = `/dashboard?userId=${userId}`;
    }
  } else {
    alert('Erreur lors de la vérification du rôle');
  }
}