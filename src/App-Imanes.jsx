import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

export default function PoemasImanes() {
  const [palabras, setPalabras] = useState([]);
  const [nuevaPalabra, setNuevaPalabra] = useState('');
  const [palabraArrastrada, setPalabraArrastrada] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Cargar palabras del localStorage al iniciar
  useEffect(() => {
    const palabrasGuardadas = localStorage.getItem('palabrasImanes');
    if (palabrasGuardadas) {
      setPalabras(JSON.parse(palabrasGuardadas));
    }
  }, []);

  // Guardar en localStorage cada vez que cambian las palabras
  useEffect(() => {
    if (palabras.length > 0) {
      localStorage.setItem('palabrasImanes', JSON.stringify(palabras));
    }
  }, [palabras]);

  const agregarPalabra = () => {
    if (nuevaPalabra.trim() === '') return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Posición aleatoria inicial en la parte superior
    const randomX = Math.random() * (containerRect.width - 150) + 50;
    const randomY = Math.random() * 200 + 100;

    const palabra = {
      id: Date.now() + Math.random(),
      texto: nuevaPalabra.trim(),
      x: randomX,
      y: randomY,
      creador: 'yo', // En una versión con backend, esto sería el user ID
      fecha: new Date().toISOString()
    };

    setPalabras([...palabras, palabra]);
    setNuevaPalabra('');
  };

  const eliminarPalabra = (id) => {
    setPalabras(palabras.filter(p => p.id !== id));
  };

  const limpiarTodo = () => {
    if (window.confirm('¿Seguro que querés borrar todas las palabras?')) {
      setPalabras([]);
      localStorage.removeItem('palabrasImanes');
    }
  };

  const handleMouseDown = (e, palabra) => {
    // Solo permitir arrastrar si es el creador (en esta versión todos son creadores)
    const rect = e.currentTarget.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setPalabraArrastrada(palabra);
  };

  const handleMouseMove = (e) => {
    if (!palabraArrastrada) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    let newX = e.clientX - containerRect.left - offset.x;
    let newY = e.clientY - containerRect.top - offset.y;

    // Limitar a los bordes del contenedor
    newX = Math.max(0, Math.min(newX, containerRect.width - 150));
    newY = Math.max(0, Math.min(newY, containerRect.height - 50));

    setPalabras(palabras.map(p => 
      p.id === palabraArrastrada.id 
        ? { ...p, x: newX, y: newY }
        : p
    ));
  };

  const handleMouseUp = () => {
    setPalabraArrastrada(null);
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
  }, [palabraArrastrada, offset]);

  return (
    <div className="min-h-screen bg-[#2D3436] font-sans overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Space Grotesk', sans-serif;
        }

        .palabra-iman {
          cursor: grab;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          user-select: none;
        }

        .palabra-iman:hover {
          transform: scale(1.05);
          z-index: 100;
        }

        .palabra-iman:active {
          cursor: grabbing;
          transform: scale(1.08);
          z-index: 1000;
        }

        .input-container {
          backdrop-filter: blur(10px);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        ::selection {
          background-color: #74B9FF;
          color: #2D3436;
        }
      `}</style>

      {/* Header / Input Area */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#2D3436] to-transparent p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
              Poemas Imanes
            </h1>
            <p className="text-lg text-[#B2BEC3]">
              Arrastrá las palabras para crear tu poema
            </p>
          </div>

          {/* Input para agregar palabras */}
          <div className="flex gap-3 items-center justify-center input-container bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20">
            <input
              type="text"
              value={nuevaPalabra}
              onChange={(e) => setNuevaPalabra(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribí una palabra..."
              className="flex-1 bg-white text-[#2D3436] px-5 py-3 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#74B9FF] max-w-md"
              autoFocus
            />
            <button
              onClick={agregarPalabra}
              disabled={nuevaPalabra.trim() === ''}
              className="bg-[#74B9FF] hover:bg-[#5FA3E8] text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              Agregar
            </button>
            
            {palabras.length > 0 && (
              <button
                onClick={limpiarTodo}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-3 rounded-xl transition-all border border-red-500/30"
                title="Limpiar todo"
              >
                <RotateCcw size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Canvas / Fridge Area */}
      <div 
        ref={containerRef}
        className="w-full min-h-screen pt-48 pb-20 relative"
        style={{ cursor: palabraArrastrada ? 'grabbing' : 'default' }}
      >
        {palabras.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center float-animation">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-[#B2BEC3] text-xl font-light">
                Empezá a agregar palabras para crear tu poema
              </p>
            </div>
          </div>
        )}

        {palabras.map((palabra) => (
          <div
            key={palabra.id}
            className="palabra-iman absolute bg-white rounded-lg shadow-xl px-5 py-3 border-2 border-[#DFE6E9]"
            style={{
              left: `${palabra.x}px`,
              top: `${palabra.y}px`,
              zIndex: palabraArrastrada?.id === palabra.id ? 1000 : 1,
            }}
            onMouseDown={(e) => handleMouseDown(e, palabra)}
          >
            <div className="flex items-center gap-2">
              <span className="text-[#2D3436] text-lg font-semibold select-none">
                {palabra.texto}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  eliminarPalabra(palabra.id);
                }}
                className="text-[#B2BEC3] hover:text-red-500 transition-colors p-1"
                title="Eliminar palabra"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#2D3436] to-transparent p-4">
        <div className="text-center">
          <p className="text-[#B2BEC3] text-sm">
            {palabras.length} {palabras.length === 1 ? 'palabra' : 'palabras'} en tu poema
          </p>
        </div>
      </div>
    </div>
  );
}
