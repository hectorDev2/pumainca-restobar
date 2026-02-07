"use client";

import React, { useState } from "react";
import Link from "next/link";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../datepicker.css";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/api";
import type { ReservationResponse } from "@/lib/api-types";

registerLocale("es", es);

type ReservationFormData = {
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
  specialRequests: string;
};

type ReservationConfirmation = {
  message?: string;
  code?: string;
  emailStatus?: "sent" | "failed" | "skipped";
  emailMessage?: string;
};

const createInitialFormData = (): ReservationFormData => ({
  name: "",
  email: "",
  phone: "",
  date: new Date(),
  time: "",
  guests: 2,
  specialRequests: "",
});

const OPERATING_HOURS = {
  start: 12,
  end: 23,
} as const;

const buildTimeOptions = () =>
  Array.from(
    { length: OPERATING_HOURS.end - OPERATING_HOURS.start + 1 },
    (_, index) => {
      const hour = OPERATING_HOURS.start + index;
      const hourLabel = hour % 12 === 0 ? 12 : hour % 12;
      const label = `${String(hourLabel).padStart(2, "0")}:00 PM`;
      return {
        value: `${String(hour).padStart(2, "0")}:00`,
        label,
      };
    },
  );

const timeOptions = buildTimeOptions();

const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

const isDateSelectable = (date: Date) => {
  if (!isValidDate(date)) return false;
  const today = getStartOfToday();
  const candidate = new Date(date);
  candidate.setHours(0, 0, 0, 0);
  return candidate >= today;
};

