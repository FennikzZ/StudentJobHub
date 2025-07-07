import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

const { Sider } = Layout;

type CustomMenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
};

const items: CustomMenuItem[] = [
  { key: "/work", label: "งานทั้งหมด", icon: <DashboardOutlined />, className: "menu-work" },
  { key: "/dashboard", label: "แดชบอร์ด", icon: <UserOutlined />, className: "menu-dashboard" },
  { key: "/", label: "ออกจากระบบ", icon: <UserOutlined />, className: "menu-logout" },
];

const AdminSidebar: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  return (
    <div className="admin">
      <Sider width={250} className="sider" theme="light">
        <div className="logo">
          <div className="logo-circle">
            <span className="logo-initial">S</span>
          </div>
          <span className="logo-text">Student Job Hub</span>
        </div>

        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          className="menu"
          onClick={handleMenuClick}
        >
          {items.map((item) => (
            <Menu.Item
              key={item.key}
              icon={<span className="icon-style">{item.icon}</span>}
              className={`menu-item ${item.className || ""}`}
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    </div>
  );
};

export default AdminSidebar;