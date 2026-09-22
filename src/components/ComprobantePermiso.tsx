import React from 'react';
import type { SolicitudPermiso } from '../types';

interface Props {
  solicitud: SolicitudPermiso;
  onCerrar: () => void;
}

export const ComprobantePermiso: React.FC<Props> = ({ solicitud, onCerrar }) => {
  
  const handleImprimir = () => {
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
            <style>
              @page {
                size: letter portrait;
                margin: 8mm;
              }
              body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                background: #ffffff;
                color: #1e293b;
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                height: 100vh;
              }
              .pagina-impresion {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 255mm;
                max-height: 255mm;
                box-sizing: border-box;
              }
              .caja-comprobante {
                height: 48%;
                border: 1.5px solid #cbd5e1;
                border-radius: 8px;
                padding: 12px 16px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                background: #ffffff;
                box-sizing: border-box;
                page-break-inside: avoid;
              }
              .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                border-bottom: 2px solid #0f172a;
                padding-bottom: 8px;
              }
              .titulo-seccion {
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                margin: 0;
                color: #0f172a;
                letter-spacing: 0.5px;
              }
              .sub-titulo {
                font-size: 9px;
                color: #64748b;
                margin: 2px 0 0 0;
                font-weight: 400;
              }
              .badge {
                background: #0f172a;
                color: #ffffff;
                padding: 3px 8px;
                font-size: 7.5px;
                font-weight: 700;
                text-transform: uppercase;
                border-radius: 3px;
                letter-spacing: 0.5px;
              }
              .badge-copia {
                background: #475569;
              }
              .titulo-documento {
                text-align: center;
                font-size: 11px;
                font-weight: 800;
                color: #2563eb;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin: 2px 0;
              }
              .caja-datos {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                padding: 8px 12px;
              }
              .grid-2 {
                display: grid;
                grid-template-columns: 1.5fr 1fr;
                gap: 8px;
                margin-bottom: 6px;
              }
              .grid-4 {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 6px;
                border-top: 1px solid #e2e8f0;
                padding-top: 6px;
              }
              .grid-3-firmas {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                text-align: center;
                font-size: 8.5px;
                color: #475569;
                padding-top: 4px;
              }
              .firma-linea {
                border-top: 1px solid #64748b;
                padding-top: 3px;
                font-weight: 500;
              }
              .label {
                color: #64748b;
                font-size: 7px;
                text-transform: uppercase;
                font-weight: 700;
                letter-spacing: 0.3px;
              }
              .valor {
                font-weight: 600;
                color: #0f172a;
                font-size: 9.5px;
              }
              .linea-corte {
                text-align: center;
                color: #94a3b8;
                font-size: 8px;
                letter-spacing: 1px;
                border-bottom: 1px dashed #cbd5e1;
                padding-bottom: 2px;
                text-transform: uppercase;
                font-weight: 600;
              }
            </style>
          </head>
          <body>
            <div class="pagina-impresion">
              
              <!-- ORIGINAL -->
              <div class="caja-comprobante">
                <div class="header">
                  <div>
                    <h1 class="titulo-seccion">Centro Odontológico Sindicato Nº 1</h1>
                    <p class="sub-titulo">Codelco Chile - División Chuquicamata / Calama</p>
                  </div>
                  <div style="text-align: right;">
                    <span class="badge">Original - Control Sindicato</span>
                    <p class="sub-titulo" style="margin-top: 3px;"><strong>Folio:</strong> #${solicitud.id}</p>
                  </div>
                </div>

                <div class="titulo-documento">Comprobante de Solicitud de Permiso</div>

                <div class="caja-datos">
                  <div class="grid-2">
                    <div><span class="label">Trabajador</span><br/><span class="valor">${solicitud.nombreTrabajador}</span></div>
                    <div><span class="label">RUT</span><br/><span class="valor">${solicitud.rut}</span></div>
                  </div>
                  <div class="grid-2" style="border-top: 1px solid #e2e8f0; padding-top: 6px; margin-bottom: 0;">
                    <div><span class="label">Jefe de Sección / Cargo</span><br/><span class="valor" style="color: #2563eb;">${solicitud.cargo || 'No especificado'}</span></div>
                    <div><span class="label">Motivo</span><br/><span class="valor">${solicitud.motivo}</span></div>
                  </div>
                  <div class="grid-4">
                    <div><span class="label">Tipo Permiso</span><br/><span class="valor">${solicitud.tipoPermiso}</span></div>
                    <div><span class="label">Fecha Inicio</span><br/><span class="valor">${solicitud.fechaInicio || 'N/A'}</span></div>
                    <div><span class="label">Duración</span><br/><span class="valor" style="color: #2563eb;">${solicitud.cantidadHoras} hrs</span></div>
                    <div><span class="label">Estado</span><br/><span class="valor">${solicitud.estado}</span></div>
                  </div>
                </div>

                <div class="grid-3-firmas">
                  <div class="firma-linea">Firma Solicitante</div>
                  <div class="firma-linea">Jefe de Sección (V°B°)</div>
                  <div class="firma-linea">Control de Tiempo</div>
                </div>
              </div>

              <!-- LÍNEA DE CORTE -->
              <div class="linea-corte">
                ✂️ ---------------------------- Línea de corte oficial ---------------------------- ✂️
              </div>

              <!-- COPIA -->
              <div class="caja-comprobante">
                <div class="header">
                  <div>
                    <h1 class="titulo-seccion">Centro Odontológico Sindicato Nº 1</h1>
                    <p class="sub-titulo">Codelco Chile - División Chuquicamata / Calama</p>
                  </div>
                  <div style="text-align: right;">
                    <span class="badge badge-copia">Copia - Trabajador</span>
                    <p class="sub-titulo" style="margin-top: 3px;"><strong>Folio:</strong> #${solicitud.id}</p>
                  </div>
                </div>

                <div class="titulo-documento">Comprobante de Solicitud de Permiso</div>

                <div class="caja-datos">
                  <div class="grid-2">
                    <div><span class="label">Trabajador</span><br/><span class="valor">${solicitud.nombreTrabajador}</span></div>
                    <div><span class="label">RUT</span><br/><span class="valor">${solicitud.rut}</span></div>
                  </div>
                  <div class="grid-2" style="border-top: 1px solid #e2e8f0; padding-top: 6px; margin-bottom: 0;">
                    <div><span class="label">Jefe de Sección / Cargo</span><br/><span class="valor" style="color: #2563eb;">${solicitud.cargo || 'No especificado'}</span></div>
                    <div><span class="label">Motivo</span><br/><span class="valor">${solicitud.motivo}</span></div>
                  </div>
                  <div class="grid-4">
                    <div><span class="label">Tipo Permiso</span><br/><span class="valor">${solicitud.tipoPermiso}</span></div>
                    <div><span class="label">Fecha Inicio</span><br/><span class="valor">${solicitud.fechaInicio || 'N/A'}</span></div>
                    <div><span class="label">Duración</span><br/><span class="valor" style="color: #2563eb;">${solicitud.cantidadHoras} hrs</span></div>
                    <div><span class="label">Estado</span><br/><span class="valor">${solicitud.estado}</span></div>
                  </div>
                </div>

                <div class="grid-3-firmas">
                  <div class="firma-linea">Firma Solicitante</div>
                  <div class="firma-linea">Jefe de Sección (V°B°)</div>
                  <div class="firma-linea">Control de Tiempo</div>
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

  const renderContenidoComprobante = (tipo: 'Original - Control Sindicato' | 'Copia - Trabajador', esCopia = false) => (
    <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
        <div>
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Centro Odontológico Sindicato Nº 1</h1>
          <p className="text-[11px] text-slate-500 font-normal">Codelco Chile - División Chuquicamata / Calama</p>
        </div>
        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-1 text-white ${esCopia ? 'bg-slate-600' : 'bg-slate-900'}`}>{tipo}</span>
          <p className="text-slate-500 text-xs font-medium"><strong>Folio:</strong> #{solicitud.id}</p>
        </div>
      </div>

      <h2 className="text-center text-xs font-black text-blue-600 uppercase tracking-widest">
        Comprobante de Solicitud de Permiso
      </h2>

      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Trabajador</span>
            <span className="font-semibold text-slate-900">{solicitud.nombreTrabajador}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase">RUT</span>
            <span className="font-semibold text-slate-900">{solicitud.rut}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Jefe de Sección / Cargo</span>
            <span className="font-semibold text-blue-600">{solicitud.cargo || 'No especificado'}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Motivo</span>
            <span className="font-semibold text-slate-900">{solicitud.motivo}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div>
          <span className="block text-[10px] font-bold text-slate-400 uppercase">Tipo Permiso</span>
          <span className="font-semibold text-slate-900">{solicitud.tipoPermiso}</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold text-slate-400 uppercase">Fecha Inicio</span>
          <span className="font-semibold text-slate-900">{solicitud.fechaInicio || 'N/A'}</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold text-slate-400 uppercase">Duración</span>
          <span className="font-bold text-blue-600">{solicitud.cantidadHoras} hrs</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold text-slate-400 uppercase">Estado</span>
          <span className="font-semibold text-slate-900">{solicitud.estado}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 pt-3 text-center text-xs text-slate-500 font-medium">
        <div className="border-t border-slate-400 pt-2 font-medium text-slate-600">Firma Solicitante</div>
        <div className="border-t border-slate-400 pt-2 font-medium text-slate-600">Jefe de Sección (V°B°)</div>
        <div className="border-t border-slate-400 pt-2 font-medium text-slate-600">Control de Tiempo</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative space-y-4 max-h-[95vh] overflow-y-auto">
        
        <div className="sticky top-0 bg-white/95 backdrop-blur z-20 flex justify-between items-center border-b border-slate-200 pb-3 pt-1">
          <h3 className="text-base font-bold text-slate-800">Vista Previa - Comprobante Oficial</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleImprimir}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
            >
              🖨️ Imprimir / Guardar PDF
            </button>
            <button
              type="button"
              onClick={onCerrar}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-200">
          <div>{renderContenidoComprobante('Original - Control Sindicato')}</div>
          <div className="flex items-center justify-center text-slate-400 text-xs my-2">
            <span className="border-t border-dashed border-slate-300 w-full text-center py-1">✂️ ------------------------------------ Línea de corte oficial ------------------------------------ ✂️</span>
          </div>
          <div>{renderContenidoComprobante('Copia - Trabajador', true)}</div>
        </div>

      </div>
    </div>
  );
};