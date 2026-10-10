"use client";

import { useState } from "react";
import Link from "next/link";
import AdminLogoutButton from "./admin-logout-button";

type RequestStatus = "New" | "Follow-up" | "Booked";
type RequestFilter = "All" | RequestStatus;

type ConsultationRequest = {
  id: number;
  name: string;
  email: string;
  goal: string;
  date: string;
  status: RequestStatus;
  note: string;
};

const requests: ConsultationRequest[] = [
  { id: 1, name: "Olivia Chen", email: "olivia@example.com", goal: "Breakouts", date: "Today, 9:42 am", status: "New", note: "Looking for a simple routine that works with sensitive skin." },
  { id: 2, name: "Maya Patel", email: "maya@example.com", goal: "Building a routine", date: "Today, 8:15 am", status: "Follow-up", note: "Asked for help choosing a gentle cleanser and moisturizer." },
  { id: 3, name: "Amina Yusuf", email: "amina@example.com", goal: "Dryness or sensitivity", date: "Yesterday", status: "Booked", note: "Prefers a morning consultation later this week." },
  { id: 4, name: "Eleanor Wright", email: "eleanor@example.com", goal: "Uneven tone or texture", date: "Oct 7", status: "New", note: "Would like to talk through a more consistent routine." },
  { id: 5, name: "Priya Shah", email: "priya@example.com", goal: "Building a routine", date: "Oct 6", status: "Booked", note: "Interested in a short consultation and a written plan." },
  { id: 6, name: "Chloe Martin", email: "chloe@example.com", goal: "Something else", date: "Oct 5", status: "Follow-up", note: "Sent a follow-up question about getting started." },
];

const filters: RequestFilter[] = ["All", "New", "Follow-up", "Booked"];

