import { useState } from 'react'
import './App.css'

type Priority = '高' | '中' | '低'

type KpiItem = {
  label: string
  value: string
  helper: string
}

type DailyMetric = {
  day: string
  phoneHours: number
  sleepHours: number
}

type TodoItem = {
  id: number
  title: string
  priority: Priority
  due: string
  completed: boolean
}

type PhoneUsageDraft = {
  date: string
  hours: string
  memo: string
}

type SleepDraft = {
  bedtime: string
  sleepStart: string
  wakeTime: string
  satisfaction: string
}

type TodoDraft = {
  title: string
  priority: Priority
  due: string
}

const dailyMetrics: DailyMetric[] = [
  { day: '木', phoneHours: 4.2, sleepHours: 6.5 },
  { day: '金', phoneHours: 3.8, sleepHours: 7.1 },
  { day: '土', phoneHours: 5.6, sleepHours: 8.0 },
  { day: '日', phoneHours: 4.9, sleepHours: 7.6 },
  { day: '月', phoneHours: 3.4, sleepHours: 6.8 },
  { day: '火', phoneHours: 3.1, sleepHours: 7.3 },
  { day: '水', phoneHours: 2.8, sleepHours: 7.4 },
]

const initialTodos: TodoItem[] = [
  { id: 1, title: '朝のストレッチを10分する', priority: '中', due: '08:30', completed: true },
  { id: 2, title: '昼休みに散歩する', priority: '低', due: '13:00', completed: false },
  { id: 3, title: '寝る前にスマホを机に置く', priority: '高', due: '22:30', completed: false },
  { id: 4, title: '明日の予定を3つだけ整理する', priority: '中', due: '21:30', completed: true },
]

const todayLabel = '2026年7月15日 水曜日'

function KpiCard({ item }: { item: KpiItem }) {
  return (
    <article className="card kpi-card">
      <span className="kpi-label">{item.label}</span>
      <strong>{item.value}</strong>
      <span className="kpi-helper">{item.helper}</span>
    </article>
  )
}

function BarChart({
  title,
  subtitle,
  unit,
  values,
  valueKey,
}: {
  title: string
  subtitle: string
  unit: string
  values: DailyMetric[]
  valueKey: 'phoneHours' | 'sleepHours'
}) {
  const maxValue = Math.max(...values.map((item) => item[valueKey]))

  return (
    <section className="card chart-card">
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="bar-chart" role="img" aria-label={`${title}の棒グラフ`}>
        {values.map((item) => {
          const value = item[valueKey]

          return (
            <div className="bar-column" key={`${title}-${item.day}`}>
              <span className="bar-number">{value.toFixed(1)}</span>
              <div className="bar-rail">
                <div className="bar-meter" style={{ height: `${(value / maxValue) * 100}%` }} />
              </div>
              <span className="bar-day">{item.day}</span>
            </div>
          )
        })}
      </div>
      <p className="chart-note">単位: {unit}</p>
    </section>
  )
}

function TodoList({
  todos,
  onToggle,
}: {
  todos: TodoItem[]
  onToggle: (id: number) => void
}) {
  return (
    <section className="card todo-card">
      <div className="section-heading">
        <div>
          <h2>今日のTODO</h2>
          <p>完了状況、優先度、期限を確認</p>
        </div>
      </div>
      <div className="todo-list">
        {todos.map((todo) => (
          <label className="todo-row" key={todo.id}>
            <input
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              type="checkbox"
            />
            <span className="todo-title">{todo.title}</span>
            <span className={`priority priority-${todo.priority}`}>{todo.priority}</span>
            <span className="todo-due">{todo.due}</span>
          </label>
        ))}
      </div>
    </section>
  )
}

function PhoneUsageForm({
  draft,
  onChange,
}: {
  draft: PhoneUsageDraft
  onChange: (draft: PhoneUsageDraft) => void
}) {
  return (
    <section className="card form-card">
      <div className="section-heading">
        <div>
          <h2>スマホ時間入力</h2>
          <p>今日の使用時間を仮入力</p>
        </div>
      </div>
      <form className="form-grid">
        <label>
          日付
          <input
            onChange={(event) => onChange({ ...draft, date: event.target.value })}
            type="date"
            value={draft.date}
          />
        </label>
        <label>
          使用時間
          <input
            min="0"
            onChange={(event) => onChange({ ...draft, hours: event.target.value })}
            step="0.1"
            type="number"
            value={draft.hours}
          />
        </label>
        <label className="full-width">
          メモ
          <textarea
            onChange={(event) => onChange({ ...draft, memo: event.target.value })}
            rows={3}
            value={draft.memo}
          />
        </label>
      </form>
    </section>
  )
}

