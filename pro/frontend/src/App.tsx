import React from "react";
import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { Breadcrumb, Layout, Menu, theme } from "antd";
import logo from "./assets/logojob.png";

import Home from "./pages/home";
import Work from "./pages/work";
import WorkCreate from "./pages/work/create";
import Dashboard from "./pages/dashboard";
import Account from "./pages/account";
import AccountrCreate from "./pages/account/create";
import AccountEdit from "./pages/account/edit";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const page = localStorage.getItem("page");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const setCurrentPage = (val: string) => {
    localStorage.setItem("page", val);
  };

  const iconSize = 34;

  // เมนูซ้าย (Home, Dashboard, Work)
  const leftMenuItems: MenuProps['items'] = [
    {
      label: (
        <Link
          to="/"
          onClick={() => setCurrentPage("home")}
          style={{ fontSize: 24, fontWeight: "bold", color: "#112D4E" }} // <<< ใส่ color ตรงนี้ไม่มีผล
        >
          HOME
        </Link>

      ),
      key: "home",
    },
    {
      label: (
        <Link
          to="/dashboard"
          onClick={() => setCurrentPage("dashboard")}
          style={{ fontSize: 24, fontWeight: "bold", color: "#112D4E" }}
        >
          DASHBOARD
        </Link>
      ),
      key: "dashboard",
    },
    {
      label: (
        <Link
          to="/work"
          onClick={() => setCurrentPage("work")}
          style={{ fontSize: 24, fontWeight: "bold", color: "#112D4E" }}
        >
          WORK
        </Link>
      ),
      key: "work",
    },
  ];

  // เมนูขวา (Account)
  const rightMenuItems: MenuProps['items'] = [
    {
      label: (
        <Link
          to="/account"
          onClick={() => setCurrentPage("account")}
          style={{ fontSize: 24, fontWeight: "bold", color: "#112D4E" }}
        >
          <UserOutlined style={{ fontSize: iconSize ,color: "#112D4E" }} /> ACCOUNT
        </Link>
      ),
      key: "account",
    },
  ];

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            background: "#F9F7F7",
            height: 128,
          }}
        >
          {/* โลโก้ */}
          <div style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
            <img src={logo} alt="Logo" style={{ height: 100 }} />
          </div>

          {/* เมนูซ้าย: Home, Dashboard, Work */}
          <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={[page ? page : "home"]}
            items={leftMenuItems}
            style={{
              display: "flex",
              gap: 20,
              fontWeight: "bold",
              backgroundColor: "#F9F7F7", // เพิ่มตรงนี้
            }}
          />

          {/* กั้นกลางให้เมนูขวาชิดขวา */}
          <div style={{ flexGrow: 1 }}></div>

          {/* เมนูขวา: Account */}
          <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={[page === "account" ? "account" : ""]}
            items={rightMenuItems}
            style={{
              display: "flex",
              gap: 20,
              fontWeight: "bold",
              backgroundColor: "#F9F7F7", // เพิ่มตรงนี้
            }}
          />
        </Header>

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }} />
          <div
            style={{
              padding: 24,
              minHeight: "calc(100vh - 234px)",
              background: "#F9F7F7",
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/create" element={<WorkCreate />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/account" element={<Account />} />
              <Route path="/account/create" element={<AccountrCreate />} />
              <Route path="/account/edit/:id" element={<AccountEdit />} />
            </Routes>
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>STUDENT JOB HUB</Footer>
      </Layout>
    </Router>
  );
};

export default App;
