const {
	client,
	getAllUsers,
	createUser,
	updateUser,
	createPost,
	updatePost,
	getAllPosts,
	getUserById,
	getPostsByUser
} = require("./index");
const users = [
	{
		username: "albert",
		password: "bertie99",
		name: "al",
		location: "SD",
	},
	{
		username: "sandra",
		password: "2sandy4me",
		name: "sandra",
		location: "Denver",
	},
	{
		username: "glamgal",
		password: "soglam",
		name: "Gee",
		location: "San Fransisco",
	},
];
const tables = [
	{
		name: "users",
		columns: `id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true`,
	},
	{
		name: "posts",
		columns: `id SERIAL PRIMARY KEY,
    "authorId" INTEGER REFERENCES users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content text NOT NULL,
    active BOOLEAN DEFAULT true`,
	},
];

async function createInitialPosts() {
	try {
		const [albert, sandra, glamgal] = await getAllUsers();
		await createPost({
			authorId: albert.id,
			title: "First Post",
			content:
				"This is my first post. I hope I love writing blogs as much as I love writing them.",
		});

		// a couple more
	} catch (error) {
		throw error;
	}
}

const createInitialUsers = async (users) => {
	try {
		console.log("STARTED inserting users...");
		await Promise.all(users.map(createUser));
	} catch (error) {
		throw error;
	} finally {
		console.log("FINISHED inserting users");
	}
};

async function dropTable(table) {
	console.log(`dropping table ${table.name}`);
	await client.query(`
        DROP TABLE IF EXISTS ${table.name};
    `);
	console.log(`table ${table.name} has been dropped`);
}
async function dropTables(tablesToDrop) {
	console.log("Starting to drop tables...");
	try {
		await Promise.all(tablesToDrop.reverse().map(dropTable));
		tablesToDrop.reverse();
		console.log("Finished dropping tables!");
	} catch (error) {
		throw Error(`error while dropping tables: ${error.message}`); 
	}
}

// this function should call a query which creates all tables for our database
async function createTable(table) {
	await client.query(`
        CREATE TABLE ${table.name} (${table.columns});
    `);
	console.log(`table ${table.name} has been created`);
}
async function createTables(tablesToCreate) {
	console.log("Starting to create tables...");
	try {
		await Promise.all(tablesToCreate.map(createTable));
		console.log("Finished creating tables!");
	} catch (error) {
		throw Error(`error while creating tables: ${error.message}`); // we pass the error up to the function that calls dropTables
	}
}

async function rebuildDB() {
	try {
		client.connect();		
		await dropTables(tables);
		await createTables(tables);
		await createInitialUsers(users);
		await createInitialPosts();
	} catch (error) {
		console.error(error);
	}
}

const testDB = async () => {
	try {
		console.log("testing database...");
		const rows = await getAllUsers();
		console.log("rows:", rows);
		console.log("updating user 0");
		const updateUserResult = await updateUser(rows[0].id, {
			name: "newname Sogood",
			location: "Lesterville, KY",
		});
		console.log("Updated user:", updateUserResult);
		console.log("finished updating");
		const newRows = await getAllUsers();
		console.log("new rows:", newRows);
		console.log("Calling getAllPosts");
		const posts = await getAllPosts();
		console.log("Result:", posts);

		console.log("Calling updatePost on posts[0]");
		const updatePostResult = await updatePost(posts[0].id, {
		title: "New Title",
		content: "Updated Content"
		});
		console.log("Result:", updatePostResult);

		console.log("Calling getUserById with 1");
		const albert = await getUserById(1);
		console.log("Result:", albert);

		console.log("Finished database tests!");
	}  catch (error) {
		console.error(error);
	}
};

rebuildDB()
	.then(testDB)
	.catch(console.error)
	.finally(() => client.end());
