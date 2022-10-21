const db = require("./db.js");
db.run(
	`CREATE TABLE IF NOT EXISTS categorys (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT
	)`
);
db.run( //prices in cents!
	`CREATE TABLE IF NOT EXISTS products (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT,
		description TEXT,
		image TEXT,
		price INTEGER,
		salePrice INTEGER,
		stock INTEGER,
		categoryId INTEGER,
		FOREIGN KEY (categoryId) REFERENCES categorys(id)
	);`
);

//add product
async function add(title, description, image, price, salePrice, stock, categoryId) {
	let result = await db.run(
		`INSERT INTO products (title, description, image, price, salePrice, stock, categoryId)
		VALUES (?, ?, ?, ?, ?, ?, ?);`,
		[title, description, image, price, salePrice, stock, categoryId]
	);
}

//update product
async function update(id, title, description, image, price, salePrice, stock, categoryId) {
	let result = await db.run(
		`UPDATE products SET
			title = ?, 
			description = ?,
			image = ?,
			price = ?,
			salePrice = ?,
			stock = ?,
			categoryId = ?
		WHERE id = ?;`,
		[title, description, image, price, salePrice, stock, categoryId, id]
	);
}

//get single product
async function single(id) {
	return await db.get(`SELECT * FROM products WHERE id = ?`, [id]);
}

//list product
async function list(filter) {
	let where = ``;
	let params = [];
	if (typeof filter.category === "number") {
		where += ` categoryId = ?`;
		params.push(filter.category);
	}
	
	let list = await db.all(
		`SELECT * FROM products` + (params.length? ` WHERE${where}`: ``) + `;`,
		params
	);
	return list;
}

module.exports = {
	add,
	update,
	single,
	list,
};