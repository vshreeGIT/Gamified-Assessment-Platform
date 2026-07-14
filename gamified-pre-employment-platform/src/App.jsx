import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import Challenges from "./pages/candidate/Challenges";
import Badges from "./pages/candidate/Badges";
import Leaderboard from "./pages/candidate/Leaderboard";
import JobMatches from "./pages/candidate/JobMatches";
import CandidateProfile from "./pages/candidate/CandidateProfile";

import CodingHome from "./pages/candidate/coding/CodingHome";
import CodingConcept from "./pages/candidate/coding/CodingConcept";
import CodingDifficulty from "./pages/candidate/coding/CodingDifficulty";
import CodingQuestion from "./pages/candidate/coding/CodingQuestion";

import AptitudeHome from "./pages/candidate/aptitude/AptitudeHome";
import CommunicationHome from "./pages/candidate/communication/CommunicationHome";

import ReasoningHome from "./pages/candidate/reasoning/ReasoningHome";
import ReasoningDifficulty from "./pages/candidate/reasoning/ReasoningDifficulty";
import ReasoningQuestion from "./pages/candidate/reasoning/ReasoningQuestion";
import ReasoningResult from "./pages/candidate/reasoning/ReasoningResult";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
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

        <Route path="/aptitude" element={<AptitudeHome />} />
        <Route path="/communication" element={<CommunicationHome />} />

        {/* Reasoning */}
        <Route path="/reasoning" element={<ReasoningHome />} />
        <Route
          path="/reasoning/difficulty"
          element={<ReasoningDifficulty />}
        />
        <Route
          path="/reasoning/question"
          element={<ReasoningQuestion />}
        />
        <Route
          path="/reasoning/result"
          element={<ReasoningResult />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;