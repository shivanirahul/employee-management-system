import { useState } from "react";
import "./index.css";

const BADGE = { Male: "et-badge-male", Female: "et-badge-female" };
const AVATAR_CLASSES = ["et-avatar-0", "et-avatar-1", "et-avatar-2", "et-avatar-3", "et-avatar-4"];
const PER_PAGE = 6;
const initials = (e) => (e.firstName?.[0] || "") + (e.lastName?.[0] || "");

export default function EmployeeTable({ employees = [], onView, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("firstName");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  const filtered = employees
  .filter((e) => {
    if (!search.trim()) return true;

    return String(e[sortBy] || "")
      .toLowerCase()
      .includes(search.toLowerCase());
  })
    .sort((a, b) => {
  const aVal = a[sortBy];
  const bVal = b[sortBy];

  if (!aVal) return 1;
  if (!bVal) return -1;

  const cmp = aVal.localeCompare(bVal);
  return sortDir === "asc" ? cmp : -cmp;
});

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const cur = Math.min(page, totalPages);
  const slice = filtered.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);
 
  return (
    <div className="et-page">


  <div className="et-header">
        <div>
          <h2 className="et-title">Employees</h2>
          <p className="et-subtitle">{filtered.length} total record{filtered.length !== 1 && "s"}</p>
        </div>

        <div className="et-toolbar">
          <div className="et-search-wrap">
            <label htmlFor="employee-search" className="sr-only">Search employees</label>
            <span className="et-search-icon" aria-hidden="true">🔍</span>
            <input
              id="employee-search"
              className="et-input"
              placeholder="Search by name, email, city..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <label htmlFor="sort-by" className="sr-only">Sort by</label>
          <select id="sort-by" className="et-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="city">City</option>
          </select>

          <button
            className="et-icon-btn"
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            aria-label={`Sort ${sortDir === "asc" ? "descending" : "ascending"}`}
          >
            {sortDir === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      <div className="et-grid">
        {slice.length ? slice.map((emp, i) => (
          <div key={emp.id ?? i} className="et-card">
            <div className="et-card-top">
              <div className="et-card-identity">
                <div className={`et-avatar ${AVATAR_CLASSES[i % AVATAR_CLASSES.length]}`}>
                  {initials(emp)}
                </div>
                <div>
                  <div className="et-name">{emp.firstName} {emp.lastName}</div>
                  <div className="et-designation">{emp.designation || "—"}</div>
                </div>
              </div>
              <span className={`et-badge ${BADGE[emp.gender] || "et-badge-other"}`}>{emp.gender}</span>
            </div>

            <div className="et-contact">
              <div className="et-contact-row">✉️ {emp.email}</div>
              <div className="et-contact-row">📞 {emp.mobile}</div>
              <div className="et-contact-row">📍 {emp.city}</div>
            </div>

            <div className="et-actions">
              <button className="et-btn" onClick={() => onView?.(emp)}>View</button>
              <button className="et-btn et-btn-edit" onClick={() => onEdit?.(emp)}>✏️ Edit</button>
              <button className="et-btn et-btn-delete" onClick={() => onDelete?.(emp)}>🗑️ Delete</button>
            </div>
          </div>
        )) : (
          <div className="et-empty">No employees found</div>
        )}
      </div>

      {filtered.length > PER_PAGE && (
        <div className="et-pagination">
          <button className="et-btn" disabled={cur <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
          <span className="et-page-count">{cur} / {totalPages}</span>
          <button className="et-btn" disabled={cur >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
