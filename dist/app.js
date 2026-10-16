"use strict";
// 3. Book კლასი
class Book {
    constructor(id, title, author, year, status) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
        this.status = status;
    }
}
// 4. Employee კლასი
class Employee {
    constructor(name) {
        this.name = name;
    }
    logInfo() {
        console.log(`თანამშრომლის სახელი: ${this.name}`);
    }
}
// 5. Developer კლასი (მემკვიდრეობა / OOP Extends)
class Developer extends Employee {
    constructor(name, programmingLanguage) {
        super(name); // მშობელი კლასის (Employee) კონსტრუქტორის გამოძახება
        this.programmingLanguage = programmingLanguage;
    }
    work() {
        console.log(`დეველოპერი ${this.name} წერს კოდს ${this.programmingLanguage} ენაზე.`);
    }
}
// 6. მონაცემთა საცავი (საწყისი 5 წიგნი)
const books = [
    new Book(1, "ვეფხისტყაოსანი", "შოთა რუსთაველი", 1200, "ხელმისაწვდომია"),
    new Book(2, "დათა თუთაშხია", "ჭაბუა ამირეჯიბი", 1975, "ხელმისაწვდომია"),
    new Book(3, "დიდოსტატის კონსტანტინეს მარჯვენა", "კონსტანტინე გამსახურდია", 1939, "არ არის ხელმისაწვდომი"),
    new Book(4, "ჯინსების თაობა", "დათო ტურაშვილი", 2001, "ხელმისაწვდომია"),
    new Book(5, "კაცის ტვირთი", "მიხეილ ჯავახიშვილი", 1929, "არ არის ხელმისაწვდომი")
];
// 7. DOM-ის ელემენტები
const booksListContainer = document.getElementById("books-list");
const bookForm = document.getElementById("book-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const yearInput = document.getElementById("year");
const statusSelect = document.getElementById("status");
// 8. წიგნების ეკრანზე გამოტანის (Render) ფუნქცია
function renderBooks() {
    if (!booksListContainer)
        return;
    booksListContainer.innerHTML = "";
    books.forEach((book) => {
        const bookCard = document.createElement("div");
        const isAvailable = book.status === "ხელმისაწვდომია";
        bookCard.className = `book-card ${isAvailable ? "" : "unavailable"}`;
        bookCard.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>ავტორი:</strong> ${book.author}</p>
            <p><strong>წელი:</strong> ${book.year}</p>
            <span class="status-badge ${isAvailable ? "available" : "unavailable"}">
                ${book.status}
            </span>
            <button class="delete-btn" onclick="deleteBook(${book.id})">წაშლა</button>
        `;
        booksListContainer.appendChild(bookCard);
    });
}
// 9. წიგნის წაშლის ფუნქცია
function deleteBook(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        books.splice(index, 1);
        renderBooks();
    }
}
// window ობიექტზე მიბმა, რომ HTML-ის onclick-მა დაინახოს
window.deleteBook = deleteBook;
// 10. ახალი წიგნის დამატების ფუნქცია
function handleAddBook(event) {
    event.preventDefault();
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const year = Number(yearInput.value);
    const status = statusSelect.value;
    if (!title || !author || !year) {
        alert("გთხოვთ შეავსოთ ყველა ველი!");
        return;
    }
    // ახალი უნიკალური ID-ის გენერირება
    const newId = books.length > 0 ? books[books.length - 1].id + 1 : 1;
    // ახალი წიგნის ობიექტის შექმნა Book კლასით
    const newBook = new Book(newId, title, author, year, status);
    // მასივში დამატება
    books.push(newBook);
    // DOM-ის განახლება და ფორმის გასუფთავება
    renderBooks();
    bookForm.reset();
}
// 11. ივენთების მიბმა და ინიციალიზაცია
if (bookForm) {
    bookForm.addEventListener("submit", handleAddBook);
}
// Employee და Developer კლასების ტესტირება კონსოლში
const dev = new Developer("ლაშა", "TypeScript");
dev.logInfo();
dev.work();
// გვერდის ჩატვირთვისას წიგნების დახატვა
renderBooks();
