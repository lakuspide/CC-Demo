import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SensoryLoader from './components/SensoryLoader';
import AsadoCentral from './AsadoCentral';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="bg-[#0d0d0d] min-h-screen">
      <AnimatePresence>
        {!isLoaded && <SensoryLoader key="loader" ON_LOAD_COMPLETE={() => setIsLoaded(true)} />}
      </AnimatePresence>
      
      <AsadoCentral />
    </div>
  );
}

export default App;
