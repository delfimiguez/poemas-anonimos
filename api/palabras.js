import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    if (req.method === 'GET') {
      // Obtener todas las palabras
      const palabras = await kv.get('palabras') || [];
      return new Response(JSON.stringify(palabras), { status: 200, headers });
    }

    if (req.method === 'POST') {
      // Agregar nueva palabra
      const body = await req.json();
      const { palabra } = body;

      if (!palabra || !palabra.texto) {
        return new Response(
          JSON.stringify({ error: 'Palabra inválida' }),
          { status: 400, headers }
        );
      }

      const palabras = await kv.get('palabras') || [];
      palabras.push(palabra);
      await kv.set('palabras', palabras);

      return new Response(JSON.stringify(palabra), { status: 201, headers });
    }

    if (req.method === 'DELETE') {
      // Eliminar una palabra
      const body = await req.json();
      const { id } = body;

      const palabras = await kv.get('palabras') || [];
      const nuevasPalabras = palabras.filter(p => p.id !== id);
      await kv.set('palabras', nuevasPalabras);

      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    return new Response(
      JSON.stringify({ error: 'Método no permitido' }),
      { status: 405, headers }
    );
  } catch (error) {
    console.error('Error en API:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers }
    );
  }
}
