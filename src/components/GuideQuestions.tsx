/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, FileText, Database, ShieldCheck, UserCheck, Smile } from 'lucide-react';

interface QuestionItem {
  number: string;
  question: string;
  icon: React.ReactNode;
  answer: string;
  items: string[];
  recommendation: string;
}

export default function GuideQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const questions: QuestionItem[] = [
    {
      number: "1",
      question: "¿Cuáles son los principales trámites que generan más retrasos y frustración entre los ciudadanos en la municipalidad?",
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
      answer: "En los gobiernos locales de nivel provincial y distrital (como la Municipalidad Provincial de Yau), los cuellos de botella se concentran en trámites que requieren inspecciones físicas o conciliaciones impositivas y legales:",
      items: [
        "Licencias de Funcionamiento Comercial e ITSE (Inspección Técnica de Seguridad en Edificaciones): Suelen tardar por falta de inspectores certificados y expedientes duplicados.",
        "Aprobación de Obras Públicas y Edificaciones Privadas: Involucra revisiones de planos, zonificación y factibilidad que pasan por múltiples subgerencias manualmente.",
        "Registro Civil Extemporáneo e Inscripciones: Retrasados por inconsistencias de actas antiguas en caseríos alejados.",
        "Reclamos y Apelaciones Tributarios (Arbitrios e Impuesto Predial): Generan malestar por errores en cobros de catastro y largos plazos de auditoría."
      ],
      recommendation: "Metodología propuesta GDI: Automatizar la digitalización, pre-clasificar automáticamente mediante el clasificador de Inteligencia Artificial (Gemini NLP) y enrutar de forma inmediata a los especialistas correspondientes según criticidad."
    },
    {
      number: "2",
      question: "¿Qué datos históricos son necesarios para entrenar el modelo de machine learning y cómo se pueden recolectar de manera efectiva?",
      icon: <Database className="w-5 h-5 text-emerald-600" />,
      answer: "Para entrenar modelos eficaces de enrutamiento y priorización documental, se requiere un dataset histórico estructurado que contenga los siguientes atributos clave:",
      items: [
        "Metadatos del Expediente: Tipo de trámite, área de destino, fechas de creación, hitos intermedios de resolución y fecha de cierre definitivo.",
        "Contenido de Texto (Cuerpo del trámite): Glosa del pedido, justificación, observaciones iniciales y resoluciones previas redactadas por los técnicos.",
        "Variables del Ciudadano: Ubicación del predio, rubro comercial del negocio, historial de cumplimiento impositivo.",
        "Métricas de Procesamiento: Tiempos de espera por etapa (cuello de botella de cada oficina) e histórico de calificaciones de satisfacción ciudadana."
      ],
      recommendation: "Estrategia de recolección: Implementar formularios estructurados estándar en la Mesa de Partes física y un portal web unificado, migrar datos manuales legados mediante automatización OCR y digitalizar la cola con base de datos en tiempo real."
    },
    {
      number: "3",
      question: "¿Qué métricas se utilizarán para evaluar la efectividad del sistema de machine learning implementado?",
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      answer: "La evaluación del sistema se realiza en dos niveles complementarios: rendimiento del modelo técnico (ML) e impacto directo en la gestión pública (Operaciones):",
      items: [
        "F1-Score y Precisión de Clasificación: Mide que el clasificador asigne correctamente los trámites al área adecuada y con la prioridad justa, previniendo errores de enrutamiento.",
        "Matriz de Confusión: Permite identificar tipos de trámites con los que el modelo presenta mayor ambigüedad (por ejemplo, clasificar Tributación como Licencias).",
        "Tiempo de Ciclo Completo (Lead Time): Medición del tiempo promedio desde el registro del trámite hasta el despacho final de la resolución (meta: reducción del 60%).",
        "Tasa de Error Humano y Re-trabajo: Porcentaje de trámites que fueron mal enrutados por el personal municipal y tuvieron que devolverse.",
        "CSI (Customer Satisfaction Index): Índice cuantitativo de satisfacción del ciudadano obtenido inmediatamente después de concluir el trámite."
      ],
      recommendation: "Monitoreo continuo: Un dashboard interactivo integrado que calcule en tiempo real los KPIs de precisión y agilidad municipal para facilitar auditorías externas de transparencia pública."
    },
    {
      number: "4",
      question: "¿Cómo se garantizará la aceptación y uso del nuevo sistema por parte del personal de la municipalidad?",
      icon: <UserCheck className="w-5 h-5 text-blue-600" />,
      answer: "La transición de un sistema 100% manual a uno gobernado por algoritmos predictivos requiere una estrategia activa de Gestión del Cambio y capacitación constante:",
      items: [
        "Involucramiento Temprano (Diseño participativo): Incluir a los jefes de área de Yau en la definición de las reglas lógicas preliminares para que sientan la IA como un asistente útil y no como un reemplazo.",
        "Capacitación Dinámica: Talleres interactivos prácticos basados en simulación de casos de uso comunes (Mapeo de trámites de emergencia vs estandarizados).",
        "Amigabilidad de Interfaz (UX Simplificada): Dotar al personal de un panel administrativo sumamente intuitivo que minimice clics, destaque alertas automáticas por colores y guíe las resoluciones con sugerencias provistas por el modelo de IA.",
        "Políticas de Reconocimiento: Incentivar con menciones de desempeño a las gerencias que logren reducir significativamente sus colas utilizando el nuevo software GDI."
      ],
      recommendation: "Regla de Oro: El sistema actúa como un recomendador activo y transparente. El control jurisdiccional final y firma digital siempre recaen en el funcionario público responsable."
    },
    {
      number: "5",
      question: "¿Qué mecanismos de feedback se establecerán para ajustar el sistema en función de la experiencia del ciudadano y del personal?",
      icon: <Smile className="w-5 h-5 text-rose-600" />,
      answer: "Para mantener el modelo de Machine Learning alineado a las necesidades de Yau y retroalimentarlo constantemente con nuevos datos de validación, se estructuran tres bucles de feedback:",
      items: [
        "Bucle del Ciudadano (Feedback Corto): Autoevaluación inmediata con estrellas y comentarios libres enviados a través de su canal de alerta predilecto (WhatsApp, SMS o Email) una vez concluida su solicitud.",
        "Bucle del Operario (Validación Humana en el Loop): Posibilidad de re-clasificar manualmente una sugerencia de prioridad o categoría errada. Cada corrección del operario municipal retroalimenta y re-entrena el dataset del modelo.",
        "Evaluación Semestral del Modelo (Fine-Tuning): Auditoría por parte de la Oficina de Tecnologías para re-ajustar las variables de ponderación crítica según el volumen de solicitudes recibidas estacionalmente."
      ],
      recommendation: "Seguridad y Transparencia: Conforme a la legislación nacional, todos los datos personales se encriptan bajo directrices de privacidad de datos, dejando trazas públicas de auditoría (logs) para garantizar probidad administrativa."
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xs" id="senati-faq-panel">
      <div className="mb-6 flex items-start gap-4">
        <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
          <HelpCircle className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Marco Teórico y Solución a Preguntas Guía (SENATI)</h2>
          <p className="text-sm text-slate-500 mt-1">Fundamentos teóricos y técnicos exigidos para la entrega final del taller de Machine Learning.</p>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={q.number} 
              className={`border rounded-xl transition-all duration-200 ${isOpen ? 'border-indigo-200 bg-indigo-50/10' : 'border-slate-100 bg-white hover:border-slate-200'}`}
              id={`pregunta-guia-${q.number}`}
            >
              <button 
                className="w-full text-left p-5 flex items-start justify-between gap-4 focus:outline-none"
                onClick={() => toggleIndex(idx)}
              >
                <div className="flex gap-3">
                  <span className="font-mono text-sm leading-6 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                    Q{q.number}
                  </span>
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5">{q.icon}</span>
                    <span className="font-medium text-slate-800 text-sm md:text-base leading-tight md:leading-snug">{q.question}</span>
                  </div>
                </div>
                <div className="mt-1 text-slate-400">
                  {isOpen ? <ChevronUp className="w-5 h-5 text-indigo-500" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-slate-650 text-sm border-t border-dashed border-slate-100/50">
                  <p className="font-medium text-slate-700 mb-3 mt-2">{q.answer}</p>
                  <ul className="list-disc pl-5 space-y-2.5 text-slate-600">
                    {q.items.map((item, idy) => (
                      <li key={idy} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                  <div className="mt-4 p-4 bg-white border border-indigo-100 rounded-lg text-indigo-950 font-medium flex gap-3 text-xs md:text-sm shadow-xs">
                    <span className="font-bold text-indigo-700 shrink-0">💡 Solución Recomendada:</span>
                    <span>{q.recommendation}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
