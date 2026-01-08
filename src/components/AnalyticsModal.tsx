import React, { useRef, useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type TabKey = "current" | "generation" | "scenario" | "compare";

export function AnalyticsModal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tab, setTab] = useState<TabKey>("current");

  // Генерация (контролы формы)
  const [goal, setGoal] = useState("Минимизация затрат");
  const [variants, setVariants] = useState<number>(3);
  const [useNorms, setUseNorms] = useState(true);

  const history = useMemo(
    () => [
      { date: "16.11.2025 20:23", text: "3 варианта (баланс)" },
      { date: "14.11.2025 15:47", text: "5 вариантов (минимизация затрат)" },
    ],
    []
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const chartData = [
    { month: "Янв", current: 28, forecast: 30 },
    { month: "Фев", current: 29, forecast: 31 },
    { month: "Мар", current: 31, forecast: 33 },
    { month: "Апр", current: 30, forecast: 34 },
    { month: "Май", current: 33, forecast: 36 },
    { month: "Июн", current: 34, forecast: 38 },
    { month: "Июл", current: 36, forecast: 40 },
  ];

  const runGeneration = () => {
    // тут позже подключишь реальный запрос/логику
    console.log("Generate:", { goal, variants, useNorms });
  };

  return (
    <div className="analyticsOverlay">
      <div className="analyticsModal analytics-modal" ref={ref}>
        <div className="analyticsHeader">
          
        </div>

        <div className="analyticsTabs">
          <button
            className={tab === "current" ? "active" : ""}
            onClick={() => setTab("current")}
          >
            Текущий анализ
          </button>
          <button
            className={tab === "generation" ? "active" : ""}
            onClick={() => setTab("generation")}
          >
            Генерация
          </button>
          <button
            className={tab === "scenario" ? "active" : ""}
            onClick={() => setTab("scenario")}
          >
            Сценарий
          </button>
          <button
            className={tab === "compare" ? "active" : ""}
            onClick={() => setTab("compare")}
          >
            Сравнение
          </button>
        </div>

        {/* Контент вкладок */}
        {tab === "current" && (
          <div className="analyticsContent">
            <div className="chartCard">
              <div className="chartTitleRow">
                <div className="chartTitle">Прогноз нагрузки</div>
                <div className="chartLegend">
                  <span className="dot dotCurrent" /> Текущая
                  <span className="dot dotForecast" /> Прогноз
                </div>
              </div>

              <div className="chartArea">
                <ResponsiveContainer width="100%" height={170}>
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
                    <XAxis dataKey="month" tickMargin={8} />
                    <YAxis tickMargin={8} width={34} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(15,33,71,0.95)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 10,
                        color: "#fff",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Line type="monotone" dataKey="current" stroke="#6b5cff" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="forecast" stroke="#b9b2ff" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="issues">
              <div className="issue critical">
                Критический износ<br />
                км 48–49, участок 250м
              </div>
              <div className="issue warning">
                Превышение нагрузки<br />
                км 50–51
              </div>
              <div className="issue notice">
                Плановая проверка<br />
                км 45–52
              </div>
            </div>
          </div>
        )}

        {tab === "generation" && (
          <div className="genWrap">
            <div className="genCard">
              <div className="genTitle">ИИ-генерация вариантов</div>
              <div className="genDesc">
                Искусственный интеллект предложит улучшенные варианты решений с учетом ограничений.
              </div>

              <div className="genField">
                <label>Приоритет оптимизации</label>
                <select value={goal} onChange={(e) => setGoal(e.target.value)}>
                  <option>Минимизация затрат</option>
                  <option>Максимизация ресурса</option>
                  <option>Снижение рисков</option>
                  <option>Баланс</option>
                </select>
              </div>

              <div className="genField">
                <label>Количество вариантов</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={variants}
                  onChange={(e) => setVariants(Number(e.target.value))}
                />
              </div>

              <label className="genCheck">
                <input
                  type="checkbox"
                  checked={useNorms}
                  onChange={(e) => setUseNorms(e.target.checked)}
                />
                Учитывать нормативные ограничения
              </label>

              <button className="genBtn" onClick={runGeneration}>
                Запустить генерацию
              </button>
            </div>

            <div className="genHistory">
              <div className="genHistoryTitle">История генераций</div>

              <div className="genHistoryList">
                {history.map((h, idx) => (
                  <div className="genHistoryItem" key={idx}>
                    <div className="genHistoryDate">{h.date}</div>
                    <div className="genHistoryText">{h.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "scenario" && (
          <div className="emptyState">
            <div className="emptyTitle">Сценарий</div>
            <div className="emptyText">Здесь будет настройка сценариев (подключим позже).</div>
          </div>
        )}

        {tab === "compare" && (
          <div className="emptyState">
            <div className="emptyTitle">Сравнение</div>
            <div className="emptyText">Здесь будет сравнение вариантов (подключим позже).</div>
          </div>
        )}
      </div>
    </div>
  );
}
