import React, { useEffect, useState } from 'react';
import api from './api/axios';
import { AxiosError } from 'axios';
import { Users, Plus, Trash2, AlertCircle } from 'lucide-react';


interface Cliente {
  idCliente: number;
  nombres: string;
  paterno: string;
  materno?: string;
  email: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nombres, setNombres] = useState('');
  const [paterno, setPaterno] = useState('');
  const [materno, setMaterno] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const cargarClientes = async () => {
    try {
      const respuesta = await api.get('/clientes');
      setClientes(respuesta.data);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los clientes del servidor.');
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const gestionarGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombres.trim() || !paterno.trim() || !email.trim()) {
      setError('Los nombres, apellido paterno y email son obligatorios.');
      return;
    }

    try {
      await api.post('/clientes', { nombres, paterno, materno: materno || undefined, email });
      setNombres('');
      setPaterno('');
      setMaterno('');
      setEmail('');
      setError(null);
      cargarClientes();
    } catch (err) {
      const errorDeAxios = err as AxiosError<{ message: string | string[] }>;
      const mensajeError = errorDeAxios.response?.data?.message;
      setError(Array.isArray(mensajeError) ? mensajeError[0] : mensajeError || 'Error al registrar el cliente.');
    }
  };

  const gestionarEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await api.delete(`/clientes/${id}`);
        cargarClientes();
      } catch (err) {
        setError('No se pudo eliminar al cliente seleccionado.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 border-b pb-4 border-gray-200">
        <Users className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h2>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center space-x-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Nuevo Cliente</h3>
          <form onSubmit={gestionarGuardar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nombres</label>
              <input
                type="text"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                placeholder="Ej. Juan Carlos"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Apellido Paterno</label>
              <input
                type="text"
                value={paterno}
                onChange={(e) => setPaterno(e.target.value)}
                placeholder="Ej. Pérez"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Apellido Materno (Opcional)</label>
              <input
                type="text"
                value={materno}
                onChange={(e) => setMaterno(e.target.value)}
                placeholder="Ej. Mamani"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Cliente</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b border-gray-200">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400 italic">
                    No hay clientes registrados.
                  </td>
                </tr>
              ) : (
                clientes.map((cli) => (
                  <tr key={cli.idCliente} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-gray-500">#{cli.idCliente}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {cli.nombres} {cli.paterno} {cli.materno || ''}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{cli.email}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => gestionarEliminar(cli.idCliente)}
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