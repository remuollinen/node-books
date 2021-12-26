"use strict";

const path = require("path");
const { storageFile, adapterFile } = require("./storageConfig.json");
const storageFilePath = path.join(__dirname, storageFile);
const { readStorage, writeStorage } = require("./readerWriter");
const {adapt} = require(path.join(__dirname, adapterFile))

async function getAllFromStorage() {
	return readStorage(storageFilePath);
}

async function getOneFromStorage(id) {
	const storage = await readStorage(storageFilePath);
	return storage.find((item) => item.id == id || null);
}

async function addToStorage(newObj) {
	const storage = await readStorage(storageFilePath);
	storage.push(adapt(newObj));
	return await writeStorage(storageFilePath, storage);
}
async function updateStorage(updatedObj) {
	const storage = await readStorage(storageFilePath);
	const oldObj = storage.find((item) => item.id == updatedObj.id);
	if (oldObj) {
		Object.assign(oldObj, adapt(updatedObj));
		return await writeStorage(storageFilePath, storage);
	}
	return false;
}
async function removeFromStorage(id) {
	const storage = await readStorage(storageFilePath);
	const i = storage.findIndex((item) => item.id == id);
	if (i < 0) return false;
	storage.splice(i, 1);
	return await writeStorage(storageFilePath, storage);
}

module.exports = {
	getAllFromStorage,
	getOneFromStorage,
	addToStorage,
	updateStorage,
	removeFromStorage,
};
