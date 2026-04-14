class BookItem {
    private static nextId: number = 1;
    
    public readonly id: number;
    public readonly title: string;
    public readonly author: string;
    public readonly createdAt: Date;

    constructor(title: string, author: string) {
        this.id = BookItem.nextId++;
        this.title = title;
        this.author = author;
        this.createdAt = new Date();
    }
    //  возвращает информацию
    getFullInfo(): string {
        return `ID: ${this.id} | "${this.title}" - ${this.author}`;
    }
    //    сравнение
    getNormalizedKey(): string {
        return `${this.title.toLowerCase()}|${this.author.toLowerCase()}`;
    }
}

class BookStorage {
    private books: BookItem[] = [];
    //    добавление
    addBook(book: BookItem): void {
        this.books.push(book);
    }
    //   список
    getAllBooks(): BookItem[] {
        return [...this.books];
    }
    //   количество
    getCount(): number {
        return this.books.length;
    }
    //    проверка оригинальности
    existsWithSameTitleAndAuthor(title: string, author: string): boolean {
        const normalizedTitle = title.toLowerCase();
        const normalizedAuthor = author.toLowerCase();
        
        return this.books.some(book => 
            book.title.toLowerCase() === normalizedTitle && 
            book.author.toLowerCase() === normalizedAuthor
        );
    }
}

class BookApp {
    private titleInput: HTMLInputElement;
    private authorInput: HTMLInputElement;
    private addButton: HTMLButtonElement;
    private errorDiv: HTMLDivElement;
    private counterSpan: HTMLSpanElement;
    private booksContainer: HTMLDivElement;
    private storage: BookStorage;

    constructor() {
        this.titleInput = document.getElementById('bookTitle') as HTMLInputElement;
        this.authorInput = document.getElementById('bookAuthor') as HTMLInputElement;
        this.addButton = document.getElementById('addButton') as HTMLButtonElement;
        this.errorDiv = document.getElementById('errorMessage') as HTMLDivElement;
        this.counterSpan = document.getElementById('bookCounter') as HTMLSpanElement;
        this.booksContainer = document.getElementById('booksContainer') as HTMLDivElement;
        
        this.storage = new BookStorage();
        //    обработчик кнопки
        this.addButton.addEventListener('click', () => this.handleAddBook());
           
        this.titleInput.addEventListener('input', () => this.hideError());
        this.authorInput.addEventListener('input', () => this.hideError());
        
        this.render();
    }
    //    нормализация строки
    private normalizeString(str: string): string {
        return str.trim().replace(/\s+/g, ' ');
    }
    //   показываем ошибку
    private showError(message: string): void {
        this.errorDiv.textContent = message;
        this.errorDiv.classList.add('show');
        
        setTimeout(() => this.hideError(), 3000);
    }
        // прячем
    private hideError(): void {
        this.errorDiv.classList.remove('show');
    }
        // валидация и добавление
    private handleAddBook(): void {
        let title = this.normalizeString(this.titleInput.value);
        let author = this.normalizeString(this.authorInput.value);
            //  проверка пустых полей
        if (!title || !author) {
            this.showError('Пожалуйста, заполните оба поля: название и автор');
            return;
        }
            // дубликаты
        if (this.storage.existsWithSameTitleAndAuthor(title, author)) {
            this.showError('Такая книга уже есть в списке!');
            return;
        }
        //    создаём книгу
        const newBook = new BookItem(title, author);
        //    добавляем в базу
        this.storage.addBook(newBook);
        
        this.titleInput.value = '';
        this.authorInput.value = '';
        
        this.render();
        
        this.showTemporarySuccess();
    }
        //  сообщение об успехе
    private showTemporarySuccess(): void {
        const originalText = this.addButton.textContent;
        this.addButton.textContent = 'Добавлено!';
        setTimeout(() => {
            this.addButton.textContent = originalText;
        }, 1000);
    }
    
    private render(): void {
        //   обновляем счётчик
        const count = this.storage.getCount();
        this.counterSpan.textContent = count.toString();
            //   очищаем
        this.booksContainer.innerHTML = '';
                // получаем все книги
        const books = this.storage.getAllBooks();
        
        if (books.length === 0) {
            //   если книг нет
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'Здесь пока нет книг. Добавьте первую!';
            this.booksContainer.appendChild(emptyMessage);
        } else {
            //    карточки для книги
            books.forEach(book => {
                const card = this.createBookCard(book);
                this.booksContainer.appendChild(card);
            });
        }
    }
            //   эфект
    private createBookCard(book: BookItem): HTMLDivElement {
        const card = document.createElement('div');
        card.className = 'book-card';
        
        card.addEventListener('click', () => {
            alert(book.getFullInfo());
        });
            // название
        const titleEl = document.createElement('div');
        titleEl.className = 'book-title';
        titleEl.textContent = `${book.title}`;
            //  автор
        const authorEl = document.createElement('div');
        authorEl.className = 'book-author';
        authorEl.textContent = `${book.author}`;
            // id
        const idEl = document.createElement('div');
        idEl.className = 'book-id';
        idEl.textContent = `ID: ${book.id}`;
            // дата
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
    //  запуск
document.addEventListener('DOMContentLoaded', () => {
    new BookApp();
});