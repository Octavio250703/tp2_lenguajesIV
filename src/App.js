import React from "react";
import "./App.css";
import ImageUploader from "./ImageUploader";

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Trabajo Práctico N°1 — Lenguajes IV</h1>
        <p className="subtitle">Seleccioná una imagen para visualizarla. (Podés activar múltiples más abajo)</p>
      </header>

      <main className="app-main">
        <section className="card">
          <h2 className="card-title">Visor de imágenes</h2>
          {/* Cambiá multiple a true si tu profe permite varias imágenes */}
          <ImageUploader multiple={false} maxMB={10} />
        </section>
      </main>

      <footer className="app-footer">Hecho con React • Accesible y responsive • {new Date().getFullYear()}</footer>
    </div>
  );
}
