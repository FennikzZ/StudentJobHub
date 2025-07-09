import { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Typography,
  message,
  Pagination,
  Row,
  Col,
} from "antd";
import { GetDashboard } from "../../../services/https";
import { DashboardInterface } from "../../../interfaces/IDashboard";
import Navbar from "../../../components/Navbar/Navbar";
import bannerImage from "../../../assets/bannerblue.png";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const DashboardView = () => {
  const [dashboards, setDashboards] = useState<DashboardInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [messageApi, contextHolder] = message.useMessage();

  const fetchDashboard = async () => {
    const res = await GetDashboard();
    if (res) {
      setDashboards(res);
    } else {
      messageApi.error("ไม่สามารถโหลดข้อมูลได้");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const paginated = dashboards.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <Navbar />
      <Layout style={{ backgroundColor: "#F9F7F7", minHeight: "100vh" }}>
        <Content style={{ padding: 24 }}>
          {contextHolder}

          {/* ✅ Banner */}
          <div
            style={{
              position: "relative",
              marginBottom: 32,
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={bannerImage}
              alt="Banner"
              style={{ width: "100%", maxHeight: 160, objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#fff",
                background: "rgba(0, 0, 0, 0.3)",
                padding: "12px 32px",
                borderRadius: 10,
              }}
            >
              <Title level={2} style={{ color: "#fff", margin: 0 }}>
                📢 ข่าวประชาสัมพันธ์
              </Title>
            </div>
          </div>

          {/* ✅ Cards 2 per row */}
          <Row gutter={[32, 32]} justify="center">
            {paginated.map((item) => (
              <Col xs={24} md={10} key={item.ID}>
                <Card
                  hoverable
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    padding: 24,
                    borderRadius: 16,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                    background: "#ffffff",
                    height: "100%",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  bodyStyle={{ display: "flex", gap: 24, padding: 0 }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(63, 114, 175, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
                  }}
                >
                  <img
                    alt={item.subject}
                    src={item.image || ""}
                    style={{
                      width: 140,
                      height: 140,
                      objectFit: "cover",
                      borderRadius: 12,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <Title level={4} style={{ color: "#051a49", marginBottom: 12 }}>
                      {item.subject}
                    </Title>
                    <Paragraph style={{ fontSize: 15, color: "#112D4E", lineHeight: 1.7 }}>
                      {item.information}
                    </Paragraph>
                    <div style={{ marginTop: "auto", textAlign: "right", fontSize: 14, color: "#888" }}>
                      📅 วันที่เผยแพร่:{" "}
                      {item.dashboardtime
                        ? new Date(item.dashboardtime).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                        : "-"}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* ✅ Pagination */}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={dashboards.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              style={{ color: "#3F72AF" }}
            />
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default DashboardView;