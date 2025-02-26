import { createConnection } from '$lib/db/mysql.js'; 
 

export async function GET({ params }) {
    const { id } = params; 
   
    try {
        const connection = await createConnection(); 
        const [rows] = await connection.execute('SELECT * FROM albanian_beaches');
       
        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: 'beach not found' }), {
                status: 404,
                headers: { 'content-type': 'application/json' }
            });
        }
 
        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { 'content-type': 'application/json' }
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Database connection failed' }), {
            status: 500,
            headers: { 'content-type': 'application/json' }
        });
    }
}
 
export async function POST({ request }) {
 
    const connection = await createConnection();
    const data = await request.json();
   
    await connection.execute(
     'INSERT INTO albanian_beaches (name, location, type) VALUES (?, ?, ?)',
     [data.name, data.location, data.type]
    );
   
    await connection.end();
   
    return new Response(JSON.stringify(data), {
     status: 201,
     headers: { 'content-type': 'application/json' }
    });
}