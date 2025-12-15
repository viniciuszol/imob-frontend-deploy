// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import Login from "../pages/Login";
import Empresas from "../pages/Empresas";
import EmpresaDetalhes from "../pages/EmpresaDetalhes";
import Ativos from "../pages/Ativos";
import ImportarEmpresa from "../pages/ImportarEmpresa";
import Movimentacoes from "../pages/Movimentacoes";
import { registerRequest } from "../api/auth";

// 🔹 Subpáginas dentro de /pages/investimentos/
import OverviewPage from "../pages/investimentos/OverviewPage";
import ComparativoPage from "../pages/investimentos/ComparativoPage";
import EvolucaoCDIPage from "../pages/investimentos/EvolucaoCDIPage";
import InvestimentosAtivoPage from "../pages/investimentos/InvestimentosAtivoPage";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route 
          path="/register" 
          element={
            <Register 
          />} 
        />

        <Route
          path="/empresas"
          element={
            <PrivateRoute>
              <Empresas />
            </PrivateRoute>
          }
        />

        <Route
          path="/empresa/:id"
          element={
            <PrivateRoute>
              <EmpresaDetalhes />
            </PrivateRoute>
          }
        />

        <Route
          path="/ativos"
          element={
            <PrivateRoute>
              <Ativos />
            </PrivateRoute>
          }
        />

        <Route
          path="/empresas/importar"
          element={<ImportarEmpresa isModal />}
        />

        <Route
          path="/movimentacoes"
          element={
            <PrivateRoute>
              <Movimentacoes />
            </PrivateRoute>
          }
        />

        <Route
          path="/investimentos"
          element={
            <PrivateRoute>
              <OverviewPage />
            </PrivateRoute>
          }
        />

        {/* 🔹 Comparativo Ativo x CDI */}
        <Route
          path="/investimentos/comparativo"
          element={
            <PrivateRoute>
              <ComparativoPage />
            </PrivateRoute>
          }
        />

        {/* 🔹 Evolução do CDI */}
        <Route
          path="/investimentos/cdi"
          element={
            <PrivateRoute>
              <EvolucaoCDIPage />
            </PrivateRoute>
          }
        />
        {/* 🔹 Comparativo Ativo x CDI */}
        <Route
          path="/investimentos/ativos"
          element={
            <PrivateRoute>
              <InvestimentosAtivoPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
