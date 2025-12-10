import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

// Detectar si estamos en desarrollo o producción
const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? null  // No usar API en localhost
  : '/api';

export default function App() {
  const [palabras, setPalabras] = useState([]);
  const [nuevaPalabra, setNuevaPalabra] = useState('');
  const [palabraArrastrada, setPalabraArrastrada] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [cargando, setCargando] = useState(true);
  const [usandoLocalStorage, setUsandoLocalStorage] = useState(false);
  const containerRef = useRef(null);
  const intervaloRef = useRef(null);

  // Cargar palabras de la API al iniciar
  useEffect(() => {
    cargarPalabras();
    
    // Solo hacer polling si hay API disponible
    if (API_URL) {
      intervaloRef.current = setInterval(cargarPalabras, 3000);
    }
    
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, []);

  const cargarPalabras = async () => {
    // Si no hay API (desarrollo local), usar localStorage
    if (!API_URL) {
      const local = localStorage.getItem('palabrasImanes');
      if (local) {
        try {
          setPalabras(JSON.parse(local));
        } catch (e) {
          setPalabras([]);
        }
      }
      setUsandoLocalStorage(true);
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/palabras`);
      if (response.ok) {
        const data = await response.json();
        setPalabras(data);
        localStorage.setItem('palabrasImanes', JSON.stringify(data));
      } else {
        throw new Error('API no disponible');
      }
    } catch (error) {
      console.log('Usando localStorage (API no disponible)');
      setUsandoLocalStorage(true);
      const local = localStorage.getItem('palabrasImanes');
      if (local) {
        try {
          setPalabras(JSON.parse(local));
        } catch (e) {
          setPalabras([]);
        }
      }
    } finally {
      setCargando(false);
    }
  };

  const agregarPalabra = async () => {
    if (nuevaPalabra.trim() === '') return;
    
    const randomX = Math.random() * (window.innerWidth - 200) + 50;
    const randomY = Math.random() * (window.innerHeight - 400) + 200;

    const palabra = {
      id: Date.now() + Math.random(),
      texto: nuevaPalabra.trim(),
      x: randomX,
      y: randomY,
      creador: 'anonimo',
      fecha: new Date().toISOString()
    };

    // Si estamos usando localStorage, agregar directamente
    if (!API_URL || usandoLocalStorage) {
      const nuevasPalabras = [...palabras, palabra];
      setPalabras(nuevasPalabras);
      localStorage.setItem('palabrasImanes', JSON.stringify(nuevasPalabras));
      setNuevaPalabra('');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/palabras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ palabra })
      });

      if (response.ok) {
        setNuevaPalabra('');
        await cargarPalabras();
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      console.log('Guardando localmente...');
      const nuevasPalabras = [...palabras, palabra];
      setPalabras(nuevasPalabras);
      localStorage.setItem('palabrasImanes', JSON.stringify(nuevasPalabras));
      setNuevaPalabra('');
      setUsandoLocalStorage(true);
    }
  };

  const eliminarPalabra = async (id) => {
    // Si estamos usando localStorage, eliminar directamente
    if (!API_URL || usandoLocalStorage) {
      const nuevasPalabras = palabras.filter(p => p.id !== id);
      setPalabras(nuevasPalabras);
      localStorage.setItem('palabrasImanes', JSON.stringify(nuevasPalabras));
      return;
    }

    try {
      const response = await fetch(`${API_URL}/palabras`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        await cargarPalabras();
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      console.log('Eliminando localmente...');
      const nuevasPalabras = palabras.filter(p => p.id !== id);
      setPalabras(nuevasPalabras);
      localStorage.setItem('palabrasImanes', JSON.stringify(nuevasPalabras));
      setUsandoLocalStorage(true);
    }
  };

  const limpiarTodo = async () => {
    if (window.confirm('¿Seguro que querés borrar todas las palabras?')) {
      // Si estamos usando localStorage, limpiar directamente
      if (!API_URL || usandoLocalStorage) {
        setPalabras([]);
        localStorage.removeItem('palabrasImanes');
        return;
      }

      try {
        for (const palabra of palabras) {
          await fetch(`${API_URL}/palabras`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: palabra.id })
          });
        }
        await cargarPalabras();
      } catch (error) {
        console.log('Limpiando localmente...');
        setPalabras([]);
        localStorage.removeItem('palabrasImanes');
        setUsandoLocalStorage(true);
      }
    }
  };

  const handleMouseDown = (e, palabra) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setPalabraArrastrada(palabra);
  };

  const handleMouseMove = (e) => {
    if (!palabraArrastrada) return;
    
    let newX = e.clientX - offset.x;
    let newY = e.clientY - offset.y;

    // Limitar a los bordes de la ventana
    newX = Math.max(0, Math.min(newX, window.innerWidth - 200));
    newY = Math.max(0, Math.min(newY, window.innerHeight - 100));

    // Actualizar el estado local inmediatamente
    setPalabras(prevPalabras => prevPalabras.map(p => 
      p.id === palabraArrastrada.id 
        ? { ...p, x: newX, y: newY }
        : p
    ));

    // Actualizar la referencia de la palabra arrastrada
    setPalabraArrastrada(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = async () => {
    if (palabraArrastrada) {
      // Si estamos usando localStorage, guardar directamente
      if (!API_URL || usandoLocalStorage) {
        localStorage.setItem('palabrasImanes', JSON.stringify(palabras));
        setPalabraArrastrada(null);
        return;
      }

      // Actualizar posición en el servidor
      try {
        await fetch(`${API_URL}/actualizar-posicion`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: palabraArrastrada.id,
            x: palabraArrastrada.x,
            y: palabraArrastrada.y
          })
        });
      } catch (error) {
        console.log('Guardando posición localmente...');
        localStorage.setItem('palabrasImanes', JSON.stringify(palabras));
      }
      setPalabraArrastrada(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      agregarPalabra();
    }
  };

  useEffect(() => {
    if (palabraArrastrada) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [palabraArrastrada, offset, palabras]);

  return (
    <div ref={containerRef} className="min-h-screen bg-white font-sans overflow-hidden lined-background relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Space Grotesk', sans-serif;
        }

        .lined-background {
          background-image: repeating-linear-gradient(
            transparent,
            transparent 14.5px,
            #000000 14.5px,
            #000000 15px
          );
          background-size: 100% 15px;
        }

        .palabra-iman {
          cursor: grab;
          transition: transform 0.15s ease;
          user-select: none;
        }

        .palabra-iman:hover {
          transform: scale(1.05);
        }

        .palabra-iman:active {
          cursor: grabbing;
          transform: scale(1.08);
        }

        ::selection {
          background-color: #FFF59D;
          color: #000;
        }
      `}</style>

      {/* Loading state */}
      {cargando && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="text-center">
            <div className="text-2xl mb-2">📝</div>
            <p className="text-gray-600">Cargando poemas...</p>
          </div>
        </div>
      )}

      {/* Caja centrada en el medio */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="border-2 border-black p-8 bg-white">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-black mb-2">
              Poemas Imanes
            </h1>
            <p className="text-base text-gray-600 mb-2">
              Arrastrá las palabras para crear tu poema
            </p>
            {usandoLocalStorage && (
              <p className="text-xs text-orange-600 mb-4">
                💾 Modo local - Los cambios solo se ven en este dispositivo
              </p>
            )}

            {/* Input para agregar palabras */}
            <div className="flex gap-3 items-center justify-center">
              <input
                type="text"
                value={nuevaPalabra}
                onChange={(e) => setNuevaPalabra(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribí una palabra..."
                className="bg-white text-black px-4 py-2 border-2 border-black text-base font-medium focus:outline-none w-64"
                autoFocus
              />
              <button
                onClick={agregarPalabra}
                disabled={nuevaPalabra.trim() === ''}
                className="bg-black hover:bg-gray-800 text-white px-5 py-2 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus size={18} />
                Agregar
              </button>
              
              {palabras.length > 0 && (
                <button
                  onClick={limpiarTodo}
                  className="bg-white hover:bg-gray-100 text-black border-2 border-black p-2 transition-colors"
                  title="Limpiar todo"
                >
                  <RotateCcw size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Palabras arrastrables */}
      {palabras.map((palabra) => (
        <div
          key={palabra.id}
          className="palabra-iman fixed bg-white border-2 border-black px-4 py-2"
          style={{
            left: `${palabra.x}px`,
            top: `${palabra.y}px`,
            zIndex: palabraArrastrada?.id === palabra.id ? 1000 : 10,
          }}
          onMouseDown={(e) => handleMouseDown(e, palabra)}
        >
          <div className="flex items-center gap-2">
            <span className="text-black text-base font-semibold select-none">
              {palabra.texto}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                eliminarPalabra(palabra.id);
              }}
              className="text-gray-500 hover:text-black transition-colors"
              title="Eliminar palabra"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
