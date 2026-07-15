import './App.css'

type WorkCategory = '開発' | '会議' | 'レビュー' | '設計' | '調査'

type WorkRecord = {
  id: number
  date: string
  dayLabel: string
  title: string
  category: WorkCategory
  durationHours: number
  note: string
}

type CategorySummary = {
  category: WorkCategory
  hours: number
  color: string
}

const weeklyHours = [
  { label: '木', hours: 6.5 },
  { label: '金', hours: 7.25 },
  { label: '土', hours: 2.5 },
  { label: '日', hours: 1.75 },
  { label: '月', hours: 8 },
  { label: '火', hours: 6.75 },
  { label: '水', hours: 7.5 },
]

const categorySummaries: CategorySummary[] = [
  { category: '開発', hours: 18.5, color: '#4b5563' },
  { category: '会議', hours: 7, color: '#9ca3af' },
  { category: 'レビュー', hours: 5.5, color: '#6b7280' },
  { category: '設計', hours: 4.5, color: '#d1d5db' },
  { category: '調査', hours: 3.5, color: '#e5e7eb' },
]

const recentRecords: WorkRecord[] = [
  {
    id: 1,
    date: '7/15',
    dayLabel: '今日',
    title: 'ダッシュボード画面の実装',
    category: '開発',
    durationHours: 3.25,
    note: 'KPI とグラフの初期実装',
  },
  {
    id: 2,
    date: '7/15',
    dayLabel: '今日',
    title: '週次進捗ミーティング',
    category: '会議',
    durationHours: 1,
    note: '今週の優先度を確認',
  },
  {
    id: 3,
    date: '7/14',
    dayLabel: '昨日',
    title: 'PR レビューと修正確認',
    category: 'レビュー',
    durationHours: 2.5,
    note: 'UI 変更の差分確認',
  },
  {
    id: 4,
    date: '7/14',
    dayLabel: '昨日',
    title: '作業記録モデルの整理',
    category: '設計',
    durationHours: 2,
    note: '集計単位と画面項目を定義',
  },
  {
    id: 5,
    date: '7/13',
    dayLabel: '月',
    title: 'Cloudflare Workers 構成確認',
    category: '調査',
    durationHours: 1.75,
    note: 'ビルドと配信設定を確認',
  },
]

const totalCategoryHours = categorySummaries.reduce(
  (total, item) => total + item.hours,
  0,
)

const maxDailyHours = Math.max(...weeklyHours.map((item) => item.hours))

const formatHours = (hours: number) => `${hours.toFixed(hours % 1 === 0 ? 0 : 1)}h`

function buildPieSegments(items: CategorySummary[]) {
  let cumulative = 0

  return items.map((item) => {
    const percentage = item.hours / totalCategoryHours
    const dashArray = `${percentage * 100} ${100 - percentage * 100}`
    const dashOffset = -cumulative * 100
    cumulative += percentage

    return {
      ...item,
      dashArray,
      dashOffset,
      percentage: Math.round(percentage * 100),
    }
  })
}

function App() {
  const pieSegments = buildPieSegments(categorySummaries)

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">作業時間ダッシュボード</p>
          <h1>今日の集中度をひと目で確認</h1>
        </div>
        <div className="period-chip">2026年7月15日</div>
      </header>

      <section className="kpi-grid" aria-label="作業時間の概要">
        <article className="kpi-card">
          <span className="kpi-label">今日</span>
          <strong>{formatHours(7.5)}</strong>
          <span className="kpi-caption">目標 8h まであと 0.5h</span>
        </article>
        <article className="kpi-card">
          <span className="kpi-label">今週</span>
          <strong>{formatHours(40.25)}</strong>
          <span className="kpi-caption">先週比 +3.0h</span>
        </article>
        <article className="kpi-card">
          <span className="kpi-label">今月</span>
          <strong>{formatHours(118.5)}</strong>
          <span className="kpi-caption">月間目標の 72%</span>
        </article>
      </section>

      <section className="chart-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>直近7日間</h2>
              <p>日別の作業時間</p>
            </div>
            <span className="panel-total">{formatHours(40.25)}</span>
          </div>
          <div className="bar-chart" role="img" aria-label="直近7日間の作業時間の棒グラフ">
            {weeklyHours.map((item) => (
              <div className="bar-item" key={item.label}>
                <span className="bar-value">{formatHours(item.hours)}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ height: `${(item.hours / maxDailyHours) * 100}%` }}
                  />
                </div>
                <span className="bar-label">{item.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>カテゴリ別</h2>
              <p>今週の内訳</p>
            </div>
            <span className="panel-total">{formatHours(totalCategoryHours)}</span>
          </div>
          <div className="category-chart">
            <svg className="pie-chart" viewBox="0 0 42 42" role="img" aria-label="カテゴリ別の作業時間の円グラフ">
              <circle className="pie-bg" cx="21" cy="21" r="15.915" />
              {pieSegments.map((segment) => (
                <circle
                  className="pie-segment"
                  cx="21"
                  cy="21"
                  key={segment.category}
                  r="15.915"
                  stroke={segment.color}
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.dashOffset}
                />
              ))}
            </svg>
            <ul className="category-list">
              {pieSegments.map((item) => (
                <li key={item.category}>
                  <span className="category-dot" style={{ background: item.color }} />
                  <span>{item.category}</span>
                  <strong>
                    {formatHours(item.hours)} / {item.percentage}%
                  </strong>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section className="panel records-panel">
        <div className="panel-header">
          <div>
            <h2>最近の作業記録</h2>
            <p>仮データによる最新 5 件</p>
          </div>
        </div>
        <div className="records-list">
          {recentRecords.map((record) => (
            <article className="record-row" key={record.id}>
              <div className="record-date">
                <strong>{record.date}</strong>
                <span>{record.dayLabel}</span>
              </div>
              <div className="record-main">
                <h3>{record.title}</h3>
                <p>{record.note}</p>
              </div>
              <span className="record-category">{record.category}</span>
              <strong className="record-hours">{formatHours(record.durationHours)}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
