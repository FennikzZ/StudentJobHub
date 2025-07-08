import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "antd";
import logo from "../../assets/logojob.png";

const { Header } = Layout;

const Navbar: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(localStorage.getItem("page") || "home");

  const handleMenuClick = (key: string) => {
    setCurrentPage(key);
    localStorage.setItem("page", key);
  };

  const navItems = [
    { key: "home", label: "หน้าหลัก", to: "/" },
    { key: "dashboard", label: "กระดานข่าว", to: "/dashboard/view" },
    { key: "work", label: "งานทั้งหมด", to: "/work/view" },
    { key: "admin", label: "แอดมิน", to: "/work" },
    { key: "account", label: "โปรไฟล์", to: "/account" },
  ];

  return (
    <Header
      style={{
        backgroundColor: "#F9F7F7",
        height: 20,
        padding: 0,
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          maxWidth: "60%",
          margin: "0 auto",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", // กึ่งกลางแนวตั้ง
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="Logo" style={{ height: 40 }} />
        </div>

        {/* Menu */}
        <div style={{ display: "flex", gap: 40 }}>
          {navItems.map((item) => {
            const isActive = currentPage === item.key;
            return (
              <Link
                key={item.key}
                to={item.to}
                onClick={() => handleMenuClick(item.key)}
                style={{
                  color: isActive ? "#3F72AF" : "#112D4E",
                  fontWeight: isActive ? "bold" : "normal",
                  fontSize: 17,
                  textDecoration: "none",
                  padding: "12px 0",
                  borderBottom: isActive ? "2px solid #3F72AF" : "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderBottom = "2px solid #3F72AF";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderBottom = "none";
                  }
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
