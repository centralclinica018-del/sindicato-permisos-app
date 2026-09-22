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

  // Función reutilizable para renderizar el contenido del comprobante (Original o Copia)
  const renderContenidoComprobante = (tipo: 'ORIGINAL - CONTROL SINDICATO' | 'COPIA - FUNCIONARIO') => (
    <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0 print:space-y-1.5 flex flex-col justify-between h-full text-xs">
      
      {/* Cabecera institucional */}
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-1.5">
        <div>
          <h1 className="text-xs font-bold text-slate-900 uppercase">Centro Odontológico Sindicato Nº 1</h1>
          <p className="text-[9px] text-slate-600">Codelco Chile - Calama</p>
        </div>
        <div className="text-right text-xs">
          <span className="inline-block bg-slate-900 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase mb-0.5">{tipo}</span>
          <p className="text-slate-500 text-[10px]"><strong>Folio ID:</strong> #{solicitud.id}</p>
        </div>
      </div>

      <h2 className="text-center text-xs font-extrabold text-blue-900 uppercase tracking-wide">
        Solicitud de Permiso
      </h2>

      {/* Datos del Trabajador */}
      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded border border-slate-200">
        <div>
          <span className="block text-[9px] font-semibold text-slate-500 uppercase">Nombre Trabajador</span>
          <span className="font-medium text-slate-800">{solicitud.nombreTrabajador}</span>
        </div>
        <div>
          <span className="block text-[9px] font-semibold text-slate-500 uppercase">RUT</span>
          <span className="font-medium text-slate-800">{solicitud.rut}</span>
        </div>
        <div>
          <span className="block text-[9px] font-semibold text-slate-500 uppercase">Jefe de Sección</span>
          <span className="font-medium text-indigo-700">{solicitud.cargo || 'No especificado'}</span>
        </div>
        <div>
          <span className="block text-[9px] font-semibold text-slate-500 uppercase">Motivo</span>
          <span className="font-medium text-slate-800">{solicitud.motivo}</span>
        </div>
      </div>

      {/* Fechas y Tipo */}
      <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-50 p-2 rounded border border-slate-200">
        <div>
          <span className="block text-[9px] font-semibold text-slate-500 uppercase">Tipo</span>
          <span className="font-medium text-slate-800">{solicitud.tipoPermiso}</span>
        </div>
        <div>
          <span className="block text-[9px] font-semibold text-slate-500 uppercase">Desde</span>
          <span className="font-medium text-slate-800">{solicitud.fechaInicio || 'N/A'}</span>
        </div>
        <div>
          <span className="block text-[9px] font-semibold text-slate-500 uppercase">Hasta</span>
          <span className="font-medium text-slate-800">{solicitud.fechaFin || solicitud.fechaInicio || 'N/A'}</span>
        </div>
      </div>

      {/* Bloque de Horas y Estado */}
      <div className="grid grid-cols-4 gap-2 text-[11px] bg-blue-50/80 p-2 rounded border border-blue-200">
        <div>
          <span className="block text-[9px] font-semibold text-blue-800 uppercase">Salida</span>
          <span className="font-bold text-blue-900">{solicitud.horaSalida || 'No reg.'}</span>
        </div>
        <div>
          <span className="block text-[9px] font-semibold text-blue-800 uppercase">Regreso</span>
          <span className="font-bold text-blue-900">{solicitud.horaRegreso || solicitud.horaLlegada || 'No reg.'}</span>
        </div>
        <div>
          <span className="block text-[9px] font-semibold text-blue-800 uppercase">Duración</span>
          <span className="font-extrabold text-blue-900">{solicitud.cantidadHoras} hrs</span>
        </div>
        <div>
          <span className="block text-[9px] font-semibold text-blue-800 uppercase">Estado</span>
          <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded ${
            solicitud.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
            solicitud.estado === 'Rechazado' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {solicitud.estado}
          </span>
        </div>
      </div>

      {/* Firmas Oficiales */}
      <div className="grid grid-cols-3 gap-4 pt-4 text-center text-[10px] text-slate-600">
        <div className="border-t border-slate-400 pt-1">
          Firma Solicitante
        </div>
        <div className="border-t border-slate-400 pt-1">
          Jefe Sección / V°B°
        </div>
        <div className="border-t border-slate-400 pt-1">
          Control Tiempo
        </div>
      </div>

    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative space-y-4 max-h-[95vh] overflow-y-auto print:shadow-none print:p-0 print:m-0 print:w-full print:max-h-none print:overflow-visible">
        
        {/* Botones de acción (No se imprimen) */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-20 flex justify-between items-center print:hidden border-b pb-3 pt-1">
          <h3 className="text-base font-bold text-slate-800">Comprobante Oficial - Centro Odontológico</h3>
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

        {/* CONTENEDOR PRINCIPAL DE IMPRESIÓN (ID requerido para el CSS global) */}
        <div id="modal-comprobante-impresion" className="print:h-[100vh] print:flex print:flex-col print:justify-between print:box-border print:p-1 space-y-4">
          
          {/* 1. ORIGINAL */}
          <div className="print:h-[48%] print:overflow-hidden">
            {renderContenidoComprobante('ORIGINAL - CONTROL SINDICATO')}
          </div>

          {/* Línea de corte punteada visible solo en impresión */}
          <div className="hidden print:flex items-center justify-center text-slate-400 text-[10px] my-0.5">
            <span>✂️ ------------------------------------ Cortar aquí ------------------------------------ ✂️</span>
          </div>

          {/* 2. COPIA FUNCIONARIO */}
          <div className="print:h-[48%] print:overflow-hidden">
            {renderContenidoComprobante('COPIA - FUNCIONARIO')}
          </div>

        </div>

      </div>
    </div>
  );
};