export default function ReservationPage() {
  const [formData, setFormData] = useState<ReservationFormData>(() =>
    createInitialFormData(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] =
    useState<ReservationConfirmation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "guests") {
      setFormData((prev) => ({ ...prev, guests: Number(value) }));
      return;
    }

    setFormData((prev) => {
      switch (name) {
        case "name":
          return { ...prev, name: value };
        case "email":
          return { ...prev, email: value };
        case "phone":
          return { ...prev, phone: value };
        case "time":
          return { ...prev, time: value };
        case "specialRequests":
          return { ...prev, specialRequests: value };
        default:
          return prev;
      }
    });
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    if (!isDateSelectable(date)) {
      setErrorMessage("No se pueden hacer reservas para fechas pasadas.");
      return;
    }
    setErrorMessage(null);
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.time) {
      setErrorMessage("Selecciona una hora para tu reserva.");
      return;
    }

    const hour = parseInt(formData.time.split(":")[0], 10);
    if (Number.isNaN(hour)) {
      setErrorMessage("Selecciona una hora válida para tu reserva.");
      return;
    }

    if (hour < OPERATING_HOURS.start || hour > OPERATING_HOURS.end) {
      setErrorMessage(
        "Por favor selecciona una hora válida (12:00 PM - 11:00 PM).",
      );
      return;
    }

    // Validation for TC006: Ensure date is not in the past
    const today = getStartOfToday();
    const selectedDate = new Date(formData.date);
    if (!isValidDate(selectedDate)) {
      setErrorMessage("Selecciona una fecha válida para tu reserva.");
      return;
    }
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setErrorMessage("No se pueden hacer reservas para fechas pasadas.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload: {
      fullName: string;
      email: string;
      phoneNumber: string;
      reservationDate: string;
      reservationTime: string;
      numberOfGuests: number;
      specialRequests?: string;
    } = {
      fullName: formData.name,
      email: formData.email,
      phoneNumber: formData.phone,
      reservationDate: formData.date.toISOString().split("T")[0],
      reservationTime: formData.time,
      numberOfGuests: formData.guests,
    };

    if (formData.specialRequests.trim()) {
      payload.specialRequests = formData.specialRequests.trim();
    }

    try {
      const data = await apiFetch<ReservationResponse>("/api/reservations", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setConfirmation({
        message:
          data?.message ?? data?.text ?? "Tu mesa quedó reservada con éxito.",
        code: data?.reservation_code ?? data?.code,
        emailStatus: data?.emailStatus,
        emailMessage: data?.emailMessage,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Ocurrió un error inesperado.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setConfirmation(null);
    setFormData(createInitialFormData());
    setErrorMessage(null);
  };

  if (confirmation) {
    return (
      <div className="min-h-screen bg-background-dark transition-colors duration-300">
        <Navbar showSearch={false} />
        <div className="pt-20 pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="max-w-md w-full px-4 text-center animate-fade-in-up space-y-6">
            <div className="size-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-4xl text-green-500">
                check_circle
              </span>
            </div>
            <h2 className="text-3xl font-bold text-text-primary">
              ¡Reserva Confirmada!
            </h2>
            <p className="text-text-secondary">
              {confirmation.message} Te esperamos el{" "}
              <strong>
                {formData.date.toLocaleDateString("es-PE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </strong>{" "}
              a las <strong>{formData.time}</strong> para {formData.guests}{" "}
              persona{formData.guests === 1 ? "" : "s"}.
            </p>
            {confirmation.code && (
              <p className="text-text-primary font-semibold tracking-wide">
                Código: {confirmation.code}
              </p>
            )}
            {confirmation.emailMessage && (
              <p className="text-sm text-text-secondary">
                {confirmation.emailMessage}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center"
              >
                Volver al Inicio
              </Link>
              <button
                onClick={resetForm}
                className="text-text-secondary hover:text-text-primary px-8 py-3 font-semibold transition-colors"
              >
                Reservar otra mesa
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark transition-colors duration-300">
      <Navbar showSearch={false} />
      <div className="pt-8 pb-16">
        <div className="max-w-lg mx-auto px-4 sm:px-8">
          <div className="text-center mb-10">
            <span className="text-primary font-bold text-sm tracking-widest uppercase mb-2 block">
              Reservas
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-text-primary mb-4">
              Reserva tu Mesa
            </h1>
            <p className="text-text-secondary">
              Asegura tu lugar para una experiencia gastronómica inolvidable.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-surface-dark p-8 rounded-3xl shadow-xl border border-zinc-800 space-y-5 transition-colors duration-300"
          >
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-text-secondary mb-2">
                  Nombre Completo
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  className="w-full bg-surface-hover border border-zinc-700/50 rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-text-secondary/50"
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-bold text-text-secondary mb-2">
                  Fecha
                </label>
                <DatePicker
                  required
                  selected={formData.date}
                  onChange={handleDateChange}
                  minDate={getStartOfToday()}
                  filterDate={isDateSelectable}
                  onChangeRaw={(event) => event.preventDefault()}
                  readOnly
                  dateFormat="dd 'de' MMMM 'de' yyyy"
                  placeholderText="Selecciona una fecha"
                  locale="es"
                  className="w-full bg-surface-hover border border-zinc-700/50 rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-text-secondary/50"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-bold text-text-secondary mb-2">
                  Hora
                </label>
                <select
                  required
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full bg-surface-hover border border-zinc-700/50 rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                >
                  <option value="">Elegir hora</option>
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold text-text-secondary mb-2">
                  Número de Personas
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    name="guests"
                    min="1"
                    max="12"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full h-2 bg-surface-hover rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-xl font-bold text-primary w-8 text-center">
                    {formData.guests}
                  </span>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold text-text-secondary mb-2">
                  Email
                </label>
                <input
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  className="w-full bg-surface-hover border border-zinc-700/50 rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-text-secondary/50"
                  placeholder="juan@ejemplo.com"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold text-text-secondary mb-2">
                  Teléfono
                </label>
                <input
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  className="w-full bg-surface-hover border border-zinc-700/50 rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-text-secondary/50"
                  placeholder="+51 999 999 999"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold text-text-secondary mb-2">
                  Solicitudes especiales (opcional)
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-surface-hover border border-zinc-700/50 rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-text-secondary/50"
                  placeholder="Alérgenos, asientos, celebraciones, etc."
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-center text-sm text-red-400">{errorMessage}</p>
            )}

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
                "Confirmar Reserva"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
