import React, { useEffect, useState } from 'react';
import api from './api/axios';
import { AxiosError } from 'axios';
import { ShoppingCart, Plus, Trash2, AlertCircle } from 'lucide-react';

interface Categoria {
  idCategoria: number;
  nombre: string;
}

interface Producto {
  idProducto: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria: Categoria;
}

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  // Estados de los inputs del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = async () => {
    try {
      const [resProductos, resCategorias] = await Promise.all([
        api.get('/productos'),
        api.get('/categorias'),
      ]);
      setProductos(resProductos.data);
      setCategorias(resCategorias.data);
      setError(null);
    } catch (err) {
      setError('No se pudieron sincronizar los datos con el servidor.');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const gestionarGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !precio || !stock || !idCategoria) {
      setError('Por favor llena todos los campos obligatorios y selecciona una categoría.');
      return;
    }

    try {
      await api.post('/productos', {
        nombre,
        descripcion: descripcion || undefined,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        idCategoria: parseInt(idCategoria),
      });
      
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setStock('');
      setIdCategoria('');
      setError(null);
      cargarDatos();
    } catch (err) {
      const errorDeAxios = err as AxiosError<{ message: string | string[] }>;
      const mensajeError = errorDeAxios.response?.data?.message;
      setError(Array.isArray(mensajeError) ? mensajeError[0] : mensajeError || 'Error al guardar el producto.');
    }
  };

  const gestionarEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await api.delete(`/productos/${id}`);
        cargarDatos();
      } catch (err) {
        setError('No se pudo eliminar el producto.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 border-b pb-4 border-gray-200">
        <ShoppingCart className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Inventario (Productos)</h2>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center space-x-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de registro */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Nuevo Producto</h3>
          <form onSubmit={gestionarGuardar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nombre del artículo</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Laptop HP 15"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Categoría Asociada</label>
              <select
                value={idCategoria}
                onChange={(e) => setIdCategoria(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              >
                <option value="">-- Selecciona una categoría --</option>
                {categorias.map((cat) => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Precio (Bs.)</label>
                <input
                  type="number"
                  step="0.01"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Stock Inicial</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Descripción (Opcional)</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Detalles técnicos o del producto..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar en Inventario</span>
            </button>
          </form>
        </div>

        {/* Tabla de Productos */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b border-gray-200">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400 italic">
                    No hay productos en inventario.
                  </td>
                </tr>
              ) : (
                productos.map((prod) => (
                  <tr key={prod.idProducto} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-900">{prod.nombre}</td>
                    <td className="px-4 py-4">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-semibold">
                        {prod.categoria?.nombre || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-gray-600">{Number(prod.precio).toFixed(2)} Bs.</td>
                    <td className="px-4 py-4">
                      <span className={`font-semibold ${prod.stock < 5 ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                        {prod.stock} u.
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => gestionarEliminar(prod.idProducto)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors"
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