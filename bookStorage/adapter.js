"use strict";

function adapt(item) {
	return {
		id: +item.id,
		name: item.name,
		author: item.author,
		genre: item.genre,
		year: +item.year,
	};
}

module.exports = { adapt };
