import React, { useState } from "react";
import { Chart } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Chart as ChartJS,
  ScatterController,
} from "chart.js";
import "../src/styles/global.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ScatterController);

const MassBalanceChart: React.FC = () => {
  const [emptyWeight, setEmptyWeight] = useState<number>(345.9);
  const [pilotPassengerWeight, setPilotPassengerWeight] = useState<number>(0);
  const [baggageWeight, setBaggageWeight] = useState<number>(0);
  const [fuelWeightL, setFuelWeightL] = useState<number>(0);

  const totalFuelKilo = fuelWeightL * 0.72;
  const totalWeight = emptyWeight + pilotPassengerWeight + baggageWeight + totalFuelKilo;

  const cg =
    (emptyWeight * 0.26 +
      pilotPassengerWeight * 0.55 +
      baggageWeight * 1.08 +
      totalFuelKilo * 0.68) /
    totalWeight;

  const envelope = [
    { x: 0.25, y: 373 },
    { x: 0.31, y: 373 },
    { x: 0.37, y: 398 },
    { x: 0.40, y: 456 },
    { x: 0.40, y: 600 },
    { x: 0.35, y: 600 },
    { x: 0.25, y: 373 },
  ];

  const isOutOfLimits =
    cg < Math.min(...envelope.map((p) => p.x)) ||
    cg > Math.max(...envelope.map((p) => p.x)) ||
    totalWeight < Math.min(...envelope.map((p) => p.y)) ||
    totalWeight > Math.max(...envelope.map((p) => p.y));

  const data = {
    datasets: [
      {
        label: "Centre de Gravité",
        data: [{ x: cg, y: totalWeight }],
        backgroundColor: isOutOfLimits ? "red" : "green",
        pointRadius: 6,
      },
      {
        label: "Enveloppe de vol",
        data: envelope,
        borderColor: "black",
        borderWidth: 3,
        fill: true,
        pointRadius: 4,
        showLine: true,
      },
    ],
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-100 shadow-lg rounded-xl min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-black-800">
        Masse et Centrage F-HDLV
      </h2>

      {/* Layout Grid for Two Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Block */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Données d'entrée</h3>
          <div className="flex flex-col space-y-4">
            {[
              { label: "Poids à Vide (Kg)", value: emptyWeight, setter: setEmptyWeight },
              { label: "Pilote & Passagers (Kg)", value: pilotPassengerWeight, setter: setPilotPassengerWeight },
              { label: "Bagages (Kg)", value: baggageWeight, setter: setBaggageWeight },
              { label: "Carburant (L)", value: fuelWeightL, setter: setFuelWeightL },
            ].map(({ label, value, setter }, idx) => (
              <div key={idx} className="flex flex-col">
                <label className="font-semibold text-gray-700">{label} :</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setter(Math.max(0, Number(e.target.value)))}
                  className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  min="0"
                />
              </div>
            ))}

            {/* Fuel Weight (Kg) Display */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Carburant (Kg) :</label>
              <input
                type="text"
                value={totalFuelKilo.toFixed(1)}
                className="border p-2 rounded w-full bg-gray-200 text-gray-600"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Graph Block */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-center">
          <div className="w-full h-[400px]">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Graphique</h3>
            <Chart
              type="scatter"
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: { display: true, text: "Distance du C.G. au pt de référence (m)" },
                    min: 0.24,
                    max: 0.44,
                  },
                  y: {
                    title: { display: true, text: "Poids Total (Kg)" },
                    min: 340,
                    max: 620,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* CG and Weight Info */}
      <div className="text-center mt-6">
        <p className="text-lg font-semibold text-black-800">
          CG: {cg.toFixed(3)} m | Poids Total: {totalWeight.toFixed(2)} Kg
        </p>
        {isOutOfLimits && (
          <p className="mt-4 text-red-600 font-bold">
            ⚠️ Attention : Hors des limites de vol sécurisées !
          </p>
        )}
      </div>
    </div>
  );
};

export default MassBalanceChart;