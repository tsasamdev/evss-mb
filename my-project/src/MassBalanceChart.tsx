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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ScatterController
);

interface MassBalanceChartProps {
  title: string;
  emptyWeight: number;
  cgArms: {
    empty: number;
    pilotPassenger: number;
    baggage: number;
    fuel: number;
  };
  envelope: { x: number; y: number }[];
  pdfUrl: string;
  useMomentAxis?: boolean;
  customXScale?: {
    min: number;
    max: number;
  };
}

const MassBalanceChart: React.FC<MassBalanceChartProps> = ({
  title,
  emptyWeight,
  cgArms,
  envelope,
  pdfUrl,
  useMomentAxis = false,
  customXScale,
}) => {
  const [pilotPassengerWeight, setPilotPassengerWeight] = useState(0);
  const [baggageWeight, setBaggageWeight] = useState(0);
  const [fuelWeightL, setFuelWeightL] = useState(0);

  const totalFuelKilo = fuelWeightL * 0.72;
  const totalWeight = emptyWeight + pilotPassengerWeight + baggageWeight + totalFuelKilo;

  const cg =
    (emptyWeight * cgArms.empty +
      pilotPassengerWeight * cgArms.pilotPassenger +
      baggageWeight * cgArms.baggage +
      totalFuelKilo * cgArms.fuel) / totalWeight;

  const moment = cg * totalWeight;
  const xValue = useMomentAxis ? moment : cg;

  const isInsideEnvelope = (point: { x: number; y: number }, polygon: { x: number; y: number }[]) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi + 0.00001) + xi;

      if (intersect) inside = !inside;
    }
    return inside;
  };

  const isOutOfLimits = !isInsideEnvelope({ x: xValue, y: totalWeight }, envelope);

  const data = {
    datasets: [
      {
        label: "Centre de Gravité",
        data: [{ x: xValue, y: totalWeight }],
        backgroundColor: isOutOfLimits ? "red" : "green",
        pointRadius: 4,
      },
      {
        label: "Enveloppe de vol",
        data: envelope,
        borderColor: "black",
        borderWidth: 2,
        fill: true,
        pointRadius: 3,
        showLine: true,
      },
    ],
  };

  const xScale = useMomentAxis
    ? {
        title: {
          display: true,
          text: "Moment d'avion (kg·m)",
        },
        min: customXScale?.min ?? 70,
        max: customXScale?.max ?? 130,
      }
    : {
        title: {
          display: true,
          text: "Distance du C.G. au pt de référence (m)",
        },
        min: 0.24,
        max: 0.44,
      };

  return (
    <div className="w-full flex justify-center px-2">
    <div className="p-6 bg-white shadow-xl rounded-xl w-full max-w-3xl mx-auto">

        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>

        <div className="mb-4 text-center">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            📄 Manuel de vol
          </a>
        </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">

          <div className="space-y-4">
            <label>Poids à Vide (Kg):</label>
            <input disabled value={emptyWeight} className="w-full bg-gray-200 p-2 rounded" />

            <label>Pilote & Passagers (Kg):</label>
            <input
              type="number"
              value={pilotPassengerWeight}
              onChange={e => setPilotPassengerWeight(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />

            <label>Bagages (Kg):</label>
            <input
              type="number"
              value={baggageWeight}
              onChange={e => setBaggageWeight(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />

            <label>Carburant (L):</label>
            <input
              type="number"
              value={fuelWeightL}
              onChange={e => setFuelWeightL(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />

            <label>Carburant (Kg):</label>
            <input
              disabled
              value={totalFuelKilo.toFixed(1)}
              className="w-full bg-gray-200 p-2 rounded"
            />
          </div>

          <div className="relative w-full h-[400px]">
            <Chart
              type="scatter"
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: xScale,
                  y: {
                    title: {
                      display: true,
                      text: "Poids Total (Kg)",
                    },
                    min: 340,
                    max: 620,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="mt-4 text-center font-semibold text-gray-800">
          {useMomentAxis
            ? `Moment: ${moment.toFixed(1)} kg·m`
            : `CG: ${cg.toFixed(3)} m`}{" "}
          | Poids Total: {totalWeight.toFixed(1)} Kg
          {isOutOfLimits && (
            <p className="text-red-600 mt-2">⚠️ Hors des limites de vol sécurisées !</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MassBalanceChart;
