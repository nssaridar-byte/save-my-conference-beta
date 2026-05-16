
const { Client } = require('pg');
const client = new Client({ 
  connectionString: "postgresql://neondb_owner:npg_vbks0LztD9Vn@ep-cold-dust-ah5qnsx9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" 
});

async function run() {
  try {
    await client.connect();
    const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'File'");
    console.log("--- COLUMNS IN FILE TABLE ---");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

run();
