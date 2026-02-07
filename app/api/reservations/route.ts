import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";
import { VALIDATION } from "@/constants/validation";

const OPERATING_HOURS = {
  start: 12,
  end: 23,
} as const;

const parseDateOnly = (value: string | null | undefined) => {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const isValidTime = (value: string | null | undefined) => {
  if (!value) return false;
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
  if (!match) return false;
  const hour = Number(value.split(":")[0]);
  return hour >= OPERATING_HOURS.start && hour <= OPERATING_HOURS.end;
};

const getMailerConfig = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !user || !pass || !from) {
    return null;
  }

  return {
    host,
    port: Number(port),
    user,
    pass,
    from,
  };
};

const sendReservationEmail = async (params: {
  to: string;
  code: string;
  date: string;
  time: string;
  guests: number;
  name?: string | null;
}) => {
  const mailer = getMailerConfig();

  if (!mailer) {
    return {
      status: "skipped" as const,
      message:
        "El envío de email no está configurado en este entorno. Guarda tu código de reserva.",
    };
  }

  const transporter = nodemailer.createTransport({
    host: mailer.host,
    port: mailer.port,
    secure: mailer.port === 465,
    auth: {
      user: mailer.user,
      pass: mailer.pass,
    },
  });

  try {
    const subject = "Confirmación de reserva - Pumainca Restobar";
    const text =
      `Hola ${params.name ?? ""},\n\n` +
      `Tu reserva está confirmada.\n` +
      `Código: ${params.code}\n` +
      `Fecha: ${params.date}\n` +
      `Hora: ${params.time}\n` +
      `Personas: ${params.guests}\n\n` +
      `¡Te esperamos!`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <h2>Reserva confirmada</h2>
        <p>Hola ${params.name ?? ""},</p>
        <p>Tu reserva está confirmada. Guarda este código:</p>
        <p style="font-size: 18px; font-weight: bold;">${params.code}</p>
        <ul>
          <li><strong>Fecha:</strong> ${params.date}</li>
          <li><strong>Hora:</strong> ${params.time}</li>
          <li><strong>Personas:</strong> ${params.guests}</li>
        </ul>
        <p>¡Te esperamos en Pumainca Restobar!</p>
      </div>
    `;

    await transporter.sendMail({
      from: mailer.from,
      to: params.to,
      subject,
      text,
      html,
    });

    return {
      status: "sent" as const,
      message: "Te enviamos el código de reserva por email.",
    };
  } catch (error) {
    console.error("[POST /api/reservations] Email send error:", error);
    return {
      status: "failed" as const,
      message:
        "No pudimos enviar el email de confirmación. Guarda tu código de reserva.",
    };
  }
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  let query = supabase.from("reservations").select("*");

  if (email) {
    query = query.eq("email", email);
  }

  const { data, error } = await query.order("reservation_date", {
    ascending: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email?.trim();
    const phone = (body.phoneNumber ?? body.phone_number)?.trim();
    const reservationDate = body.reservationDate ?? body.reservation_date;
    const reservationTime = body.reservationTime ?? body.reservation_time;
    const numberOfGuests =
      body.numberOfGuests ?? body.number_of_guests ?? body.guests;

    if (!email || !phone) {
      return NextResponse.json(
        { message: "Email y teléfono son requeridos" },
        { status: 400 },
      );
    }

    if (!VALIDATION.EMAIL.test(email)) {
      return NextResponse.json(
        { message: "Formato de email inválido" },
        { status: 400 },
      );
    }

    const parsedDate = parseDateOnly(reservationDate);
    if (!parsedDate) {
      return NextResponse.json(
        { message: "Selecciona una fecha válida" },
        { status: 400 },
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    parsedDate.setHours(0, 0, 0, 0);

    if (parsedDate < today) {
      return NextResponse.json(
        { message: "La fecha de reserva no puede ser anterior a hoy" },
        { status: 400 },
      );
    }

    if (!isValidTime(reservationTime)) {
      return NextResponse.json(
        {
          message: "La hora debe estar entre 12:00 PM y 11:00 PM",
        },
        { status: 400 },
      );
    }

    if (
      typeof numberOfGuests !== "number" ||
      numberOfGuests < 1 ||
      numberOfGuests > 12
    ) {
      return NextResponse.json(
        { message: "El número de personas debe estar entre 1 y 12" },
        { status: 400 },
      );
    }

    // Generate code
    const code = `RES${new Date().toISOString().slice(0, 10).replace(/-/g, "")}${Math.floor(1000 + Math.random() * 9000)}`;

    const { data, error } = await supabase
      .from("reservations")
      .insert({
        reservation_code: code,
        full_name: body.fullName ?? body.full_name,
        email,
        phone_number: phone,
        reservation_date: reservationDate,
        reservation_time: reservationTime,
        number_of_guests: numberOfGuests,
        special_requests: body.specialRequests ?? body.special_requests,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/reservations] Supabase insert error:", error);
      throw new Error(error.message || "Error al crear reserva");
    }

    const emailResult = await sendReservationEmail({
      to: email,
      code,
      date: reservationDate,
      time: reservationTime,
      guests: numberOfGuests,
      name: body.fullName ?? body.full_name,
    });

    return NextResponse.json({
      ...data,
      message: "Reserva creada exitosamente",
      emailStatus: emailResult.status,
      emailMessage: emailResult.message,
    });
  } catch (err: any) {
    console.error("[POST /api/reservations] Unexpected error:", err);
    return NextResponse.json(
      { message: err?.message || "Error interno del servidor" },
      { status: 500 },
    );
  }
}
