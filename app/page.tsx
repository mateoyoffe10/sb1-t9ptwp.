import { Button } from "@/components/ui/button";
import { Cigarette, Heart, TrendingDown } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Cigarette className="w-6 h-6 text-blue-600" />
            DejarFácil
          </h1>
          <Link href="/signin">
            <Button variant="outline">Iniciar Sesión</Button>
          </Link>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Tomá el control de tus hábitos de consumo
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Llevá el control de tu camino hacia una vida libre de humo con nuestro tablero intuitivo y herramientas de progreso.
            </p>
            <Link href="/signin">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Comenzá tu Camino
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Heart className="w-12 h-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Seguimiento de Salud</h3>
              <p className="text-gray-600">Controlá las mejoras en tu salud a medida que dejás de fumar.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <TrendingDown className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Progreso Visual</h3>
              <p className="text-gray-600">Visualizá tu avance en la reducción del consumo de tabaco.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}