/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutDashboard, Package2, ArrowRightLeft, Users2, FileText, Settings, Search, Plus, Edit2, Trash2, Filter, TrendingUp, LogOut, User, Lock, Github, Linkedin, Facebook, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockInventory = [
  { id: 1, name: "Camiseta Polo M", stock: 142, category: "Ropa", status: "Disponible", value: "2,840" },
  { id: 2, name: "Pantalón Cargo L", stock: 8, category: "Ropa", status: "Stock bajo", value: "480" },
  { id: 3, name: "Zapatilla Runner S", stock: 67, category: "Calzado", status: "Disponible", value: "5,360" },
  { id: 4, name: "Mochila Urbana", stock: 31, category: "Accesorios", status: "Disponible", value: "1,550" },
  { id: 5, name: "Buzo Oversize M", stock: 55, category: "Ropa", status: "Disponible", value: "3,300" },
  { id: 6, name: "Cinturón Cuero", stock: 4, category: "Accesorios", status: "Stock bajo", value: "200" }
];

const mockProviders = [
  { id: "P001", name: "Empaques Globales S.A.", contact: "Carlos Diaz", email: "ventas@empaques.com", phone: "+51 987 654 321", status: "Activo" },
  { id: "P002", name: "Insumos Industriales", contact: "Ana Torres", email: "contacto@insumos.com", phone: "+51 912 345 678", status: "Activo" },
  { id: "P003", name: "Logística Total E.I.R.L.", contact: "Luis Mendez", email: "pedidos@logistica.pe", phone: "+51 923 456 789", status: "Inactivo" },
];

const mockMovements = [
  { id: "M001", date: "11 May 2026", type: "Entrada", product: "Zapatilla Runner S", quantity: 50, user: "Juan M." },
  { id: "M002", date: "10 May 2026", type: "Salida", product: "Pantalón Cargo L", quantity: -12, user: "Ana T." },
  { id: "M003", date: "09 May 2026", type: "Entrada", product: "Mochila Urbana", quantity: 20, user: "Juan M." },
  { id: "M004", date: "09 May 2026", type: "Ajuste", product: "Camiseta Polo M", quantity: -2, user: "Sistema" },
  { id: "M005", date: "08 May 2026", type: "Salida", product: "Cinturón Cuero", quantity: -5, user: "Ana T." },
];

const mockSalesData = [
  { name: 'Ene', ingresos: 4000, egresos: 2400 },
  { name: 'Feb', ingresos: 3000, egresos: 1398 },
  { name: 'Mar', ingresos: 2000, egresos: 3800 },
  { name: 'Abr', ingresos: 2780, egresos: 1908 },
  { name: 'May', ingresos: 4890, egresos: 2800 },
  { name: 'Jun', ingresos: 3390, egresos: 1800 },
];

