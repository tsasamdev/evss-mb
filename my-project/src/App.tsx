import React from "react";
import MassBalanceChart from "./MassBalanceChart";
import { Analytics } from "@vercel/analytics/react"

const App: React.FC = () => {
  return (
    <div >
      <MassBalanceChart />
      <Analytics />
    </div>
    
  );
};

export default App;