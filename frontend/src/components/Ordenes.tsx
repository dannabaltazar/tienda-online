import React, { useEffect, useState } from 'react';
import api from './api/axios';
import { AxiosError } from 'axios';
import { ClipboardList, Plus, Trash2, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';

interface Cliente {
  idCliente: number;
  nombres: string;
  paterno: string;
}

interface Producto {
  idProducto: number;
  nombre: string;
  precio: number;
  stock: number;
}

interface DetalleOrden {
  idProducto: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export default function Ordenes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  
  // Selección del maestro
  const [idCliente, setIdCliente] = useState('');
  
  // Selección temporal del detalle
  const [idProductoSel, setIdProductoSel] = useState('');
  const [cantidadSel, setCantidadSel] = useState('1');
  
  // Lista de productos agregados a la orden actual
  const [carrito, setCarrito] = useState<DetalleOrden[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  // Cargar clientes y productos disponibles
  const cargarDatos = async () => {
    try {
      const [resClientes, resProductos] = await Promise.all([
        api.get('/clientes'),
        api.get('/productos')
      ]);
      setClientes(resClientes.data);
      setProductos(resProductos.data);
    } catch (err) {
      setError('No se pudieron cargar los datos necesarios del servidor.');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Agregar un producto al carrito local
  const agregarAlCarrito = () => {
    if (!idProductoSel || !cantidadSel) {
      setError('Selecciona un producto y una cantidad válida.');
      return;
    }

    const productoOriginal = productos.find(p => p.idProducto === parseInt(idProductoSel));
    if (!productoOriginal) return;

    const cantidad = parseInt(cantidadSel);

    if (cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0.');
      return;
    }

    if (cantidad > productoOriginal.stock) {
      setError(`Stock insuficiente. Solo quedan ${productoOriginal.stock} unidades.`);
      return;
    }

    // Verificar si ya está en el carrito para sumar cantidad
    const existe = carrito.find(item => item.idProducto === productoOriginal.idProducto);
    if (existe) {
      const nuevaCantidad = existe.cantidad + cantidad;
      if (nuevaCantidad > productoOriginal.stock) {
        setError(`No puedes agregar más. Supera el stock de ${productoOriginal.stock} unidades.`);
        return;
      }
      setCarrito(carrito.map(item => 
        item.idProducto === productoOriginal.idProducto 
          ? { ...item, cantidad: nuevaCantidad } 
          : item
      ));
    } else {
      setCarrito([...carrito, {
        idProducto: productoOriginal.idProducto,
        nombre: productoOriginal.nombre,
        precio: Number(productoOriginal.precio),
        cantidad
      }]);
    }

    setError(null);
    setIdProductoSel('');
    setCantidadSel('1');
  };

  // Quitar artículo del carrito
  const eliminarDelCarrito = (id: number) => {
    setCarrito(carrito.filter(item => item.idProducto !== id));
  };

  // Calcular el gran total de la venta
  const calcularTotal = () => {
    return carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  };

  // Enviar la orden completa al Backend
  const guardarOrden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idCliente) {
      setError('Debes seleccionar un cliente para la orden.');
      return;
    }
    if (carrito.length === 0) {
      setError('El carrito debe tener al menos un producto.');
      return;
    }

    try {
      // Estructuramos el DTO tal como lo espera tu backend en NestJS
      const payload = {
        idCliente: parseInt(idCliente),
        productos: carrito.map(item => ({
          idProducto: item.idProducto,
          cantidad: item.cantidad
        }))
      };

      await api.post('/ordenes', payload);
      
      setExito('¡Orden de venta registrada con éxito!');
      setError(null);
      setCarrito([]);
      setIdCliente('');
      cargarDatos(); // Recargar productos para actualizar los stocks en la lista
    } catch (err) {
      const errorDeAxios = err as AxiosError<{ message: string | string[] }>;
      const mensajeError = errorDeAxios.response?.data?.message;
      setError(Array.isArray(mensajeError) ? mensajeError[0] : mensajeError || 'Error al procesar la orden.');
      setExito(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 border-b pb-4 border-gray-200">
        <ClipboardList className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Nueva Orden de Venta</h2>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center space-x-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {exito && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-center space-x-2 text-green-700">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{exito}</span>
        </div>
      )}

      <form onSubmit={guardarOrden} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: Selección de Cliente y Selector de Artículos */}
        <div className="space-y-6 lg:col-span-1">
          {/* Tarjeta Cliente */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">1. Seleccionar Cliente</h3>
            <select
              value={idCliente}
              onChange={(e) => setIdCliente(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value="">-- Selecciona un cliente --</option>
              {clientes.map(cli => (
                <option key={cli.idCliente} value={cli.idCliente}>
                  {cli.nombres} {cli.paterno}
                </option>
              ))}
            </select>
          </div>

          {/* Tarjeta Añadir Producto */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">2. Agregar Productos</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Producto</label>
                <select
                  value={idProductoSel}
                  onChange={(e) => setIdProductoSel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                >
                  <option value="">-- Selecciona un artículo --</option>
                  {productos.map(prod => (
                    <option key={prod.idProducto} value={prod.idProducto} disabled={prod.stock <= 0}>
                      {prod.nombre} ({Number(prod.precio).toFixed(2)} Bs.) — Stock: {prod.stock}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={cantidadSel}
                  onChange={(e) => setCantidadSel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <button
                type="button"
                onClick={agregarAlCarrito}
                className="w-full flex items-center justify-center space-x-1 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Añadir a la Lista</span>
              </button>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Detalle y confirmación del carrito */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">3. Detalle de la Orden</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b border-gray-200">
                    <th className="px-4 py-3">Descripción</th>
                    <th className="px-4 py-3 text-right">Precio</th>
                    <th className="px-4 py-3 text-center">Cantidad</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                    <th className="px-4 py-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                  {carrito.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400 italic">
                        No has añadido productos a la orden todavía.
                      </td>
                    </tr>
                  ) : (
                    carrito.map(item => (
                      <tr key={item.idProducto} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 font-medium text-gray-900">{item.nombre}</td>
                        <td className="px-4 py-4 text-right font-mono">{item.precio.toFixed(2)} Bs.</td>
                        <td className="px-4 py-4 text-center font-semibold">{item.cantidad}</td>
                        <td className="px-4 py-4 text-right font-mono font-semibold text-indigo-600">
                          {(item.precio * item.cantidad).toFixed(2)} Bs.
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => eliminarDelCarrito(item.idProducto)}
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

          {/* Pie de la tarjeta con el total y botón de Guardar */}
          <div className="bg-gray-50 p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <span className="text-sm text-gray-500 block">Total a Pagar</span>
              <span className="text-2xl font-black text-gray-900 font-mono">
                {calcularTotal().toFixed(2)} Bs.
              </span>
            </div>
            
            <button
              type="submit"
              disabled={carrito.length === 0}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 font-semibold py-3 px-8 rounded-md transition-colors text-sm shadow-md ${
                carrito.length === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Procesar y Guardar Venta</span>
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}