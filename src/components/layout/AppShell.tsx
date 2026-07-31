import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, MessageSquare, BarChart3, LogOut, Zap } from "lucide-react";
import { useKidSession } from "../../state/KidSessionContext";
import styles from "./AppShell.module.css";

const navItems = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/self-talk", label: "Self-Talk", icon: MessageSquare },
  { to: "/progress", label: "Progress", icon: BarChart3 },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { kid, logout } = useKidSession();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className={styles.shell}>
      <div className={styles.rail}>
        <Zap size={20} className={styles.railBrand} />
        <nav className={styles.railNav}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={styles.railItem} aria-label={label}>
              {({ isActive }) => (
                <span className={styles.railItemInner}>
                  {isActive && <span className={styles.railActiveBar} />}
                  <Icon size={18} color={isActive ? "var(--accent)" : "var(--text-secondary)"} />
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <button type="button" className={styles.railLogout} onClick={handleLogout} aria-label="Log out">
          <LogOut size={18} />
        </button>
      </div>

      <div className={styles.main}>
        <header className={styles.header}>
          <div>
            <div className={styles.wordmark}>
              <Zap size={15} className={styles.wordmarkIcon} />
              CORTX<span className={styles.wordmarkAccent}>PRIME</span>
            </div>
            <div className={styles.tagline}>{kid?.sport ? kid.sport.toUpperCase() : "MINDSET OS"}</div>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.username}>{kid?.username}</span>
            <button type="button" className={styles.headerLogout} onClick={handleLogout} aria-label="Log out">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <main className={styles.content}>{children}</main>

        <nav className={styles.bottomNav}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={styles.navItem}>
              {({ isActive }) => (
                <>
                  <Icon
                    size={19}
                    color={isActive ? "var(--accent)" : "var(--text-secondary)"}
                    style={isActive ? { filter: "drop-shadow(0 0 4px var(--accent))" } : undefined}
                  />
                  <span className={isActive ? `${styles.navLabel} ${styles.navLabelActive}` : styles.navLabel}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
