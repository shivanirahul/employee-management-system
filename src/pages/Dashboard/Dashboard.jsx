import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import apiClient from "../../services/api";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
import "./Dashboard.css";


function daysUntilBirthday(dob) {
  if (!dob) return Infinity;
  const today = new Date();
  const birth = new Date(dob);
  const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < today) {
    next.setFullYear(today.getFullYear() + 1);
  }
  return Math.ceil((next - today) / (1000 * 60 * 60 * 24));
}

function formatBirthday(dob) {
  return new Date(dob).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function initials(emp) {
  return ((emp.firstName?.[0] || "") + (emp.lastName?.[0] || "")).toUpperCase();
}

function greetingForNow() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const AVATAR_CLASSES = ["avatar-0", "avatar-1", "avatar-2", "avatar-3", "avatar-4"];
const BADGE_CLASS = { Male: "badge-male", Female: "badge-female" };

const ANNOUNCEMENTS = [
  { text: "New employee onboarding checklist updated.", time: "2 days ago" },
  { text: "Office will be closed for the upcoming public holiday.", time: "4 days ago" },
  { text: "Please update your profile details if anything has changed.", time: "1 week ago" },
];


function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    let frame;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

function StatCard({ icon, label, value, accent }) {
  const animated = useCountUp(value);
  return (
    <div className={`stat-card stat-${accent}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-value">{animated}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function Avatar({ emp, index }) {
  return (
    <div className={`avatar ${AVATAR_CLASSES[index % AVATAR_CLASSES.length]}`}>
      {initials(emp)}
    </div>
  );
}

function GenderBadge({ gender }) {
  return <span className={`badge ${BADGE_CLASS[gender] || "badge-other"}`}>{gender || "—"}</span>;
}

function Panel({ title, action, children, className = "" }) {
  return (
    <div className={`panel ${className}`}>
      <div className="panel-header">
        <h3>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ text }) {
  return <div className="empty-text">{text}</div>;
}

function Spinner() {
  return <div className="spinner" role="status" aria-label="Loading" />;
}


const Dashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/api/employee");
        const formatted = response.data.data.map((emp) => ({
          id: emp._id,
          firstName: emp.FirstName,
          lastName: emp.LastName,
          gender: emp.Gender,
          city: emp.City || "Unknown",
          dob: emp.DOB || null,
        }));
        setEmployees(formatted);
      } catch (err) {
        console.error(err);
        setError("Couldn't load employee data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const recentEmployees = employees.slice(0, 4);

  const upcomingBirthdays = employees
    .filter((emp) => emp.dob)
    .map((emp) => ({ ...emp, daysAway: daysUntilBirthday(emp.dob) }))
    .sort((a, b) => a.daysAway - b.daysAway)
    .slice(0, 4);

  const genderCounts = employees.reduce((acc, emp) => {
    const key = emp.gender || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const totalForGender = employees.length || 1;

  const cityCounts = employees.reduce((acc, emp) => {
    acc[emp.city] = (acc[emp.city] || 0) + 1;
    return acc;
  }, {});
  const cityList = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="welcome-banner">
          <div className="welcome-text">
            <span className="welcome-greeting">{greetingForNow()},</span>
            <h1>Admin 👋</h1>
            <p>Here's what's happening across your organization today.</p>
          </div>
          <div className="welcome-decoration" aria-hidden="true">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
          </div>
        </div>

        {loading && (
          <div className="dashboard-loading">
            <Spinner />
            <span>Loading dashboard…</span>
          </div>
        )}

        {!loading && error && <div className="dashboard-error">{error}</div>}

        {!loading && !error && (
          <>
            <div className="stats-row">
              <StatCard icon="👥" label="Total Employees" value={employees.length} accent="violet" />
              <StatCard icon="🎂" label="Upcoming Birthdays" value={upcomingBirthdays.length} accent="pink" />
              <StatCard icon="📍" label="Cities" value={cityList.length} accent="teal" />
            </div>

            <div className="dashboard-grid dashboard-grid-primary">
              <Panel
                title="Recent Employees"
                action={
                  <button className="view-all-btn" onClick={() => navigate("/employees")}>
                    View All
                  </button>
                }
              >
                {recentEmployees.length === 0 ? (
                  <EmptyState text="No employees yet." />
                ) : (
                  <div className="employee-list">
                    {recentEmployees.map((emp, i) => (
                      <div key={emp.id} className="employee-row">
                        <div className="employee-identity">
                          <Avatar emp={emp} index={i} />
                          <div>
                            <strong>{emp.firstName} {emp.lastName}</strong>
                            <div className="employee-sub">{emp.city}</div>
                          </div>
                        </div>
                        <GenderBadge gender={emp.gender} />
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel title="Birthdays">
                {upcomingBirthdays.length === 0 ? (
                  <EmptyState text="No birthdays on file." />
                ) : (
                  <table className="bday-table">
                    <tbody>
                      {upcomingBirthdays.map((emp, i) => (
                        <tr key={emp.id}>
                          <td>
                            <div className="bday-name-cell">
                              <Avatar emp={emp} index={i} />
                              <span>{emp.firstName} {emp.lastName}</span>
                            </div>
                          </td>
                          <td className="bday-date-cell">🎂 {formatBirthday(emp.dob)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Panel>

              <Panel title="Quick Actions">
                <div className="quick-actions-list">
                  <button className="quick-action-btn" onClick={() => navigate("/add-employee")}>
                    <span className="quick-action-icon">➕</span>
                    Add Employee
                  </button>
                  <button className="quick-action-btn" onClick={() => navigate("/employees")}>
                    <span className="quick-action-icon">👥</span>
                    View Employees
                  </button>
                  <button className="quick-action-btn" onClick={() => window.location.reload()}>
                    <span className="quick-action-icon">🔄</span>
                    Refresh Data
                  </button>
                  <button className="quick-action-btn" onClick={() => navigate("/employees?sort=city")}>
                    <span className="quick-action-icon">📍</span>
                    Browse by City
                  </button>
                </div>
              </Panel>

              <Panel title="Gender Statistics">
  {employees.length === 0 ? (
    <EmptyState text="No data yet." />
  ) : (
    <div className="gender-chart-container">
      <div className="gender-chart">
        <Doughnut
          data={{
            labels: Object.keys(genderCounts),
            datasets: [
              {
                data: Object.values(genderCounts),
                backgroundColor: [
                  "#ec4899",
                  "#94a3b8",
                  "#3b82f6",
                ],
                borderWidth: 0,
              },
            ],
          }}
          options={{
            cutout: "70%",
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>

      <div className="gender-stats">
        {Object.entries(genderCounts).map(([gender, count]) => {
          const pct = Math.round((count / totalForGender) * 100);

          return (
            <div key={gender} className="gender-stat-item">
              <div className="gender-stat-left">
                <span
                  className={`gender-dot ${
                    gender === "Female"
                      ? "female-dot"
                      : gender === "Male"
                      ? "male-dot"
                      : "other-dot"
                  }`}
                />
                <span>{gender}</span>
              </div>

              <strong>{pct}%</strong>
            </div>
          );
        })}
      </div>
    </div>
  )}
</Panel>
</div>

<div className="dashboard-grid dashboard-grid-secondary">
  <Panel title="Announcements">
    <div className="announcement-list">
      {ANNOUNCEMENTS.map((a, i) => (
        <div key={i} className="announcement-row">
          <span className="announcement-dot" />
          <div className="announcement-text">
            {a.text}
            <span className="announcement-time">{a.time}</span>
          </div>
        </div>
      ))}
    </div>
  </Panel>

  <Panel title="Top Cities">
    {cityList.length === 0 ? (
      <EmptyState text="No data yet." />
    ) : (
      <div className="city-list">
        {cityList.map(([name, count]) => (
          <div key={name} className="city-row">
            <span>{name}</span>
            <span className="city-count">{count}</span>
          </div>
        ))}
      </div>
    )}
  </Panel>
</div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;