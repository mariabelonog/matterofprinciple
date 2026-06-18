# Matter of Principle

[Посмотреть рекламную брошюру](https://mariabelonog.github.io/matterofprinciple/brochure.html)

**[▶ Играть](https://matterofprinciple.vercel.app)**

Браузерная стратегическая игра: ты руководитель гоночной команды на грани банкротства. Один сезон, восемь гонок, сто миллионов Geld на старте.

---

## Для пользователя

<img width="1428" height="736" alt="Screenshot 2026-06-18 at 13 58 05" src="https://github.com/user-attachments/assets/6c70ffa3-17ea-496a-9c6f-b6facff17937" />
<img width="1425" height="723" alt="Screenshot 2026-06-18 at 13 59 02" src="https://github.com/user-attachments/assets/645c27a3-e137-4451-9466-4c2e6f65dabc" />
<img width="1425" height="729" alt="Screenshot 2026-06-18 at 14 08 49" src="https://github.com/user-attachments/assets/d73648cf-ad86-4e83-883e-f9b4ead9437a" />

## Для разработчика

### Стек

Next.js 15 (App Router), TypeScript 5, Tailwind CSS v4. Игра полностью работает в браузере.

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
Более подробно:


```
matterofprinciple/
│
├── app/
│   ├── page.tsx        ← МОЗГ ИГРЫ. Единственный владелец состояния.
│   │                      Стейт-машина с 8 экранами, все переходы здесь.
│   ├── layout.tsx      ← HTML-обёртка, подключение шрифта Press Start 2P
│   └── globals.css     ← глобальные стили, импорт Tailwind
│
├── components/
│   ├── screens/        ← полноэкранные компоненты, по одному на фазу игры
│   │   ├── HeroScreen.tsx           — стартовый экран
│   │   ├── HowToPlay.tsx            — правила
│   │   ├── TeamSetup.tsx            — ввод названия команды
│   │   ├── DriverSelectionScreen.tsx — выбор пилота
│   │   ├── BudgetAllocationScreen.tsx — предсезонные инвестиции
│   │   ├── RaceScreen.tsx           — главный экран (спонсор→кризис→риск→гонка→результат)
│   │   ├── InvestmentScreen.tsx     — инвестиции между гонками
│   │   └── FinalSeasonResult.tsx    — итоговый экран
│   │
│   └── ui/             ← переиспользуемые панели внутри экранов
│       ├── CrisisPanel.tsx      — кризисный выбор с таймером 15 сек
│       ├── RiskSelector.tsx     — слайдер риска 0–10
│       ├── RaceResultPanel.tsx  — позиция, финансы, нарратив
│       ├── TeamStatusPanel.tsx  — текущие индексы команды
│       ├── TeamKPIPanel.tsx     — история KPI по гонкам
│       ├── RouteMapModal.tsx    — карта маршрута + экономика городов
│       └── SponsorUpdate.tsx    — результат броска на спонсора
│
├── lib/                ← вся игровая логика, без UI
│   ├── simulation.ts        — 6 чистых функций-формул (calcCarPerformance и др.)
│   ├── simulationEngine.ts  — симуляция гонки, PRNG Mulberry32, соперники
│   ├── races.ts             — календарь 8 гонок (статичные данные)
│   ├── crisisEvents.ts      — 3 кризисных события с вариантами выбора
│   └── teamKPIs.ts          — хелперы для исторических KPI
│
├── data/
│   ├── cityEconomics.ts  — реальные экономические данные 8 городов
│   └── mockData.ts       — тестовые данные для разработки
│
└── types/
    └── game.ts           — все TypeScript-интерфейсы: GameState, Driver,
                            Race, CrisisEvent, RaceResult и др.

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

### Архитектура (контейнеры)

```
┌─────────────────────────────────────────────────────────┐
│                    Браузер пользователя                  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Next.js App (Client)                │   │
│  │                                                  │   │
│  │   app/page.tsx  ←─── стейт-машина (GameState)   │   │
│  │        │                                         │   │
│  │   ┌────▼─────────────────────────────────────┐  │   │
│  │   │           Screen Components              │  │   │
│  │   │  HeroScreen · TeamSetup · DriverSelect   │  │   │
│  │   │  BudgetAllocation · RaceScreen           │  │   │
│  │   │  InvestmentScreen · FinalSeasonResult    │  │   │
│  │   └────┬─────────────────────────────────────┘  │   │
│  │        │ вызывает                                │   │
│  │   ┌────▼─────────────────────────────────────┐  │   │
│  │   │           Game Logic  (/lib)             │  │   │
│  │   │  simulation.ts   — формулы индексов      │  │   │
│  │   │  simulationEngine.ts — гонка, PRNG,      │  │   │
│  │   │                        соперники          │  │   │
│  │   │  races.ts        — календарь сезона      │  │   │
│  │   │  crisisEvents.ts — кризисные сценарии    │  │   │
│  │   └────┬─────────────────────────────────────┘  │   │
│  │        │ читает                                  │   │
│  │   ┌────▼──────────┐   ┌────────────────────┐   │   │
│  │   │  /data        │   │  /types/game.ts     │   │   │
│  │   │  статичные    │   │  TypeScript-        │   │   │
│  │   │  данные       │   │  интерфейсы         │   │   │
│  │   └───────────────┘   └────────────────────┘   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

