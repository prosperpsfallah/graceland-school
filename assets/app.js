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
      "The portal database connection is not configured."
    );

    return null;
  }

  try {
    const {
      data: authData,
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      window.location.replace("../index.html");
      return null;
    }

    const {
      data: profile,
      error: profileError
    } = await supabase
      .from("user_profiles")
      .select("id, school_id, first_name, last_name, role, status")
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

    if (
      profile.status &&
      profile.status !== "active"
    ) {
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
      profile
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
  const app = document.getElementById("app");

  if (!app) {
    console.error(message);
    return;
  }

  app.innerHTML = `
    <main style="
      max-width: 600px;
      margin: 60px auto;
      padding: 24px;
      font-family: Arial, sans-serif;
      text-align: center;
    ">
      <h1 style="color: #063B7A;">
        GRACAIS
      </h1>

      <p style="margin-top: 16px;">
        ${esc(message)}
      </p>

      <p style="margin-top: 12px; color: #64748B;">
        Graceland Academy International School of Excellence
      </p>
    </main>
  `;
}

// ============================================
// LOGOUT
// ============================================

export async function logout() {
  if (!supabaseReady || !supabase) {
    console.error(
      "Cannot log out: Supabase is not configured."
    );

    return false;
  }

  const {
    error
  } = await supabase.auth.signOut();

  if (error) {
    console.error(
      "GRACAIS logout failed:",
      error.message
    );

    return false;
  }

  window.location.replace("../index.html");

  return true;
}

// ============================================
// SET UP LOGOUT BUTTONS
// ============================================

export function setupLogout() {
  const buttons = document.querySelectorAll(
    "[data-logout], #logoutButton, .logout-button"
  );

  buttons.forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();

      button.disabled = true;

      try {
        await logout();
      } finally {
        button.disabled = false;
      }
    });
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

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");

    toggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });
}