function SleepForm({
  draft,
  onChange,
}: {
  draft: SleepDraft
  onChange: (draft: SleepDraft) => void
}) {
  return (
    <section className="card form-card">
      <div className="section-heading">
        <div>
          <h2>睡眠記録入力</h2>
          <p>就寝から起床までを記録</p>
        </div>
      </div>
      <form className="form-grid">
        <label>
          就寝時刻
          <input
            onChange={(event) => onChange({ ...draft, bedtime: event.target.value })}
            type="time"
            value={draft.bedtime}
          />
        </label>
        <label>
          入眠時刻
          <input
            onChange={(event) => onChange({ ...draft, sleepStart: event.target.value })}
            type="time"
            value={draft.sleepStart}
          />
        </label>
        <label>
          起床時刻
          <input
            onChange={(event) => onChange({ ...draft, wakeTime: event.target.value })}
            type="time"
            value={draft.wakeTime}
          />
        </label>
        <label>
          睡眠満足度
          <select
            onChange={(event) => onChange({ ...draft, satisfaction: event.target.value })}
            value={draft.satisfaction}
          >
            <option value="5">5 とても良い</option>
            <option value="4">4 良い</option>
            <option value="3">3 普通</option>
            <option value="2">2 浅い</option>
            <option value="1">1 不足</option>
          </select>
        </label>
      </form>
    </section>
  )
}

function TodoForm({
  draft,
  onChange,
  onAdd,
}: {
  draft: TodoDraft
  onChange: (draft: TodoDraft) => void
  onAdd: () => void
}) {
  return (
    <section className="card form-card">
      <div className="section-heading">
        <div>
          <h2>TODO追加</h2>
          <p>今日やることを仮追加</p>
        </div>
      </div>
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault()
          onAdd()
        }}
      >
        <label className="full-width">
          TODO
          <input
            onChange={(event) => onChange({ ...draft, title: event.target.value })}
            placeholder="例: 22時以降は通知を切る"
            type="text"
            value={draft.title}
          />
        </label>
        <label>
          優先度
          <select
            onChange={(event) => onChange({ ...draft, priority: event.target.value as Priority })}
            value={draft.priority}
          >
            <option value="高">高</option>
            <option value="中">中</option>
            <option value="低">低</option>
          </select>
        </label>
        <label>
          期限
          <input
            onChange={(event) => onChange({ ...draft, due: event.target.value })}
            type="time"
            value={draft.due}
          />
        </label>
        <button className="primary-button full-width" type="submit">
          TODOを追加
        </button>
      </form>
    </section>
  )
}

function App() {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos)
  const [phoneDraft, setPhoneDraft] = useState<PhoneUsageDraft>({
    date: '2026-07-15',
    hours: '2.8',
    memo: '夜の動画視聴を短めにできた',
  })
  const [sleepDraft, setSleepDraft] = useState<SleepDraft>({
    bedtime: '23:10',
    sleepStart: '23:35',
    wakeTime: '07:00',
    satisfaction: '4',
  })
  const [todoDraft, setTodoDraft] = useState<TodoDraft>({
    title: '',
    priority: '中',
    due: '21:00',
  })

  const completedCount = todos.filter((todo) => todo.completed).length
  const kpis: KpiItem[] = [
    { label: '今日のスマホ使用時間', value: '2.8時間', helper: '昨日より 0.3時間 少なめ' },
    { label: '昨夜の睡眠時間', value: '7.4時間', helper: '目標 7時間を達成' },
    { label: '入眠時刻', value: '23:35', helper: '就寝から25分後' },
    { label: '今日のTODO達成数', value: `${completedCount}/${todos.length}`, helper: '完了チェックで更新' },
  ]

  const toggleTodo = (id: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const addTodo = () => {
    const title = todoDraft.title.trim()

    if (!title) {
      return
    }

    setTodos((currentTodos) => [
      ...currentTodos,
      {
        id: Date.now(),
        title,
        priority: todoDraft.priority,
        due: todoDraft.due,
        completed: false,
      },
    ])
    setTodoDraft({ title: '', priority: '中', due: '21:00' })
  }

  return (
    <main className="dashboard-shell">
      <header className="top-header">
        <div>
          <p className="today-label">{todayLabel}</p>
          <h1>Personal Dashboard</h1>
        </div>
        <p className="header-summary">スマホ・睡眠・TODOを一画面で確認</p>
      </header>

      <section className="kpi-grid" aria-label="今日のサマリー">
        {kpis.map((item) => (
          <KpiCard item={item} key={item.label} />
        ))}
      </section>

      <section className="charts-grid">
        <BarChart
          subtitle="使いすぎを早めに把握"
          title="直近7日間のスマホ使用時間"
          unit="時間"
          valueKey="phoneHours"
          values={dailyMetrics}
        />
        <BarChart
          subtitle="睡眠リズムの変化を確認"
          title="直近7日間の睡眠時間"
          unit="時間"
          valueKey="sleepHours"
          values={dailyMetrics}
        />
      </section>

      <section className="main-grid">
        <TodoList onToggle={toggleTodo} todos={todos} />
        <div className="forms-stack">
          <PhoneUsageForm draft={phoneDraft} onChange={setPhoneDraft} />
          <SleepForm draft={sleepDraft} onChange={setSleepDraft} />
          <TodoForm draft={todoDraft} onAdd={addTodo} onChange={setTodoDraft} />
        </div>
      </section>
    </main>
  )
}

export default App
