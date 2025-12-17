import React from "react";
import "./App.css";
import { MapView } from "./MapView.tsx";

function App() {
  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand">
          <span className="brandThin">logo</span>
          <span className="brandBold">company</span>
        </div>

        <div className="topActions">
          <button className="pill">📊 Аналитика</button>
          <button className="pill">📄 Отчеты</button>
          <button className="pill">🖥️ ИИ-помощник</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <button className="iconBtn">🗺️</button>
          <button className="iconBtn">📈</button>
          <button className="iconBtn">$</button>
          <button className="iconBtn">⚠️</button>
          <button className="iconBtn">📡</button>
        </aside>

        <main className="main">
          <div className="map-wrapper">
            <div className="map-card">
              <MapView />
            </div>

            <div className="zoomStack">
              <button className="zoomBtn">＋</button>
              <button className="zoomBtn">－</button>
              <button className="zoomBtn">⛶</button>
            </div>
          </div>

          <section className="right-panel">
            <div className="panel">
              <div className="panelTitle">Характеристики</div>
              <div className="kv">
                <div className="k">Материал:</div><div className="v">Асфальт М400</div>
                <div className="k">Ширина:</div><div className="v">14.5 м</div>
                <div className="k">Толщина:</div><div className="v">25 см</div>
                <div className="k">Год постройки:</div><div className="v">2018</div>
              </div>
            </div>

            <div className="panel">
              <div className="panelTitle">Медиа-данные</div>

              <div className="mediaRow">
                <span>📷 Фото-съёмка:</span>
                <b>12.11.2024</b>
              </div>

              <div className="mediaRow">
                <span>🎥 Видео инспекция:</span>
                <b>03.05.2025</b>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;

