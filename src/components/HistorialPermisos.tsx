import React, { useState } from 'react';
import type { SolicitudPermiso, EstadoPermiso } from '../types';

interface Props {
  solicitudes: SolicitudPermiso[];
  onCambiarEstado: (id: string, nuevoEstado: EstadoPermiso) => void;
  onEliminar: (id: string) => void;
  onVerComprobante: (solicitud: SolicitudPermiso) => void;
  rolUsuario?: string;
}

export const HistorialPermisos: React.FC<Props> = ({
  solicitudes,
  onCambiarEstado,
  onEliminar,
  onVerComprobante,
  rolUsuario = '',
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [filtroMotivo, setFiltroMotivo] = useState<string>('TODOS');
  const [filtroAnio, setFiltroAnio] = useState<string>('TODOS');
  const [filtroMes, setFiltroMes] = useState<string>('TODOS');

  const rolLimpio = rolUsuario.toLowerCase();
  const esVisualizador = rolLimpio === 'visualizador';
  const esDigitador = rolLimpio === 'digitador';
  const puedeEliminar = rolLimpio === 'admin' || rolLimpio === 'superadmin';

  // Función radical para asegurar que si viene concatenado con guion, se corte y se quede SOLO con el motivo
  const obtenerMotivoCorto = (motivoCompleto: string) => {
    if (!motivoCompleto) return 'N/A';
    // Si viene con formato "Conciliación - observación", extrae estrictamente la primera parte antes del guion
    const partes = motivoCompleto.split(/[-–—]/);
    return partes[0].trim();
  };

  const motivosDisponibles = Array.from(
    new Set(solicitudes.map((sol) => obtenerMotivoCorto(sol.motivo)))
  ).filter(Boolean);

  const aniosDisponibles = Array.from(
    new Set(solicitudes.map((sol) => {
      if (!sol.fechaInicio) return '';
      return new Date(sol.fechaInicio).getFullYear().toString();
    }))
  ).filter(Boolean).sort((a, b) => b.localeCompare(a));

  const mesesDisponibles = [
    { id: '01', nombre: 'Enero' },
    { id: '02', nombre: 'Febrero' },
    { id: '03', nombre: 'Marzo' },
    { id: '04', nombre: 'Abril' },
    { id: '05', nombre: 'Mayo' },
    { id: '06', nombre: 'Junio' },
    { id: '07', nombre: 'Julio' },
    { id: '08', nombre: 'Agosto' },
    { id: '09', nombre: 'Septiembre' },
    { id: '10', nombre: 'Octubre' },
    { id: '11', nombre: 'Noviembre' },
    { id: '12', nombre: 'Diciembre' },
  ];

  const solicitudesFiltradas = solicitudes.filter((sol) => {
    const coincideTexto =
      sol.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      sol.nombreTrabajador.toLowerCase().includes(busqueda.toLowerCase()) ||
      sol.rut.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado = filtroEstado === 'TODOS' || sol.estado === filtroEstado;
    const motivoCorto = obtenerMotivoCorto(sol.motivo);
    const coincideMotivo = filtroMotivo === 'TODOS' || motivoCorto.toLowerCase().includes(filtroMotivo.toLowerCase());

    let coincideAnio = true;
    let coincideMes = true;

    if (sol.fechaInicio) {
      const fechaSol = new Date(sol.fechaInicio);
      const anioSol = fechaSol.getFullYear().toString();
      const mesSol = String(fechaSol.getMonth() + 1).padStart(2, '0');

      if (filtroAnio !== 'TODOS' && anioSol !== filtroAnio) coincideAnio = false;
      if (filtroMes !== 'TODOS' && mesSol !== filtroMes) coincideMes = false;
    } else {
      if (filtroAnio !== 'TODOS' || filtroMes !== 'TODOS') {
        coincideAnio = false;
        coincideMes = false;
      }
    }

    return coincideTexto && coincideEstado && coincideMotivo && coincideAnio && coincideMes;
  });

  const totalHorasAprobadas = solicitudesFiltradas
    .filter((sol) => sol.estado === 'Aprobado')
    .reduce((acc, sol) => {
      const texto = sol.cantidadHoras.toLowerCase();
      if (texto.includes('días') || texto.includes('dia') || texto.includes('día')) {
        const diasNum = parseFloat(texto.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;
        return acc + (diasNum * 8.5);
      } else if (texto.includes('hrs')) {
        const horasNum = parseFloat(texto.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;
        return acc + horasNum;
      }
      return acc;
    }, 0);

  const handleEliminarClick = (sol: SolicitudPermiso) => {
    if (!puedeEliminar) return;
    const targetId = (sol as any).firebaseId || sol.id;
    if (window.confirm(`¿Estás seguro de que deseas eliminar la solicitud #${sol.id}?`)) {
      onEliminar(targetId);
    }
  };

  const handleCambiarEstadoClick = (sol: SolicitudPermiso, nuevoEstado: EstadoPermiso) => {
    if (esVisualizador || esDigitador) return;
    const targetId = (sol as any).firebaseId || sol.id;
    onCambiarEstado(targetId, nuevoEstado);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-6 border border-slate-200 mt-12 md:mt-16">
      
      {/* Encabezado y Buscador */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Historial e Informes de Permisos</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {esVisualizador ? 'Modo de consulta (Visualizador).' : esDigitador ? 'Modo de registro (Digitador).' : 'Revisa, aprueba o gestiona los permisos solicitados.'}
          </p>
        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por Folio, Nombre o RUT..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Estado</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Motivo</label>
          <select
            value={filtroMotivo}
            onChange={(e) => setFiltroMotivo(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="TODOS">Todos los motivos</option>
            {motivosDisponibles.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Año</label>
          <select
            value={filtroAnio}
            onChange={(e) => setFiltroAnio(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="TODOS">Todos los años</option>
            {aniosDisponibles.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Mes</label>
          <select
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="TODOS">Todos los meses</option>
            {mesesDisponibles.map((mes) => (
              <option key={mes.id} value={mes.id}>{mes.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
          <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">Total Solicitudes</span>
          <div className="text-3xl font-extrabold text-slate-800">{solicitudesFiltradas.length}</div>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-1">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Total Horas Aprobadas</span>
          <div className="text-3xl font-extrabold text-emerald-700">{totalHorasAprobadas.toFixed(1)} hrs</div>
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full divide-y divide-slate-200 table-fixed">
          <colgroup><col className="w-20" /><col className="w-32" /><col className="w-52" /><col className="w-40" /><col className="w-24" /><col className="w-44" /></colgroup>
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Folio</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Período</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trabajador / Aprobador</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Motivo</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Duración</th>
              <th className="px-3 py-3 text-center text-xs font-medium text-slate-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {solicitudesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                  No se encontraron registros.
                </td>
              </tr>
            ) : (
              solicitudesFiltradas.map((sol) => {
                const motivoCorto = obtenerMotivoCorto(sol.motivo);
                return (
                  <tr key={sol.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-4 text-sm font-bold text-blue-600 truncate">
                      #{sol.id}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-600">
                      <div className="font-medium text-slate-900 truncate">{sol.fechaInicio || 'N/A'}</div>
                      <div className="text-xs text-slate-500 truncate">al {sol.fechaFin || sol.fechaInicio || 'N/A'}</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm font-semibold text-slate-900 truncate" title={sol.nombreTrabajador}>{sol.nombreTrabajador}</div>
                      <div className="text-xs text-slate-500 truncate">RUT: {sol.rut}</div>
                      <div className="text-xs text-blue-700 font-medium truncate">Jefe: {sol.cargo || 'No asignado'}</div>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-700">
                      <div className="w-full truncate" title={sol.motivo}>
                        {motivoCorto}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm font-semibold text-slate-800 truncate">
                      {sol.cantidadHoras}
                    </td>
                    <td className="px-3 py-4 text-center space-y-1.5">
                      <div className="flex justify-center">
                        <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                          sol.estado === 'Aprobado' ? 'bg-emerald-100 text-emerald-800' :
                          sol.estado === 'Rechazado' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sol.estado}
                        </span>
                      </div>
                      <div className="flex justify-center items-center gap-1 flex-wrap">
                        <button
                          type="button"
                          onClick={() => onVerComprobante(sol)}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-xs transition cursor-pointer"
                          title="Ver PDF"
                        >
                          📄
                        </button>

                        {!esVisualizador && !esDigitador && (
                          <>
                            {sol.estado !== 'Aprobado' && (
                              <button
                                type="button"
                                onClick={() => handleCambiarEstadoClick(sol, 'Aprobado')}
                                className="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs transition cursor-pointer"
                              >
                                Aprobar
                              </button>
                            )}
                            {sol.estado !== 'Rechazado' && (
                              <button
                                type="button"
                                onClick={() => handleCambiarEstadoClick(sol, 'Rechazado')}
                                className="px-2 py-0.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-xs transition cursor-pointer"
                              >
                                Rechazar
                              </button>
                            )}
                          </>
                        )}

                        {puedeEliminar && (
                          <button
                            type="button"
                            onClick={() => handleEliminarClick(sol)}
                            className="px-2 py-0.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs transition cursor-pointer"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};