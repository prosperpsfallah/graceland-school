// ============================================
// GRACAIS E-PORTAL
// SHARED ADMIN LAYOUT
// ============================================

import {
  requireUser,
  logout,
  esc
} from "./app.js";

// ============================================
// SCHOOL INFORMATION
// ============================================

const SCHOOL_NAME =
  "Graceland Academy International School of Excellence";

const SCHOOL_SHORT_NAME = "GRACAIS";

// ============================================
// ADMIN NAVIGATION
// ============================================

const ADMIN_NAV = [
  {
    title: "MAIN",
    items: [
      ["dashboard.html", "Dashboard", "layout-dashboard"],
      ["students.html", "Students", "users"],
      ["teachers.html", "Teachers", "graduation-cap"],
      ["classes.html", "Classes", "school"],
      ["subjects.html", "Subjects", "book-open"]
    ]
  },
  {
    title: "ACADEMIC MANAGEMENT",
    items: [
      ["academic-years.html", "Academic Years", "calendar-days"],
      ["teacher-assignments.html", "Teacher Assignments", "clipboard-list"],
      ["grades.html", "Grades", "chart-no-axes-column"],
      ["attendance.html", "Attendance", "calendar-check"],
      ["schedule.html", "Schedules", "calendar-clock"],
      ["announcements.html", "Announcements", "megaphone"]
    ]
  },
  {
    title: "RECORDS",
    items: [
      ["student-enrollment.html", "Enrollment", "user-plus"],
      ["transcripts.html", "Transcripts", "file-text"],
      ["reports.html", "Reports", "chart-column"],
      ["documents.html", "Documents", "folder"],
      ["audit-logs.html", "Audit Logs", "history"]
    ]
  },
  {
    title: "SYSTEM",
    items: [
      ["users.html", "User Accounts", "shield-check"],
      ["settings.html", "Settings", "settings"]
    ]
  }
];

// ============================================
// ICONS
// ============================================

const ICONS = {
  "layout-dashboard": "▦",
  users: "♙",
  "graduation-cap": "♧",
  school: "⌂",
  "book-open": "▤",
  "calendar-days": "▦",
  "clipboard-list": "☷",
  "chart-no-axes-column": "▥",
  "calendar-check": "✓",
  "calendar-clock": "◷",
  megaphone: "◉",
  "user-plus": "＋",
  "file-text": "▤",
  "chart-column": "▥",
  folder: "▱",
  history: "↶",
  "shield-check": "◇",
  settings: "⚙",
  menu: "☰",
  close: "×",
  logout: "⇥"
};

// ============================================
// NAVIGATION HTML
// ============================================

function buildNavigation(currentPage) {
  const groups = ADMIN_NAV.map(group => {
    const links = group.items.map(
      ([file, label, icon]) => {
        const active =
          currentPage === file ||
          currentPage === file.replace(".html", "");

        return `
          <a
            class="sidebar-link ${active ? "active" : ""}"
            href="./${esc(file)}"
            ${active ? 'aria-current="page"' : ""}
          >
            <span class="sidebar-icon" aria-hidden="true">
              ${esc(ICONS[icon] || "•")}
            </span>
            <span>${esc(label)}</span>
          </a>
        `;
      }
    ).join("");

    return `
      <div class="sidebar-group">
        <p class="sidebar-group-title">
          ${esc(group.title)}
        </p>

        <nav class="sidebar-nav">
          ${links}
        </nav>
      </div>
    `;
  }).join("");

  return `
    <aside
      id="sidebar"
      class="sidebar"
      data-sidebar
      aria-label="Main navigation"
    >
      <div class="sidebar-brand">
        <a href="./dashboard.html" class="brand-link">
          <img
            src="../logo.png"
            alt="${SCHOOL_SHORT_NAME} logo"
            class="sidebar-logo"
          >

          <span class="brand-text">
            <strong>${SCHOOL_SHORT_NAME}</strong>
            <small>Academic Portal</small>
          </span>
        </a>

        <button
          type="button"
          class="sidebar-close"
          id="sidebarClose"
          aria-label="Close navigation"
        >
          ${ICONS.close}
        </button>
      </div>

      <div class="sidebar-content">
        ${groups}
      </div>

      <div class="sidebar-footer">
        <div class="sidebar-school-name">
          ${SCHOOL_NAME}
        </div>

        <div class="sidebar-role">
          Authorized Staff Area
        </div>
      </div>
    </aside>
  `;
}

