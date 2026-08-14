"use client";

import { Fragment, useEffect, useState } from "react";

function diff(target: number) {
  const total = Math.max(0, target - Date.now());
  return {
    total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

const UNITS: { key: "days" | "hours" | "minutes" | "seconds"; label: string }[] =
  [
    { key: "days", label: "dias" },
    { key: "hours", label: "horas" },
    { key: "minutes", label: "min" },
    { key: "seconds", label: "seg" },
  ];

/** Contagem regressiva delicada até a data do evento. */
export function Countdown({ date }: { date: string }) {
  const target = new Date(date).getTime();
  const [time, setTime] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (time.total === 0) {
    return <p className="font-heading text-2xl italic">É hoje!</p>;
  }

  return (
    <div className="flex items-center justify-center">
      {UNITS.map(({ key, label }, i) => (
        <Fragment key={key}>
          {i > 0 && (
            <span className="mx-2.5 h-6 w-px bg-current opacity-20 sm:mx-4" />
          )}
          <div className="flex min-w-9 flex-col items-center">
            <span
              suppressHydrationWarning
              className="font-heading text-2xl leading-none font-medium tabular-nums sm:text-3xl"
            >
              {String(time[key]).padStart(2, "0")}
            </span>
            <span className="mt-1.5 text-[0.55rem] tracking-[0.2em] uppercase opacity-65">
              {label}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
