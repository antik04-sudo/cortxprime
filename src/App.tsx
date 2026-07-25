import { HashRouter, Routes, Route } from "react-router-dom";
import { ActiveProfileProvider } from "./state/ActiveProfileContext";
import ProfileGate from "./components/layout/ProfileGate";
import OnboardingFlow from "./components/onboarding/OnboardingFlow";
import HomeScreen from "./components/home/HomeScreen";
import StandardJournalFlow from "./components/journal/StandardJournalFlow";
import PostLossFlow from "./components/journal/PostLossFlow";
import MistakeOfWeekFlow from "./components/journal/MistakeOfWeekFlow";
import SelfTalkScripts from "./components/selftalk/SelfTalkScripts";
import ProgressScreen from "./components/progress/ProgressScreen";

export default function App() {
  return (
    <ActiveProfileProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<ProfileGate />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/journal/standard" element={<StandardJournalFlow />} />
          <Route path="/journal/post-loss" element={<PostLossFlow />} />
          <Route path="/journal/mistake-of-week" element={<MistakeOfWeekFlow />} />
          <Route path="/self-talk" element={<SelfTalkScripts />} />
          <Route path="/progress" element={<ProgressScreen />} />
        </Routes>
      </HashRouter>
    </ActiveProfileProvider>
  );
}
