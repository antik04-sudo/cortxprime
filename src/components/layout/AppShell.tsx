import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useActiveProfile } from "../../state/ActiveProfileContext";
import styles from "./AppShell.module.css";

const navItems = [
  {
    to: "/home",
    label: "Home",
    icon: (
      <path d="M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
    ),
  },
  {
    to: "/self-talk",
    label: "Self-Talk",
    icon: <path d="M4 5h16v11H9l-5 4V5Z" />,
  },
  {
    to: "/progress",
    label: "Progress",
    icon: <path d="M4 19V10M11 19V5M18 19v-7" />,
  },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { activeProfile, clearActiveProfile } = useActiveProfile();
  const navigate = useNavigate();

  function handleSwitchProfile() {
    clearActiveProfile();
    navigate("/");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: "100dvh" }}>
      <header className={styles.header}>
        <div className={styles.logoBadge}>
          <img src="/logo-lockup-400.png" alt="CortXPrime" className={styles.logoImg} />
        </div>
        <div className={styles.profileArea}>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
            {activeProfile?.name}
          </span>
          <button
            type="button"
            className={styles.profileButton}
            onClick={handleSwitchProfile}
          >
            Switch profile
          </button>
        </div>
      </header>
      <main className={styles.content}>{children}</main>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            <svg
              className={styles.navIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {item.icon}
            </svg>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
