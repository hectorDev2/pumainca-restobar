
import React, { useState } from 'react';
import { Screen, CartItem } from '../types';

interface Props {
  cart: CartItem[];
  totals: { subtotal: number; tax: number; serviceFee: number; total: number };
  onNavigate: (screen: Screen) => void;
}

const CheckoutScreen: React.FC<Props> = ({ cart, totals, onNavigate }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cash'>('card');

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800 bg-background-dark/95 backdrop-blur px-6 md:px-10 py-3">
        <div className="flex items-center gap-4 text-white">
          <img src="/logo.png" className="w-[120px]" alt="Pumainca" />
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => onNavigate('cart')} className="text-text-secondary hover:text-white text-sm font-medium transition-colors hidden sm:block">Volver al Carrito</button>
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
            <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-white">Pago Seguro</span>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-10">
            <div>
              <h1 className="text-primary text-3xl md:text-4xl font-black mb-2">Finalizar Pedido</h1>
              <p className="text-text-secondary">Complete los detalles de su pedido para comenzar la preparación.</p>
            </div>

            {/* Steps Progress */}
            <div className="bg-surface-dark rounded-2xl p-6 border border-zinc-800">
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">1</span> Detalles
                </div>
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs">2</span> Pago
                </div>
                <div className="flex items-center gap-2 text-text-secondary font-medium text-sm">
                  <span className="w-6 h-6 rounded-full bg-zinc-800 text-text-secondary flex items-center justify-center text-xs">3</span> Confirmación
                </div>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '66%' }}></div>
              </div>
            </div>

            {/* Form Sections */}
            <section className="space-y-4">
              <h2 className="text-primary text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">contact_page</span> Información de Contacto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Correo Electrónico</label>
                  <input type="email" placeholder="tu@ejemplo.com" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Número de Teléfono</label>
                  <input type="tel" placeholder="+51 900 000 000" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none" />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-primary text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">storefront</span> Detalles de Recogida
              </h2>
              <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h3 className="text-primary font-bold">PUMAINCA RESTOBAR</h3>
                    <p className="text-sm text-text-secondary">Av. La Mar 1234, Miraflores, Lima</p>
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  <label className="text-xs text-text-secondary block mb-1">Hora Estimada</label>
                  <select className="w-full md:w-48 bg-black border border-zinc-800 text-white rounded-lg px-3 py-2 outline-none">
                    <option>Lo antes posible (20m)</option>
                    <option>En 45 minutos</option>
                    <option>En 1 hora</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-primary text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">credit_card</span> Método de Pago
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'card', label: 'Tarjeta', icon: 'credit_card' },
                  { id: 'paypal', label: 'PayPal', icon: 'account_balance_wallet' },
                  { id: 'cash', label: 'En el Local', icon: 'payments' }
                ].map(method => (
                  <button 
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${paymentMethod === method.id ? 'border-primary bg-primary/10' : 'border-zinc-800 bg-surface-dark hover:bg-zinc-800'}`}
                  >
                    <span className={`material-symbols-outlined text-3xl ${paymentMethod === method.id ? 'text-primary' : 'text-zinc-500'}`}>{method.icon}</span>
                    <span className={`font-bold text-sm ${paymentMethod === method.id ? 'text-white' : 'text-zinc-500'}`}>{method.label}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-8 space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Nombre del Titular</label>
                    <input type="text" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Número de Tarjeta</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">credit_card</span>
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-black border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white outline-none font-mono" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">Vencimiento</label>
                      <input type="text" placeholder="MM/AA" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-center outline-none font-mono" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">CVC</label>
                      <input type="text" placeholder="123" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-center outline-none font-mono" />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-surface-dark border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 bg-surface-hover/50 border-b border-zinc-800">
                  <h2 className="text-primary font-bold">Resumen de tu Orden</h2>
                  <p className="text-xs text-text-secondary mt-1">Pedido #29381 • Para recoger</p>
                </div>
                <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 border border-zinc-800" style={{ backgroundImage: `url('${item.dish.image}')` }}></div>
                        <div>
                          <p className="text-white font-bold text-sm">{item.dish.name}</p>
                          <p className="text-primary text-xs font-bold">x{item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-white font-medium text-sm">S./{(item.dish.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-black/50 border-t border-zinc-800 space-y-3">
                  <div className="flex justify-between text-zinc-500 text-sm">
                    <span>Subtotal</span>
                    <span className="text-white">S./{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-sm">
                    <span>IGV (18%)</span>
                    <span className="text-white">S./{totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-sm pb-2">
                    <span>Costo Empaque</span>
                    <span className="text-white">S./{totals.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-zinc-800 pt-4 flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Total</span>
                    <span className="text-primary font-black text-3xl tracking-tighter">S./{totals.total.toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-primary hover:bg-red-500 text-white font-black text-lg py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all mt-4 active:scale-95 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">verified</span>
                    Confirmar Pedido
                  </button>
                  <p className="text-center text-zinc-600 text-[10px] mt-4 uppercase font-bold tracking-widest">Pago Encriptado y Seguro</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CheckoutScreen;
