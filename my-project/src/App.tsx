import MassBalanceChart from "./MassBalanceChart";

const App = () => {
  return (
    <div className="flex flex-col gap-12 p-8 max-w-7xl mx-auto">
      <MassBalanceChart
        title="Masse et Centrage F-HDLV"
        emptyWeight={345.9}
        cgArms={{ empty: 0.26, pilotPassenger: 0.55, baggage: 1.08, fuel: 0.68 }}
        envelope={[
          { x: 0.25, y: 373 },
          { x: 0.31, y: 373 },
          { x: 0.37, y: 398 },
          { x: 0.40, y: 456 },
          { x: 0.40, y: 600 },
          { x: 0.35, y: 600 },
          { x: 0.25, y: 373 },
        ]}
        pdfUrl="/docs/rtc.pdf"
      />

      <MassBalanceChart
        title="Masse et Centrage F-HDLT"
        emptyWeight={365}
        cgArms={{ empty: 0.27, pilotPassenger: 0.54, baggage: 1.05, fuel: 0.67 }}
        envelope={[
          { x: 92, y: 374 },
          { x: 106, y: 374 },
          { x: 144, y: 400 },
          { x: 184, y: 455 },
          { x: 240, y: 600 },
          { x: 224, y: 600 },
          { x: 170, y: 525 },
          { x: 92, y: 374 },
        ]}
        pdfUrl="/docs/fgxyz.pdf"
        useMomentAxis={true}
        customXScale={{ min: 70, max: 260 }}
      />
    </div>
  );
};

export default App;