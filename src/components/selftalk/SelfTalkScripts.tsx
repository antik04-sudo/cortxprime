import { useMemo, useState } from "react";
import AppShell from "../layout/AppShell";
import { useActiveProfile } from "../../state/ActiveProfileContext";
import { useFavorites } from "../../hooks/useFavorites";
import { selfTalkScripts } from "../../content/selfTalkScripts";
import TriggerFilterTabs, { type TriggerFilter } from "./TriggerFilterTabs";
import ScriptCard from "./ScriptCard";

export default function SelfTalkScripts() {
  const { activeProfile } = useActiveProfile();
  const { favoriteIds, toggle } = useFavorites(activeProfile?.id);
  const [filter, setFilter] = useState<TriggerFilter>("all");

  const visibleScripts = useMemo(
    () => (filter === "all" ? selfTalkScripts : selfTalkScripts.filter((s) => s.trigger === filter)),
    [filter]
  );

  return (
    <AppShell>
      <div className="stack">
        <h1 style={{ fontSize: "var(--text-xl)" }}>Self-talk scripts</h1>
        <TriggerFilterTabs value={filter} onChange={setFilter} />
        <div className="stack">
          {visibleScripts.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              isFavorited={favoriteIds.has(script.id)}
              onToggleFavorite={() => toggle(script.id)}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
