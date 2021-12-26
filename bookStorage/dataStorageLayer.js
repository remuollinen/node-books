"use strict";

const { CODES, MESSAGES } = require("./statuscodes");

const {
	getAllFromStorage,
	getOneFromStorage,
	addToStorage,
	updateStorage,
	removeFromStorage,
} = require("./storageLayer");

module.exports = class DataStorage {
	get CODES() {
		return CODES;
	}
	getAll() {
		return getAllFromStorage();
	}
	getOne(id) {
		return new Promise(async (resolve, reject) => {
			if (!id) {
				reject(MESSAGES.NOT_FOUND("--empty--"));
			} else {
				const result = await getOneFromStorage(id);
				if (result) {
					resolve(result);
				} else {
					reject(MESSAGES.NOT_FOUND(id));
				}
			}
		});
	}
	insert(book) {
		return new Promise(async (resolve, reject) => {
			if (book) {
				if (!book.id) {
					reject(MESSAGES.NOT_INSERTED());
				} else if (await getOneFromStorage(book.id)) {
					reject(MESSAGES.ALREADY_IN_USE(book.id));
				} else if (await addToStorage(book)) {
					resolve(MESSAGES.INSERT_OK(book.id));
				} else {
					reject(MESSAGES.NOT_INSERTED());
				}
			} else {
				reject(MESSAGES.NOT_INSERTED());
			}
		});
	}
	update(book) {
		return new Promise(async (resolve, reject) => {
			if (book) {
				if (await updateStorage(book)) {
					resolve(MESSAGES.UPDATE_OK(book.id));
				} else {
					reject(MESSAGES.NOT_UPDATED());
				}
			} else {
				reject(MESSAGES.NOT_UPDATED());
			}
		});
	}
	remove(id) {
		return new Promise(async (resolve, reject) => {
			if (!id) {
				reject(MESSAGES.NOT_FOUND("--empty--"));
			} else if (await removeFromStorage(id)) {
				resolve(MESSAGES.REMOVE_OK(id));
			} else {
				reject(MESSAGES.NOT_REMOVED(id));
			}
		});
	}
};
