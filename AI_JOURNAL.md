# Журнал использования искусственного интеллекта

**Проект:** Matter of Principle  
**Модель:** Claude Sonnet 4.6 (Claude Code)

---

## 1. Дизайн-документ и архитектура игры

**Промпт:**

> "project info
> the currency in this world is geld (G)
> я думаю что место в каждой гонке будет определяться следующей формулой.
> p = car performance * 0,6 + driver input * 0,1 + strategy * 0,3 (p is our place in the race)
> in this parallel universe there are 8 races (like in good ol times) (paris, strassburg, stuttgart, vienna, budapest, bucharest, sinaia, istanbul)
> 10 drivers because there is 10 teams.
> car performance = car development * 0,6 + staff quality * 0,4 (out of 10)
> strategy = staff quality * 0,7 + risk willingness * 0,3 (out of 10)
> driver = driver index * 0,6 + risk willingness * 0,4 (out of 10)
> we invest in:
> staff quality = return of investment in that? (out of 10)
> car development = return of investment in that? (out of 10)
> we also have public image index (out of 10)
> public image = (investment in public index - risk willingness)
> from the public image index we calculate the returned investment to the budget (multiplied on some probability)
> we invest in public image hoping to have return of investment to refill the budget but it is not guaranteed. we spend budget once on a pilot, basically we are buying the driver index. we also invest in car development and staff quality. we also pay for the crashes (losses). they are subtracted from the budget after every race.
> its game over once the budget is negative
> losses = some probability (derived from risk willingness) * the last two car performance investments
> gameplay
> first we enter the name of our team
> we have lets say 100 mln geld at first
> we choose which driver to buy out of three (their cost depends on their index out of 10)
> then we are offered to make the first investments in car dev, public image and staff quality
> then every race till the end (unless its a race where action happens) we first are told whether we have some new contracts (budget refill yay), then set the risk willingness index, then see our race result, then decide where to make investments out of three again after the losses are subtracted.
> there are three races where sth happens and we have to make some tough decisions. those races are strassburg, budapest and istanbul.
> the decisions affect the money we spend, the losses we take and the risk index on which we decide.
> Matter of Principle
> Rararacing is about to go bankrupt. Nobody wants to sail the sinking ship. Your friend from its executives board is begging for a favor - take over team principle's role and lead the boat out of the storm." lets discuss the ideas

**Результат:** Создан `GAME_SPEC.md` — спецификация игры, взятая из обсуждённой идеи: 8 гонок, стартовый бюджет 100M Geld, формулы carPerformance / strategy / raceScore, система индексов 0–10, призовые деньги по позициям, механика краша и спонсоров.

---

## 2. Прототип интерфейса

**Промпт:** Создать скелет Next.js-приложения с пиксельным дизайном, экранами TeamSetup / DriverSelection / BudgetAllocation / RaceScreen и мок-данными. Прикреплены референсы.

Обсуждение реализации, доработка, дебаггинг.

**Результат:** Реализованы компоненты всех экранов, ретро-стиль с Press Start 2P, пиксельная сетка фона, базовая стейт-машина в `page.tsx`.

---

## 3. Полный игровой цикл

**Промпт:** Реализуй полный сезон из 8 гонок: кризисные события в трёх городах (Страсбург, Будапешт, Стамбул) с тремя вариантами выбора каждый, экран инвестиций между гонками, финальный экран результатов.

Обсуждение реализации, выявление лучших путей, доработка, дебаггинг. Мёрж.

**Результат:** Написаны `lib/crisisEvents.ts`, `lib/races.ts`, `InvestmentScreen.tsx`, `FinalSeasonResult.tsx`. Реализован полный переход между экранами через стейт-машину в `page.tsx`.

---

## 4. Движок симуляции

**Промпт:** Добавь детерминированный движок гонки с сидированным PRNG, девятью командами-соперниками, призовыми деньгами по позициям, механикой надёжности автомобиля и эволюцией соперников между гонками.

**Результат:** Создан `lib/simulationEngine.ts`: алгоритм Mulberry32 для воспроизводимой случайности, шаблоны 9 соперников (герои Илиады), `simulateRace()`, `updateRivals()`, призовая шкала 50M→1M Geld.

---

## 5. Балансировка и контент

**Промпт:** Обсуждение балансировки и выигрышных стратегий.

**Результат:** Скорректированы коэффициенты водителей и веса индексов в формулах, переписаны три кризисных сценария (контрабандное топливо / радикальный апгрейд / поглощение командой), обновлены все тексты интерфейса.

---

## 6. UI-улучшения

**Промпт:** Добавь таймер обратного отсчёта на кризисные решения (15 секунд с авто-выбором), интерактивную карту маршрута Восточного экспресса, панель финансовых KPI команды на экране инвестиций.

Обсуждение реализации и интерфейса, выбор KPI, доработка, дебаггинг.

**Результат:** Реализованы `components/ui/CrisisPanel.tsx` с прогресс-баром таймера, `components/ui/RouteMapModal.tsx` с кликабельной картой городов, `components/ui/TeamKPIPanel.tsx` с историческими данными.

---

## 7. Рефакторинг `page.tsx`

**Промпт:** Проанализируй `page.tsx` на предмет мёртвого кода, дублирования и несоответствия лучшим практикам React. Исправь все найденные проблемы.

**Результат:** Удалены три недостижимых legacy-экрана и их импорты, дублирующий вызов `applyUpgrades` вынесен в хелпер `applyAllInvestments()`, 128 DOM-элементов бордюра заменены CSS-градиентом, `key` перенесён непосредственно на `<RaceScreen>`.

---

## 8. Комментирование кода

**Промпт:** Добавь полные комментарии на русском языке ко всем 25 TypeScript/TSX файлам проекта — интерфейсы, функции, константы, формулы, JSX-секции.

Проверка и исправление комментариев.

**Результат:** Прокомментированы все файлы: `types/game.ts`, весь `/lib`, весь `/data`, все экранные и UI-компоненты. Каждая формула, магическое число и алгоритмическое решение снабжено объяснением.
