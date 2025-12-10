import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method === 'PUT') {
    try {
      const body = await req.json();
      const { id, x, y } = body;

      const palabras = await kv.get('palabras') || [];
      const palabrasActualizadas = palabras.map(p => 
        p.id === id ? { ...p, x, y } : p
      );
      
      await kv.set('palabras', palabrasActualizadas);

      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    } catch (error) {
      console.error('Error actualizando posición:', error);
      return new Response(
        JSON.stringify({ error: 'Error actualizando posición' }),
        { status: 500, headers }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: 'Método no permitido' }),
    { status: 405, headers }
  );
}
