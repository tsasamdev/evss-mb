import React from "react";
import MassBalanceChart from "./MassBalanceChart";

const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <MassBalanceChart />
    </div>
  );
};

export default App;