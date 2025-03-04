import { createConnection } from '$lib/db/mysql.js'; 
import { BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD } from '$env/static/private';

async function authenticate(request) {
 
    const authHeader = request.headers.get('authorization');
   
    if (!authHeader){
        return new Response(null,{
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"'}
        });
   
    }
   
   
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(':');
   
   
    if (username !== BASIC_AUTH_USERNAME || password !== BASIC_AUTH_PASSWORD){
        return new Response (JSON.stringify({message:'Access denied'}), {
            status: 401,
            headers: {'Content-Type': 'application/json'},
        });
    }
    return null;
   
    }


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