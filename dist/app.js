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
let books = [
    new Book(1, "ვეფხისტყაოსანი", "შოთა რუსთაველი", 1200, "ხელმისაწვდომია"),
    new Book(2, "დათა თუთაშხია", "ჭაბუა ამირეჯიბი", 1975, "ხელმისაწვდომია"),
    new Book(3, "დიდოსტატის კონსტანტინეს მარჯვენა", "კონსტანტინე გამსახურდია", 1939, "არ არის ხელმისაწვდომი"),
    new Book(4, "ჯინსების თაობა", "დათო ტურაშვილი", 2001, "ხელმისაწვდომია"),
    new Book(5, "კაცის ტვირთი", "მიხეილ ჯავახიშვილი", 1929, "არ არის ხელმისაწვდომი")
];
// რედაქტირებადი წიგნის id (null - ახალი წიგნის დამატების რეჟიმი)
let editingId = null;
// 7. DOM-ის ელემენტები
const booksListContainer = document.getElementById("books-list");
const bookForm = document.getElementById("book-form");
const formTitle = document.getElementById("form-title");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const yearInput = document.getElementById("year");
const statusSelect = document.getElementById("status");
const submitButton = document.getElementById("add-btn");
const cancelButton = document.getElementById("cancel-btn");
const searchInput = document.getElementById("search");
// 8. მონაცემების დამუშავების ფუნქციები
// ახალი უნიკალური ID-ის გენერირება (უდიდესი არსებული id + 1)
function generateId() {
    if (books.length === 0) {
        return 1;
    }
    return Math.max(...books.map((book) => book.id)) + 1;
}
// წიგნის მოძებნა id-ით
function findBookById(id) {
    return books.find((book) => book.id === id);
}
// წიგნების გაფილტვრა სათაურის მიხედვით
function searchBooks(query) {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery === "") {
        return books;
    }
    return books.filter((book) => book.title.toLowerCase().includes(normalizedQuery));
}
// 9. წიგნების ეკრანზე გამოტანის (Render) ფუნქცია
function renderBooks() {
    if (!booksListContainer)
        return;
    // ძველი HTML-ის გასუფთავება
    booksListContainer.innerHTML = "";
    const visibleBooks = searchBooks(searchInput.value);
    if (visibleBooks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "წიგნები ვერ მოიძებნა";
        booksListContainer.appendChild(emptyMessage);
        return;
    }
    visibleBooks.forEach((book) => {
        const isAvailable = book.status === "ხელმისაწვდომია";
        const bookCard = document.createElement("div");
        bookCard.className = isAvailable ? "book-card" : "book-card unavailable";
        const titleEl = document.createElement("h3");
        titleEl.textContent = book.title;
        const authorEl = document.createElement("p");
        authorEl.innerHTML = "<strong>ავტორი:</strong> ";
        authorEl.append(book.author);
        const yearEl = document.createElement("p");
        yearEl.innerHTML = "<strong>წელი:</strong> ";
        yearEl.append(String(book.year));
        const statusEl = document.createElement("span");
        statusEl.className = isAvailable ? "status-badge available" : "status-badge unavailable";
        statusEl.textContent = book.status;
        // მოქმედების ღილაკები
        const actions = document.createElement("div");
        actions.className = "book-actions";
        const toggleBtn = document.createElement("button");
        toggleBtn.className = "toggle-btn";
        toggleBtn.textContent = "სტატუსის შეცვლა";
        toggleBtn.addEventListener("click", () => toggleStatus(book.id));
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "რედაქტირება";
        editBtn.addEventListener("click", () => startEdit(book.id));
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "წაშლა";
        deleteBtn.addEventListener("click", () => deleteBook(book.id));
        actions.append(toggleBtn, editBtn, deleteBtn);
        bookCard.append(titleEl, authorEl, yearEl, statusEl, actions);
        booksListContainer.appendChild(bookCard);
    });
}
// 10. წიგნის წაშლის ფუნქცია (id-ით გაფილტვრა)
function deleteBook(id) {
    books = books.filter((book) => book.id !== id);
    // თუ რედაქტირების რეჟიმში მყოფი წიგნი წაიშალა, ფორმა ბრუნდება დამატების რეჟიმში
    if (editingId === id) {
        resetForm();
    }
    renderBooks();
}
// 11. სტატუსის შეცვლა (if/else პირობითი ოპერატორით)
function toggleStatus(id) {
    const book = findBookById(id);
    if (!book)
        return;
    if (book.status === "ხელმისაწვდომია") {
        book.status = "არ არის ხელმისაწვდომი";
    }
    else {
        book.status = "ხელმისაწვდომია";
    }
    renderBooks();
}
// 12. რედაქტირების დაწყება - ფორმაში წიგნის მონაცემების ჩასმა
function startEdit(id) {
    const book = findBookById(id);
    if (!book)
        return;
    editingId = id;
    titleInput.value = book.title;
    authorInput.value = book.author;
    yearInput.value = String(book.year);
    statusSelect.value = book.status;
    formTitle.textContent = "წიგნის რედაქტირება";
    submitButton.textContent = "ცვლილებების შენახვა";
    cancelButton.style.display = "block";
    bookForm.scrollIntoView({ behavior: "smooth" });
    titleInput.focus();
}
// ფორმის დაბრუნება დამატების რეჟიმში
function resetForm() {
    editingId = null;
    bookForm.reset();
    formTitle.textContent = "ახალი წიგნის დამატება";
    submitButton.textContent = "წიგნის დამატება";
    cancelButton.style.display = "none";
}
// 13. ფორმის გაგზავნა - ახალი წიგნის დამატება ან არსებულის განახლება
function handleSubmit(event) {
    event.preventDefault();
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const year = Number(yearInput.value);
    const status = statusSelect.value;
    const currentYear = new Date().getFullYear();
    if (!title || !author || !year) {
        alert("გთხოვთ შეავსოთ ყველა ველი!");
        return;
    }
    if (year < 0 || year > currentYear) {
        alert(`გამოცემის წელი უნდა იყოს 0-დან ${currentYear}-მდე!`);
        return;
    }
    if (editingId !== null) {
        // არსებული წიგნის განახლება
        const book = findBookById(editingId);
        if (book) {
            book.title = title;
            book.author = author;
            book.year = year;
            book.status = status;
        }
    }
    else {
        // ახალი წიგნის ობიექტის შექმნა Book კლასით და მასივში დამატება
        const newBook = new Book(generateId(), title, author, year, status);
        books.push(newBook);
    }
    // DOM-ის განახლება და ფორმის გასუფთავება
    resetForm();
    renderBooks();
}
// 14. ივენთების მიბმა და ინიციალიზაცია
if (bookForm) {
    bookForm.addEventListener("submit", handleSubmit);
}
cancelButton.addEventListener("click", resetForm);
// ძიება - ყოველი სიმბოლოს აკრეფისას სია ახლდება
searchInput.addEventListener("input", renderBooks);
// Employee და Developer კლასების ტესტირება კონსოლში
const dev = new Developer("ლაშა", "TypeScript");
dev.logInfo();
dev.work();
// გვერდის ჩატვირთვისას წიგნების დახატვა
renderBooks();
