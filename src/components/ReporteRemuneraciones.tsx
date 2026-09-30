import React, { useState } from 'react';

interface Solicitud {
  id: string;
  nombreTrabajador: string;
  rut: string;
  fechaInicio: string;
  fechaTermino?: string;
  fechaHasta?: string;
  motivo?: string;
  tipoPermiso?: string;
  cantidadHoras?: string;
  estado: string;
}

interface Props {
  solicitudes: Solicitud[];
}

export const ReporteRemuneraciones: React.FC<Props> = ({ solicitudes }) => {
  const [fechaInicioCorte, setFechaInicioCorte] = useState<string>('2026-09-21');
  const [fechaFinCorte, setFechaFinCorte] = useState<string>('2026-10-20');

  // Filtrado robusto por fechas y estado aprobado
  const permisosParaRemuneraciones = solicitudes.filter(sol => {
    if (!sol.estado || !sol.fechaInicio) return false;

    const estadoLimpio = sol.estado.trim().toLowerCase();
    const esAprobado = estadoLimpio === 'aprobada' || estadoLimpio === 'aprobado';
    if (!esAprobado) return false;

    const fechaPermisoStr = sol.fechaInicio.trim().split('T')[0];
    return fechaPermisoStr >= fechaInicioCorte && fechaPermisoStr <= fechaFinCorte;
  });

  // Función para calcular las horas de forma numérica pura (1 día = 8.5 horas)
  const obtenerHorasNumericas = (cantidadStr: string = '') => {
    if (!cantidadStr) return 0;
    const lower = cantidadStr.toLowerCase();
    const num = parseFloat(cantidadStr);
    if (isNaN(num)) return 0;

    if (lower.includes('día') || lower.includes('dia')) {
      return num * 8.5;
    }
    return num;
  };

  const exportarACSV = () => {
    let csvContent = "Trabajador;RUT;Fecha Inicio;Fecha Término;Motivo;Horas;Minutos;Estado\n";
    
    permisosParaRemuneraciones.forEach((p) => {
      const termino = p.fechaTermino || p.fechaHasta || p.fechaInicio;
      const motivo = (p.motivo || p.tipoPermiso || 'N/A').replace('-', '').trim();
      const horasNum = obtenerHorasNumericas(p.cantidadHoras);
      const minutosNum = horasNum * 60; // Calculamos el valor numérico exacto de los minutos

      // Exportamos los números directamente para evitar errores de fórmulas regionales en Excel
      csvContent += `"${p.nombreTrabajador}";"${p.rut}";"${p.fechaInicio}";"${termino}";"${motivo}";${horasNum};${minutosNum};"${p.estado}"\n`;
    });

    // BOM (\uFEFF) para codificación UTF-8 perfecta (tildes y Ñ)
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_remuneraciones_${fechaInicioCorte}_al_${fechaFinCorte}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto my-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Corte de Permisos para Remuneraciones</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-md border">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio del Corte:</label>
          <input 
            type="date" 
            value={fechaInicioCorte} 
            onChange={(e) => setFechaInicioCorte(e.target.value)}
            className="w-full p-2 border rounded-md bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Cierre (Término):</label>
          <input 
            type="date" 
            value={fechaFinCorte} 
            onChange={(e) => setFechaFinCorte(e.target.value)}
            className="w-full p-2 border rounded-md bg-white"
          />
        </div>
        <div className="md:col-span-2 text-sm text-gray-600">
          <p>⚙️ <em>Filtrando solicitudes aprobadas entre el {fechaInicioCorte} y el {fechaFinCorte}. (1 día = 8.5 horas)</em></p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold text-gray-700">
          Permisos en este ciclo: <span className="text-blue-600">{permisosParaRemuneraciones.length}</span>
        </span>
        <button 
          onClick={exportarACSV}
          disabled={permisosParaRemuneraciones.length === 0}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 cursor-pointer"
        >
          📥 Exportar Reporte para Sueldos (CSV)
        </button>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-sm text-gray-700">
              <th className="p-3">Trabajador</th>
              <th className="p-3">RUT</th>
              <th className="p-3">Fecha Inicio</th>
              <th className="p-3">Fecha Término</th>
              <th className="p-3">Motivo</th>
              <th className="p-3">Horas</th>
              <th className="p-3">Minutos</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {permisosParaRemuneraciones.length > 0 ? (
              permisosParaRemuneraciones.map((permiso) => {
                const fechaTerminoMostrar = permiso.fechaTermino || permiso.fechaHasta || permiso.fechaInicio;
                const motivoMostrar = (permiso.motivo || permiso.tipoPermiso || 'N/A').replace('-', '').trim();
                const horasNum = obtenerHorasNumericas(permiso.cantidadHoras);
                const minutosCalc = horasNum * 60;

                return (
                  <tr key={permiso.id} className="border-b text-sm hover:bg-gray-50">
                    <td className="p-3 font-medium">{permiso.nombreTrabajador}</td>
                    <td className="p-3">{permiso.rut}</td>
                    <td className="p-3 text-purple-700 font-mono">{permiso.fechaInicio}</td>
                    <td className="p-3 text-purple-700 font-mono">{fechaTerminoMostrar}</td>
                    <td className="p-3">{motivoMostrar}</td>
                    <td className="p-3 font-bold text-blue-600">{horasNum}</td>
                    <td className="p-3 font-semibold text-gray-700">{minutosCalc}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 font-semibold">
                        {permiso.estado}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No hay permisos aprobados en este rango de fechas de corte.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};