const mockCategoryData = [
  { name: 'Ropa', value: 450 },
  { name: 'Calzado', value: 280 },
  { name: 'Accesorios', value: 150 },
  { name: 'Hogar', value: 120 },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background font-sans text-foreground overflow-hidden relative">
        {/* Decorative Blob Backgrounds for Glassmorphism */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-secondary/80 rounded-full blur-[100px] pointer-events-none mix-blend-multiply opacity-60"></div>
        <div className="absolute -bottom-40 -left-60 w-[700px] h-[700px] bg-primary/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply opacity-60"></div>
        
        <div className="flex flex-row z-10 w-full max-w-[850px] h-[500px] bg-card/60 backdrop-blur-xl rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden p-0">
          
          {/* Left Side */}
          <div className="w-1/2 bg-gradient-to-br from-primary via-[#4f5987] to-primary/80 flex flex-col justify-center items-center text-center p-8 relative overflow-hidden rounded-r-[150px] z-10 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>
            <h2 className="text-[36px] font-bold text-white mb-2 tracking-tight leading-tight">¡Bienvenido!</h2>
            <p className="text-white/80 text-[15px] mb-8 font-medium">¿No tienes una cuenta aún?</p>
          </div>

          {/* Right Side */}
          <div className="w-1/2 flex flex-col justify-center px-12 py-8 relative z-0">
            <div className="text-center mb-8">
              <h1 className="text-[32px] font-bold text-foreground">Iniciar Sesión</h1>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }}>
              <div className="space-y-4">
                <div className="relative">
                  <Input type="text" placeholder="Usuario" defaultValue="admin" className="bg-white/5 border border-white/10 text-[15px] text-foreground h-[50px] pl-5 pr-12 rounded-xl placeholder:text-muted-foreground/60 w-full focus-visible:ring-1 focus-visible:ring-primary shadow-inner" required />
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                </div>
                <div className="relative">
                  <Input type="password" placeholder="Contraseña" defaultValue="password123" className="bg-white/5 border border-white/10 text-[15px] text-foreground h-[50px] pl-5 pr-12 rounded-xl placeholder:text-muted-foreground/60 w-full focus-visible:ring-1 focus-visible:ring-primary shadow-inner" required />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                </div>
              </div>
              
              <div className="text-center mt-6 mb-4">
                <a href="#" className="text-[14px] text-muted-foreground hover:text-primary transition-colors font-medium">¿Olvidaste tu contraseña?</a>
              </div>

              <Button type="submit" className="w-full rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white h-[50px] shadow-lg border-none transition-all font-semibold tracking-wide text-[16px] mt-2">
                Ingresar
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background font-sans text-foreground selection:bg-accent selection:text-foreground overflow-hidden relative">
      {/* Decorative Blob Backgrounds for Glassmorphism */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-secondary/80 rounded-full blur-[100px] pointer-events-none mix-blend-multiply opacity-60"></div>
      <div className="absolute -bottom-40 left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply opacity-50"></div>
      
      {/* Sidebar */}
      <aside className="w-[260px] bg-gradient-to-b from-sidebar/90 to-sidebar-accent/90 backdrop-blur-3xl text-sidebar-foreground flex flex-col h-full py-10 px-6 z-10 shadow-[4px_0_24px_rgba(82,92,141,0.15)] relative">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="w-[38px] h-[38px] bg-gradient-to-br from-primary-foreground/20 to-primary-foreground/5 shadow-sm rounded-xl flex items-center justify-center">
            <Package2 size={20} className="text-white" />
          </div>
          <span className="text-white text-[19px] font-semibold tracking-wide">Inventra</span>
        </div>

        {/* Menu */}
        <nav className="flex-1 flex flex-col gap-1.5 mt-2">
          <div 
            onClick={() => setCurrentView('dashboard')}
            className={`rounded-lg py-2.5 px-4 flex items-center gap-3 cursor-pointer transition-colors ${currentView === 'dashboard' ? 'bg-gradient-to-r from-primary-foreground/15 to-primary-foreground/5 shadow-sm' : 'hover:bg-white/5 text-muted-foreground hover:text-white'}`}
          >
            <LayoutDashboard size={18} className={currentView === 'dashboard' ? 'text-white' : ''} />
            <span className={`${currentView === 'dashboard' ? 'text-white' : ''} font-medium text-[15px]`}>Dashboard</span>
          </div>
          <div 
            onClick={() => setCurrentView('products')}
            className={`rounded-lg py-2.5 px-4 flex items-center gap-3 cursor-pointer transition-colors ${currentView === 'products' ? 'bg-gradient-to-r from-primary-foreground/15 to-primary-foreground/5 shadow-sm' : 'hover:bg-white/5 text-muted-foreground hover:text-white'}`}
          >
            <Package2 size={18} className={currentView === 'products' ? 'text-white' : ''} />
            <span className={`${currentView === 'products' ? 'text-white' : ''} font-medium text-[15px]`}>Productos</span>
          </div>
          <div 
            onClick={() => setCurrentView('movements')}
            className={`rounded-lg py-2.5 px-4 flex items-center gap-3 cursor-pointer transition-colors ${currentView === 'movements' ? 'bg-gradient-to-r from-primary-foreground/15 to-primary-foreground/5 shadow-sm' : 'hover:bg-white/5 text-muted-foreground hover:text-white'}`}
          >
            <ArrowRightLeft size={18} className={currentView === 'movements' ? 'text-white' : ''} />
            <span className={`${currentView === 'movements' ? 'text-white' : ''} font-medium text-[15px]`}>Movimientos</span>
          </div>
          <div 
            onClick={() => setCurrentView('providers')}
            className={`rounded-lg py-2.5 px-4 flex items-center gap-3 cursor-pointer transition-colors ${currentView === 'providers' ? 'bg-gradient-to-r from-primary-foreground/15 to-primary-foreground/5 shadow-sm' : 'hover:bg-white/5 text-muted-foreground hover:text-white'}`}
          >
            <Users2 size={18} className={currentView === 'providers' ? 'text-white' : ''} />
            <span className={`${currentView === 'providers' ? 'text-white' : ''} font-medium text-[15px]`}>Proveedores</span>
          </div>
          <div 
            onClick={() => setCurrentView('reports')}
            className={`rounded-lg py-2.5 px-4 flex items-center gap-3 cursor-pointer transition-colors ${currentView === 'reports' ? 'bg-gradient-to-r from-primary-foreground/15 to-primary-foreground/5 shadow-sm' : 'hover:bg-white/5 text-muted-foreground hover:text-white'}`}
          >
            <FileText size={18} className={currentView === 'reports' ? 'text-white' : ''} />
            <span className={`${currentView === 'reports' ? 'text-white' : ''} font-medium text-[15px]`}>Reportes</span>
          </div>
          <div 
            onClick={() => setCurrentView('settings')}
            className={`rounded-lg py-2.5 px-4 flex items-center gap-3 cursor-pointer transition-colors ${currentView === 'settings' ? 'bg-gradient-to-r from-primary-foreground/15 to-primary-foreground/5 shadow-sm' : 'hover:bg-white/5 text-muted-foreground hover:text-white'}`}
          >
            <Settings size={18} className={currentView === 'settings' ? 'text-white' : ''} />
            <span className={`${currentView === 'settings' ? 'text-white' : ''} font-medium text-[15px]`}>Ajustes</span>
          </div>
        </nav>

        {/* User Card */}
        <div className="mt-8 bg-gradient-to-r from-[#444E7B] to-[#363D60] hover:from-[#495484] hover:to-[#384167] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.1)] border border-white/5 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-[#485381] text-white font-bold text-sm">JM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-white text-sm font-medium">Juan M.</span>
              <span className="text-white/70 text-xs">Admin</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 rounded-lg" onClick={() => setIsAuthenticated(false)} title="Cerrar sesión">
            <LogOut size={16} />
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 h-full">
        <div className="max-w-[1000px] mx-auto flex flex-col h-full pt-2">
          
          <header className="flex flex-row items-end justify-between mb-8 relative z-10 w-full">
            <div className="mb-[-4px]">
              <h1 className="text-[26px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 leading-none mb-2">
                {currentView === 'dashboard' ? 'Dashboard' : currentView === 'products' ? 'Productos' : currentView === 'providers' ? 'Proveedores' : currentView === 'movements' ? 'Movimientos' : currentView === 'reports' ? 'Reportes' : 'Ajustes'}
              </h1>
              <p className="text-primary text-[13px] leading-tight whitespace-pre-line">
                {currentView === 'dashboard' ? 'lunes, 11 de mayo\n2026' : currentView === 'products' ? 'Gestión de inventario\ny catálogo' : currentView === 'providers' ? 'Directorio de\nproveedores' : currentView === 'movements' ? 'Historial de\ntransacciones' : currentView === 'reports' ? 'Análisis y\nrendimiento' : 'Configuración\ndel sistema'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {(currentView === 'products' || currentView === 'providers') && (
                <Button variant="outline" className="h-9 px-3 rounded-lg border-primary/20 bg-card/50 hover:bg-card text-foreground shadow-sm transition-all text-sm flex items-center gap-2">
                  <Filter size={16} />
                  Filtros
                </Button>
              )}
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within/input:text-primary transition-colors">
                  <Search size={16} />
                </div>
                <Input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="w-[200px] h-9 pl-9 bg-background border-input shadow-sm rounded-lg text-sm transition-shadow focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-0"
                />
              </div>
              <Button className="h-9 px-4 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] transition-all font-medium text-sm flex items-center gap-2">
                <Plus size={16} />
                Agregar
              </Button>
            </div>
          </header>

          {currentView === 'dashboard' && (
            <div className="grid grid-cols-3 gap-6 mb-8 relative z-10">
              {/* Card 1 */}
              <Card className="relative bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60 h-[130px] overflow-hidden flex flex-col justify-between group">
                <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-muted-foreground text-[11px] font-semibold uppercase tracking-widest leading-[1.2]">SKUs<br/>TOTALES</h3>
                  <p className="text-[32px] font-semibold text-foreground leading-none mt-2 tracking-tight">1,284</p>
                </div>
                <div className="relative z-10 w-full h-1 bg-muted rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary/50 rounded-full w-[45%]"></div>
                </div>
              </Card>

              {/* Card 2 */}
              <Card className="relative bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60 h-[130px] overflow-hidden flex flex-col justify-between group">
                <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-[#e74c3c]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-muted-foreground text-[11px] font-semibold uppercase tracking-widest leading-[1.2]">STOCK<br/>BAJO</h3>
                  <p className="text-[32px] font-semibold text-[#e74c3c] leading-none mt-2 tracking-tight">23</p>
                </div>
                <div className="relative z-10 w-full h-1 bg-muted rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#c0392b] to-[#e74c3c] rounded-full w-[15%]"></div>
                </div>
              </Card>

              {/* Card 3 */}
              <Card className="relative bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60 h-[130px] overflow-hidden flex flex-col justify-between group">
                <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-muted-foreground text-[11px] font-semibold uppercase tracking-widest leading-[1.2]">ÓRDENES HOY<br/>&nbsp;</h3>
                  <p className="text-[32px] font-semibold text-emerald-600 leading-none mt-2 -translate-y-[14px] tracking-tight">47</p>
                </div>
                <div className="relative z-10 w-full h-1 bg-muted rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full w-[60%]"></div>
                </div>
              </Card>
            </div>
          )}

          {currentView === 'reports' ? (
            <div className="grid grid-cols-2 gap-6 flex-1 min-h-[400px] relative z-10 mb-8">
              <Card className="col-span-2 relative bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60 overflow-hidden flex flex-col">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-foreground text-[11px] font-semibold uppercase tracking-widest leading-[1.2]">Ingresos y Egresos</h3>
                    <p className="text-muted-foreground text-xs mt-1">Comparativa de los últimos 6 meses</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs border-primary/20 bg-card/50 hover:bg-card shadow-sm transition-all text-foreground">Exportar CSV</Button>
                </div>
                <div className="flex-1 min-h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#e74c3c" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px' }}
                      />
                      <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
                      <Area type="monotone" dataKey="egresos" name="Egresos" stroke="#e74c3c" strokeWidth={3} fillOpacity={1} fill="url(#colorEgresos)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="relative bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60 overflow-hidden flex flex-col">
                <div className="mb-6">
                  <h3 className="text-foreground text-[11px] font-semibold uppercase tracking-widest leading-[1.2]">Stock por Categoría</h3>
                </div>
                <div className="flex-1 min-h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockCategoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                        labelStyle={{ display: 'none' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="value" name="Unidades" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="relative bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60 overflow-hidden flex flex-col">
                <div className="mb-6">
                  <h3 className="text-foreground text-[11px] font-semibold uppercase tracking-widest leading-[1.2]">Rendimiento Mensual</h3>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-4">
                   <div className="w-full flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm">
                      <div>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Crecimiento</p>
                        <p className="text-2xl font-bold text-emerald-500 tracking-tight">+24.5%</p>
                      </div>
                      <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                        <TrendingUp size={24} />
                      </div>
                   </div>
                   <div className="w-full flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm">
                      <div>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Tasa de Rotación</p>
                        <p className="text-2xl font-bold text-primary tracking-tight">4.2x</p>
                      </div>
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <ArrowRightLeft size={24} />
                      </div>
                   </div>
                </div>
              </Card>
            </div>
          ) : currentView === 'settings' ? (
            <div className="flex-1 relative z-10 flex flex-col gap-6 w-full max-w-3xl pb-8">
              <Card className="bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60">
                <h2 className="text-lg font-semibold text-foreground mb-4">Perfil del Usuario</h2>
                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-[#485381] text-white font-bold text-2xl">JM</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-foreground font-medium text-lg">Juan M.</h3>
                    <p className="text-muted-foreground text-sm">Administrador Principal</p>
                    <Button variant="outline" size="sm" className="mt-2 h-8 text-xs border-primary/20 bg-card/50 hover:bg-card shadow-sm transition-all text-foreground">Cambiar foto</Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Nombre Completo</label>
                    <Input defaultValue="Juan M." className="bg-white/5 border-white/10 text-sm h-10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Correo Electrónico</label>
                    <Input defaultValue="juan.m@empresa.com" className="bg-white/5 border-white/10 text-sm h-10" />
                  </div>
                </div>
              </Card>

              <Card className="bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60">
                <h2 className="text-lg font-semibold text-foreground mb-4">Preferencias</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10 transition-colors hover:bg-white/10">
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Notificaciones por correo</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Recibir alertas de stock bajo y movimientos.</p>
                    </div>
                    <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10 transition-colors hover:bg-white/10">
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Modo Oscuro</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Tema visual de la aplicación.</p>
                    </div>
                    <div className="w-10 h-6 bg-[hsl(var(--muted))] rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)]"></div></div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end gap-3 mt-2">
                 <Button variant="outline" className="border-white/10 bg-transparent hover:bg-white/5 text-foreground h-10 px-6">Cancelar</Button>
                 <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground h-10 px-6 shadow-md border-none">Guardar cambios</Button>
              </div>
            </div>
          ) : (
            <div className="bg-card/60 backdrop-blur-xl rounded-xl border border-white/60 overflow-hidden shadow-[0_4px_20px_rgba(82,92,141,0.05)] flex-1 relative z-10 flex flex-col">
            <Table className="w-full text-left max-h-min border-none">
              <TableHeader className="bg-gradient-to-r from-primary to-primary/90">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-primary-foreground px-6 py-[14px] font-medium text-xs tracking-wider w-[70px] text-center h-auto">#</TableHead>
                  {currentView === 'providers' ? (
                    <>
                      <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">PROVEEDOR</TableHead>
                      <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">CONTACTO</TableHead>
                      <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">EMAIL</TableHead>
                      <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">TELÉFONO</TableHead>
                      <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto text-center w-[120px]">ESTADO</TableHead>
                    </>
                  ) : currentView === 'movements' ? (
                    <>
                      <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">FECHA</TableHead>
                      <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">TIPO</TableHead>
                      <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">PRODUCTO</TableHead>
                      <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto text-right">CANTIDAD</TableHead>
                      <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">USUARIO</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">PRODUCTO</TableHead>
                      <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">STOCK</TableHead>
                      <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">CATEGORÍA</TableHead>
                      <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto text-center w-[120px]">ESTADO</TableHead>
                      <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">VALOR</TableHead>
                    </>
                  )}
                  {(currentView === 'products' || currentView === 'providers') && (
                    <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider w-[100px] text-right h-auto">ACCIONES</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentView === 'providers' ? mockProviders.map((item) => (
                  <TableRow key={item.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors text-sm last:border-0 group">
                    <TableCell className="px-6 py-[14px] font-medium text-foreground text-center">{item.id}</TableCell>
                    <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.name}</TableCell>
                    <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.contact}</TableCell>
                    <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.email}</TableCell>
                    <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.phone}</TableCell>
                    <TableCell className="px-4 py-[14px] text-center">
                      <div className="flex justify-center">
                        <Badge variant={item.status === 'Activo' ? 'default' : 'secondary'} className={`shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] border-none pointer-events-none rounded-md px-3 py-1 font-medium ${item.status === 'Activo' ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                          {item.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-[14px] font-medium text-right">
                      <div className="flex items-center justify-end gap-1">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"><Edit2 size={16} /></Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"><Trash2 size={16} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : currentView === 'movements' ? mockMovements.map((item) => (
                  <TableRow key={item.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors text-sm last:border-0 group">
                    <TableCell className="px-6 py-[14px] font-medium text-foreground text-center">{item.id}</TableCell>
                    <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.date}</TableCell>
                    <TableCell className="px-4 py-[14px] font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.type === 'Entrada' ? 'bg-emerald-500' : item.type === 'Salida' ? 'bg-[#e74c3c]' : 'bg-amber-500'}`}></span>
                        {item.type}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.product}</TableCell>
                    <TableCell className={`px-4 py-[14px] font-medium text-right ${item.quantity > 0 ? 'text-emerald-500' : item.quantity < 0 ? 'text-[#e74c3c]' : 'text-foreground'}`}>
                      {item.quantity > 0 ? '+' : ''}{item.quantity}
                    </TableCell>
                    <TableCell className="px-4 py-[14px] font-medium text-muted-foreground">{item.user}</TableCell>
                  </TableRow>
                )) : mockInventory.map((item) => (
                  <TableRow key={item.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors text-sm last:border-0 group">
                    <TableCell className="px-6 py-[14px] font-medium text-foreground text-center">{item.id}</TableCell>
                    <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.name}</TableCell>
                    <TableCell className="px-4 py-[14px] font-medium text-foreground">
                      {item.stock} un.
                    </TableCell>
                    <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.category}</TableCell>
                    <TableCell className="px-4 py-[14px]">
                      <div className="flex justify-center">
                        <Badge className={`shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] border-none pointer-events-none rounded-md px-3 py-1 font-medium text-white ${item.stock <= 10 ? 'bg-gradient-to-r from-[#c0392b] to-[#e74c3c]' : 'bg-gradient-to-r from-primary to-primary/80'}`}>
                          {item.stock <= 10 ? 'Stock Bajo' : 'Disponible'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-[14px] font-medium text-foreground">
                      {item.value}
                    </TableCell>
                    {currentView === 'products' && (
                      <TableCell className="px-4 py-[14px] font-medium text-right">
                        <div className="flex items-center justify-end gap-1">
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"><Edit2 size={16} /></Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"><Trash2 size={16} /></Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          )}

        </div>
      </main>
    </div>
  );
}



