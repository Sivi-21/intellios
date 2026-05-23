/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { AIChat } from "./pages/AIChat";
import { Notes } from "./pages/Notes";
import { Tasks } from "./pages/Tasks";
import { Settings } from "./pages/Settings";
export default function App() {
  return <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="chat" element={<AIChat />} />
            <Route path="notes" element={<Notes />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="settings" element={<Settings />} />
            {
    /* Catch-all route to fallback to dashboard */
  }
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>;
}
