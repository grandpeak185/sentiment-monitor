import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import History from "@/pages/History";
import ReportDetail from "@/pages/ReportDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:date" element={<ReportDetail />} />
      </Routes>
    </Router>
  );
}
