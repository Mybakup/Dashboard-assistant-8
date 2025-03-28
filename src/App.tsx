import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { NewRequest } from './pages/NewRequest';
import { RequestDetails } from './pages/RequestDetails';
import { ActiveAgentsPage } from './pages/ActiveAgentsPage';
import { PractitionerSearch } from './pages/PractitionerSearch';
import { AdminDashboard } from './pages/AdminDashboard';
import { MapUsageDetails } from './pages/MapUsageDetails';
import { AppointmentsDetails } from './pages/AppointmentsDetails';
import { PaymentDetails } from './pages/PaymentDetails';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/new-request" element={
            <PrivateRoute>
              <NewRequest />
            </PrivateRoute>
          } />
          <Route path="/request/:id" element={
            <PrivateRoute>
              <RequestDetails />
            </PrivateRoute>
          } />
          <Route path="/active-agents" element={
            <PrivateRoute>
              <ActiveAgentsPage />
            </PrivateRoute>
          } />
          <Route path="/practitioners" element={
            <PrivateRoute>
              <PractitionerSearch />
            </PrivateRoute>
          } />
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/map-usage" element={
            <PrivateRoute>
              <MapUsageDetails />
            </PrivateRoute>
          } />
          <Route path="/admin/appointments" element={
            <PrivateRoute>
              <AppointmentsDetails />
            </PrivateRoute>
          } />
          <Route path="/admin/payments" element={
            <PrivateRoute>
              <PaymentDetails />
            </PrivateRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;