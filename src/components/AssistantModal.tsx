import React, { useEffect, useMemo, useRef, useState } from "react";

type Msg = {
  id: string;
  role: "assistant" | "user";
  text: string;
  time?: string;
};

export function AssistantModal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>(() => [
    {
      id: "m1",
      role: "assistant",
      time: "16:45",
      text:
        "Здравствуйте! Я ИИ-помощник платформы управления инфраструктурой. " +
        "Могу проанализировать данные, предложить оптимальные решения и ответить на ваши вопросы. Чем могу помочь?",
    },
  ]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const todayLabel = useMemo(() => "Сегодня", []);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    const userMsg: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      time: `${hh}:${mm}`,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // демо-ответ (потом заменишь на реальный API)
    setTimeout(() => {
      const reply: Msg = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "Принял. Уточни участок/км или выбери действие снизу — и я начну анализ.",
      };
      setMessages((prev) => [...prev, reply]);
    }, 450);
  };

  const quickAction = (text: string) => {
    setInput(text);
  };

  const saveSession = () => {
    console.log("Save session:", messages);
  };

  return (
    <div className="assistantOverlay">
      <div className="assistantModal" ref={ref}>
        <div className="assistantHeader">
          <div className="assistantTitle">ИИ-помощник</div>
          <button className="assistantClose" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>

        <div className="assistantBody">
          <div className="assistantDay">{todayLabel}</div>

          <div className="assistantChat">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`assistantMsgRow ${m.role === "user" ? "me" : "bot"}`}
              >
                <div className="assistantBubble">
                  <div className="assistantText">{m.text}</div>
                  {m.time && <div className="assistantTime">{m.time}</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="assistantQuick">
            <div className="assistantQuickTitle">Быстрые действия:</div>

            <button
              className="assistantQuickBtn"
              onClick={() => quickAction("Показать проблемные зоны по текущему участку")}
              type="button"
            >
              <span className="assistantQuickIcon">◎</span>
              Показать проблемные зоны
            </button>

            <button
              className="assistantQuickBtn"
              onClick={() => quickAction("Какой вариант ремонта лучше и почему?")}
              type="button"
            >
              <span className="assistantQuickIcon">↗</span>
              Какой вариант лучше?
            </button>

            <button
              className="assistantQuickBtn"
              onClick={() => quickAction("Сделай анализ рисков по участку")}
              type="button"
            >
              <span className="assistantQuickIcon">⚠</span>
              Анализ рисков
            </button>
          </div>
        </div>

        <div className="assistantFooter">
          <div className="assistantInputRow">
            <input
              className="assistantInput"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Задайте вопрос…"
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />
            <button className="assistantSend" onClick={send} type="button" aria-label="Отправить">
              ➤
            </button>
          </div>

          <button className="assistantSave" onClick={saveSession} type="button">
            Сохранить сессию диалога
          </button>
        </div>
      </div>
    </div>
  );
}
