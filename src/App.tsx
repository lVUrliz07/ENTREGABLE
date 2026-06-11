/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  FileText, 
  Users, 
  Sparkles, 
  HelpCircle, 
  Activity, 
  PlusCircle, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  Bell, 
  Clock, 
  Filter, 
  Search, 
  UserCheck, 
  Star, 
  Sliders, 
  Check, 
  FileCheck2, 
  TrendingUp, 
  PhoneCall, 
  BadgeAlert,
  Info,
  LogIn,
  ArrowLeft,
  Lock,
  Shield
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { Tramite, Curriculum, Alerta } from './types';
import GuideQuestions from './components/GuideQuestions';
import LoginScreen from './components/LoginScreen';
import UserProfile from './components/UserProfile';

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<'kpis' | 'ciudadano' | 'empleados' | 'curriculums' | 'guia' | 'mis-tramites'>('ciudadano');
  const [latestSubmission, setLatestSubmission] = useState<any | null>(null);
  const [feedbackSentForLatest, setFeedbackSentForLatest] = useState<boolean>(false);
  const [latestEvaluatedCV, setLatestEvaluatedCV] = useState<Curriculum | null>(null);

  // Database lists in frontend
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [metrics, setMetrics] = useState<any>({
    totalTramites: 0,
    categorias: { licencias: 0, obras: 0, registro: 0, tributacion: 0, otros: 0 },
    prioridades: { baja: 0, media: 0, alta: 0, critica: 0 },
    estados: { recibido: 0, analizando: 0, observado: 0, aprobado: 0, denegado: 0 },
    indiceSatisfaccion: 0,
    satisfaccionVotos: 0,
    precisionML: 93.6,
    totalAlertasEnviadas: 0,
    totalCurriculosPostulados: 0
  });

  // UI state managers
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isAiFallback, setIsAiFallback] = useState<boolean>(false);

  // Form states - Tramite
  const [newTramite, setNewTramite] = useState({
    dni: '',
    nombreCiudadano: '',
    telefono: '',
    correo: '',
    titulo: '',
    descripcion: ''
  });

  // Form states - CV Screening
  const [newCV, setNewCV] = useState({
    nombreCandidato: '',
    correo: '',
    telefono: '',
    cargoPostula: 'Ingeniero Civil - Subgerencia de Liquidación de Obras',
    textoCV: ''
  });

  // Active selected elements for inspection modal or side-by-side view
  const [selectedTramiteId, setSelectedTramiteId] = useState<string | null>(null);
  const [filterCategoria, setFilterCategoria] = useState<string>('todos');
  const [filterPrioridad, setFilterPrioridad] = useState<string>('todos');
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  // Pagination states
  const [tramitePage, setTramitePage] = useState(1);
  const [cvPage, setCvPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Citizen satisfaction rating state for selected completed tramite
  const [starRating, setStarRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [lastSentFeedback, setLastSentFeedback] = useState<{calificacion: number; comentario: string} | null>(null);

  // Handle simulated session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('simulated_user');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  // Redirect active tab on session change to avoid orphan tabs
  useEffect(() => {
    if (currentUser) {
      if (activeTab === 'ciudadano' || activeTab === 'mis-tramites') {
        setActiveTab('kpis');
      }
    } else {
      if (activeTab === 'kpis') {
        setActiveTab('ciudadano');
      }
    }
  }, [currentUser, activeTab]);

  // Force clear stale session when navigating to empleados without user
  useEffect(() => {
    if (activeTab === 'empleados' && !currentUser) {
      localStorage.removeItem('simulated_user');
      setCurrentUser(null);
    }
  }, [activeTab, currentUser]);

  // Reset pagination when filters change
  useEffect(() => {
    setTramitePage(1);
  }, [filterCategoria, filterPrioridad, filterEstado]);

  useEffect(() => {
    setCvPage(1);
  }, [curriculums]);

  // Google Authentication trigger handlers
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const simulatedUser = {
        uid: "google-admin-yau",
        displayName: "Administrador Google Yau",
        email: "admin.google@yau.gob.pe",
        photoURL: null,
        emailVerified: true,
        providerData: [{ providerId: "google.com", email: "admin.google@yau.gob.pe" }]
      };
      localStorage.setItem('simulated_user', JSON.stringify(simulatedUser));
      setCurrentUser(simulatedUser as any);
      setSuccessMsg("¡Sesión iniciada correctamente con Google (modo demostración)!");
    } catch (err: any) {
      setErrorMsg("Ocurrió un inconveniente al iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleMockAdminSignIn = (email?: string) => {
    try {
      console.log('[APP] handleMockAdminSignIn called with email:', email);
      setLoading(true);
      setErrorMsg(null);
      const simulatedUser = {
        uid: "admin-yau-senati",
        displayName: "Administrador de Yau",
        email: email || "admin@yau.gob.pe",
        photoURL: null,
        emailVerified: true
      };
      localStorage.setItem('simulated_user', JSON.stringify(simulatedUser));
      console.log('[APP] Setting currentUser to:', simulatedUser);
      setCurrentUser(simulatedUser as any);
      setSuccessMsg("¡Sesión iniciada correctamente como de Administrador de Yau!");
      console.log('[APP] Success message set, currentUser should be truthy now');
    } catch (e) {
      console.error('[APP] Error in handleMockAdminSignIn:', e);
      setErrorMsg("Error al iniciar sesión de administrador simulada.");
    } finally {
      setLoading(false);
    }
  };

  // Clear simulated session
  const handleSignOut = () => {
    localStorage.removeItem('simulated_user');
    setCurrentUser(null);
    setActiveTab('ciudadano');
    setSuccessMsg("Sesión cerrada correctamente.");
  };


  // Fetch all database records on mount
  const refreshData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      
      const resT = await fetch('/api/tramites');
      if (resT.ok) {
        const data = await resT.json();
        setTramites(data);
        if (data.length > 0 && !selectedTramiteId) {
          setSelectedTramiteId(data[0].id);
        }
      }

      const resC = await fetch('/api/curriculums');
      if (resC.ok) {
        const data = await resC.json();
        setCurriculums(data);
      }

      const resM = await fetch('/api/metrics');
      if (resM.ok) {
        const data = await resM.json();
        setMetrics(data);
      }
    } catch (e: any) {
      console.error("Error communicating with backend API. Using local simulated actions.", e);
      setErrorMsg("Ocurrió un aviso de red. Revise si el servidor Node/Express se está ejecutando en segundo plano.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Citizen register submit
  const handleRegisterTramite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTramite.dni || !newTramite.nombreCiudadano || !newTramite.telefono || !newTramite.correo || !newTramite.titulo || !newTramite.descripcion) {
      setErrorMsg("Todos los campos de la solicitud son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const response = await fetch('/api/tramites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTramite)
      });

      if (!response.ok) {
        throw new Error("No se pudo registrar.");
      }

      const result = await response.json();
      setLatestSubmission(result);
      setFeedbackSentForLatest(false);
      setSuccessMsg(`¡Trámite creado exitosamente! ID de Seguimiento: ${result.id}. Nuestro motor de Inteligencia Artificial la catalogó con Prioridad ${result.prioridad.toUpperCase()}.`);
      
      // Clear form
      setNewTramite({
        dni: '',
        nombreCiudadano: '',
        telefono: '',
        correo: '',
        titulo: '',
        descripcion: ''
      });

      // Shift view to let them inspect
      await refreshData();
      setSelectedTramiteId(result.id);
      
      if (currentUser) {
        setActiveTab('empleados');
      } else {
        setActiveTab('ciudadano');
      }
    } catch (err: any) {
      setErrorMsg("Error registrando trámite. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Human Resources CV Screening submit
  const handleRegisterCV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCV.nombreCandidato || !newCV.correo || !newCV.telefono || !newCV.textoCV) {
      setErrorMsg("Complete todos los campos del candidato.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const response = await fetch('/api/curriculums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCV)
      });

      if (!response.ok) {
        throw new Error("No se pudo evaluar el currículum.");
      }

      const data = await response.json();
      setLatestEvaluatedCV(data);
      setSuccessMsg(`Candidatura evaluada y procesada. El modelo IA ha computado su puntaje de idoneidad institucional.`);
      setNewCV({
        nombreCandidato: '',
        correo: '',
        telefono: '',
        cargoPostula: 'Ingeniero Civil - Subgerencia de Liquidación de Obras',
        textoCV: ''
      });

      await refreshData();
    } catch (err: any) {
      setErrorMsg("Error al enviar CV al servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Officer Update Estate manually -> Triggers Alerte
  const handleUpdateEstado = async (id: string, nuevoEstado: string) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch(`/api/tramites/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (res.ok) {
        setSuccessMsg(`Se coordinó el estado con éxito. Alerta automatizada enviada al ciudadano.`);
        await refreshData();
      } else {
        setErrorMsg("Error al actualizar el estado del trámite.");
      }
    } catch (e) {
      setErrorMsg("No se pudo establecer conexión.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Feedback from Citizen
  const handleSendFeedback = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch(`/api/tramites/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calificacion: starRating,
          comentario: feedbackComment
        })
      });

      if (res.ok) {
        setSuccessMsg("¡Agradecemos mucho sus valiosos comentarios! Su feedback ha sido registrado para afinar el modelo de Inteligencia de Yau.");
        setLastSentFeedback({ calificacion: starRating, comentario: feedbackComment });
        setFeedbackComment('');
        setFeedbackSentForLatest(true);
        await refreshData();
      } else {
        setErrorMsg("Ocurrió un error al enviar el feedback.");
      }
    } catch (error) {
      setErrorMsg("Error de red.");
    } finally {
      setLoading(false);
    }
  };

  // UI state for preset cv simulation load to help user test faster
  const loadPresetCV1 = () => {
    setNewCV({
      nombreCandidato: "Ing. Alejandro Mendoza Valdivia",
      correo: "a.mendoza.valdivia@grupovias.pe",
      telefono: "945938102",
      cargoPostula: "Ingeniero Civil - Subgerencia de Liquidación de Obras",
      textoCV: "Ingeniero Civil colegiado por la Universidad Nacional con 4 años redactando cuadernos de obra, realizando informes periciales, valorizaciones de asfalto y control presupuestal de pavimentos. Conozco el SIAF gubernamental, la ley general de arbitrios y el OSCE nivel regular."
    });
  };

  const loadPresetCV2 = () => {
    setNewCV({
      nombreCandidato: "Diana Laura Cáceres Paredes",
      correo: "diana.caceres.rh@outlook.com",
      telefono: "961029304",
      cargoPostula: "Especialista en Compras y Contrataciones del Estado",
      textoCV: "Abogada Especialista en Contrataciones y Adquisiciones del Estado. Certificada OSCE nivel avanzado por 4 periodos seguidos. 12 años liderando licitaciones públicas, control interno preventivo de proveedores, defensa administrativa en litigios de compras y contratos complejos. Maestría en Gestión Pública."
    });
  };

  const loadPresetTramite1 = () => {
    setNewTramite({
      dni: "41920384",
      nombreCiudadano: "Carlos Alberto Quispe Romero",
      telefono: "941029103",
      correo: "carlos.quispe@gmail.com",
      titulo: "URGENTE: Fuga masiva de gas en mercado municipal central de Yau",
      descripcion: "Se siente un fuerte olor a gas GLP licuado de petróleo por el sector de pescados y comidas preparadas del mercado municipal. Los comerciantes y madres de familia se encuentran con miedo. Urge personal de Defensa Civil que realice una inspección técnica inmediata antes de una tragedia."
    });
  };

  const loadPresetTramite2 = () => {
    setNewTramite({
      dni: "10294817",
      nombreCiudadano: "Laura Isabel Alva",
      telefono: "951920301",
      correo: "laura.alva@negociosyau.com",
      titulo: "Autorización especial para feria dominical de artesanía de Yau",
      descripcion: "Solicito autorización del espacio público municipal para realizar una feria de artesanías locales durante los domingos del mes patrio de este año. Promoveremos productos locales y contaremos con seguridad privada básica."
    });
  };

  const loadPresetTramite3 = () => {
    setNewTramite({
      dni: "72102948",
      nombreCiudadano: "Sofía Lorena Huamán Prado",
      telefono: "961849203",
      correo: "sofia.huaman@boticasyau.com",
      titulo: "Licencia de funcionamiento definitivo para botica comunitaria Yau",
      descripcion: "Solicito la inspección técnica de seguridad en edificaciones (ITSE) y la expedición de la licencia de funcionamiento comercial definitivo para nuestro establecimiento de salud de venta de medicamentos de bajo costo ubicado frente a la Plaza Principal."
    });
  };

  const loadPresetTramite4 = () => {
    setNewTramite({
      dni: "08492038",
      nombreCiudadano: "Mariano Estanislao Castro",
      telefono: "972105492",
      correo: "mariano.castro@outlook.com",
      titulo: "Reclamo por duplicación de cobro de impuesto predial y arbitrios",
      descripcion: "Presento un reclamo administrativo tributario formal contra el área de Rentas de la municipalidad. Me ha llegado una notificación de cobranza coactiva por el impuesto predial del año 2025 cobrándome dos veces el mismo periodo de forma consecutiva cuando ya cuento con el voucher cancelado."
    });
  };

  const loadPresetTramite5 = () => {
    setNewTramite({
      dni: "42039481",
      nombreCiudadano: "Emilio Vicente Quispe",
      telefono: "931205391",
      correo: "emilio.vicente@gmail.com",
      titulo: "Rectificación administrativa urgente de partida de nacimiento",
      descripcion: "Solicito la corrección de error material en mi acta de nacimiento de la Municipalidad de Yau. Mi segundo apellido fue registrado erróneamente como 'Quispeo' agregando una 'o' al final de la firma. Adjunto mi certificado bautismal y ficha RENIEC para la subsanación correspondiente."
    });
  };

  const loadPresetTramite6 = () => {
    setNewTramite({
      dni: "15928374",
      nombreCiudadano: "Hugo Severo Montes",
      telefono: "955102934",
      correo: "hugo.montes@vecinosyau.pe",
      titulo: "CRÍTICO: Colapso total de alcantarillado e inundación de aguas servidas",
      descripcion: "Las tuberías de desagüe de la Av. Bolognesi cuadra 3 han colapsado por completo. Las aguas negras y servidas están brotando de los buzones principales inundando las veredas y la pista de la calle, generando un olor fétido insoportable y un inminente peligro infeccioso de salud ambiental para todos los niños y vecinos."
    });
  };

  // Filter computation
  const filteredTramites = tramites.filter(t => {
    if (filterCategoria !== 'todos' && t.categoria !== filterCategoria) return false;
    if (filterPrioridad !== 'todos' && t.prioridad !== filterPrioridad) return false;
    if (filterEstado !== 'todos' && t.estado !== filterEstado) return false;
    return true;
  });

  const totalTramitePages = Math.max(1, Math.ceil(filteredTramites.length / ITEMS_PER_PAGE));
  const paginatedTramites = filteredTramites.slice((tramitePage - 1) * ITEMS_PER_PAGE, tramitePage * ITEMS_PER_PAGE);

  const selectedTramite = tramites.find(t => t.id === selectedTramiteId);

  // CV pagination
  const sortedCurriculums = [...curriculums].sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
  const totalCvPages = Math.max(1, Math.ceil(sortedCurriculums.length / ITEMS_PER_PAGE));
  const paginatedCurriculums = sortedCurriculums.slice((cvPage - 1) * ITEMS_PER_PAGE, cvPage * ITEMS_PER_PAGE);

  // Recharts metric calculations and formatting
  const categoryChartData = Object.entries(metrics.categorias).map(([name, val]) => ({
    name: name.toUpperCase(),
    cantidad: val
  }));

  const priorityChartData = Object.entries(metrics.prioridades).map(([name, val]) => ({
    name: name.toUpperCase(),
    cantidad: val
  }));

  const stateColors: Record<string, string> = {
    recibido: '#4F46E5', // Indigo
    analizando: '#EAB308', // Yellow
    observado: '#F97316', // Orange
    aprobado: '#10B981', // Emerald
    denegado: '#EF4444' // Red
  };

  const priorityColors: Record<string, string> = {
    baja: '#64748B', // slate
    media: '#3B82F6', // blue
    alta: '#EAB308', // amber
    critica: '#EF4444' // red
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans" id="applet-container">
      {/* HEADER PRINCIPAL */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md" id="header-yau">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/30">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                  SENATI 2026
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                GDI Yau: Inteligencia Documental
              </h1>
              <p className="text-xs text-slate-400">
                Sistema Automatizado de Gestión de Trámites y Selección de Personal con Machine Learning · Mun. Provincial de Yau
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex flex-row items-center gap-2 sm:gap-3 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <UserProfile user={currentUser} onSignOut={handleSignOut} />
                <button
                  onClick={refreshData}
                  className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition-colors border border-slate-700 cursor-pointer font-semibold"
                  title="Sincronizar base de datos"
                  id="btn-sync"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sincronizar Datos</span>
                </button>
                <span className="text-xs text-slate-400 font-mono bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800 hidden sm:inline-block" id="utc-clock">
                  UTC: 2026-06-06
                </span>
              </div>
            ) : (
              <div className="flex flex-row items-center gap-2 sm:gap-3">
                {['kpis', 'empleados', 'curriculums'].includes(activeTab) ? (
                  <button
                    onClick={() => {
                      setActiveTab('ciudadano');
                    }}
                    className="flex items-center gap-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded-lg transition-all shadow-md cursor-pointer border border-rose-500/20"
                    id="btn-header-login"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Regresar a Página Principal</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      console.log('[APP] Acceso Funcionario clicked, navigating to empleados');
                      setActiveTab('empleados');
                    }}
                    className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-505 text-white font-bold px-3 py-1.5 rounded-lg transition-all shadow-md cursor-pointer border border-indigo-500/20"
                    id="btn-header-login"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Acceso Funcionario</span>
                  </button>
                )}
                <span className="text-xs text-slate-400 font-mono bg-slate-800/40 px-2.5 py-1.5 rounded-lg border border-slate-700/50 hidden sm:inline-block" id="utc-clock">
                  UTC: 2026-06-06
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* METRIC RIBBON ALERT IF OFFLINE OR NO SECRET ENV SET */}
      <div className="bg-amber-50 border-b border-amber-200 text-amber-950 px-4 py-2 text-xs" id="ai-status-bar">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
            <span>
              <strong>Asistente de IA Activado:</strong> El motor de lenguaje procesa cada solicitud automáticamente. Si no hay conexión de API Key, se activa un clasificador lógico adaptativo de respaldo de la Municipalidad de Yau.
            </span>
          </div>
          <a 
            href="#senati-faq-panel" 
            onClick={() => { setActiveTab('guia'); }}
            className="underline font-bold hover:text-amber-700"
          >
            Ver Marco Teórico SENATI &rarr;
          </a>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* BANNER NOTIFICADOR DE ACCION */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-900 rounded-xl flex items-center gap-3 text-sm animate-fade-in" id="error-alert">
            <AlertTriangle className="w-5 h-5 text-red-650 shrink-0" />
            <div>
              <p className="font-semibold">Aviso del Sistema</p>
              <p className="text-xs text-red-700">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-250 text-emerald-950 rounded-xl flex items-start gap-3 text-sm animate-fade-in" id="success-alert">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-emerald-900">Operación Realizada con Éxito</p>
              <p className="text-xs text-emerald-800 mt-0.5">{successMsg}</p>
            </div>
            <button 
              onClick={() => setSuccessMsg(null)} 
              className="text-emerald-500 hover:text-emerald-700 text-xs font-bold font-mono px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* NAVEGACIÓN PRINCIPAL (PESTAÑAS EN POSICIÓN HORIZONTAL A LO LARGO) */}
        <div className="flex flex-row overflow-x-auto items-center border border-slate-200 bg-white rounded-xl p-1.5 mb-8 gap-1.5 w-full shadow-sm scrollbar-none whitespace-nowrap" id="navigation-tabs">
          {/* Vistas de Administración (Solo visibles para Funcionarios Municipales autenticados) */}
          {currentUser ? (
            <>
              <button
                onClick={() => setActiveTab('kpis')}
                className={`flex items-center gap-2 px-4.5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'kpis' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                id="tab-kpis"
              >
                <Activity className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Mesa de Control (KPIs)</span>
              </button>
              <button
                onClick={() => {
                  console.log('[APP] Acceso Empleados clicked, currentUser:', currentUser);
                  setActiveTab('empleados');
                }}
                className={`flex items-center gap-2 px-4.5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'empleados' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                id="tab-empleados"
              >
                <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Bandeja Municipal ({filteredTramites.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('curriculums')}
                className={`flex items-center gap-2 px-4.5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'curriculums' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                id="tab-curriculums-admin"
              >
                <Users className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Selección de Personal (Cribado CV)</span>
              </button>
            </>
          ) : (
            <>
              {/* Vistas Públicas de Ciudadanos (Solo visibles cuando no hay administrador autenticado) */}
              <button
                onClick={() => setActiveTab('ciudadano')}
                className={`flex items-center gap-2 px-4.5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'ciudadano' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                id="tab-ciudadano"
              >
                <PlusCircle className="w-4 h-4 text-violet-500 shrink-0" />
                <span>Mesa de Partes Virtual</span>
              </button>

              <button
                onClick={() => setActiveTab('mis-tramites')}
                className={`flex items-center gap-2 px-4.5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'mis-tramites' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                id="tab-mis-tramites"
              >
                <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Mis Trámites en Revisión</span>
              </button>
            </>
          )}
          
          <button
            onClick={() => setActiveTab('guia')}
            className={`flex items-center gap-2 px-4.5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'guia' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
            id="tab-guia"
          >
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Preguntas Guía (SENATI)</span>
          </button>
        </div>

        {/* ==========================================
            TAB 1: PANEL DE CONTROL Y KPIS DE RENDIMIENTO
            ========================================== */}
        {activeTab === 'kpis' && (
          !currentUser ? (
            <LoginScreen onSignIn={handleGoogleSignIn} onAdminSignIn={handleMockAdminSignIn} loading={loading} />
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.35, ease: 'easeOut' }} 
              className="space-y-8" 
              id="panel-kpis-tab"
            >
            {/* HERO PRINCIPAL */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden" id="hero-muni">
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 max-w-3xl">
                <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-widest bg-emerald-500 text-emerald-950 rounded-lg">
                  Gestión Pública Eficiente con IA
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-3 text-white">
                  Modernización del Proceso y Resoluciones Municipales de Yau
                </h2>
                <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
                  Para contrarrestar cuellos de botella y largas colas, disminuimos drásticamente los tiempos de evaluación. Cada expediente se pre-clasifica y evalúa en un tiempo inferior a 3 segundos, determinando prioridad mediante Machine Learning y emitiendo alertas inmediatas al teléfono del ciudadano.
                </p>
                <div className="mt-5 flex flex-wrap gap-4">
                  <button 
                    onClick={() => setActiveTab('empleados')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 font-semibold cursor-pointer"
                  >
                    📂 Gestionar Expedientes (Bandeja Municipal)
                  </button>
                </div>
              </div>
            </div>

            {/* TARJETAS DE MÉTRICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="kpis-row">
              <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold tracking-wide uppercase">Total Trámites Registrados</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{metrics.totalTramites}</h3>
                  <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1 font-semibold">
                    <span className="font-mono">+100%</span> procesado digitalmente
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold tracking-wide uppercase">Alertas en Tiempo Real</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{metrics.totalAlertasEnviadas}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 font-semibold">
                     Canales: SMS, Email, WhatsApp
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Bell className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold tracking-wide uppercase">Índice Satisfacción Ciudadana</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900">{metrics.indiceSatisfaccion}</span>
                    <span className="text-xs text-slate-400">/ 5</span>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1.5 flex items-center gap-1 font-semibold">
                    ★ ★ ★ ★ ☆ ({metrics.satisfaccionVotos} encuestas)
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold tracking-wide uppercase">Precisión Clasificador NLP</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{metrics.precisionML}%</h3>
                  <p className="text-xs text-slate-500 mt-1.5 font-semibold">
                     Refinado por feedback humano
                  </p>
                </div>
                <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
                  <Sliders className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* SECCIÓN DE GRÁFICAS DE RECHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="charts-row">
              <div className="bg-white rounded-xl p-5 md:p-6 border border-slate-100 shadow-xs">
                <div className="mb-4">
                  <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">Distribución de Trámites por Categorías</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Volumen total de carga de expedientes administrativos</p>
                </div>
                <div className="h-64" id="category-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryChartData}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                        labelStyle={{ fontWeight: 'bold' }}
                      />
                      <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#06b6d4'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 md:p-6 border border-slate-100 shadow-xs">
                <div className="mb-4">
                  <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">Trámites Clasificados por Prioridad Crítica</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Asignación algorítmica para optimización de tiempos en cola</p>
                </div>
                <div className="h-64 flex flex-col md:flex-row items-center justify-between gap-4" id="priority-chart-container">
                  <div className="w-full md:w-3/5 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={priorityChartData}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff' }}
                        />
                        <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
                          {priorityChartData.map((entry, index) => {
                            const nameLower = entry.name.toLowerCase();
                            const color = priorityColors[nameLower] || '#4f46e5';
                            return <Cell key={`cell-p-${index}`} fill={color} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Leyenda explicativa de prioridades exigidas por el PDF */}
                  <div className="w-full md:w-2/5 space-y-2 text-xs" id="priority-legend">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full shrink-0"></span>
                      <div>
                        <span className="font-bold text-slate-800">Crítica</span>: Riesgo de daño público.
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full shrink-0"></span>
                      <div>
                        <span className="font-bold text-slate-800">Alta</span>: Reclamos e impuestos erróneos.
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full shrink-0"></span>
                      <div>
                        <span className="font-bold text-slate-800">Media</span>: Renovación e ITSE comercial.
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-slate-500 rounded-full shrink-0"></span>
                      <div>
                        <span className="font-bold text-slate-800">Baja</span>: Registros estandarizados civiles.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCION BIENVENIDA MUNICIPAL EXPLICACIÓN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="features-info">
              <div className="bg-slate-100/50 border border-slate-200/50 rounded-xl p-5 text-center">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-slate-900 text-sm">Clasificación por NLP</h5>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Analiza el título y argumentos del pedido de forma sintáctica, infiriendo de forma inmediata el área administrativa correspondiente de la Municipalidad de Yau.
                </p>
              </div>

              <div className="bg-slate-100/50 border border-slate-200/50 rounded-xl p-5 text-center">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-slate-900 text-sm">Alertas Simuladas (WhatsApp / SMS)</h5>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Actualice estados desde la bandeja municipal. El sistema generará y mostrará una alerta simulada de SMS, E-mail o WhatsApp en la bitácora de seguimiento.
                </p>
              </div>

              <div className="bg-slate-100/50 border border-slate-200/50 rounded-xl p-5 text-center">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-slate-900 text-sm">Cribado de CVs (RRHH)</h5>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Módulo de selección de personal incorporado. Evalúa la compatibilidad (%) de postulantes para cargos especializados como inspectores ITSE o ingenieros de obras.
                </p>
              </div>
            </div>

          </motion.div>
          )
        )}

        {/* ==========================================
            TAB 2: MESA DE PARTES VIRTUAL (CIUDADANO)
            ========================================== */}
        {activeTab === 'ciudadano' && (
          latestSubmission ? (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-8"
              id="citizen-success-view"
            >
              {/* Celeb Check Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden" id="success-banner">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-emerald-950/30 text-white border border-white/20 rounded-md">
                      Mesa de Partes Virtual - IA Procesado
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-3 text-white">
                      ¡Trámite Registrado &amp; Clasificado Correctamente!
                    </h2>
                    <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
                      Su expediente ha sido ingresado en la base de datos de la municipalidad. El motor inteligente determinó su clasificación técnica y prioridad para automatizar su derivación.
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0 w-full md:w-auto bg-emerald-950/25 p-4 rounded-xl border border-white/15">
                    <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">Código de Seguimiento</span>
                    <span className="text-2xl font-black font-mono tracking-wider text-white select-all">{latestSubmission.id}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(latestSubmission.id);
                        alert("Código de seguimiento copiado: " + latestSubmission.id);
                      }}
                      className="text-[10px] font-bold text-white hover:underline bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-all flex items-center gap-1.5 cursor-pointer mt-1"
                    >
                      Copiar Código
                    </button>
                  </div>
                </div>
              </div>

              {/* TWO COLUMN GRID DETAILS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LADO IZQUIERDO: DETALLE DE SOLICITUD */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-150 p-6 space-y-6 shadow-xs">
                  <div className="flex gap-2.5 items-center border-b border-slate-100 pb-3">
                    <div className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm">Resumen de Datos Ingresados</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">DNI / Carnet</span>
                      <span className="font-mono text-slate-800 font-semibold mt-0.5 block">{latestSubmission.dni}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Ciudadano</span>
                      <span className="text-slate-800 font-semibold mt-0.5 block">{latestSubmission.nombreCiudadano}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Celular de Contacto</span>
                      <span className="font-mono text-slate-800 font-semibold mt-0.5 block">{latestSubmission.telefono}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Correo Electrónico</span>
                      <span className="text-slate-800 font-semibold mt-0.5 block break-all">{latestSubmission.correo}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Título de la Solicitud</span>
                    <span className="text-slate-950 font-bold text-sm block bg-slate-50 p-2.5 rounded-lg border border-slate-100">{latestSubmission.titulo}</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Fundamento Detallado</span>
                    <div className="text-slate-650 text-xs leading-relaxed p-4 bg-slate-50 border border-slate-100 rounded-xl whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {latestSubmission.descripcion}
                    </div>
                  </div>
                </div>

                {/* LADO DERECHO: INTERPRETACIÓN Y EVALUACIÓN DEL CLASIFICADOR NLP */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                        <h4 className="font-bold text-white text-sm">Evaluación Algorítmica Inteligente (NLP)</h4>
                      </div>
                      <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 font-bold px-2.5 py-0.5 rounded-full">
                        Confianza AI: {((latestSubmission.analisisML?.confianza || 0.95) * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 text-xs">
                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                        <span className="block text-[9px] uppercase font-extrabold text-indigo-200 tracking-wider">Área Municipal</span>
                        <div className="flex items-center gap-1.5 mt-1 capitalize text-white font-bold">
                          <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0"></span>
                          <span>{latestSubmission.categoria}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                        <span className="block text-[9px] uppercase font-extrabold text-indigo-200 tracking-wider">Prioridad</span>
                        <div className="flex items-center gap-1.5 mt-1 capitalize text-white font-bold">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${
                            latestSubmission.prioridad === 'critica' ? 'bg-rose-500 animate-ping' :
                            latestSubmission.prioridad === 'alta' ? 'bg-amber-400' :
                            latestSubmission.prioridad === 'media' ? 'bg-indigo-455' : 'bg-slate-400'
                          }`}></span>
                          <span>{latestSubmission.prioridad}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 bg-white/5 p-4 rounded-xl border border-white/10 text-xs">
                      <span className="block font-bold text-indigo-200 text-[10px] uppercase tracking-wider">Razonamiento Semántico del Clasificador:</span>
                      <p className="text-indigo-100 mt-1 leading-relaxed text-xs">
                        {latestSubmission.analisisML?.explicacion || "Análisis interpretado mediante procesamiento de lenguaje natural."}
                      </p>
                    </div>

                    <div className="space-y-1 bg-indigo-950/60 p-4 rounded-xl border border-indigo-800/30 text-xs">
                      <span className="block font-bold text-amber-300 text-[10px] uppercase tracking-wider">Pauta de Resolución Sugerida:</span>
                      <p className="text-slate-300 mt-1 leading-relaxed text-xs italic">
                        {latestSubmission.analisisML?.sugerenciaResolucion || "Revisión prioritaria según directrices municipales."}
                      </p>
                    </div>
                  </div>

                  {/* COLA DE ALERTAS SMS SIMULADAS */}
                  <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs space-y-4">
                    <div className="flex gap-2 items-center text-slate-800 border-b border-slate-100 pb-3">
                      <Bell className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-sm">Disparador de Alertas Multicanal (Simulado)</span>
                    </div>

                    <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-805 font-mono uppercase">SMS / WhatsApp</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-850 px-2 py-0.5 rounded font-black">ENVIADO</span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-705 bg-white p-2.5 rounded border border-slate-201 leading-snug">
                        MUNIYAU AUTOMATIZADO: Su trámite con ID: {latestSubmission.id} ha sido procesado por el clasificador ML. Categoría: {latestSubmission.categoria.toUpperCase()}, Prioridad: {latestSubmission.prioridad.toUpperCase()}.
                      </p>
                      <div className="text-[9px] text-slate-400 mt-1 flex gap-1">
                        <span>Canal de envío directo para el número:</span>
                        <span className="font-bold text-slate-700">{latestSubmission.telefono}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Retroalimentación / Encuesta del Ciudadano */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex gap-2.5 items-center border-b border-slate-100 pb-3">
                  <div className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg">
                    <Star className="w-4 h-4 fill-yellow-400" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm">Retroalimentación / Encuesta del Ciudadano</span>
                </div>

                {feedbackSentForLatest && lastSentFeedback ? (
                  <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4 text-xs space-y-1 animate-fadeInUp">
                    <div className="flex items-center gap-1.5 text-emerald-950 font-bold">
                      <span className="text-yellow-600 font-extrabold text-sm">★ {lastSentFeedback.calificacion} / 5</span>
                      <span>Enviado Correctamente</span>
                    </div>
                    <p className="text-slate-650 italic mt-1 font-medium bg-white/50 p-2 rounded-lg">
                      &ldquo;{lastSentFeedback.comentario || "Atención automatizada rápida y eficiente"}&rdquo;
                    </p>
                    <p className="text-[10px] text-emerald-800 font-semibold pt-1">
                      ¡Agradecemos mucho sus valiosos comentarios! Su feedback ha sido registrado para afinar el modelo de Inteligencia de Yau.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleSendFeedback(e, latestSubmission.id)} className="space-y-4">
                    <p className="text-xs font-medium text-slate-600">Simule la valoración del ciudadano tras recibir la notificación del trámite:</p>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setStarRating(s)}
                            className="focus:outline-none text-base cursor-pointer hover:scale-110 active:scale-95 transition-all p-1"
                          >
                            <Star className={`w-5 h-5 ${s <= starRating ? 'fill-yellow-400 text-yellow-450' : 'text-slate-300'}`} />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{starRating} Estrellas</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold text-slate-400">Escriba un breve comentario</label>
                      <input 
                        type="text"
                        value={feedbackComment}
                        onChange={e => setFeedbackComment(e.target.value)}
                        placeholder="ej. Excelente atención automatizada, no hice colas..."
                        className="w-full text-xs border border-slate-200 focus:border-indigo-500 rounded-lg px-3 py-2.5 outline-none bg-white font-medium"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Registrar Feedback de Ciudadano
                    </button>
                  </form>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setLatestSubmission(null)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Registrar otro Trámite / Volver a la Mesa de Partes
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              id="panel-ciudadano-tab"
            >
            
            {/* LADO IZQUIERDO: FORMULARIO */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-150 p-6 md:p-8 shadow-xs" id="col-form-tramite">
              <div className="mb-6 flex gap-3 items-center">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Mesa de Partes Virtual - Registro de Solicitudes</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Ingrese sus datos para clasificar y priorizar automáticamente su trámite mediando Machine Learning.</p>
                </div>
              </div>

              {/* Presets buttons to click quickly for presentation demonstration */}
              <div className="mb-6 bg-slate-50 border border-slate-100 rounded-xl p-4" id="presets-panel-tramites">
                <span className="text-xs font-bold text-slate-500 block mb-2">Simular expedientes para probar el clasificador Inteligente (NLP - ML):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  <button 
                    type="button"
                    onClick={loadPresetTramite1}
                    className="text-left text-xs bg-red-50 hover:bg-red-100 text-red-800 p-2.5 rounded-lg border border-red-200 font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    🚨 Fuga de Gas (Crítico)
                  </button>
                  <button 
                    type="button"
                    onClick={loadPresetTramite2}
                    className="text-left text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-850 p-2.5 rounded-lg border border-indigo-200 font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    📅 Feria Artesanal (Media)
                  </button>
                  <button 
                    type="button"
                    onClick={loadPresetTramite3}
                    className="text-left text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-850 p-2.5 rounded-lg border border-emerald-200 font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    💊 Botica Licencia (Media)
                  </button>
                  <button 
                    type="button"
                    onClick={loadPresetTramite4}
                    className="text-left text-xs bg-amber-50 hover:bg-amber-100 text-amber-850 p-2.5 rounded-lg border border-amber-200 font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    💰 Cobro de Impuestos (Media)
                  </button>
                  <button 
                    type="button"
                    onClick={loadPresetTramite5}
                    className="text-left text-xs bg-slate-150 hover:bg-slate-200 text-slate-800 p-2.5 rounded-lg border border-slate-300 font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    📝 Error Partida Naci. (Baja)
                  </button>
                  <button 
                    type="button"
                    onClick={loadPresetTramite6}
                    className="text-left text-xs bg-rose-50/80 hover:bg-rose-100 text-rose-800 p-2.5 rounded-lg border border-rose-250 font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    💦 Desagüe Colapso (Crítico)
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setNewTramite({
                        dni: '',
                        nombreCiudadano: '',
                        telefono: '',
                        correo: '',
                        titulo: '',
                        descripcion: ''
                      });
                    }}
                    className="text-left text-xs bg-violet-50 hover:bg-violet-100 text-violet-850 p-2.5 rounded-lg border border-dashed border-violet-300 font-bold transition-all cursor-pointer shadow-xs"
                  >
                    ➕ OTRO (Formulario Vacío)
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2.5 italic">
                  * Haz clic en cualquiera de estos botones para precargar el texto prototípico o escribe libremente tu propio de forma manual seleccionando el botón violeta para vaciar el formulario.
                </p>
              </div>

              <form onSubmit={handleRegisterTramite} className="space-y-5" id="form-registro-documentos">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">D.N.I. Ciudadano / Carnet (*)</label>
                    <input 
                      type="text" 
                      value={newTramite.dni}
                      onChange={e => setNewTramite({...newTramite, dni: e.target.value})}
                      placeholder="8 dígitos ej. 41920384"
                      className="w-full text-sm border border-slate-200 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg px-3.5 py-2.5 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nombre Completo (*)</label>
                    <input 
                      type="text" 
                      value={newTramite.nombreCiudadano}
                      onChange={e => setNewTramite({...newTramite, nombreCiudadano: e.target.value})}
                      placeholder="Ej. Carlos Alberto Quispe Romero"
                      className="w-full text-sm border border-slate-200 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg px-3.5 py-2.5 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Número de Celular (*)</label>
                    <input 
                      type="tel" 
                      value={newTramite.telefono}
                      onChange={e => setNewTramite({...newTramite, telefono: e.target.value})}
                      placeholder="9 dígitos para alertas SMS/WhatsApp"
                      className="w-full text-sm border border-slate-200 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg px-3.5 py-2.5 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Correo Electrónico (*)</label>
                    <input 
                      type="email" 
                      value={newTramite.correo}
                      onChange={e => setNewTramite({...newTramite, correo: e.target.value})}
                      placeholder="ejemplo@correo.com"
                      className="w-full text-sm border border-slate-200 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg px-3.5 py-2.5 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Título de la Solicitud (*)</label>
                  <input 
                    type="text" 
                    value={newTramite.titulo}
                    onChange={e => setNewTramite({...newTramite, titulo: e.target.value})}
                    placeholder="Escriba un título claro ej. Fuga masiva de gas en mercado municipal central"
                    className="w-full text-sm border border-slate-200 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg px-3.5 py-2.5 outline-none font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Fundamento / Descripción Detallada (*)</label>
                  <textarea 
                    value={newTramite.descripcion}
                    onChange={e => setNewTramite({...newTramite, descripcion: e.target.value})}
                    rows={4}
                    placeholder="Describa a detalle su situación para que el motor inteligente de la municipalidad pueda asignarle prioridad de inmediato."
                    className="w-full text-sm border border-slate-200 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 rounded-lg px-3.5 py-2.5 outline-none leading-relaxed"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Analizando texto mediante Gemini Natural Language &amp; Clasificando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Registrar en Mesa de Partes Virtual y Pre-evaluar con IA
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* LADO DERECHO: EXPLICACIÓN DE PROTECCIÓN DE DATOS Y TRANSPARENCIA */}
            <div className="lg:col-span-5 space-y-6" id="col-info-tramite">
              <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
                <div className="flex gap-3 items-center mb-4">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">¿Cómo trabaja la Inteligencia Artificial?</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  La Municipalidad Provincial de Yau ha desplegado un modelo <strong>NLP (Natural Language Processing)</strong> que interpreta semánticamente los textos. Al ingresar su glosa:
                </p>
                <ul className="mt-3 space-y-2 text-xs text-slate-400 pl-4 list-decimal leading-relaxed">
                  <li>Identifica instantáneamente si pertenece a <strong>Obras, Licencias, Registro Civil, Tributación o Consultas Generales.</strong></li>
                  <li>Infiere el nivel de <strong>criticidad</strong> basándose en riesgos sanitarios, de seguridad pública e infracciones monetarias.</li>
                  <li>Genera una propuesta preliminar de resolución técnica que disminuye retrasos y previene que el expediente quede traspapelado.</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
                <div className="flex gap-3 items-center text-slate-800">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <h4 className="font-bold text-sm">Cumplimiento de Ley de Protección de Datos</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Conforme a la normativa nacional, el tratamiento de sus datos personales (correo, teléfono y DNI) cumple estrictamente los estándares internacionales de confidencialidad para la gestión gubernamental transparente:
                </p>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-650 leading-snug">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Sus datos están cifrados y solo se utilizarán para la emisión de alertas del curso del trámite en tiempo real para evitar que realice colas físicas innecesarias.</span>
                </div>
              </div>
            </div>
          </motion.div>
          )
        )}

        {/* ==========================================
            TAB CIUDADANO: MIS TRÁMITES EN REVISIÓN
            ========================================== */}
        {activeTab === 'mis-tramites' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-6"
            id="panel-mis-tramites"
          >
            <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs">
              <div className="mb-5 flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Mis Trámites en Revisión</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Seguimiento de sus solicitudes registradas en la Municipalidad de Yau.</p>
                </div>
              </div>

              {tramites.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No hay trámites registrados aún.</p>
                  <button
                    onClick={() => setActiveTab('ciudadano')}
                    className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Ir a Mesa de Partes para registrar uno
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tramites.map(t => {
                    const estadoColor = stateColors[t.estado] || '#64748B';
                    const prioridadColor = priorityColors[t.prioridad] || '#CBD5E1';
                    return (
                      <div key={t.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:border-slate-200 transition-all">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {t.id}
                          </span>
                          <span 
                            className="text-[10px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded"
                            style={{ backgroundColor: estadoColor + '15', color: estadoColor }}
                          >
                            {t.estado}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-800 text-sm line-clamp-1 leading-snug">{t.titulo}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{t.descripcion}</p>
                        <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: prioridadColor }}></span>
                            <span className="text-[10px] font-bold text-slate-500 capitalize">Prioridad {t.prioridad}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(t.fechaCreacion).toLocaleDateString()}
                          </span>
                        </div>
                        {t.alertas && t.alertas.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Última notificación:</p>
                            <p className="text-xs text-slate-600 italic line-clamp-1">
                              {t.alertas[t.alertas.length - 1]?.mensaje}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ==========================================
            TAB 3: BANDEJA MUNICIPAL (EMPLEADOS & OFICINAS)
            ========================================== */}
        {activeTab === 'empleados' && (
          !currentUser ? (
            <LoginScreen onSignIn={handleGoogleSignIn} onAdminSignIn={handleMockAdminSignIn} loading={loading} />
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6" 
              id="panel-empleados-tab"
            >
            
            {/* LADO IZQUIERDO: BANDEJA DE ENTRADA CON EXPEDIENTES */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-150 overflow-hidden flex flex-col h-[700px] shadow-xs" id="col-ban-exp">
              
              {/* CABECERA FILTRADO */}
              <div className="p-4 border-b border-slate-100 bg-slate-55/40 space-y-3" id="filters-container">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filtrar Expedientes</span>
                  <button 
                    onClick={() => {
                      setFilterCategoria('todos');
                      setFilterPrioridad('todos');
                      setFilterEstado('todos');
                    }}
                    className="text-xs text-indigo-600 font-bold hover:underline"
                  >
                    Limpiar Filtros
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-0.5">Categoría</label>
                    <select 
                      value={filterCategoria} 
                      onChange={e => setFilterCategoria(e.target.value)}
                      className="w-full text-xs border border-slate-100 rounded bg-white p-1 outline-none font-medium text-slate-700"
                    >
                      <option value="todos">Todas</option>
                      <option value="licencias">Licencias</option>
                      <option value="obras">Obras</option>
                      <option value="registro">Reg. Civil</option>
                      <option value="tributacion">Tributación</option>
                      <option value="otros">Otros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-0.5">Prioridad</label>
                    <select 
                      value={filterPrioridad} 
                      onChange={e => setFilterPrioridad(e.target.value)}
                      className="w-full text-xs border border-slate-100 rounded bg-white p-1 outline-none font-medium text-slate-700"
                    >
                      <option value="todos">Todas</option>
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                      <option value="critica">Crítica</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-0.5">Estado actual</label>
                  <select 
                    value={filterEstado} 
                    onChange={e => setFilterEstado(e.target.value)}
                    className="w-full text-xs border border-slate-100 rounded bg-white p-1 outline-none font-medium text-slate-700"
                  >
                    <option value="todos">Todos los Estados</option>
                    <option value="recibido">Recibido (Pre-evaluado IA)</option>
                    <option value="analizando">Bajo Inspección</option>
                    <option value="observado">Observado</option>
                    <option value="aprobado">Aprobado / Firmado</option>
                    <option value="denegado">Denegado</option>
                  </select>
                </div>
              </div>

              {/* LISTADO IN-MEMORY */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100" id="lista-tramites-items">
                {filteredTramites.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">Ningún expediente califica con los filtros activos.</p>
                  </div>
                ) : (
                  paginatedTramites.map(t => {
                    const isSelected = t.id === selectedTramiteId;
                    const cColor = priorityColors[t.prioridad] || '#CBD5E1';
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTramiteId(t.id)}
                        className={`p-4 text-left cursor-pointer transition-all ${isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-50'}`}
                        id={`card-tramite-${t.id}`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {t.id}
                          </span>
                          <span 
                            className="text-[10px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded"
                            style={{ backgroundColor: stateColors[t.estado] + '15', color: stateColors[t.estado] }}
                          >
                            {t.estado}
                          </span>
                        </div>
                        
                        <h4 className="font-semibold text-slate-800 text-sm line-clamp-1 leading-snug">{t.titulo}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-normal">{t.descripcion}</p>
                        
                        <div className="flex justify-between items-center mt-3 gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <span 
                              className="w-2.5 h-2.5 rounded-full shrink-0" 
                              style={{ backgroundColor: cColor }}
                            ></span>
                            <span className="text-[10px] font-bold text-slate-500 capitalize">Prioridad {t.prioridad}</span>
                          </div>

                          <span className="text-[10px] text-slate-450 font-mono">
                            {new Date(t.fechaCreacion).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {filteredTramites.length > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Página {tramitePage} de {totalTramitePages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTramitePage(p => Math.max(1, p - 1))}
                      disabled={tramitePage === 1}
                      className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Anterior
                    </button>
                    <button
                      type="button"
                      onClick={() => setTramitePage(p => Math.min(totalTramitePages, p + 1))}
                      disabled={tramitePage === totalTramitePages}
                      className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* LADO DERECHO: REVISIÓN PROFUNDA DEL EXPEDIENTE Y CONTROL DE ESTADOS */}
            <div className="lg:col-span-7 space-y-6" id="col-detail-exp">
              {selectedTramite ? (
                <div className="bg-white rounded-xl border border-slate-150 p-6 space-y-6 shadow-xs animate-fade-in" id="panel-vistas-detalle">
                  
                  {/* HEADER DETALLE */}
                  <div className="flex justify-between items-start flex-wrap gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded">
                          {selectedTramite.id}
                        </span>
                        <span className="text-xs text-slate-450 font-mono">
                          Registrado: {new Date(selectedTramite.fechaCreacion).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-950 mt-2 leading-snug">{selectedTramite.titulo}</h3>
                    </div>

                    {/* Badge de prioridad visual */}
                    <div 
                      className="text-xs font-bold px-3 py-1.5 rounded-xl text-white shadow-xs capitalize"
                      style={{ backgroundColor: priorityColors[selectedTramite.prioridad] }}
                    >
                      Prioridad {selectedTramite.prioridad}
                    </div>
                  </div>

                  {/* IDENTIDAD CIUDADANO */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">DNI Ciudadano</span>
                      <span className="font-medium text-slate-850 text-sm mt-0.5 block">{selectedTramite.dni}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Nombres</span>
                      <span className="font-medium text-slate-850 text-sm mt-0.5 block line-clamp-1">{selectedTramite.nombreCiudadano}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Teléfono</span>
                      <span className="font-medium text-slate-850 text-sm mt-0.5 block">{selectedTramite.telefono}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">E-mail</span>
                      <span className="font-medium text-slate-850 text-sm mt-0.5 block line-clamp-1">{selectedTramite.correo}</span>
                    </div>
                  </div>

                  {/* DESCRIPCIÓN DEL EXPEDIENTE */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Glosa de Sustento del Expediente</h5>
                    <div className="text-slate-700 text-sm leading-relaxed p-4 bg-white border border-slate-100 rounded-xl whitespace-pre-wrap">
                      {selectedTramite.descripcion}
                    </div>
                  </div>

                  {/* CAJA DE ANÁLISIS MACHINE LEARNING (GEMINI MODEL INTEGRADO) */}
                  <div className="bg-indigo-50/50 border border-indigo-150 p-5 rounded-xl space-y-4 shadow-sm">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                        <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                        <span>Pre-Evaluación Algorítmica Inteligente (Naturaleza del Documento)</span>
                      </div>
                      <span className="text-xs font-mono bg-indigo-100 text-indigo-805 font-bold px-2 py-0.5 rounded">
                        Confianza AI: {(selectedTramite.analisisML.confianza * 100).toFixed(1)}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      <strong>Explicación del Modelo:</strong> {selectedTramite.analisisML.explicacion}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
                      <div className="p-3 bg-white border border-indigo-100 rounded-lg">
                        <span className="block font-bold text-indigo-900">Categoría Recomendada</span>
                        <span className="font-mono text-slate-700 text-sm capitalize mt-1 block">{selectedTramite.analisisML.categoriaSugerida || selectedTramite.categoria}</span>
                      </div>
                      <div className="p-3 bg-white border border-indigo-100 rounded-lg">
                        <span className="block font-bold text-indigo-900">Prioridad Sugerida</span>
                        <span className="font-mono text-slate-755 text-sm capitalize mt-1 block">{selectedTramite.analisisML.prioridadCalculada || selectedTramite.prioridad}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-900 text-indigo-100 rounded-lg text-xs font-medium flex gap-2">
                      <span className="font-bold text-white shrink-0">🔨 Recomendación Operador:</span>
                      <span>{selectedTramite.analisisML.sugerenciaResolucion}</span>
                    </div>
                  </div>

                  {/* CAMBIO DE ESTADOS Y CONTROL */}
                  <div className="pt-2 border-t border-slate-100">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Acciones del Operario (Coordinación de Estado)</h5>
                    <div className="flex flex-wrap gap-2" id="btn-estado-actions">
                      <button 
                        onClick={() => handleUpdateEstado(selectedTramite.id, 'analizando')}
                        className={`text-xs py-2 px-3.5 rounded-lg border font-semibold transition-all ${selectedTramite.estado === 'analizando' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-205'}`}
                      >
                        ✓ Investigar (Inspección)
                      </button>
                      <button 
                        onClick={() => handleUpdateEstado(selectedTramite.id, 'observado')}
                        className={`text-xs py-2 px-3.5 rounded-lg border font-semibold transition-all ${selectedTramite.estado === 'observado' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-205'}`}
                      >
                        ⚠ Observar Expediente
                      </button>
                      <button 
                        onClick={() => handleUpdateEstado(selectedTramite.id, 'aprobado')}
                        className={`text-xs py-2 px-3.5 rounded-lg border font-semibold transition-all ${selectedTramite.estado === 'aprobado' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-205'}`}
                      >
                        ★ Aprobar y Firmar
                      </button>
                      <button 
                        onClick={() => handleUpdateEstado(selectedTramite.id, 'denegado')}
                        className={`text-xs py-2 px-3.5 rounded-lg border font-semibold transition-all ${selectedTramite.estado === 'denegado' ? 'bg-red-500 text-white border-red-500' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-205'}`}
                      >
                        ✕ Denegar Solicitud
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium block mt-2 text-right italic">
                      * Nota de Simulación Académica: Los envíos de SMS o WhatsApp son simulados en tiempo real dentro de la bitácora inferior por tratarse de un entorno académico.
                    </span>
                  </div>

                  {/* COLA DE CONCILIACIONES Y ALERTAS ENVIADAS (SIMULADAS EN TIEMPO REAL) */}
                  <div className="border-t border-slate-100 pt-4" id="alertas-timeline">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-emerald-500" />
                      Historial de Alertas de la Plataforma (Simulación: SMS / Email / WhatsApp)
                    </h5>
                    
                    <div className="space-y-2.5">
                      {selectedTramite.alertas.map((al, ai) => (
                        <div key={al.id || ai} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2.5 text-xs">
                          <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 shrink-0">
                            {al.tipo}
                          </span>
                          <div className="flex-1">
                            <p className="text-slate-500 font-mono text-[10px]" style={{ fontSize: '9px' }}>
                              Seguimiento: {al.id} &middot; {new Date(al.timestamp).toLocaleTimeString()}
                            </p>
                            <p className="text-slate-750 font-medium mt-1 select-all">{al.mensaje}</p>
                            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Destinatario: {al.destino}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ENCUESTA DE SATISFACCIÓN CIUDADANA */}
                  <div className="border-t border-slate-100 pt-5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Retroalimentación / Encuesta del Ciudadano</h5>
                    
                    {selectedTramite.feedback ? (
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-xs space-y-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex font-semibold items-center text-emerald-950 gap-1">
                            <span className="font-bold text-yellow-600">★ {selectedTramite.feedback.calificacion} / 5</span>
                            <span>(Excelente)</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(selectedTramite.feedback.fechaFeedback).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-650 italic mt-1 font-medium">&ldquo;{selectedTramite.feedback.comentario}&rdquo;</p>
                        <p className="text-[10px] text-emerald-800 font-semibold pt-1">Este feedback se guardó de forma permanente y retroalimenta al clasificador inteligente.</p>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200/40 rounded-xl p-4 text-xs text-slate-500 italic">
                        No se ha registrado opinión para este trámite aún por parte del ciudadano. Se invita al ciudadano a realizar la encuesta desde la mesa de partes virtual tras procesar su expediente.
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="bg-white border border-slate-150 rounded-xl p-8 text-center text-slate-400">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-base font-medium">Seleccione un trámite de la bandeja para auditar detalles</p>
                </div>
              )}
            </div>

          </motion.div>
          )
        )}

        {/* ==========================================
            TAB 4: CRIBADO DE HOJAS DE VIDA (CURRÍCULUMS Y RRHH)
            ========================================== */}
        {activeTab === 'curriculums' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8" 
            id="panel-curriculums-tab"
          >
            
            {/* FORMULARIO POSTULACIÓN */}
            <div className="lg:col-span-5 space-y-6" id="panel-postulantes">
              <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs">
                <div className="mb-4 flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-850">Cribado de Currículos</h3>
                    <p className="text-xs text-slate-400">Módulo de selección de personal gubernamental mediante IA.</p>
                  </div>
                </div>

                {/* Preset CV screening buttons to test easily */}
                <div className="mb-4 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1.5">
                  <span className="font-bold text-slate-500 block">Cargar perfiles de prueba rápidos:</span>
                  <div className="flex flex-col gap-1.5">
                    <button 
                      type="button" 
                      onClick={loadPresetCV1}
                      className="text-left font-medium text-slate-705 bg-white border border-slate-201 hover:bg-indigo-50/50 p-1.5 rounded transition cursor-pointer"
                    >
                      👤 Ing. Civil (Subgerencia de Obras) - Coincidencia Alta
                    </button>
                    <button 
                      type="button" 
                      onClick={loadPresetCV2}
                      className="text-left font-medium text-slate-705 bg-white border border-slate-201 hover:bg-indigo-50/50 p-1.5 rounded transition cursor-pointer"
                    >
                      👤 Abogada (Especialista en Compras OSCE) - Excelente
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setNewCV({
                          nombreCandidato: '',
                          correo: '',
                          telefono: '',
                          cargoPostula: 'Ingeniero Civil - Subgerencia de Liquidación de Obras',
                          textoCV: ''
                        });
                      }}
                      className="text-left font-bold text-slate-705 bg-slate-100 border border-dashed border-slate-305 hover:bg-slate-150 p-1.5 rounded transition cursor-pointer"
                    >
                      ➕ OTRO / Vaciar Formulario (Llenado Manual)
                    </button>
                  </div>
                </div>

                <form onSubmit={handleRegisterCV} className="space-y-4" id="form-cv-screening">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Nombre Completo del Postulante (*)</label>
                    <input 
                      type="text"
                      value={newCV.nombreCandidato}
                      onChange={e => setNewCV({...newCV, nombreCandidato: e.target.value})}
                      placeholder="Ej. Ing. Alejandro Mendoza Valdivia"
                      className="w-full text-xs border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">E-mail (*)</label>
                      <input 
                        type="email"
                        value={newCV.correo}
                        onChange={e => setNewCV({...newCV, correo: e.target.value})}
                        placeholder="ejemplo@correo.com"
                        className="w-full text-xs border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Teléfono (*)</label>
                      <input 
                        type="text"
                        value={newCV.telefono}
                        onChange={e => setNewCV({...newCV, telefono: e.target.value})}
                        placeholder="945938102"
                        className="w-full text-xs border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 font-bold">Cargo Público al que Postula (*)</label>
                    <select 
                      value={newCV.cargoPostula}
                      onChange={e => setNewCV({...newCV, cargoPostula: e.target.value})}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none bg-white font-medium"
                    >
                      <option value="Ingeniero Civil - Subgerencia de Liquidación de Obras">Ingeniero Civil - Subgerencia de Liquidación de Obras</option>
                      <option value="Especialista en Compras y Contrataciones del Estado">Especialista en Compras y Contrataciones del Estado</option>
                      <option value="Inspector Técnico de Seguridad en Edificaciones (ITSE)">Inspector Técnico de Seguridad en Edificaciones (ITSE)</option>
                      <option value="Registrador Civil de la Mesa Metropolitana">Registrador Civil de la Mesa Metropolitana</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Cuerpo / Extracto / Texto del CV (*)</label>
                    <textarea 
                      value={newCV.textoCV}
                      onChange={e => setNewCV({...newCV, textoCV: e.target.value})}
                      rows={6}
                      placeholder="Pegue aquí el texto extraído del Currículum Vitae del candidato para evaluar compatibilidad técnica, años de experiencia y conocimientos de normativas del estado."
                      className="w-full text-xs border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none leading-relaxed font-mono"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition"
                  >
                    {loading ? "Evaluando mediante Modelo Gemini LLM..." : "Registrar Postulante y Pre-Cribar con IA"}
                  </button>
                </form>
              </div>
            </div>

            {/* LISTADO DE POSTULANTES EVALUADOS */}
            <div className="lg:col-span-7 space-y-4" id="ranking-postulantes">
              <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs">
                
                {currentUser ? (
                  // LOGGED IN ADMIN: VIEW ALL APPLICANTS
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-slate-800">Bandeja de Selección &amp; Ranking General de Postulantes</h4>
                        <p className="text-xs text-slate-400">Currículos de postulantes evaluados mediante el modelo de Inteligencia Artificial.</p>
                      </div>
                      <span className="text-xs font-bold text-indigo-650 bg-indigo-50 px-2.5 py-1 rounded-full animate-pulse">
                        {curriculums.length} Postulados
                      </span>
                    </div>

                    <div className="space-y-4" id="cv-grid-list">
                      {sortedCurriculums.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-8">No hay postulantes registrados en el sistema.</p>
                      ) : (
                        paginatedCurriculums.map((cv) => {
                          const rec = cv.analisisML.estadoRecomendacion;
                          const compatStatusColor = cv.analisisML.puntajeCompatibilidad >= 80 
                            ? 'text-emerald-600 bg-emerald-50' 
                            : cv.analisisML.puntajeCompatibilidad >= 50 
                            ? 'text-amber-600 bg-amber-50' 
                            : 'text-red-500 bg-red-50';

                          return (
                            <div 
                              key={cv.id} 
                              className="p-5 border border-slate-100 rounded-xl bg-slate-50/50 hover:border-slate-200 transition-all space-y-3"
                              id={`curr-${cv.id}`}
                            >
                              <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">
                                    Código: {cv.id} &middot; {new Date(cv.fechaCreacion).toLocaleDateString()}
                                  </span>
                                  <h5 className="font-bold text-slate-900 text-sm mt-0.5">{cv.nombreCandidato}</h5>
                                  <p className="text-xs text-slate-600 font-medium">Postula a: <span className="text-indigo-950 font-bold">{cv.cargoPostula}</span></p>
                                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                                    📞 {cv.telefono} &middot; ✉️ {cv.correo}
                                  </p>
                                </div>

                                <div className={`text-center py-1.5 px-3 rounded-lg ${compatStatusColor}`}>
                                  <span className="text-xs font-bold tracking-tight block">Compatibilidad</span>
                                  <span className="text-lg font-black leading-none">{cv.analisisML.puntajeCompatibilidad}%</span>
                                </div>
                              </div>

                              {/* Extracto */}
                              <div className="p-3 bg-white border border-slate-100 rounded-lg text-slate-500 text-xs line-clamp-2 italic">
                                &ldquo;{cv.textoCV}&rdquo;
                              </div>

                              {/* Habilidades detectadas */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[10px] uppercase text-slate-400 font-bold shrink-0">Habilidades IA:</span>
                                {cv.analisisML.habilidadesClave.map((h, hi) => (
                                  <span key={hi} className="text-[10px] font-semibold text-slate-700 bg-slate-150 px-2 py-0.5 rounded-full border border-slate-204">
                                    {h}
                                  </span>
                                ))}
                              </div>

                              {/* Justificación y decisión */}
                              <div className="p-3.5 bg-indigo-50 text-indigo-950 border border-indigo-120 rounded-lg text-xs">
                                <div className="flex items-center gap-1.5 font-bold mb-1">
                                  <Sparkles className="w-4 h-4 text-indigo-650" />
                                  <span>Justificación de Candidatura</span>
                                </div>
                                <p className="leading-relaxed">{cv.analisisML.justificacion}</p>
                                
                                <div className="mt-2.5 pt-2 border-t border-indigo-100/55 flex justify-between items-center flex-wrap gap-2 text-[10px] uppercase">
                                  <span className="font-bold text-slate-500">Decisión en cola:</span>
                                  <span className={`font-mono font-black border px-2 py-0.5 rounded ${
                                    rec === 'aprobado' ? 'bg-emerald-100 text-emerald-800 border-emerald-250' : 
                                    rec === 'revision' ? 'bg-amber-100 text-amber-805 border-amber-205' : 
                                    'bg-red-100 text-red-800 border-red-250'
                                  }`}>
                                    {rec.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {sortedCurriculums.length > ITEMS_PER_PAGE && (
                      <div className="flex items-center justify-between px-1 pt-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Página {cvPage} de {totalCvPages}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setCvPage(p => Math.max(1, p - 1))}
                            disabled={cvPage === 1}
                            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            ← Anterior
                          </button>
                          <button
                            type="button"
                            onClick={() => setCvPage(p => Math.min(totalCvPages, p + 1))}
                            disabled={cvPage === totalCvPages}
                            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            Siguiente →
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // CITIZEN / CANDIDATE: PRIVATE RESULT VIEW (LAW N° 29733 PROTECTION)
                  <div className="space-y-4">
                    {latestEvaluatedCV ? (
                      <>
                        <div className="mb-4 p-4.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl space-y-1">
                          <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs sm:text-sm">
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                            <span>¡Postulación Evaluada con Éxito de forma Privada!</span>
                          </div>
                          <p className="text-slate-650 text-xs leading-relaxed">
                            Su evaluación individual se ha completado. En concordancia con la <strong>Ley de Protección de Datos Personales N° 29733</strong>, sus datos, respuestas y puntajes son privados y confidenciales. Solo usted puede verlos en esta pantalla.
                          </p>
                        </div>

                        <div className="p-5 border border-slate-150 rounded-2xl bg-indigo-50/10 shadow-xs space-y-4">
                          <div className="flex justify-between items-start flex-wrap gap-2 border-b border-slate-100 pb-3">
                            <div>
                              <span className="text-[10px] uppercase font-mono font-bold text-indigo-600 tracking-wider">
                                SU REPORTE INDIVIDUAL &middot; ID: {latestEvaluatedCV.id}
                              </span>
                              <h5 className="font-black text-slate-900 text-base mt-1">{latestEvaluatedCV.nombreCandidato}</h5>
                              <p className="text-xs text-slate-600 mt-1 font-medium">Cargo al que Postula: <span className="text-indigo-950 font-bold">{latestEvaluatedCV.cargoPostula}</span></p>
                            </div>

                            <div className="text-center py-2 px-3.5 bg-indigo-600 text-white rounded-xl shadow-sm">
                              <span className="text-[10px] font-bold tracking-wider block uppercase opacity-90">Compatibilidad IA</span>
                              <span className="text-2xl font-black">{latestEvaluatedCV.analisisML.puntajeCompatibilidad}%</span>
                            </div>
                          </div>

                          {/* extracto del CV */}
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase text-slate-400 font-bold block">Texto del CV analizado:</span>
                            <div className="p-3 bg-white border border-slate-100 rounded-lg text-slate-500 text-xs line-clamp-3 italic">
                              &ldquo;{latestEvaluatedCV.textoCV}&rdquo;
                            </div>
                          </div>

                          {/* habilidades */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] uppercase text-slate-400 font-bold shrink-0">Habilidades detectadas:</span>
                            {latestEvaluatedCV.analisisML.habilidadesClave.map((h, hi) => (
                              <span key={hi} className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                {h}
                              </span>
                            ))}
                          </div>

                          {/* justificacion */}
                          <div className="p-4 bg-indigo-50 text-indigo-950 border border-indigo-120 rounded-xl text-xs space-y-2">
                            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                              <Sparkles className="w-4 h-4 text-indigo-650" />
                              <span>Justificación de su Nivel de Compatibilidad (Gemini ML Model)</span>
                            </div>
                            <p className="leading-relaxed text-slate-700 font-medium">{latestEvaluatedCV.analisisML.justificacion}</p>
                            
                            <div className="mt-3 pt-3 border-t border-indigo-100/55 flex justify-between items-center flex-wrap gap-2 text-[10px] uppercase text-slate-500">
                              <span>Estado de Recomendación del Sistema:</span>
                              <span className={`font-mono font-black border px-2.5 py-0.5 rounded ${
                                latestEvaluatedCV.analisisML.estadoRecomendacion === 'aprobado' ? 'bg-emerald-100 text-emerald-850 border-emerald-200' : 
                                latestEvaluatedCV.analisisML.estadoRecomendacion === 'revision' ? 'bg-amber-100 text-amber-850 border-amber-200' : 
                                'bg-red-100 text-red-850 border-red-200'
                              }`}>
                                {latestEvaluatedCV.analisisML.estadoRecomendacion.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-650 rounded-full flex items-center justify-center mx-auto">
                          <Lock className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="space-y-1.5">
                          <h5 className="text-sm font-bold text-slate-800">Resultado de Pre-Cribado de CV (Módulo Privado)</h5>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                            Por motivos de la <strong>Ley de Protección de Datos Personales N° 29733</strong>, la bandeja general de postulantes y sus puntajes es estrictamente confidencial.
                          </p>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-dashed border-slate-200 text-slate-600 text-xs leading-relaxed max-w-sm mx-auto">
                          Complete y envíe el formulario de postulación a la izquierda con sus datos y su CV para recibir su informe de idoneidad y cribado inteligente en tiempo real.
                        </div>
                        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Conexión Protegida &middot; Ley N° 29733</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </motion.div>
        )}

        {/* ==========================================
            TAB 5: PREGUNTAS GUÍA (RESPUESTA DOCUMENTADA AL SENATI)
            ========================================== */}
        {activeTab === 'guia' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-6" 
            id="panel-guia-tab"
          >
            <div className="bg-indigo-900 text-white rounded-2xl p-6 md:p-8 flex items-center justify-between flex-wrap gap-6 border border-indigo-950">
              <div className="max-w-2xl">
                <span className="text-xs uppercase font-extrabold tracking-widest bg-amber-400 text-slate-900 border border-amber-300 px-3 py-1 rounded-md shadow-sm">
                  Entregable Oficial del Trabajo Final
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-3">Análisis Teórico &amp; Flujos Lógicos de Selección</h3>
                <p className="text-xs sm:text-sm text-indigo-200 mt-2 leading-relaxed">
                  Esta sección cumple y resuelve cabalmente las preguntas guía adjuntas en el PDF para la sustentación y calificación del estudiante de Tecnologías de la Información de SENATI.
                </p>
              </div>
              <div className="p-4 bg-white/10 rounded-xl shrink-0 border border-white/5">
                <Clock className="w-12 h-12 text-white/80" />
              </div>
            </div>

            {/* Accordion list generated in /src/components/GuideQuestions.tsx */}
            <GuideQuestions />
          </motion.div>
        )}

      </main>

      {/* FOOTER POLISHED */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 mt-16 py-8" id="footer-comp">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-indigo-500" />
            <span>&copy; {new Date().getFullYear()} Municipalidad Provincial de Yau. Todos los derechos reservados.</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Taller de Desarrollo de Aplicaciones con Machine Learning</span>
            <span className="text-slate-600">|</span>
            <span className="font-bold text-slate-300">SENATI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
