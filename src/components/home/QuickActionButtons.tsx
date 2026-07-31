import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

const actions = [
  { to: "/journal/standard", label: "Log post-game journal", variant: "primary" as const },
  { to: "/journal/post-loss", label: "Log a tough loss", variant: "secondary" as const },
  { to: "/journal/mistake-of-week", label: "Log mistake of the week", variant: "secondary" as const },
];

export default function QuickActionButtons() {
  const navigate = useNavigate();

  return (
    <div className="stack">
      {actions.map((action) => (
        <Button key={action.to} variant={action.variant} block onClick={() => navigate(action.to)}>
          {action.label}
        </Button>
      ))}
    </div>
  );
}
