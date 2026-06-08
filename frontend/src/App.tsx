import React, { useState } from 'react';
import { Layers, Users, ShoppingCart, ClipboardList } from 'lucide-react';
import Categorias from './components/Categorias.tsx';
import Clientes from './components/Clientes.tsx';
import Productos from './components/Productos.tsx';
import Ordenes from './components/Ordenes.tsx'; // 1. Nuevo componente importado

type Pestana = 'categorias' | 'clientes' | 'productos' | 'ordenes';

export default function App() {
  const [pestanaActiva, setPestanaActiva] = useState<Pestana>('categorias');

  // Función para renderizar dinámicamente el componente según la pestaña activa
  const renderizarContenido = () => {
    switch (pestanaActiva) {
      case 'categorias':
        return <Categorias />;
      case 'clientes':
        return <Clientes />;
      case 'productos':
        return <Productos />;
      case 'ordenes':
        return <Ordenes />; // 3. Componente renderizado cuando la pestaña está activa
      default:
        return <Categorias />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans antialiased">
      {/* BARRA DE NAVEGACIÓN SUPERIOR (NAVBAR) */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo o Título de la app */}
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-md">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">
                Tienda<span className="text-indigo-600">Online</span>
              </span>
            </div>

            {/* Menú de pestañas */}
            <nav className="flex space-x-1 sm:space-x-2">
              {/* Botón Categorías */}
              <button
                onClick={() => setPestanaActiva('categorias')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  pestanaActiva === 'categorias'
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Categorías</span>
              </button>

              {/* Botón Clientes */}
              <button
                onClick={() => setPestanaActiva('clientes')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  pestanaActiva === 'clientes'
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Clientes</span>
              </button>

              {/* Botón Productos */}
              <button
                onClick={() => setPestanaActiva('productos')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  pestanaActiva === 'productos'
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Productos</span>
              </button>

              {/* 2. Botón/Pestaña de Órdenes Agregado */}
              <button
                onClick={() => setPestanaActiva('ordenes')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  pestanaActiva === 'ordenes'
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Órdenes (Ventas)</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="animate-fade-in">
          {renderizarContenido()}
        </div>
      </main>

      {/* PIE DE PÁGINA SIMPLE */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-400 mt-auto">
        &copy; {new Date().getFullYear()} Sistema de Gestión Tienda Online. Todos los derechos reservados.
      </footer>
    </div>
  );
}