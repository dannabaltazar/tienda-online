import React, { useEffect, useState } from 'react';
import api from './api/axios';
import { AxiosError } from 'axios';
import { Layers, Plus, Trash2, AlertCircle } from 'lucide-react';

// Definimos la estructura de datos para TypeScript
interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion?: string;
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 1. Cargar las categorías desde el backend al montar el componente
  const cargarCategorias = async () => {
    try {
      const respuesta = await api.get('/categorias');
      setCategorias(respuesta.data);
      setError(null);
    } catch (err: any) {
      setError('No se pudieron cargar las categorías del servidor.');
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // 2. Manejar el envío del formulario (Crear Categoría)
const gestionarGuardar = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!nombre.trim()) {
    setError('El nombre de la categoría es obligatorio.');
    return;
  }

  try {
    await api.post('/categorias', { nombre, descripcion });
    setNombre('');
    setDescripcion('');
    setError(null);
    cargarCategorias(); // Recargar la lista automáticamente
  } catch (err) {
      // Capturamos el mensaje descriptivo enviado por el ValidationPipe de NestJS
      const errorDeAxios = err as AxiosError<{ message: string | string[] }>;
      const mensajeError = errorDeAxios.response?.data?.message;
      setError(
      Array.isArray(mensajeError) 
        ? mensajeError[0] 
        : mensajeError || 'Error al crear la categoría.'
    );
    }
  };

  // 3. Manejar la eliminación (Soft Delete)
  const gestionarEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await api.delete(`/categorias/${id}`);
        cargarCategorias();
      } catch (err: any) {
        setError('No se pudo eliminar la categoría seleccionada.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center space-x-2 border-b pb-4 border-gray-200">
        <Layers className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Categorías</h2>
      </div>

      {/* Alerta de Errores */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center space-x-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Registro */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Nueva Categoría</h3>
          <form onSubmit={gestionarGuardar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Electrónica, Ropa, Hogar"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Descripción (Opcional)</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Breve descripción de los productos..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Categoría</span>
            </button>
          </form>
        </div>

        {/* Tabla / Lista de Categorías */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b border-gray-200">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Descripción</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400 italic">
                    No hay categorías registradas en el sistema.
                  </td>
                </tr>
              ) : (
                categorias.map((cat) => (
                  <tr key={cat.idCategoria} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-gray-500">#{cat.idCategoria}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{cat.nombre}</td>
                    <td className="px-6 py-4 text-gray-500">{cat.descripcion || <span className="italic text-gray-300">Sin descripción</span>}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => gestionarEliminar(cat.idCategoria)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors"
                        title="Eliminar categoría"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}