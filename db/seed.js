const { client, getAllUsers, createUser } = require("./index");
const users = [
  {
    username: "albert",
    password: "bertie99",
    name:'al',
    location:'SD'
  },
  {
    username: "sandra",
    password: "2sandy4me",
    name:'sandra',
    location:'Denver'
  },{
    username:'glamgal',
    password:'soglam',
    name:'Gee',
    location:'San Fransisco'
  }
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
];

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
    await Promise.all(tablesToDrop.map(dropTable));
    console.log("Finished dropping tables!");
  } catch (error) {
    throw Error(`error while dropping tables: ${error.message}`); // we pass the error up to the function that calls dropTables
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
  } catch (error) {
    console.error(error);
  }
}

const testDB = async () => {
  try {
    // client.connect();
    const rows = await getAllUsers();

    console.log(rows);
  } catch (error) {
    console.error(error);
  }
};

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
