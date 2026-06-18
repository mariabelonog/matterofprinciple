// Центральный файл типов игры. Все интерфейсы используются как в логике симуляции,
// так и в React-компонентах — изменение полей здесь затрагивает весь проект.

// Команда-соперник, управляемая компьютером (автономный ИИ-участник сезона).
export interface Rival {
  id: string;              // уникальный идентификатор для React-ключей и поиска
  teamName: string;        // отображаемое название команды
  basePerformance: number; // базовый счёт результата на трассе: 0–10
  developmentRate: number; // прирост производительности за каждый гоночный раунд
  budget: number;          // бюджет команды в G (Geld); тратится на развитие
  reliability: number;     // надёжность автомобиля: 0–10; снижается после каждой гонки
}

// Пилот, выбираемый игроком перед сезоном. Стоимость вычитается из бюджета сразу.
export interface Driver {
  id: string;           // уникальный идентификатор для ключей и сравнения
  name: string;         // отображаемое вымышленное имя пилота
  driverIndex: number;  // индекс мастерства: 0–10; влияет на расчёт Driver Input
  cost: number;         // стоимость контракта в G; снимается с бюджета при выборе
  description: string;  // текстовая характеристика, показываемая игроку на экране выбора
}

// Глобальное состояние игровой сессии. Передаётся через props между экранами.
export interface GameState {
  teamName: string;              // название команды, введённое игроком
  budget: number;                // текущий бюджет в G; может уйти в минус (банкротство)
  driver: Driver | null;         // выбранный пилот; null до экрана выбора пилота
  carDevelopment: number;        // индекс развития автомобиля: 0–10
  staffQuality: number;          // индекс качества персонала: 0–10
  publicImage: number;           // индекс публичного имиджа: 0–10; влияет на вероятность спонсора
  riskWillingness: number;       // готовность к риску: 0–10; выставляется перед каждой гонкой
  currentRace: number;           // номер текущей гонки: 1–8
  lastCarInvestment: number;     // сумма инвестиций в машину на последнем шаге в G
  previousCarInvestment: number; // инвестиции в машину на предпоследнем шаге в G (для формулы потерь от аварии)
  raceHistory: ExtendedRaceResult[]; // список результатов всех завершённых гонок
  seasonSeed: number;            // начальное значение ГПСЧ; фиксируется при старте сезона для воспроизводимости
  carReliability: number;        // надёжность автомобиля: 0–10; снижается после каждой гонки
  rivals: Rival[];               // массив из 9 команд-соперников
}

// Базовый результат гонки, вычисляемый формулами симуляции.
export interface RaceResult {
  carPerformance: number; // взвешенная сумма carDevelopment и staffQuality
  strategy: number;       // взвешенная сумма staffQuality и riskWillingness
  driverInput: number;    // взвешенная сумма driverIndex и riskWillingness
  raceScore: number;      // итоговый балл гонки; определяет позицию среди соперников
  position: number;       // финишная позиция: 1–10
  narrative: string;      // текстовый комментарий к итогу гонки
}

// Распределение бюджета по трём категориям инвестиций (все значения в G).
export interface BudgetAllocation {
  carDevelopment: number; // сумма инвестиций в развитие автомобиля
  staffQuality: number;   // сумма инвестиций в качество персонала
  publicImage: number;    // сумма инвестиций в публичный имидж
}

// Данные об одной гонке из календаря сезона.
export interface Race {
  round: number;            // номер гонки в сезоне: 1–8
  city: string;             // название города проведения гонки
  isCrisis: boolean;        // true — перед гонкой показывается кризисное событие
  opponentScores: number[]; // 9 фиксированных баллов соперников для сравнения со счётом игрока
  atmosphereText: string;   // цитата или описание города, отображаемое на карточке гонки
}

// Один вариант выбора в кризисном событии. Все поля-дельты применяются немедленно при выборе.
export interface CrisisChoice {
  id: string;                      // уникальный идентификатор выбора (используется для записи в историю)
  label: string;                   // короткий заголовок кнопки выбора
  description: string;             // описание последствий, отображаемое под кнопкой
  narrative: string;               // текст, показываемый после выбора в блоке результатов гонки
  budgetDelta?: number;            // изменение бюджета в G (может быть отрицательным)
  carDevelopmentDelta?: number;    // изменение индекса carDevelopment
  staffQualityDelta?: number;      // изменение индекса staffQuality
  publicImageDelta?: number;       // изменение индекса publicImage
  riskModifier?: number;           // добавка к riskWillingness только для текущей гонки
  crashLossMultiplier?: number;    // множитель потерь от аварии в этой гонке (по умолчанию 1)
  driverBoost?: number;            // временный бонус к driverIndex только для этой гонки
}

// Кризисное событие, привязанное к конкретному городу.
export interface CrisisEvent {
  city: string;            // название города, в котором происходит событие
  title: string;           // заголовок события, отображаемый крупным шрифтом
  description: string;     // текст описания ситуации
  choices: CrisisChoice[]; // три варианта решения (всегда ровно три)
}

// Расширенный результат гонки — включает финансы, кризис и данные соперников.
// Хранится в raceHistory и используется в KPI-панели и итоговом экране сезона.
export interface ExtendedRaceResult extends RaceResult {
  raceNumber: number;        // номер гонки: 1–8
  city: string;              // название города
  sponsorIncome: number;     // доход от спонсора за гонку; 0 если контракт не сработал
  crashLosses: number;       // потери от аварии в G; 0 если аварии не было
  budgetAfter: number;       // бюджет после применения всех финансовых результатов гонки
  crisisChoiceId?: string;   // id выбранного варианта кризиса (если гонка кризисная)
  crisisNarrative?: string;  // нарратив выбранного варианта кризиса
  prizeMoneyEarned: number;  // призовые деньги согласно финишной позиции из таблицы PRIZE_MONEY
  dnf: boolean;              // true — автомобиль сошёл с гонки до финиша
  reliabilityAfter: number;  // значение carReliability после этой гонки
  rivalResults: { rivalId: string; teamName: string; score: number; dnf: boolean }[]; // результаты 9 соперников
}
