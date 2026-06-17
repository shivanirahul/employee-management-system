import { useState } from "react";
import "./index.css";

const PER_PAGE = 6;

const genderBadgeClass = {
  Male: "et-badge-male",
  Female: "et-badge-female",
};

const avatarColors = ["#6d28d9", "#db2777", "#0891b2", "#ea580c", "#16a34a"];

function initials(e) {
  return (e.firstName?.[0] || "") + (e.lastName?.[0] || "");
}

export default function EmployeeTable({ employees = [], onAdd, onView, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("firstName");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  const filtered = employees
    .filter((e) =>
      Object.values(e).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) =>
      sortDir === "asc"
        ? (a[sortBy] || "").localeCompare(b[sortBy] || "")
        : (b[sortBy] || "").localeCompare(a[sortBy] || "")
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const cur = Math.min(page, totalPages);
  const slice = filtered.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);

  return (
    <div className="et-page">
      <div className="et-header">
        <div>
          <h2 className="et-title">Employees</h2>
          <p className="et-subtitle">
            {filtered.length} total record{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="et-toolbar">
          <div className="et-search-wrap">
            <span className="et-search-icon">🔍</span>
            <input
              className="et-input"
              placeholder="Search by name, email, city..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select className="et-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="city">City</option>
          </select>

          <button
            className="et-icon-btn"
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            aria-label="Toggle sort direction"
          >
            {sortDir === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      <div className="et-grid">
        {slice.length ? (
          slice.map((emp, i) => {
            const badgeClass = genderBadgeClass[emp.gender] || "et-badge-other";
            const avatarBg = avatarColors[i % avatarColors.length];
            return (
              <div key={emp.id ?? i} className="et-card">
                <div className="et-card-top">
                  <div className="et-card-identity">
                    <div className="et-avatar" style={{ background: avatarBg }}>
                      {initials(emp)}
                    </div>
                    <div>
                      <div className="et-name">
                        {emp.firstName} {emp.lastName}
                      </div>
                      <div className="et-designation">{emp.designation || "—"}</div>
                    </div>
                  </div>
                  <span className={`et-badge ${badgeClass}`}>{emp.gender}</span>
                </div>

                <div className="et-contact">
                  <div className="et-contact-row">✉️ {emp.email}</div>
                  <div className="et-contact-row">📞 {emp.mobile}</div>
                  <div className="et-contact-row">📍 {emp.city}</div>
                </div>

                <div className="et-actions">
                  <button className="et-btn" onClick={() => onView?.(emp)}>
                    View
                  </button>
                  <button className="et-btn et-btn-edit" onClick={() => onEdit?.(emp)}>
                    ✏️ Edit
                  </button>
                  <button className="et-btn et-btn-delete" onClick={() => onDelete?.(emp)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="et-empty">No employees found</div>
        )}
      </div>

      {filtered.length > PER_PAGE && (
        <div className="et-pagination">
          <button className="et-btn" disabled={cur <= 1} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </button>
          <span className="et-page-count">
            {cur} / {totalPages}
          </span>
          <button className="et-btn" disabled={cur >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}