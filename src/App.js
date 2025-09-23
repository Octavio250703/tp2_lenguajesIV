import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import ImageUploader from "./ImageUploader";
import ContactForm from "./ContactForm";


function Home() {
  return (
    <section className="card">
      <h2 className="card-title">Visor de imágenes</h2>
      <ImageUploader multiple={false} maxMB={10} />
    </section>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app-shell">
        <header className="app-header">
          <h1>Trabajo Practico N°2 — Lenguajes IV</h1>
          <p className="subtitle">Seleccioná una opción en el menú</p>
          <nav style={{ marginTop: "16px" }}>
            <Link to="/" className="btn" style={{ marginRight: "8px" }}>Inicio</Link>
            <Link to="/contact" className="btn">Contacto</Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<ContactForm />} />
          </Routes>
        </main>

        <footer className="app-footer"> este es el footer </footer>
      </div>
    </Router>
  );
}

