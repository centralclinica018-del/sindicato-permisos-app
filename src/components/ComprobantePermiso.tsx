import React from 'react';
import type { SolicitudPermiso } from '../types';

interface Props {
  solicitud: SolicitudPermiso;
  onCerrar: () => void;
}

export const ComprobantePermiso: React.FC<Props> = ({ solicitud, onCerrar }) => {
  
  const handleImprimir = () => {
    // Creamos un iframe oculto para procesar la impresión de forma aislada y limpia
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Comprobante - Folio #${solicitud.id}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page {
                size: letter portrait;
                margin: 8mm;
              }
              body {
                font-family: ui-sans-serif, system-ui, sans-serif;
                background: #ffffff;
                color: #111827;
                margin: 0;
                padding: 0;
              }
            </style>
          </head>
          <body>
            <div style="display: flex; flex-direction: column; justify-content: space-between; height: 260mm; box-sizing: border-box; padding: 4mm;">
              
              <!-- ORIGINAL -->
              <div style="height: 48%; border: 1.5px solid #111827; padding: 14px; border-radius: 6px; display: flex; flex-direction: column; justify-content: space-between; background: #fff;">
                <div style="display: flex; justify-content: space-between; align-items: start; border-bottom: 2px solid #111827; padding-bottom: 8px;">
                  <div>
                    <h1 style="font-size: 13px; font-weight: bold; text-transform: uppercase; margin: 0; color: #111827;">Centro Odontológico Sindicato Nº 1</h1>
                    <p style="font-size: 9px; color: #4b5563; margin: 2px 0 0 0;">Codelco Chile - Calama</p>
                  </div>
                  <div style="text-align: right;">
                    <span style="background: #111827; color: #ffffff; padding: 3px 8px; font-size: 8px; font-weight: bold; text-transform: uppercase;">ORIGINAL - CONTROL SINDICATO</span>
                    <p style="font-size: 9px; color: #4b5563; margin: 3px 0 0 0;"><strong>Folio ID:</strong> #${solicitud.id}</p>
                  </div>
                </div>

                <h2 style="text-align: center; font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin: 4px 0;">Solicitud de Permiso</h2>

                <div style="border: 1px solid #cbd5e1; background: #f8fafc; padding: 8px; border-radius: 4px; font-size: 10px;">
                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 6px;">
                    <div><strong style="color: #64748b; font-size: 8px; text-transform: block;">TRABAJADOR:</strong><br/>${solicitud.nombreTrabajador}</div>
                    <div><strong style="color: #64748b; font-size: 8px;">RUT:</strong><br/>${solicitud.rut}</div>
                    <div><strong style="color: #64748b; font-size: 8px;">JEFE SECCIÓN:</strong><br/>${solicitud.cargo || 'No especificado'}</div>
                    <div><strong style="color: #64748b; font-size: 8px;">MOTIVO:</strong><br/>${solicitud.motivo}</div>
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
                    <div><strong style="color: #64748b; font-size: 8px;">TIPO:</strong><br/>${solicitud.tipoPermiso}</div>
                    <div><strong style="color: #64748b; font-size: 8px;">DESDE:</strong><br/>${solicitud.fechaInicio || 'N/A'}</div>
                    <div><strong style="color: #64748b; font-size: 8px;">DURACIÓN:</strong><br/>${solicitud.cantidadHoras} hrs</div>
                    <div><strong style="color: #64748b; font-size: 8px;">ESTADO:</strong><br/>${solicitud.estado}</div>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; font-size: 9px; color: #475569; padding-top: 4px;">
                  <div style="border-top: 1px solid #64748b; padding-top: 2px;">Firma Solicitante</div>
                  <div style="border-top: 1px solid #64748b; padding-top: 2px;">Jefe Sección / V°B°</div>
                  <div style="border-top: 1px solid #64748b; padding-top: 2px;">Control Tiempo</div>
                </div>
              </div>

              <!-- LÍNEA DE CORTE -->
              <div style="text-align: center; color: #94a3b8; font-size: 9px; border-bottom: 1px dashed #94a3b8; padding-bottom: 2px;">
                ✂️ ------------------------------------ Línea de corte ------------------------------------ ✂️
              </div>

              <!-- COPIA -->
              <div style="height: 48%; border: 1.5px solid #111827; padding: 14px; border-radius: 6px; display: flex; flex-direction: column; justify-content: space-between; background: #fff;">
                <div style="display: flex; justify-content: space-between; align-items: start; border-bottom: 2px solid #111827; padding-bottom: 8px;">
                  <div>
                    <h1 style="font-size: 13px; font-weight: bold; text-transform: uppercase; margin: 0; color: #111827;">Centro Odontológico Sindicato Nº 1</h1>
                    <p style="font-size: 9px; color: #4b5563; margin: 2px 0 0 0;">Codelco Chile - Calama</p>
                  </div>
                  <div style="text-align: right;">
                    <span style="background: #111827; color: #ffffff; padding: 3px 8px; font-size: 8px; font-weight: bold; text-transform: uppercase;">COPIA - FUNCIONARIO</span>
                    <p style="font-size: 9px; color: #4b5563; margin: 3px 0 0 0;"><strong>Folio ID:</strong> #${solicitud.id}</p>
                  </div>
                </div>

                <h2 style="text-align: center; font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin: 4px 0;">Solicitud de Permiso</h2>

                <div style="border: 1px solid #cbd5e1; background: #f8fafc; padding: 8px; border-radius: 4px; font-size: 10px;">
                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 6px;">
                    <div><strong style="color: #64748b; font-size: 8px;">TRABAJADOR:</strong><br/>${solicitud.nombreTrabajador}</div>
                    <div><strong style="color: #64748b; font-size: 8px;">RUT:</strong><br/>${solicitud.rut}</div>
                    <div><strong style="color: #64748b; font-size: 8px;">JEFE SECCIÓN:</strong><br/>${solicitud.cargo || 'No especificado'}</div>
                    <div><strong style="color: #64748b; font-size: 8px;">MOTIVO:</strong><br/>${solicitud.motivo}</div>
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
                    <div><strong style="color: #64748b; font-size: 8px;">TIPO:</strong><br/>${solicitud.tipoPermiso}</div>
                    <div><strong style="color: #64748b; font-size: 8px;">DESDE:</strong><br/>${solicitud.fechaInicio || 'N/A'}</div>
                    <div><strong style="color: #64748b; font-size: 8px;">DURACIÓN:</strong><br/>${solicitud.cantidadHoras} hrs</div>
                    <div><strong style="color: #64748b; font-size: 8px;">ESTADO:</strong><br/>${solicitud.estado}</div>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; font-size: 9px; color: #475569; padding-top: 4px;">
                  <div style="border-top: 1px solid #64748b; padding-top: 2px;">Firma Solicitante</div>
                  <div style="border-top: 1px solid #64748b; padding-top: 2px;">Jefe Sección / V°B°</div>
                  <div style="border-top: 1px solid #64748b; padding-top: 2px;">Control Tiempo</div>
                </div>
              </div>

            </div>
            <script>
              window.onload = function() {
                setTimeout(() => {
                  window.print();
                  setTimeout(() => {
                    window.frameElement.remove();
                  }, 500);
                }, 300);
              };
            </script>
          </body>
        </html>
      `);
      doc.close();
    }
  };

  const renderContenidoComprobante = (tipo: 'ORIGINAL - CONTROL SINDICATO' | 'COPIA - FUNCIONARIO') => (
    <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-2">
        <div>
          <h1 className="text-sm font-bold text-slate-900 uppercase">Centro Odontológico Sindicato Nº 1</h1>
          <p className="text-[10px] text-slate-600">Codelco Chile - Calama</p>
        </div>
        <div className="text-right text-xs">
          <span className="inline-block bg-slate-900 text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase mb-1">{tipo}</span>
          <p className="text-slate-500 text-[11px]"><strong>Folio ID:</strong> #{solicitud.id}</p>
        </div>
      </div>

      <h2 className="text-center text-sm font-extrabold text-blue-900 uppercase tracking-wide">
        Solicitud de Permiso
      </h2>

      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded border border-slate-200">
        <div>
          <span className="block text-[10px] font-semibold text-slate-500 uppercase">Nombre Trabajador</span>
          <span className="font-medium text-slate-800">{solicitud.nombreTrabajador}</span>
        </div>
        <div>
          <span className="block text-[10px] font-semibold text-slate-500 uppercase">RUT</span>
          <span className="font-medium text-slate-800">{solicitud.rut}</span>
        </div>
        <div>
          <span className="block text-[10px] font-semibold text-slate-500 uppercase">Jefe de Sección</span>
          <span className="font-medium text-indigo-700">{solicitud.cargo || 'No especificado'}</span>
        </div>
        <div>
          <span className="block text-[10px] font-semibold text-slate-500 uppercase">Motivo</span>
          <span className="font-medium text-slate-800">{solicitud.motivo}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded border border-slate-200">
        <div>
          <span className="block text-[10px] font-semibold text-slate-500 uppercase">Tipo</span>
          <span className="font-medium text-slate-800">{solicitud.tipoPermiso}</span>
        </div>
        <div>
          <span className="block text-[10px] font-semibold text-slate-500 uppercase">Desde</span>
          <span className="font-medium text-slate-800">{solicitud.fechaInicio || 'N/A'}</span>
        </div>
        <div>
          <span className="block text-[10px] font-semibold text-slate-500 uppercase">Hasta</span>
          <span className="font-medium text-slate-800">{solicitud.fechaFin || solicitud.fechaInicio || 'N/A'}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-xs bg-blue-50/80 p-2.5 rounded border border-blue-200">
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
          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
            solicitud.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
            solicitud.estado === 'Rechazado' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {solicitud.estado}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-3 text-center text-[11px] text-slate-600">
        <div className="border-t border-slate-400 pt-1">Firma Solicitante</div>
        <div className="border-t border-slate-400 pt-1">Jefe Sección / V°B°</div>
        <div className="border-t border-slate-400 pt-1">Control Tiempo</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      {/* Ventana Flotante / Modal para ver en pantalla */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative space-y-4 max-h-[95vh] overflow-y-auto">
        
        <div className="sticky top-0 bg-white/95 backdrop-blur z-20 flex justify-between items-center border-b border-slate-200 pb-3 pt-1">
          <h3 className="text-base font-bold text-slate-800">Vista Previa - Comprobante Oficial</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleImprimir}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow cursor-pointer flex items-center gap-1.5"
            >
              🖨️ Imprimir / Guardar PDF
            </button>
            <button
              type="button"
              onClick={onCerrar}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="space-y-4 bg-white">
          <div>{renderContenidoComprobante('ORIGINAL - CONTROL SINDICATO')}</div>
          <div className="flex items-center justify-center text-slate-400 text-xs my-2">
            <span className="border-t border-dashed border-slate-400 w-full text-center">✂️ ------------------------------------ Línea de corte ------------------------------------ ✂️</span>
          </div>
          <div>{renderContenidoComprobante('COPIA - FUNCIONARIO')}</div>
        </div>

      </div>
    </div>
  );
};