import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function PoemasAnonimos() {
  const [poemas, setPoemas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoPoema, setNuevoPoema] = useState('');
  const [animarNuevo, setAnimarNuevo] = useState(null);

  // Cargar poemas del localStorage al iniciar
  useEffect(() => {
    const poemasGuardados = localStorage.getItem('poemas');
    if (poemasGuardados) {
      setPoemas(JSON.parse(poemasGuardados));
    }
  }, []);

  const publicarPoema = () => {
    if (nuevoPoema.trim() === '') return;

    const poema = {
      id: Date.now(),
      texto: nuevoPoema.trim(),
      fecha: new Date().toISOString()
    };

    const nuevosPoemas = [poema, ...poemas];
    setPoemas(nuevosPoemas);
    localStorage.setItem('poemas', JSON.stringify(nuevosPoemas));
    
    setNuevoPoema('');
    setModalAbierto(false);
    setAnimarNuevo(poema.id);
    
    setTimeout(() => setAnimarNuevo(null), 1000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Space Grotesk', sans-serif;
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .animate-fade-slide {
          animation: fadeSlideIn 0.6s ease-out;
        }

        .animate-nuevo {
          animation: fadeSlideIn 0.8s ease-out, pulse 0.5s ease-out;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .modal-backdrop {
          animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
          animation: scaleIn 0.3s ease-out;
        }

        .btn-hover {
          transition: all 0.3s ease;
        }

        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .btn-hover:active {
          transform: translateY(0);
        }

        .tarjeta-poema {
          transition: all 0.3s ease;
        }

        .tarjeta-poema:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
        }

        textarea:focus {
          outline: none;
          border-color: #2D3436;
        }

        ::selection {
          background-color: #DFE6E9;
          color: #2D3436;
        }
      `}</style>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pb-20">
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl md:text-7xl font-bold text-[#2D3436] mb-4 tracking-tight">
            Poemas Anónimos
          </h1>
          <p className="text-xl md:text-2xl text-[#636E72] mb-12 font-light">
            Escribí algo que necesites dejar salir.
          </p>
          <button
            onClick={() => setModalAbierto(true)}
            className="btn-hover bg-[#2D3436] text-white px-10 py-4 rounded-full text-lg font-medium shadow-lg"
          >
            Escribir un poema
          </button>
        </div>

        {/* Indicador scroll */}
        {poemas.length > 0 && (
          <div className="absolute bottom-8 animate-bounce">
            <svg 
              className="w-6 h-6 text-[#B2BEC3]" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div 
          className="modal-backdrop fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalAbierto(false);
          }}
        >
          <div className="modal-content bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative">
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-6 right-6 text-[#B2BEC3] hover:text-[#2D3436] transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-semibold text-[#2D3436] mb-6">
              Tu poema
            </h2>

            <textarea
              value={nuevoPoema}
              onChange={(e) => setNuevoPoema(e.target.value)}
              placeholder="Escribí lo que sientas..."
              className="w-full h-64 p-6 border-2 border-[#DFE6E9] rounded-2xl text-[#2D3436] text-lg resize-none focus:border-[#2D3436] transition-colors"
              autoFocus
            />

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setModalAbierto(false)}
                className="px-6 py-3 text-[#636E72] hover:text-[#2D3436] transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={publicarPoema}
                disabled={nuevoPoema.trim() === ''}
                className="btn-hover bg-[#2D3436] text-white px-8 py-3 rounded-full font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                Publicar poema
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Galería de Poemas */}
      {poemas.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-4xl font-semibold text-[#2D3436] mb-12 text-center">
            Voces anónimas
          </h2>
          
          <div className="space-y-6">
            {poemas.map((poema, index) => (
              <div
                key={poema.id}
                className={`tarjeta-poema bg-white p-8 rounded-2xl shadow-md border border-[#DFE6E9] ${
                  animarNuevo === poema.id ? 'animate-nuevo' : 'animate-fade-slide'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="text-[#2D3436] text-lg leading-relaxed whitespace-pre-wrap">
                  {poema.texto}
                </p>
                <div className="mt-6 pt-4 border-t border-[#DFE6E9]">
                  <p className="text-sm text-[#B2BEC3] font-light">
                    {new Date(poema.fecha).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-8 text-[#B2BEC3] text-sm">
        <p>Un espacio seguro para tus palabras</p>
      </footer>
    </div>
  );
}
