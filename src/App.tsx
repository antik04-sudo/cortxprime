import { HashRouter, Routes, Route } from "react-router-dom";
import { ActiveProfileProvider } from "./state/ActiveProfileContext";
import { ParentAuthProvider } from "./state/ParentAuthContext";
import { KidSessionProvider } from "./state/KidSessionContext";
import ProfileGate from "./components/layout/ProfileGate";
import OnboardingFlow from "./components/onboarding/OnboardingFlow";
import HomeScreen from "./components/home/HomeScreen";
import StandardJournalFlow from "./components/journal/StandardJournalFlow";
import PostLossFlow from "./components/journal/PostLossFlow";
import MistakeOfWeekFlow from "./components/journal/MistakeOfWeekFlow";
import SelfTalkScripts from "./components/selftalk/SelfTalkScripts";
import ProgressScreen from "./components/progress/ProgressScreen";
import ParentSignup from "./components/parent/ParentSignup";
import ParentLogin from "./components/parent/ParentLogin";
import ParentDashboard from "./components/parent/ParentDashboard";
import KidLoginFlow from "./components/kid-auth/KidLoginFlow";
import KidLoggedInPlaceholder from "./components/kid-auth/KidLoggedInPlaceholder";

export default function App() {
  return (
    <ParentAuthProvider>
      <KidSessionProvider>
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

              {/* Parent auth — new for Phase 2, additive only, doesn't touch the routes above */}
              <Route path="/parent/signup" element={<ParentSignup />} />
              <Route path="/parent/login" element={<ParentLogin />} />
              <Route path="/parent/dashboard" element={<ParentDashboard />} />

              {/* Kid PIN auth — new for Phase 2. /kid/home is a temporary placeholder,
                  replaced once the real journal flows are wired to Supabase (task #22) */}
              <Route path="/kid/login" element={<KidLoginFlow />} />
              <Route path="/kid/home" element={<KidLoggedInPlaceholder />} />
            </Routes>
          </HashRouter>
        </ActiveProfileProvider>
      </KidSessionProvider>
    </ParentAuthProvider>
  );
}
