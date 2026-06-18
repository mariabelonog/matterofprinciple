# Matter of Principle

**[▶ Играть](https://matterofprinciple.vercel.app)**

Браузерная стратегическая игра: ты руководитель гоночной команды на грани банкротства. Один сезон, восемь гонок, сто миллионов Geld на старте.

---

## Для разработчика

### Стек

Next.js 15 (App Router), TypeScript 5, Tailwind CSS v4. Без бэкенда, без базы данных, без авторизации — игра полностью работает в браузере.

### Структура проекта

```
/app
  page.tsx              — стейт-машина, роутинг между экранами
  layout.tsx            — корневой layout, шрифты
/components
  /screens              — полноэкранные компоненты каждой фазы игры
  /ui                   — переиспользуемые панели (риск, кризис, KPI, карта)
/lib
  simulation.ts         — расчёт индексов и формулы
  simulationEngine.ts   — симуляция гонки, PRNG, соперники
  races.ts              — календарь 8 гонок
  crisisEvents.ts       — три кризисных сценария с выборами
/data                   — статичные данные
/types
  game.ts               — все TypeScript-интерфейсы проекта
```

### Архитектура

`app/page.tsx` — единственный владелец состояния (`GameState`). Экраны — чистые компоненты, получают данные через пропсы и возвращают события через колбэки. Бизнес-логика не живёт в компонентах.

Поток экранов:

```
hero → teamsetup → driverselection → budgetallocation → race → investment → race → ... → seasonresult
```

`investment` вставляется между каждой парой гонок. При отрицательном бюджете или после 8-й гонки — переход сразу в `seasonresult`.

### Формулы

```
carPerformance  =  carDev × 0.6  +  staffQuality × 0.4
strategy        =  staffQuality × 0.7  +  riskWillingness × 0.3
driverInput     =  driverIndex × 0.6  +  riskWillingness × 0.4
raceScore       =  carPerformance × 0.6  +  driverInput × 0.1  +  strategy × 0.3

crashLosses     =  riskWillingness/20 × (lastCarInvest + prevCarInvest) × multiplier
sponsorIncome   =  publicImage × 3 000 000  (с вероятностью publicImage / 10)
```

Случайность детерминирована: PRNG Mulberry32 с `seasonSeed`, фиксированным в начале сезона. Одна стратегия — один результат, можно сравнивать прохождения.

### Запуск локально

```bash
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000).
