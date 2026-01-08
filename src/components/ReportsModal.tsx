import React, { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

export function ReportsModal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);

  // форма
  const [exportFormat, setExportFormat] = useState("PDF-документ");
  const [includePhotos, setIncludePhotos] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeMap, setIncludeMap] = useState(false);
  const [includeEngineer, setIncludeEngineer] = useState(false);

  const [logoName, setLogoName] = useState<string>("");
  const [comment, setComment] = useState("");

  // выбор метрик для отчёта
  const [mCost, setMCost] = useState(true);
  const [mTerms, setMTerms] = useState(true);
  const [mDurability, setMDurability] = useState(true);
  const [mNorms, setMNorms] = useState(true);
  const [mSafety, setMSafety] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // данные для графиков (пример)
  const radarData = [
    { metric: "Стоимость", value: 78 },
    { metric: "Сроки", value: 64 },
    { metric: "Надежность", value: 72 },
    { metric: "Нормативы", value: 85 },
    { metric: "Безопасность", value: 69 },
  ];

  const totalScore = 87; // пример

  const pieData = [
    { name: "Материалы", value: 42 },
    { name: "Работы", value: 28 },
    { name: "Техника", value: 18 },
    { name: "Прочее", value: 12 },
  ];

  const onPickLogo: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) setLogoName(file.name);
  };

  const buildReport = () => {
    // тут позже подключишь генерацию (API/экспорт)
    console.log("Build report", {
      exportFormat,
      metrics: { mCost, mTerms, mDurability, mNorms, mSafety },
      include: { includePhotos, includeCharts, includeMap, includeEngineer },
      logoName,
      comment,
    });
  };

  return (
    <div className="reportsOverlay">
      <div className="reportsModal" ref={ref}>


        <div className="reportsScroll">
          {/* Общая оценка проекта */}
          <div className="reportCard">
            <div className="reportCardTitle">Оценка и отчет</div>

            <div className="reportSectionTitle">Общая оценка проекта</div>
            <div className="chartBox">
              <ResponsiveContainer width="100%" height={210}>
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                  <Radar dataKey="value" stroke="#6b5cff" fill="#6b5cff" fillOpacity={0.25} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>

              <div className="scorePill">
                Общий балл<br />
                <b>{totalScore}/100</b>
              </div>
            </div>
          </div>

          {/* Структура затрат */}
          <div className="reportCard">
            <div className="reportSectionTitle">Структура затрат</div>
            <div className="chartBox">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {pieData.map((_, idx) => (
                      // цвета можно потом привести 1-в-1 под фигму
                      <Cell key={idx} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>

              <div className="reportTotals">
                <div>
                  Общая стоимость: <b>68 млн ₽</b>
                </div>
                <div className="muted">
                  Экономия: <b>7 млн ₽</b> (≈ 10%)
                </div>
              </div>
            </div>
          </div>

          {/* Выбор метрик */}
          <div className="reportCard">
            <div className="reportSectionTitle">Выбор метрик для отчета</div>
            <div className="checkGrid">
              <label className="checkRow">
                <input type="checkbox" checked={mCost} onChange={(e) => setMCost(e.target.checked)} />
                Стоимость и экономика
              </label>
              <label className="checkRow">
                <input type="checkbox" checked={mTerms} onChange={(e) => setMTerms(e.target.checked)} />
                Сроки реализации
              </label>
              <label className="checkRow">
                <input
                  type="checkbox"
                  checked={mDurability}
                  onChange={(e) => setMDurability(e.target.checked)}
                />
                Устойчивость и долговечность
              </label>
              <label className="checkRow">
                <input type="checkbox" checked={mNorms} onChange={(e) => setMNorms(e.target.checked)} />
                Нормативное соответствие
              </label>
              <label className="checkRow">
                <input type="checkbox" checked={mSafety} onChange={(e) => setMSafety(e.target.checked)} />
                Безопасность
              </label>
            </div>
          </div>

          {/* Настройки отчёта */}
          <div className="reportCard">
            <div className="reportSectionTitle">Настройки отчета</div>

            <div className="field">
              <label>Формат экспорта</label>
              <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                <option>PDF-документ</option>
                <option>DOCX-документ</option>
                <option>XLSX-таблица</option>
              </select>
            </div>

            <div className="reportSectionTitle" style={{ marginTop: 10 }}>
              Включить в отчет
            </div>
            <div className="checkGrid">
              <label className="checkRow">
                <input
                  type="checkbox"
                  checked={includePhotos}
                  onChange={(e) => setIncludePhotos(e.target.checked)}
                />
                Снимки с дрона и фотографии
              </label>
              <label className="checkRow">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                />
                Графики и диаграммы
              </label>
              <label className="checkRow">
                <input type="checkbox" checked={includeMap} onChange={(e) => setIncludeMap(e.target.checked)} />
                Карта с наложением
              </label>
              <label className="checkRow">
                <input
                  type="checkbox"
                  checked={includeEngineer}
                  onChange={(e) => setIncludeEngineer(e.target.checked)}
                />
                Комментарии инженера
              </label>
            </div>

            <div className="reportSectionTitle" style={{ marginTop: 10 }}>
              Логотип организации
            </div>

            <div className="logoRow">
              <label className="uploadBtn">
                Загрузить
                <input type="file" accept="image/*" onChange={onPickLogo} />
              </label>
              <div className="logoName">{logoName ? logoName : "Файл не выбран"}</div>
            </div>

            <div className="reportSectionTitle" style={{ marginTop: 10 }}>
              Комментарий
            </div>
            <textarea
              className="commentBox"
              placeholder="Дополнительная информация о проекте..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="reportsFooter">
          <button className="buildBtn" onClick={buildReport}>
            Сформировать отчет
          </button>
        </div>
      </div>
    </div>
  );
}
