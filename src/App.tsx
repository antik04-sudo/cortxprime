import { HashRouter, Routes, Route } from "react-router-dom";
import { ActiveProfileProvider } from "./state/ActiveProfileContext";
import { ParentAuthProvider } from "./state/ParentAuthContext";
import { KidSessionProvider } from "./state/KidSessionContext";
import RoleChooser from "./components/layout/RoleChooser";
import { RequireParent, RequireKid, RequireAdmin } from "./components/layout/RouteGuards";
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
import AdminFamilies from "./components/admin/AdminFamilies";

export default function App() {
  return (
    <ParentAuthProvider>
      <KidSessionProvider>
        <ActiveProfileProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<RoleChooser />} />

              {/* Phase 1 screens — still local-IndexedDB-backed (ActiveProfileContext).
                  No longer linked from the root entry point; reachable only once a kid
                  session's Home screen (task #22) routes into them post-rewire. */}
              <Route path="/onboarding" element={<OnboardingFlow />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/journal/standard" element={<StandardJournalFlow />} />
              <Route path="/journal/post-loss" element={<PostLossFlow />} />
              <Route path="/journal/mistake-of-week" element={<MistakeOfWeekFlow />} />
              <Route path="/self-talk" element={<SelfTalkScripts />} />
              <Route path="/progress" element={<ProgressScreen />} />

              {/* Parent auth */}
              <Route path="/parent/signup" element={<ParentSignup />} />
              <Route path="/parent/login" element={<ParentLogin />} />
              <Route
                path="/parent/dashboard"
                element={
                  <RequireParent>
                    <ParentDashboard />
                  </RequireParent>
                }
              />

              {/* Kid PIN auth. /kid/home is a temporary placeholder until task #22
                  rewires the real journal flows to the Supabase-backed kid session. */}
              <Route path="/kid/login" element={<KidLoginFlow />} />
              <Route
                path="/kid/home"
                element={
                  <RequireKid>
                    <KidLoggedInPlaceholder />
                  </RequireKid>
                }
              />

              {/* Admin */}
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminFamilies />
                  </RequireAdmin>
                }
              />
            </Routes>
          </HashRouter>
        </ActiveProfileProvider>
      </KidSessionProvider>
    </ParentAuthProvider>
  );
}
