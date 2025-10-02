// src/Servicios.js
import React from "react";

const rooms = [
  {
    id: 1,
    nombre: "Habitación Simple",
    descripcion: "Cama individual, Wi-Fi, TV, baño privado.",
    precio: 45000,
    imagen: "https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    nombre: "Habitación Doble",
    descripcion: "Cama queen, escritorio, minibar, Wi-Fi.",
    precio: 72000,
    imagen: "https://images.unsplash.com/photo-1505692794403-34d4982f88aa?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    nombre: "Suite",
    descripcion: "Sala de estar, vista a la ciudad, jacuzzi.",
    precio: 135000,
    imagen: "https://images.unsplash.com/photo-1501117716987-c8e2a1a1d2b1?q=80&w=1200&auto=format&fit=crop"
  }
];

export default function Servicios() {
  return (
    <section className="card">
      <h2 className="card-title">Servicios del Hotel</h2>
      <div className="grid">
        {rooms.map((room) => (
          <div key={room.id} className="img-card">
            <div className="img-wrap">
              <img src={room.imagen} alt={room.nombre} />
            </div>
            <div className="img-meta">
              <h3>{room.nombre}</h3>
              <p>{room.descripcion}</p>
              <p><strong>${room.precio.toLocaleString("es-AR")}</strong> por noche</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
