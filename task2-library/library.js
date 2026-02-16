

const library = []; 

// ---------- Helpers ----------
function normalizeTitle(title) {
    return String(title || "").trim().toLowerCase(); // 
}

function findBookIndexByTitle(title) {
    const key = normalizeTitle(title);
    return library.findIndex(b => normalizeTitle(b.title) === key);
}

function getBookStatus(availableCopies) {
    if (availableCopies > 2) return "Available";
    if (availableCopies >= 1 && availableCopies <= 2)
        return "Limited";
    return "Out of Stock";
}

function askNonEmpty(promptText) {
    while (true) {
        const val = prompt(promptText);
        if (val === null)
            return null; // user cancelled
        const trimmed = val.trim();
        if (trimmed.length > 0)
            return trimmed;
        alert("Input cannot be empty. Please try again.");
    }
}

function askPositiveNumber(promptText) {
    while (true) {
        const val = prompt(promptText);
        if (val === null) return null; 
        const num = Number(val);
        if (num > 0 && Number.isInteger(num))
            return num;
        alert("Please enter a valid positive integer number (> 0).");
    }
}

// ---------- Function 1: Add Book ----------
function addBook() {
    const title = askNonEmpty("Enter book title:");
    if (title === null) return alert("Add book cancelled.");

    const author = askNonEmpty("Enter author name:");
    if (author === null) return alert("Add book cancelled.");

    const copies = askPositiveNumber("Enter number of copies (> 0):");
    if (copies === null) return alert("Add book cancelled.");

    const idx = findBookIndexByTitle(title);

    if (idx !== -1) { 
        library[idx].availableCopies += copies;
        alert(`Book already exists. Increased available copies by ${copies}.\nNow available: ${library[idx].availableCopies}`);
    } else {
        library.push({
            title: title.trim(),
            author: author.trim(),
            availableCopies: copies,
            borrowedCopies: 0,
            borrowCount: 0
        });
        alert(`Book added successfully: "${title}" by ${author} (${copies} copies).`);
    }
}

// ---------- Function 2: Borrow Book ----------
function borrowBook() {
    if (library.length === 0) {
        return alert("Library is empty. Add books first.");
    }

    const title = askNonEmpty("Enter the book title to borrow:");
    if (title === null) return alert("Borrow cancelled.");

    const idx = findBookIndexByTitle(title);

    if (idx === -1) {
        return alert("Book not found.");
    }

    const book = library[idx];

    if (book.availableCopies <= 0) {
        return alert(`No available copies for "${book.title}". (${getBookStatus(book.availableCopies)})`);
    }

    book.availableCopies -= 1;
    book.borrowedCopies += 1;
    book.borrowCount += 1;

    alert(`Book borrowed successfully.\n"${book.title}"\nAvailable: ${book.availableCopies}, Borrowed: ${book.borrowedCopies}`);
}

// ---------- Function 3: Return Book ----------
function returnBook() {
    if (library.length === 0) {
        return alert("Library is empty.");
    }

    const title = askNonEmpty("Enter the book title to return:");
    if (title === null) return alert("Return cancelled.");

    const idx = findBookIndexByTitle(title);

    if (idx === -1) {
        return alert("Book not found.");
    }

    const book = library[idx];

    if (book.borrowedCopies <= 0) {
        return alert(`No borrowed copies to return for "${book.title}".`);
    }

    book.borrowedCopies -= 1;
    book.availableCopies += 1;

    alert(`Book returned successfully.\n"${book.title}"\nAvailable: ${book.availableCopies}, Borrowed: ${book.borrowedCopies}`);
}

// ---------- Function 4: Calculate Total Books ----------
function calculateTotalBooks() {
    let totalAvailable = 0;
    let totalBorrowed = 0;

    for (const book of library) {
        totalAvailable += book.availableCopies;
        totalBorrowed += book.borrowedCopies;
    }

    return { totalAvailable, totalBorrowed };
}

// ---------- Function 5: Show Report ----------
function showReport() {
    if (library.length === 0) {
        return alert("Library report: No books available.");
    }

    const totals = calculateTotalBooks();

    let report = "LIBRARY REPORT\n\n";
    report += "Books List:\n";
    report += "-----------------------------\n";

    for (let i = 0; i < library.length; i++) {
        const b = library[i];
        report += `${i + 1}) Title: ${b.title}\n`;
        report += `   Author: ${b.author}\n`;
        report += `   Available: ${b.availableCopies} (${getBookStatus(b.availableCopies)})\n`;
        report += `   Borrowed: ${b.borrowedCopies}\n`;
        report += `   Borrow History (borrowCount): ${b.borrowCount}\n`;
        report += "-----------------------------\n";
    }

    report += `\nTOTAL AVAILABLE COPIES: ${totals.totalAvailable}\n`;
    report += `TOTAL BORROWED COPIES: ${totals.totalBorrowed}\n`;

    alert(report);
    console.log(report);
}

// ---------- Main Menu Loop ----------
function runLibrarySystem() {
    let exit = false;

    while (!exit) {
        const choice = prompt(
            "Library Management System\n\n" +
            "1 → Add New Book\n" +
            "2 → Borrow Book\n" +
            "3 → Return Book\n" +
            "4 → Show Library Report\n" +
            "5 → Exit\n\n" +
            "Enter your choice (1-5):"
        );

        if (choice === null) {
            exit = true;
            alert("Exiting Library System. Goodbye.");
            break;
        }

        switch (choice.trim()) {
            case "1":
                addBook();
                break;
            case "2":
                borrowBook();
                break;
            case "3":
                returnBook();
                break;
            case "4":
                showReport();
                break;
            case "5":
                exit = true;
                alert("Exiting Library System. Goodbye.");
                break;
            default:
                alert("Invalid choice. Please enter a number from 1 to 5.");
        }
    }
}


runLibrarySystem();