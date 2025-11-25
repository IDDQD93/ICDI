import React from 'react';


import './App.css';
import { MapView } from './MapView.tsx';

function App() {
  return (
    <div className="app-root">
      <aside className="sidebar">
        {/* тут твои вкладки: Физическая модель, Нагрузочная карта и т.п. */}
      </aside>

      <main className="main">
        <div className="map-wrapper">
          <MapView />
        </div>

        <section className="right-panel">
          {/* блок с характеристиками: материал, ширина, дата инспекции и т.п. */}
        </section>
      </main>
    </div>
  );
}

export default App;



