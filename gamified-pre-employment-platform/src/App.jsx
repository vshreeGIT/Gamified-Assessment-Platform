import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import RecruiterAssessment from "./pages/candidate/RecruiterAssessment";
import Challenges from "./pages/candidate/Challenges";
import Badges from "./pages/candidate/Badges";
import Leaderboard from "./pages/candidate/Leaderboard";
import JobMatches from "./pages/candidate/JobMatches";
import CandidateProfile from "./pages/candidate/CandidateProfile";

import CodingHome from "./pages/candidate/coding/CodingHome";
import CodingConcept from "./pages/candidate/coding/CodingConcept";
import CodingDifficulty from "./pages/candidate/coding/CodingDifficulty";
import CodingQuestion from "./pages/candidate/coding/CodingQuestion";

import CommunicationHome from "./pages/candidate/communication/CommunicationHome";
import DataDetective from "./pages/candidate/DataDetective";
import TeamworkMission from "./pages/candidate/TeamworkMission";
import InterviewBattle from "./pages/candidate/InterviewBattle";

import ReasoningHome from "./pages/candidate/reasoning/ReasoningHome";
import ReasoningDifficulty from "./pages/candidate/reasoning/ReasoningDifficulty";
import ReasoningQuestion from "./pages/candidate/reasoning/ReasoningQuestion";
import ReasoningResult from "./pages/candidate/reasoning/ReasoningResult";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterAssessments from "./pages/recruiter/RecruiterAssessments";
import RecruiterAssessmentForm from "./pages/recruiter/RecruiterAssessmentForm";
import RecruiterAssessmentDetail from "./pages/recruiter/RecruiterAssessmentDetail";
import RecruiterCandidates from "./pages/recruiter/RecruiterCandidates";
import RecruiterCandidateDetail from "./pages/recruiter/RecruiterCandidateDetail";
import RecruiterResults from "./pages/recruiter/RecruiterResults";
import RecruiterAnalytics from "./pages/recruiter/RecruiterAnalytics";
import RecruiterSettings from "./pages/recruiter/RecruiterSettings";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { getCurrentUser, isAuthenticated } from "./services/authService";

function RequireAdmin() {
  const user = getCurrentUser();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if ((user?.role || "").toLowerCase() !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function RequireRecruiter() {
  const user = getCurrentUser();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if ((user?.role || "").toLowerCase() !== "recruiter") {
    return <Navigate to="/candidate-dashboard" replace />;
  }

  return <Outlet />;
}

function RequireCandidate() {
  const user = getCurrentUser();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if ((user?.role || "").toLowerCase() !== "candidate") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recruiter-dashboard" element={<Navigate to="/recruiter/dashboard" replace />} />

        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
        <Route path="/assessment/:assessmentId" element={<RequireCandidate />}>
          <Route index element={<RecruiterAssessment />} />
        </Route>
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/job-matches" element={<JobMatches />} />
        <Route path="/candidate-profile" element={<CandidateProfile />} />

        <Route path="/coding" element={<CodingHome />} />
        <Route path="/coding/:language" element={<CodingConcept />} />
        <Route
          path="/coding/:language/:concept"
          element={<CodingDifficulty />}
        />
        <Route
          path="/coding/:language/:concept/:difficulty"
          element={<CodingQuestion />}
        />

        <Route path="/aptitude" element={<Navigate to="/reasoning" replace />} />
        <Route path="/communication/:subdivisionId" element={<CommunicationHome />} />
        <Route path="/communication" element={<CommunicationHome />} />
        <Route path="/data-detective" element={<DataDetective />} />
        <Route path="/data-detective/:investigationId" element={<DataDetective />} />
        <Route path="/teamwork" element={<TeamworkMission />} />
        <Route path="/interview-battle" element={<InterviewBattle />} />

        {/* Reasoning */}
        <Route path="/reasoning" element={<ReasoningHome />} />
        <Route
          path="/reasoning/difficulty"
          element={<ReasoningDifficulty />}
        />
        <Route
          path="/reasoning/difficulty/:difficulty"
          element={<ReasoningDifficulty />}
        />
        <Route
          path="/reasoning/question"
          element={<ReasoningQuestion />}
        />
        <Route
          path="/reasoning/question/:difficulty"
          element={<ReasoningQuestion />}
        />
        <Route
          path="/reasoning/result"
          element={<ReasoningResult />}
        />

        <Route path="/admin" element={<RequireAdmin />}>
          <Route index element={<AdminDashboard />} />
        </Route>

        <Route path="/recruiter" element={<RequireRecruiter />}>
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="jobs" element={<RecruiterJobs />} />
          <Route path="assessments" element={<RecruiterAssessments />} />
          <Route path="assessments/create" element={<RecruiterAssessmentForm />} />
          <Route path="assessments/:assessmentId/edit" element={<RecruiterAssessmentForm />} />
          <Route path="assessments/:assessmentId" element={<RecruiterAssessmentDetail />} />
          <Route path="create-assessment" element={<Navigate to="/recruiter/assessments/create" replace />} />
          <Route path="candidates" element={<RecruiterCandidates />} />
          <Route path="candidates/:candidateId" element={<RecruiterCandidateDetail />} />
          <Route path="results" element={<RecruiterResults />} />
          <Route path="analytics" element={<RecruiterAnalytics />} />
          <Route path="settings" element={<RecruiterSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
