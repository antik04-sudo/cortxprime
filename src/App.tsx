import { HashRouter, Routes, Route } from "react-router-dom";
import { ParentAuthProvider } from "./state/ParentAuthContext";
import { KidSessionProvider } from "./state/KidSessionContext";
import RoleChooser from "./components/layout/RoleChooser";
import { RequireParent, RequireKid, RequireKidReady, RequireAdmin } from "./components/layout/RouteGuards";
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
import AdminFamilies from "./components/admin/AdminFamilies";
import MigrationPrompt from "./components/migration/MigrationPrompt";

export default function App() {
  return (
    <ParentAuthProvider>
      <KidSessionProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<RoleChooser />} />

            {/* First-time kid setup (feeling word + process goal) — needs a kid
                session but not completed setup, so it uses the more lenient guard */}
            <Route
              path="/onboarding"
              element={
                <RequireKid>
                  <OnboardingFlow />
                </RequireKid>
              }
            />

            {/* Kid-facing journal screens — Supabase-backed via KidSessionContext */}
            <Route
              path="/home"
              element={
                <RequireKidReady>
                  <HomeScreen />
                </RequireKidReady>
              }
            />
            <Route
              path="/journal/standard"
              element={
                <RequireKidReady>
                  <StandardJournalFlow />
                </RequireKidReady>
              }
            />
            <Route
              path="/journal/post-loss"
              element={
                <RequireKidReady>
                  <PostLossFlow />
                </RequireKidReady>
              }
            />
            <Route
              path="/journal/mistake-of-week"
              element={
                <RequireKidReady>
                  <MistakeOfWeekFlow />
                </RequireKidReady>
              }
            />
            <Route
              path="/self-talk"
              element={
                <RequireKidReady>
                  <SelfTalkScripts />
                </RequireKidReady>
              }
            />
            <Route
              path="/progress"
              element={
                <RequireKidReady>
                  <ProgressScreen />
                </RequireKidReady>
              }
            />

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

            {/* Kid PIN auth */}
            <Route path="/kid/login" element={<KidLoginFlow />} />
            <Route
              path="/migrate-local-data"
              element={
                <RequireKid>
                  <MigrationPrompt />
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
      </KidSessionProvider>
    </ParentAuthProvider>
  );
}
