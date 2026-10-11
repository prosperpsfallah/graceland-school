// ============================================
// GRACAIS E-PORTAL
// SHARED APPLICATION FUNCTIONS
// ============================================

import {
  supabase,
  supabaseReady
} from "./supabase.js";

// ============================================
// SAFE HTML TEXT
// ============================================

export function esc(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]
  );
}

// ============================================
// FIND LOGIN PAGE RELATIVE TO CURRENT PAGE
// ============================================

function getLoginPath() {
  const segments = window.location.pathname
    .split("/")
    .filter(Boolean);

  // Remove the current filename.
  const directoryDepth = Math.max(
    0,
    segments.length - 1
  );

  return (
    "../".repeat(directoryDepth) +
    "index.html"
  );
}

// ============================================
// REQUIRE AUTHENTICATED USER
// ============================================

export async function requireUser(
  allowedRoles = []
) {
  if (!supabaseReady || !supabase) {
    console.error(
      "GRACAIS Supabase is not configured."
    );

    showAccessMessage(
      "The portal database connection is not configured. Please contact the system administrator."
    );

    return null;
  }

  try {
    const {
      data: authData,
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      window.location.replace(getLoginPath());
      return null;
    }

    // Updated select to pull all relevant profile fields including email and grade_level
    const {
      data: profile,
      error: profileError
    } = await supabase
      .from("user_profiles")
      .select(
        "id, school_id, first_name, last_name, role, status, grade_level, email"
      )
      .eq("id", authData.user.id)
      .maybeSingle();

    if (profileError) {
      console.error(
        "GRACAIS profile lookup failed:",
        profileError.message
      );

      showAccessMessage(
        "Unable to verify your school account. Please contact the administrator."
      );

      return null;
    }

    if (!profile) {
      showAccessMessage(
        "Your account profile was not found. Please contact the administrator."
      );

      return null;
    }

    // Default to 'active' if status is not explicitly set in user_profiles
    const accountStatus = String(profile.status || "active").toLowerCase();

    if (accountStatus !== "active") {
      showAccessMessage(
        "Your account is not active. Please contact the administrator."
      );

      return null;
    }

    if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(profile.role)
    ) {
      showAccessMessage(
        "Access denied. Your account does not have permission to view this page."
      );

      return null;
    }

    return {
      user: authData.user,
      profile: {
        ...profile,
        email: profile.email || authData.user.email
      }
    };
  } catch (error) {
    console.error(
      "GRACAIS authentication error:",
      error
    );

    showAccessMessage(
      "Unable to verify your login. Please try again."
    );

    return null;
  }
}

// ============================================
// ACCESS MESSAGE
// ============================================

function showAccessMessage(message) {
  const app =
    document.getElementById("pageContent") ||
    document.getElementById("app") ||
    document.getElementById("portalLayout");

  const safeMessage = esc(message);

  const content = `
    <main style="
      max-width: 650px;
      margin: 40px auto;
      padding: 24px;
      font-family: Arial, sans-serif;
      text-align: center;
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 4px 18px rgba(6, 59, 122, 0.08);
    ">
      <h1 style="color: #063B7A;">
        GRACAIS
      </h1>

      <p style="
        margin-top: 16px;
        color: #334155;
        line-height: 1.6;
      ">
        ${safeMessage}
      </p>

      <p style="
        margin-top: 12px;
        color: #64748B;
        font-size: 14px;
      ">
        Graceland Academy International School of Excellence
      </p>
    </main>
  `;

  if (app) {
    app.innerHTML = content;
  } else {
    document.body.innerHTML = content;
  }
}

// ============================================
// LOGOUT
// ============================================

export async function logout() {
  if (!supabaseReady || !supabase) {
    console.error(
      "Cannot complete logout: Supabase is not configured."
    );

    showAccessMessage(
      "Logout could not be completed because the authentication connection is unavailable. Please try again."
    );

    return false;
  }

  try {
    const {
      error
    } = await supabase.auth.signOut();

    if (error) {
      console.error(
        "GRACAIS logout failed:",
        error.message
      );

      showAccessMessage(
        "Logout failed. Please try again."
      );

      return false;
    }

    window.location.replace(getLoginPath());

    return true;
  } catch (error) {
    console.error(
      "GRACAIS logout error:",
      error
    );

    showAccessMessage(
      "An error occurred while logging out. Please try again."
    );

    return false;
  }
}

// ============================================
// SET UP LOGOUT BUTTONS
// ============================================

export function setupLogout() {
  const buttons = document.querySelectorAll(
    "[data-logout], #logoutButton, .logout-button"
  );

  buttons.forEach(button => {
    if (button.dataset.logoutInitialized === "true") {
      return;
    }

    button.dataset.logoutInitialized = "true";

    button.addEventListener(
      "click",
      async event => {
        event.preventDefault();

        button.disabled = true;

        try {
          await logout();
        } finally {
          button.disabled = false;
        }
      }
    );
  });
}

// ============================================
// SET UP MOBILE MENU
// ============================================

export function setupMenu() {
  const toggle = document.querySelector(
    "#menuToggle, [data-menu-toggle]"
  );

  const menu = document.querySelector(
    "#sidebar, [data-sidebar]"
  );

  if (!toggle || !menu) {
    return;
  }

  if (toggle.dataset.menuInitialized === "true") {
    return;
  }

  toggle.dataset.menuInitialized = "true";

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");

    toggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });
}
