import {
    Route,
    Routes,
  } from "react-router-dom";
  
  import ProtectedRoute from "../components/auth/ProtectedRoute";
  
  import AuthLayout from "../layouts/AuthLayout";
  import DashboardLayout from "../layouts/DashboardLayout";
  
  import AnalyticsPage from "../pages/AnalyticsPage";
  import ApiKeysPage from "../pages/ApiKeysPage";
  import LoginPage from "../pages/LoginPage";
  import NotFoundPage from "../pages/NotFoundPage";
  import OverviewPage from "../pages/OverviewPage";
  import PlaygroundPage from "../pages/PlaygroundPage";
  import ProjectDetailsPage from "../pages/ProjectDetailsPage";
  import ProjectsPage from "../pages/ProjectsPage";
  import RateLimitsPage from "../pages/RateLimitsPage";
  import RegisterPage from "../pages/RegisterPage";
  import RequestDetailsPage from "../pages/RequestDetailsPage";
  import RequestLogsPage from "../pages/RequestLogsPage";
  import SecurityRulesPage from "../pages/SecurityRulesPage";
  import SettingsPage from "../pages/SettingsPage";
  
  export default function AppRoutes() {
    return (
      <Routes>
        {/* Public auth routes */}
        <Route
          element={
            <AuthLayout />
          }
        >
          <Route
            path="/login"
            element={
              <LoginPage />
            }
          />
  
          <Route
            path="/register"
            element={
              <RegisterPage />
            }
          />
        </Route>
  
        {/* Protected dashboard */}
        <Route
          element={
            <ProtectedRoute />
          }
        >
          <Route
            element={
              <DashboardLayout />
            }
          >
            <Route
              index
              element={
                <OverviewPage />
              }
            />
  
            <Route
              path="/projects"
              element={
                <ProjectsPage />
              }
            />
  
            <Route
              path="/projects/:projectId"
              element={
                <ProjectDetailsPage />
              }
            />
  
            <Route
              path="/playground"
              element={
                <PlaygroundPage />
              }
            />
  
            <Route
              path="/api-keys"
              element={
                <ApiKeysPage />
              }
            />
  
            <Route
              path="/logs"
              element={
                <RequestLogsPage />
              }
            />
  
            <Route
              path="/logs/:requestId"
              element={
                <RequestDetailsPage />
              }
            />
  
            <Route
              path="/analytics"
              element={
                <AnalyticsPage />
              }
            />
  
            <Route
              path="/security"
              element={
                <SecurityRulesPage />
              }
            />
  
            <Route
              path="/rate-limits"
              element={
                <RateLimitsPage />
              }
            />
  
            <Route
              path="/settings"
              element={
                <SettingsPage />
              }
            />
          </Route>
        </Route>
  
        <Route
          path="*"
          element={
            <NotFoundPage />
          }
        />
      </Routes>
    );
  }