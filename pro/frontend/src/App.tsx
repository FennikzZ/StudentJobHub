import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";

import Home from "./pages/home";
import Work from "./pages/work";
import WorkCreate from "./pages/work/create";
import WorkEdit from "./pages/work/edit";
import Dashboard from "./pages/dashboard";
import Account from "./pages/account";
import AccountrCreate from "./pages/account/create";
import AccountEdit from "./pages/account/edit";

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Content
          style={{
            margin: "0 16px",
            padding: 24,
            minHeight: "calc(100vh - 134px)", // เผื่อ Footer
            background: "#F9F7F7",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/create" element={<WorkCreate />} />
            <Route path="/work/edit/:id" element={<WorkEdit />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/create" element={<AccountrCreate />} />
            <Route path="/account/edit/:id" element={<AccountEdit />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