export default function AdminDashboard() {
  const [activeFilter, setActiveFilter] = useState<RequestFilter>("All");
  const [query, setQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);

  const filteredRequests = requests.filter((request) => {
    const matchesFilter = activeFilter === "All" || request.status === activeFilter;
    const searchText = `${request.name} ${request.email} ${request.goal}`.toLowerCase();
    return matchesFilter && searchText.includes(query.trim().toLowerCase());
  });

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/" aria-label="Truth Skin Studio home">
          <span className="admin-brand-mark">t.</span>
          <span>truth<span className="admin-brand-subtitle">SKIN STUDIO</span></span>
        </Link>
        <p className="admin-nav-label">WORKSPACE</p>
        <nav className="admin-nav" aria-label="Admin navigation">
          <a className="admin-nav-link active" href="#overview"><span className="admin-nav-dot" />Overview</a>
          <a className="admin-nav-link" href="#requests"><span className="admin-nav-dot" />Consultations<span className="admin-nav-count">6</span></a>
          <Link className="admin-nav-link" href="/admin/content"><span className="admin-nav-dot" />Website content</Link>
        </nav>
        <div className="admin-sidebar-bottom">
          <span className="admin-avatar">SDG</span>
          <span className="admin-account"><strong>SKINDRUG_GIST</strong><small>Administrator</small></span>
          <span className="admin-account-menu" aria-hidden="true">···</span>
        </div>
      </aside>

      <main className="admin-main" id="overview">
        <header className="admin-topbar">
          <p>Workspace <span>/</span> Overview</p>
          <div className="admin-topbar-actions">
            <Link className="admin-public-link" href="/">View public site <span aria-hidden="true">↗</span></Link>
            <AdminLogoutButton />
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-heading">
            <div>
              <p className="admin-eyebrow">FRIDAY, OCTOBER 9</p>
              <h1>Good morning, SDG team</h1>
              <p className="admin-subheading">Here’s the shape of your consultation desk.</p>
            </div>
            <span className="admin-preview-badge"><span />Preview data</span>
          </div>

          <div className="admin-preview-notice" role="note">
            <strong>Sample workspace</strong>
            <span>These example records are for preview only. No live consultation data is connected.</span>
          </div>

          <section className="admin-stats" aria-label="Consultation summary">
            <article className="admin-stat">
              <span>Open requests</span>
              <strong>4</strong>
              <small><span className="admin-stat-dot blue" />2 new <span>·</span> 2 follow-ups</small>
            </article>
            <article className="admin-stat">
              <span>Booked this week</span>
              <strong>2</strong>
              <small><span className="admin-stat-dot green" />Both confirmed</small>
            </article>
            <article className="admin-stat">
              <span>Typical reply time</span>
              <strong>4.2 <em>hrs</em></strong>
              <small><span className="admin-stat-dot orange" />Within one business day</small>
            </article>
          </section>

          <section className="admin-requests" id="requests" aria-labelledby="requests-title">
            <div className="admin-section-heading">
              <div>
                <p className="admin-eyebrow">YOUR INBOX</p>
                <h2 id="requests-title">Consultation requests <span>6</span></h2>
              </div>
              <label className="admin-search">
                <span aria-hidden="true">⌕</span>
                <input aria-label="Search requests" onChange={(event) => setQuery(event.target.value)} placeholder="Search people or goals" value={query} />
                <kbd>/</kbd>
              </label>
            </div>

            <div className="admin-filter-row" role="tablist" aria-label="Filter consultation requests">
              {filters.map((filter) => (
                <button
                  aria-selected={activeFilter === filter}
                  className={`admin-filter${activeFilter === filter ? " active" : ""}`}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  role="tab"
                  type="button"
                >
                  {filter}<span>{filter === "All" ? requests.length : requests.filter((request) => request.status === filter).length}</span>
                </button>
              ))}
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th scope="col">NAME</th><th scope="col">LOOKING FOR</th><th scope="col">RECEIVED</th><th scope="col">STATUS</th><th scope="col"><span className="admin-visually-hidden">Actions</span></th></tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td><span className="admin-person-initial">{request.name.split(" ").map((part) => part[0]).join("")}</span><span className="admin-person"><strong>{request.name}</strong><small>{request.email}</small></span></td>
                      <td>{request.goal}</td>
                      <td className="admin-date">{request.date}</td>
                      <td><span className={`admin-status ${request.status.toLowerCase().replace("-", "")}`}>{request.status}</span></td>
                      <td><button className="admin-row-action" onClick={() => setSelectedRequest(request)} type="button">Details</button></td>
                    </tr>
                  ))}
                  {filteredRequests.length === 0 && <tr><td className="admin-empty" colSpan={5}>No requests match that search.</td></tr>}
                </tbody>
              </table>
            </div>
            <p className="admin-table-foot">Showing {filteredRequests.length} of {requests.length} sample requests</p>
          </section>

          <footer className="admin-footer"><span>TRUTH SKIN STUDIO</span><span>Thoughtful skincare, one conversation at a time.</span></footer>
        </div>
      </main>

      {selectedRequest && (
        <div className="admin-drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedRequest(null); }}>
          <section aria-labelledby="request-detail-title" aria-modal="true" className="admin-detail-drawer" role="dialog">
            <button aria-label="Close request details" className="admin-drawer-close" onClick={() => setSelectedRequest(null)} type="button">×</button>
            <p className="admin-eyebrow">CONSULTATION REQUEST</p>
            <h2 id="request-detail-title">{selectedRequest.name}</h2>
            <a href={`mailto:${selectedRequest.email}`}>{selectedRequest.email}</a>
            <dl>
              <div><dt>Looking for</dt><dd>{selectedRequest.goal}</dd></div>
              <div><dt>Received</dt><dd>{selectedRequest.date}</dd></div>
              <div><dt>Status</dt><dd><span className={`admin-status ${selectedRequest.status.toLowerCase().replace("-", "")}`}>{selectedRequest.status}</span></dd></div>
            </dl>
            <div className="admin-detail-note"><span>THEIR NOTE</span><p>{selectedRequest.note}</p></div>
            <a className="admin-reply-button" href={`mailto:${selectedRequest.email}`}>Reply by email</a>
          </section>
        </div>
      )}
    </div>
  );
}