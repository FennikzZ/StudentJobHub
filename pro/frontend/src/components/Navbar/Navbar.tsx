import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  InboxOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
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
    {
      key: "home",
      label: "หน้าแรก",
      icon: <HomeOutlined style={{ fontSize: 24 }} />,
      to: "/",
    },
    {
      key: "notifications",
      label: "กระดานข่าว",
      icon: <BellOutlined style={{ fontSize: 24 }} />,
      to: "/dashboard",
    },
    {
      key: "dashboard",
      label: "งานทั้งหมด",
      icon: <InboxOutlined style={{ fontSize: 24 }} />,
      to: "/work/view",
    },
    {
      key: "admin",
      label: "แอดมิน",
      icon: <InboxOutlined style={{ fontSize: 24 }} />,
      to: "/work",
    },
    {
      key: "account",
      label: "โปรไฟล์",
      icon: <UserOutlined style={{ fontSize: 24 }} />,
      to: "/account",
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        backgroundColor: "#F9F7F7",
        height: 100,
      }}
    >
      <div>
        <img src={logo} alt="Logo" style={{ height: 60 }} />
      </div>

      <div style={{ display: "flex", gap: 32 }}>
        {navItems.map((item) => (
          <Link
            key={item.key}
            to={item.to}
            onClick={() => handleMenuClick(item.key)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: currentPage === item.key ? "#3F72AF" : "#112D4E",
              fontWeight: currentPage === item.key ? "bold" : "normal",
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </Header>
  );
};

export default Navbar;
