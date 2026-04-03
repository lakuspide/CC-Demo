import React, { Suspense, lazy, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SensoryLoader from './components/SensoryLoader';

const AsadoCentral = lazy(() => import('./AsadoCentral'));

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!isLoaded && <SensoryLoader key="loader" ON_LOAD_COMPLETE={() => setIsLoaded(true)} />}
      </AnimatePresence>
      
      <Suspense fallback={null}>
        <AsadoCentral />
      </Suspense>
    </>
  );
}

export default App;
