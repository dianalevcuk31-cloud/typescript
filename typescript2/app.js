class BookItem {
    constructor(title, author) {
        this.id = BookItem.nextId++;
        this.title = title;
        this.author = author;
        this.createdAt = new Date();
    }
    getFullInfo() {
        return `ID: ${this.id} | "${this.title}" - ${this.author}`;
    }
    getNormalizedKey() {
        return `${this.title.toLowerCase()}|${this.author.toLowerCase()}`;
    }
}
BookItem.nextId = 1;
class BookStorage {
    constructor() {
        this.books = [];
    }
    addBook(book) {
        this.books.push(book);
    }
    getAllBooks() {
        return [...this.books];
    }
    getCount() {
        return this.books.length;
    }
    existsWithSameTitleAndAuthor(title, author) {
        const normalizedTitle = title.toLowerCase();
        const normalizedAuthor = author.toLowerCase();
        return this.books.some(book => book.title.toLowerCase() === normalizedTitle &&
            book.author.toLowerCase() === normalizedAuthor);
    }
}
class BookApp {
    constructor() {
        this.titleInput = document.getElementById('bookTitle');
        this.authorInput = document.getElementById('bookAuthor');
        this.addButton = document.getElementById('addButton');
        this.errorDiv = document.getElementById('errorMessage');
        this.counterSpan = document.getElementById('bookCounter');
        this.booksContainer = document.getElementById('booksContainer');
        this.storage = new BookStorage();
        this.addButton.addEventListener('click', () => this.handleAddBook());
        this.titleInput.addEventListener('input', () => this.hideError());
        this.authorInput.addEventListener('input', () => this.hideError());
        this.render();
    }
    normalizeString(str) {
        return str.trim().replace(/\s+/g, ' ');
    }
    showError(message) {
        this.errorDiv.textContent = message;
        this.errorDiv.classList.add('show');
        setTimeout(() => this.hideError(), 3000);
    }
    hideError() {
        this.errorDiv.classList.remove('show');
    }
    handleAddBook() {
        let title = this.normalizeString(this.titleInput.value);
        let author = this.normalizeString(this.authorInput.value);
        if (!title || !author) {
            this.showError('Пожалуйста, заполните оба поля: название и автор');
            return;
        }
        if (this.storage.existsWithSameTitleAndAuthor(title, author)) {
            this.showError('Такая книга уже есть в списке!');
            return;
        }
        const newBook = new BookItem(title, author);
        this.storage.addBook(newBook);
        this.titleInput.value = '';
        this.authorInput.value = '';
        this.render();
        this.showTemporarySuccess();
    }
    showTemporarySuccess() {
        const originalText = this.addButton.textContent;
        this.addButton.textContent = '✓ Добавлено!';
        setTimeout(() => {
            this.addButton.textContent = originalText;
        }, 1000);
    }
    render() {
        const count = this.storage.getCount();
        this.counterSpan.textContent = count.toString();
        this.booksContainer.innerHTML = '';
        const books = this.storage.getAllBooks();
        if (books.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'Здесь пока нет книг. Добавьте первую!';
            this.booksContainer.appendChild(emptyMessage);
        }
        else {
            books.forEach(book => {
                const card = this.createBookCard(book);
                this.booksContainer.appendChild(card);
            });
        }
    }
    createBookCard(book) {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.addEventListener('click', () => {
            alert(book.getFullInfo());
        });
        const titleEl = document.createElement('div');
        titleEl.className = 'book-title';
        titleEl.textContent = `${book.title}`;
        const authorEl = document.createElement('div');
        authorEl.className = 'book-author';
        authorEl.textContent = `${book.author}`;
        const idEl = document.createElement('div');
        idEl.className = 'book-id';
        idEl.textContent = `ID: ${book.id}`;
        const dateEl = document.createElement('div');
        dateEl.className = 'book-id';
        dateEl.style.marginTop = '5px';
        dateEl.style.fontSize = '0.7rem';
        dateEl.textContent = `${book.createdAt.toLocaleDateString('ru-RU')}`;
        card.appendChild(titleEl);
        card.appendChild(authorEl);
        card.appendChild(idEl);
        card.appendChild(dateEl);
        return card;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new BookApp();
});
