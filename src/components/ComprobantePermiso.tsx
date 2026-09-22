import React from 'react';
import type { SolicitudPermiso } from '../types';

interface Props {
  solicitud: SolicitudPermiso;
  onCerrar: () => void;
}

export const ComprobantePermiso: React.FC<Props> = ({ solicitud, onCerrar }) => {
  const handleImprimir = () => {
    window.print();
  };

  // Función reutilizable para renderizar cada una de las 3 copias
  const renderContenidoComprobante = (tipo: 'ORIGINAL - SINDICATO' | 'COPIA - FUNCIONARIO' | 'COPIA - ARCHIVO') => (
    <div className="space-y-1 bg-white p-2 rounded-lg border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0 print:space-y-1 flex flex-col justify-between h-full text-[10px]">
      
      {/* Cabecera institucional */}
      <div className="flex justify-between items-start border-b border-slate-800 pb-1">
        <div>
          <h1 className="text-[11px] font-bold text-slate-900 uppercase">Centro Odontológico Sindicato Nº 1</h1>
          <p className="text-[8px] text-slate-600">Codelco Chile - Calama</p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-slate-900 text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase mb-0.5">{tipo}</span>
          <p className="text-slate-500 text-[9px]"><strong>Folio:</strong> #{solicitud.id}</p>
        </div>
      </div>

      {/* Datos del Trabajador en línea compacta */}
      <div className="grid grid-cols-4 gap-1 bg-slate-50 p-1.5 rounded border border-slate-200">
        <div>
          <span className="block text-[8px] font-semibold text-slate-500 uppercase">Trabajador</span>
          <span className="font-medium text-slate-800 truncate block">{solicitud.nombreTrabajador}</span>
        </div>
        <div>
          <span className="block text-[8px] font-semibold text-slate-500 uppercase">RUT</span>
          <span className="font-medium text-slate-800">{solicitud.rut}</span>
        </div>
        <div>
          <span className="block text-[8px] font-semibold text-slate-500 uppercase">Jefe Sección</span>
          <span className="font-medium text-indigo-700 truncate block">{solicitud.cargo || 'N/A'}</span>
        </div>
        <div>
          <span className="block text-[8px] font-semibold text-slate-500 uppercase">Motivo</span>
          <span className="font-medium text-slate-800 truncate block">{solicitud.motivo}</span>
        </div>
      </div>

      {/* Fechas, Horas y Estado */}
      <div className="grid grid-cols-6 gap-1 bg-blue-50/80 p-1.5 rounded border border-blue-200">
        <div>
          <span className="block text-[8px] font-semibold text-blue-800 uppercase">Tipo</span>
          <span className="font-medium text-slate-800 truncate block">{solicitud.tipoPermiso}</span>
        </div>
        <div>
          <span className="block text-[8px] font-semibold text-blue-800 uppercase">Fecha</span>
          <span className="font-medium text-slate-800">{solicitud.fechaInicio || 'N/A'}</span>
        </div>
        <div>
          <span className="block text-[8px] font-semibold text-blue-800 uppercase">Salida</span>
          <span className="font-bold text-blue-900">{solicitud.horaSalida || 'N/A'}</span>
        </div>
        <div>
          <span className="block text-[8px] font-semibold text-blue-800 uppercase">Regreso</span>
          <span className="font-bold text-blue-900">{solicitud.horaRegreso || solicitud.horaLlegada || 'N/A'}</span>
        </div>
        <div>
          <span className="block text-[8px] font-semibold text-blue-800 uppercase">Duración</span>
          <span className="font-extrabold text-blue-900">{solicitud.cantidadHoras} hrs</span>
        </div>
        <div>
          <span className="block text-[8px] font-semibold text-blue-800 uppercase">Estado</span>
          <span className={`inline-block px-1 py-0.2 text-[8px] font-bold rounded ${
            solicitud.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
            solicitud.estado === 'Rechazado' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {solicitud.estado}
          </span>
        </div>
      </div>

      {/* Firmas compactas */}
      <div className="grid grid-cols-3 gap-3 pt-2 text-center text-[9px] text-slate-600">
        <div className="border-t border-slate-400 pt-0.5">Firma Solicitante</div>
        <div className="border-t border-slate-400 pt-0.5">Jefe Sección / V°B°</div>
        <div className="border-t border-slate-400 pt-0.5">Control Tiempo</div>
      </div>

    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative space-y-4 max-h-[95vh] overflow-y-auto print:shadow-none print:p-0 print:m-0 print:w-full print:max-h-none print:overflow-visible">
        
        {/* Botones de acción (No se imprimen) */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-20 flex justify-between items-center print:hidden border-b pb-3 pt-1">
          <h3 className="text-base font-bold text-slate-800">Comprobante Oficial (3 Copias)</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleImprimir}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow cursor-pointer"
            >
              🖨️ Imprimir / Guardar PDF
            </button>
            <button
              type="button"
              onClick={onCerrar}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL DE IMPRESIÓN (Distribución exacta para 3 copias en 1 sola hoja) */}
        <div id="modal-comprobante-impresion" className="print:h-[100vh] print:flex print:flex-col print:justify-between print:box-border print:p-1 space-y-2">
          
          {/* 1. ORIGINAL */}
          <div className="print:h-[31%] print:overflow-hidden">
            {renderContenidoComprobante('ORIGINAL - SINDICATO')}
          </div>

          {/* Línea de corte 1 */}
          <div className="hidden print:flex items-center justify-center text-slate-400 text-[8px] my-0">
            <span>✂️ ------------------------------------ Cortar aquí ------------------------------------ ✂️</span>
          </div>

          {/* 2. COPIA FUNCIONARIO */}
          <div className="print:h-[31%] print:overflow-hidden">
            {renderContenidoComprobante('COPIA - FUNCIONARIO')}
          </div>

          {/* Línea de corte 2 */}
          <div className="hidden print:flex items-center justify-center text-slate-400 text-[8px] my-0">
            <span>✂️ ------------------------------------ Cortar aquí ------------------------------------ ✂️</span>
          </div>

          {/* 3. COPIA ARCHIVO */}
          <div className="print:h-[31%] print:overflow-hidden">
            {renderContenidoComprobante('COPIA - ARCHIVO')}
          </div>

        </div>

      </div>
    </div>
  );
};