// ============================================
// SHARED PAGE HEADER
// ============================================

function buildHeader(pageTitle) {
  return `
    <header class="topbar">
      <button
        type="button"
        class="menu-toggle"
        id="menuToggle"
        data-menu-toggle
        aria-label="Open navigation"
        aria-expanded="false"
        aria-controls="sidebar"
      >
        ${ICONS.menu}
      </button>

      <div class="topbar-heading">
        <h1>${esc(pageTitle)}</h1>
        <p>${SCHOOL_SHORT_NAME} Administration</p>
      </div>

      <button
        type="button"
        class="logout-button"
        data-logout
      >
        <span aria-hidden="true">${ICONS.logout}</span>
        <span>Sign Out</span>
      </button>
    </header>
  `;
}

// ============================================
// INITIALIZE LAYOUT
// ============================================

export function initLayout(
  requiredRole = "super_admin",
  currentPage = "dashboard.html",
  pageTitle = "Dashboard"
) {
  // Support both existing root containers.
  const app =
    document.getElementById("app") ||
    document.getElementById("portalLayout");

  if (!app) {
    console.error(
      "GRACAIS layout error: #app or #portalLayout was not found."
    );
    return;
  }

  const safeTitle = esc(pageTitle);

  app.innerHTML = `
    <div class="portal-shell">
      ${buildNavigation(currentPage)}

      <div
        class="sidebar-overlay"
        id="sidebarOverlay"
      ></div>

      <main class="main-area">
        ${buildHeader(safeTitle)}

        <section
          id="pageContent"
          class="page-content"
        >
          <div class="card">
            <p>Loading ${safeTitle}...</p>
          </div>
        </section>
      </main>
    </div>
  `;

  setupLayoutEvents();
}

// ============================================
// LAYOUT EVENTS
// ============================================

function setupLayoutEvents() {
  const sidebar =
    document.getElementById("sidebar");

  const toggle =
    document.getElementById("menuToggle");

  const close =
    document.getElementById("sidebarClose");

  const overlay =
    document.getElementById("sidebarOverlay");

  function closeSidebar() {
    if (!sidebar) return;

    sidebar.classList.remove("open");

    if (overlay) {
      overlay.classList.remove("visible");
    }

    if (toggle) {
      toggle.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  }

  function openSidebar() {
    if (!sidebar) return;

    sidebar.classList.add("open");

    if (overlay) {
      overlay.classList.add("visible");
    }

    if (toggle) {
      toggle.setAttribute(
        "aria-expanded",
        "true"
      );
    }
  }

  if (toggle) {
    toggle.addEventListener(
      "click",
      openSidebar
    );
  }

  if (close) {
    close.addEventListener(
      "click",
      closeSidebar
    );
  }

  if (overlay) {
    overlay.addEventListener(
      "click",
      closeSidebar
    );
  }

  if (sidebar) {
    sidebar.querySelectorAll("a").forEach(link => {
      link.addEventListener(
        "click",
        closeSidebar
      );
    });
  }

  document.addEventListener(
    "keydown",
    event => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    }
  );
}

// ============================================
// EMPTY STATE
// ============================================

export function emptyState(
  title = "No records found",
  description = "There are no records to display yet."
) {
  return `
    <div class="card empty-state">
      <div class="empty-state-icon" aria-hidden="true">
        ▤
      </div>

      <h2>${esc(title)}</h2>
      <p>${esc(description)}</p>
    </div>
  `;
}

// ============================================
// SHARED EXPORTS
// ============================================

export {
  requireUser,
  logout,
  esc
};