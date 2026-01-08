import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { MapView } from "./MapView";
import { AssistantModal } from "./AssistantModal";
import { ReportsModal } from "./ReportsModal";
import { AnalyticsModal } from "./AnalyticsModal";



type PanelKey = "physical" | "load" | "economy" | "rules" | "devices" | null;

function App() {
  const analyticsIcon = "/src/assets/icons/Button.svg";
  const reportsIcon = "/src/assets/icons/Button (1).svg";
  const assistantIcon = "/src/assets/icons/Button (2).svg";

  const mapIcon = "/src/assets/icons/map.svg";
  const loadIcon = "/src/assets/icons/trending up.svg";
  const economyIcon = "/src/assets/icons/dollar sign.svg";
  const alertIcon = "/src/assets/icons/Alerts.svg";
  const liveIcon = "/src/assets/icons/live 2.svg";

  const [activePanel, setActivePanel] = useState<PanelKey>("physical");
  const [openSection, setOpenSection] = useState<string | null>("physical");

  const panelRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const togglePanel = (panel: PanelKey) => {
    setActivePanel(panel);
    setOpenSection(panel);
  };

  const toggleSection = (key: string) => {
    setOpenSection(prev => (prev === key ? null : key));
  };

  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const [isReportsOpen, setReportsOpen] = useState(false);

  const [isAssistantOpen, setAssistantOpen] = useState(false);

  /* КЛИК ВНЕ ПАНЕЛЕЙ */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(target)
      ) {
        setActivePanel(null);
        setOpenSection(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand">
          <span className="brandThin">logo</span>
          <span className="brandBold">company</span>
        </div>

        <div className="topActions">
          <button className="pill" onClick={() => setIsAnalyticsOpen(true)}><img src={analyticsIcon} /></button>

          <button
  type="button"
  className="pill"
  onClick={() => setReportsOpen(true)} ><img src={reportsIcon} alt="Отчеты" /></button>
          <button
  type="button"
  className="pill"
  onClick={() => setAssistantOpen(true)}
>
  <img src={assistantIcon} alt="ИИ-помощник" />
</button>

          {isReportsOpen && (
  <ReportsModal onClose={() => setReportsOpen(false)} />
)}

{isAssistantOpen && (
  <AssistantModal onClose={() => setAssistantOpen(false)} />
)}

        </div>
      </header>

      <div className="layout">
        {/* LEFT NAV */}
        <div className="left-zone">
          <aside
            className="sidebar"
            ref={sidebarRef}
            onMouseDown={e => e.stopPropagation()}
          >
            <button className="iconBtn" onClick={() => togglePanel("physical")}><img src={mapIcon} /></button>
            <button className="iconBtn" onClick={() => togglePanel("load")}><img src={loadIcon} /></button>
            <button className="iconBtn" onClick={() => togglePanel("economy")}><img src={economyIcon} /></button>
            <button className="iconBtn" onClick={() => togglePanel("rules")}><img src={alertIcon} /></button>
            <button className="iconBtn" onClick={() => togglePanel("devices")}><img src={liveIcon} /></button>
          </aside>

          <section
            ref={panelRef}
            className={`left-panel ${activePanel ? "open" : ""}`}
            onMouseDown={e => e.stopPropagation()}
          >
            {[
              ["physical", "Физическая модель"],
              ["load", "Нагрузочная карта"],
              ["economy", "Экономическая модель"],
              ["rules", "Нормативное соответствие"],
              ["devices", "Данные устройств"],
            ].map(([key, title]) => (
              <div
                key={key}
                className={`panelBtn ${activePanel === key ? "active" : ""}`}
              >
                {title}
              </div>
            ))}
          </section>
        </div>

        {/* CENTER */}
        <main className="main">
          <div className="main-top">
            <div className="map-wrapper">
              <div className="map-card">
                <MapView />
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
                <div className="mediaRow"><span>📷 Фото-съёмка:</span><b>12.11.2024</b></div>
                <div className="mediaRow"><span>🎥 Видео инспекция:</span><b>03.05.2025</b></div>
              </div>
            </section>
          </div>

          {/* PARAMS */}
          <section
            className="params-panel"
            onMouseDown={e => e.stopPropagation()}
          >
            {activePanel && (
              <Accordion
                sectionKey={activePanel}
                openSection={openSection}
                toggleSection={toggleSection}
              />
            )}
          </section>
        </main>
      </div>

      {isAnalyticsOpen && (
  <AnalyticsModal onClose={() => setIsAnalyticsOpen(false)} />
)}

    </div>
  );
}

/* ===== ACCORDION ===== */

function Accordion({
  sectionKey,
  openSection,
  toggleSection,
}: {
  sectionKey: string;
  openSection: string | null;
  toggleSection: (k: string) => void;
}) {

  const renderFields = () => {
    switch (sectionKey) {
      case "load":
        return (
          <>
            <div className="subTitle">Материалы и износ</div>
            <label>Приоритет оптимизации
              <select><option>Минимизация затрат</option></select>
            </label>
            <label>Толщина покрытия (см)<input type="number" defaultValue={12} /></label>
            <label>Износ (%)<input type="number" defaultValue={25} /></label>
            <label>Остаточный срок службы (лет)<input type="number" defaultValue={8} /></label>
          </>
        );
      case "physical":
        return (
          <>
            <label>Название участка<input defaultValue="Трасса М-11, км 45–52" /></label>
            <div className="row">
              <label>Протяжённость (км)<input type="number" defaultValue={7.2} /></label>
              <label>Ширина (м)<input type="number" defaultValue={14.5} /></label>
            </div>
            <label>Количество полос<input type="number" defaultValue={4} /></label>
            <label>Год постройки<input type="number" defaultValue={2018} /></label>

          </>
        );

      case "rules":
        return (
          <>
            <label>Норматив ГОСТ
              <select><option>ГОСТ Р 50597-2017</option></select>
            </label>
            <label>Допустимая нагрузка (т/м²)<input type="number" defaultValue={11.5} /></label>

            <div className="alertBox">
              Обнаружено превышение нормы на участке км 48–49
            </div>
          </>
        );

      case "economy":
        return (
          <>
            <label>Стоимость строительства (млн ₽)<input type="number" defaultValue={450} /></label>
            <label>Затраты на содержание (млн ₽/год)<input type="number" defaultValue={12.5} /></label>
            <label>Прогноз ремонта (млн ₽)<input type="number" defaultValue={85} /></label>
          </>
        );

      case "devices":
        return (
          <>
            <label>Последняя съёмка дроном<input defaultValue="15.11.2025, 14:30" /></label>
            <label>Количество точек съёмки<input type="number" defaultValue={127} /></label>
            <label>Формат данных
              <select><option>LIDAR Point Cloud</option></select>
            </label>
            <button className="actionBtn">🔄 Обновить с дрона</button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`accordion ${openSection === sectionKey ? "open" : ""}`}>
      <button
        className="accordionHeader"
        onMouseDown={e => e.stopPropagation()}
        onClick={() => toggleSection(sectionKey)}
      >
        {{
          physical: "Общие характеристики",
          load: "Нагрузочные параметры",
          economy: "Экономические показатели",
          rules: "Нормативные значения",
          devices: "Метаданные устройств",
        }[sectionKey]} <span>›</span>
      </button>

      <div
        className="accordionBody"
        onMouseDown={e => e.stopPropagation()}
      >
        {renderFields()}
      </div>
    </div>
  );
}

export default App;
