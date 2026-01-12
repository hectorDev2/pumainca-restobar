"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar showSearch={false} />
        <div className="pt-20 pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="max-w-md w-full px-4 text-center animate-fade-in-up">
          <div className="size-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-4">¡Reserva Confirmada!</h2>
          <p className="text-text-secondary mb-8">
            Hemos enviado los detalles de tu reserva a tu correo electrónico. ¡Te esperamos pronto en Pumainca!
          </p>
          <div className="flex flex-col gap-3">
            <Link 
              href="/"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center"
            >
              Volver al Inicio
            </Link>
            <button 
              onClick={() => setIsSuccess(false)}
              className="text-text-secondary hover:text-text-primary px-8 py-3 font-semibold transition-colors"
            >
              Hacer otra reserva
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar showSearch={false} />
      <div className="pt-8 pb-16">
      <div className="max-w-lg mx-auto px-4 sm:px-8">
        <div className="text-center mb-10">
          <span className="text-primary font-bold text-sm tracking-widest uppercase mb-2 block">Reservas</span>
          <h1 className="text-3xl md:text-4xl font-black text-text-primary mb-4">Reserva tu Mesa</h1>
          <p className="text-text-secondary">
            Asegura tu lugar para una experiencia gastronómica inolvidable.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-dark p-8 rounded-3xl shadow-xl border border-zinc-800 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-text-secondary mb-2">Nombre Completo</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Juan Pérez"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-bold text-text-secondary mb-2">Fecha</label>
              <input
                required
                name="date"
                value={formData.date}
                onChange={handleChange}
                type="date"
                className="w-full bg-background-light dark:bg-black/40 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-bold text-text-secondary mb-2">Hora</label>
              <select
                required
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full bg-background-light dark:bg-black/40 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              >
                <option value="">Elegir hora</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">01:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="19:00">07:00 PM</option>
                <option value="20:00">08:00 PM</option>
                <option value="21:00">09:00 PM</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-text-secondary mb-2">Número de Personas</label>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  name="guests"
                  min="1"
                  max="12"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-xl font-bold text-primary w-8 text-center">{formData.guests}</span>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-text-secondary mb-2">Email</label>
              <input
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="w-full bg-background-light dark:bg-black/40 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="juan@ejemplo.com"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-bold text-text-secondary mb-2">Teléfono</label>
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                className="w-full bg-background-light dark:bg-black/40 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="+51 999 999 999"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-dark disabled:opacity-70 disabled:cursor-not-allowed text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando...
              </>
            ) : (
              'Confirmar Reserva'
            )}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
