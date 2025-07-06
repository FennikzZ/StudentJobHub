import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import logo from "../../assets/logojob.png";

const { Header } = Layout;

const Navbar: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(localStorage.getItem("page") || "home");
  const location = useLocation();
  const iconSize = 30;

  const handleMenuClick = (key: string) => {
    setCurrentPage(key);
    localStorage.setItem("page", key);
  };

  const leftMenuItems: MenuProps["items"] = [
    {
      label: (
        <Link
          to="/"
          onClick={() => handleMenuClick("home")}
          style={{ fontSize: 20, fontWeight: "bold", color: "#112D4E" }}
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
          onClick={() => handleMenuClick("dashboard")}
          style={{ fontSize: 20, fontWeight: "bold", color: "#112D4E" }}
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
          onClick={() => handleMenuClick("work")}
          style={{ fontSize: 20, fontWeight: "bold", color: "#112D4E" }}
        >
          WORK
        </Link>
      ),
      key: "work",
    },
  ];

  const rightMenuItems: MenuProps["items"] = [
    {
      label: (
        <Link
          to="/account"
          onClick={() => handleMenuClick("account")}
          style={{ fontSize: 20, fontWeight: "bold", color: "#112D4E" }}
        >
          <UserOutlined style={{ fontSize: iconSize, color: "#112D4E" }} /> ACCOUNT
        </Link>
      ),
      key: "account",
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        background: "#F9F7F7",
        height: 120,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
        <img src={logo} alt="Logo" style={{ height: 90 }} />
      </div>

      {/* Left Menu */}
      <Menu
        mode="horizontal"
        selectedKeys={[currentPage]}
        items={leftMenuItems}
        style={{ backgroundColor: "#F9F7F7", flex: 1, borderBottom: "none" }}
      />

      {/* Right Menu */}
      <Menu
        mode="horizontal"
        selectedKeys={[currentPage === "account" ? "account" : ""]}
        items={rightMenuItems}
        style={{ backgroundColor: "#F9F7F7", borderBottom: "none" }}
      />
    </Header>
  );
};

export default Navbar;
