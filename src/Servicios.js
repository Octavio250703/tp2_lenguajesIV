// 📸 Importamos las imágenes desde src/assets
import habitacionSimple from "./assets/habitacion-simple.png"
import habitacionDoble from "./assets/habitacion-doble.png"
import suite from "./assets/suite.png"

// Datos de las habitaciones
const rooms = [
  {
    id: 1,
    nombre: "Habitación Simple",
    descripcion: "Cama individual, Wi-Fi, TV, baño privado.",
    precio: 45000,
    imagen: habitacionSimple,
  },
  {
    id: 2,
    nombre: "Habitación Doble",
    descripcion: "Cama queen, escritorio, minibar, Wi-Fi.",
    precio: 72000,
    imagen: habitacionDoble,
  },
  {
    id: 3,
    nombre: "Suite",
    descripcion: "Sala de estar, vista a la ciudad, jacuzzi.",
    precio: 135000,
    imagen: suite,
  },
]

function Servicios() {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Nuestras Habitaciones</h2>

      <div className="flex flex-wrap justify-center gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="w-[180px] bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out"
          >
            <div className="w-full h-12 overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={room.imagen || "/placeholder.svg"}
                alt={`Imagen de ${room.nombre}`}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = "https://placehold.co/600x400/cccccc/ffffff?text=Imagen+no+disponible"
                }}
              />
            </div>

            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{room.nombre}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{room.descripcion}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  ${room.precio.toLocaleString("es-AR")}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">/ noche</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Componente principal
export default function App() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <Servicios />
    </div>
  )
}
