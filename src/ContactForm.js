import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import "./App.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const formRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await emailjs.send(
        "service_hr8115r", 
        "template_pl8y4ks", 
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        {
          publicKey: "uogVF2GJL5El-NBbT",
          privateKey: "-lkkqK2VCnn45havygDgb", 
        }
      );
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
      <form ref={formRef} className="uploader" onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="btn"
            style={{ width: "100%", marginTop: "4px" }}
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
            style={{ width: "100%", marginTop: "4px" }}
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
            style={{ width: "100%", marginTop: "4px", minHeight: "100px" }}
          />
        </label>

        <button type="submit" className="btn" style={{ marginTop: "12px" }}>
          {status === "sending" ? "Enviando..." : "Enviar"}
        </button>

        {status === "error" && (
          <p className="msg-error" style={{ marginTop: "10px" }}>
            ❌ Ocurrió un error al enviar. Intenta nuevamente.
          </p>
        )}
      </form>
    </div>
  );
}
