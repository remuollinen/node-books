"use strict";

const http = require("http");
const path = require("path");
const express = require("express");
const app = express();

const { port, host, storage } = require("./serverConfig.json");

const DataStorage = require(path.join(
	__dirname,
	storage.storageFolder,
	storage.dataLayer
));

const dataStorage = new DataStorage();

// server

const server = http.createServer(app);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "pages"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const menuPath = path.join(__dirname, "menu.html");

app.get("/", (req, res) => res.sendFile(menuPath));

app.get("/allbooks", (req, res) =>
	dataStorage.getAll().then((data) => res.render("allBooks", { result: data }))
);

app.get("/getbook", (req, res) =>
	res.render("getBook", {
		title: "Get one book",
		header: "Get one book",
		action: "/getbook",
		submit: 'Get the book'
	})
);

app.post("/getbook", (req, res) => {
	if (!req.body) res.sendStatus(500);
	const bookId = req.body.id;
	dataStorage
		.getOne(bookId)
		.then((book) => res.render("bookPage", { result: book }))
		.catch((err) => sendErrorPage(res, err));
});

app.get("/removebook", (req, res) =>
	res.render("getBook", {
		title: "Remove book",
		header: "Remove book",
		action: "/removebook",
		submit: 'Remove the book'
	})
);

app.post("/removebook", (req, res) => {
	if (!req.body) res.sendStatus(500);
	const bookId = req.body.id;
	dataStorage
		.remove(bookId)
		.then((status) => sendStatusPage(res, status))
		.catch((err) => sendErrorPage(res, err));
});

app.get("/addbook", (req, res) =>
	res.render("form", {
		title: "Add a new book",
		header: "Add a new book",
		action: "/insert",
		submit: 'Add the book',
		id: {value: '', readonly: ''},
		name: {value: '', readonly: ''},
		author: {value: '', readonly: ''},
		genre: {value: '', readonly: ''},
		year: {value: '', readonly: ''}
	})
);

app.post('/insert', (req, res) => {
	if (!req.body) res.sendStatus(500)
	dataStorage.insert(req.body)
		.then(status => sendStatusPage(res, status))
		.catch(err => sendErrorPage(res, err))
})

app.get('/updatebook', (req, res) => res.render('form', {
	title: 'Update a book',
	header: 'Update a book', 
	action: '/updatedata',
	submit: 'Get book you want to update',
	id: {value: '', readonly: ''},
	name: {value: '', readonly: 'readonly'},
	author: {value: '', readonly: 'readonly'},
	genre: {value: '', readonly: 'readonly'},
	year: {value: '', readonly: 'readonly'}
}))

app.post('/updatedata', (req, res) => {
	if (!req.body) res.sendStatus(500);
	dataStorage.getOne(req.body.id)
		.then(book => res.render('form', {
			title: 'Update a book', 
			header: 'Update a book', 
			action: '/update',
			submit: 'Update the book',
			id: {value: book.id, readonly: 'readonly'},
			name: {value: book.name, readonly: ''},
			author: {value: book.author, readonly: ''},
			genre: {value: book.genre, readonly: ''}, 
			year: {value: book.year, readonly: ''}
		}))
		.catch(err => sendErrorPage(res, err));
})

app.post('/update', (req, res) => {
	if (!req.body) res.sendStatus(500);
	dataStorage.update(req.body)
		.then(status => sendStatusPage(res, status))
		.catch(err => sendErrorPage(res, err));
});

server.listen(port, host, () => console.log("Server running"));

function sendErrorPage(res, error, title = "Error", header = "Error") {
	sendStatusPage(res, error, title, header);
}

function sendStatusPage(res, status, title = "Status", header = "Status") {
	return res.render("statusPage", { title, header, status });
}
