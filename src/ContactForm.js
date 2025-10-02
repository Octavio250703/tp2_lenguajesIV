// ContactForm con EmailJS (versión corregida)
// - Usa SOLO la public key; EmailJS no admite privateKey en el navegador.
// - Ajusta SERVICE_ID y TEMPLATE_ID según tu panel de EmailJS.
// - Asegúrate de que tu Template tenga variables: from_name, from_email, reply_to, message.

import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./App.css";

// ✅ Inicializá EmailJS con tu PUBLIC KEY (una vez)
emailjs.init("uogVF2GJL5El-NBbT");

const SERVICE_ID = "service_hr8115r";     // ← tu Service ID
const TEMPLATE_ID = "template_pl8y4ks";   // ← tu Template ID

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // 📤 Enviar con send(service, template, params)
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: formData.name,
        from_email: formData.email,
        reply_to: formData.email, // para que "Responder" vaya al usuario
        message: formData.message,
      });

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="card">
        <h2 className="card-title">¡Gracias por tu mensaje!</h2>
        <p>Nos pondremos en contacto pronto.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">Formulario de Contacto</h2>
      <form className="uploader" onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="btn"
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>

        <label>
          Correo electrónico:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="btn"
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>

        <label>
          Mensaje:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="btn"
            style={{ width: "100%", marginTop: 4, minHeight: 100 }}
          />
        </label>

        <button type="submit" className="btn" style={{ marginTop: 12 }} disabled={status === "sending"}>
          {status === "sending" ? "Enviando..." : "Enviar"}
        </button>

        {status === "error" && (
          <p className="msg-error" style={{ marginTop: 10 }}>
            ❌ Ocurrió un error al enviar. Intenta nuevamente.
          </p>
        )}
      </form>

      <div className="map">
      <iframe
        title="Ubicación del Hotel"
        src="https://www.google.com/maps?q=-24.788,-65.410&z=14&output=embed"
        width="100%"
        height="100%"
        style={{ borderRadius: "12px", minHeight: "350px" }}
        loading="lazy"
      />
    </div>
    
    </div>
  );
}
