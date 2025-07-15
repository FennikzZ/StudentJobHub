import { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Typography,
  message,
  Pagination,
  Row,
  Col,
  Spin, // Added Spin for loading state
  Empty, // Added Empty for no data state
} from "antd";
import { GetDashboard } from "../../../services/https";
import { DashboardInterface } from "../../../interfaces/IDashboard";
import Navbar from "../../../components/Navbar/Navbar";
import bannerImage from "../../../assets/bannerblue.png"; // Ensure this path is correct

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const DashboardView = () => {
  const [dashboards, setDashboards] = useState<DashboardInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true); // New loading state

  const fetchDashboard = async () => {
    setLoading(true); // Start loading
    try {
      const res = await GetDashboard();
      if (res) {
        setDashboards(res);
      } else {
        messageApi.error("ไม่สามารถโหลดข้อมูลได้");
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      messageApi.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const paginated = dashboards.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <Navbar />
      <Layout style={{ backgroundColor: "#F9F7F7", minHeight: "100vh" }}>
        <Content style={{ padding: "24px 50px" }}>
          {contextHolder}

          {/* Banner Section */}
          <div
            style={{
              position: "relative",
              marginBottom: 48,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          >
            <img
              src={bannerImage}
              alt="Banner"
              style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                background: "rgba(17, 45, 78, 0.4)", // Darker overlay for better contrast
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Title level={1} style={{ color: "#fff", margin: 0, fontSize: "3.5em", textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
                📢 ข่าวประชาสัมพันธ์
              </Title>
            </div>
          </div>

          {/* Main Content Area */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
              <Spin size="large" tip="กำลังโหลดข้อมูล..." />
            </div>
          ) : (
            <>
              {paginated.length > 0 ? (
                <Row gutter={[32, 32]} justify="center">
                  {paginated.map((item) => (
                    <Col xs={24} md={12} lg={10} key={item.ID}>
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
                          border: "1px solid #DBE2EF", // Subtle border
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                        }}
                        bodyStyle={{ display: "flex", gap: 24, padding: 0 }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.transform =
                            "translateY(-8px)";
                          (e.currentTarget as HTMLDivElement).style.boxShadow =
                            "0 12px 30px rgba(63, 114, 175, 0.4)"; // Stronger, themed shadow
                          (e.currentTarget as HTMLDivElement).style.borderColor =
                            "#3F72AF"; // Border highlight
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.transform =
                            "translateY(0)";
                          (e.currentTarget as HTMLDivElement).style.boxShadow =
                            "0 4px 16px rgba(0,0,0,0.1)";
                          (e.currentTarget as HTMLDivElement).style.borderColor =
                            "#DBE2EF";
                        }}
                      >
                        <img
                          alt={item.subject}
                          src={item.image || ""}
                          style={{
                            width: 160, // Slightly larger image
                            height: 160,
                            objectFit: "cover",
                            borderRadius: 12,
                            flexShrink: 0,
                            borderRight: "4px solid #DBE2EF", // Visual separator
                          }}
                        />
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Title
                            level={3} // Slightly larger title
                            style={{
                              color: "#112D4E", // Darker primary color
                              marginBottom: 12,
                              lineHeight: 1.3,
                            }}
                          >
                            {item.subject}
                          </Title>
                          <Paragraph
                            style={{
                              fontSize: 16, // Slightly larger font size
                              color: "#112D4E",
                              lineHeight: 1.6,
                              flexGrow: 1, // Allows paragraph to take available space
                            }}
                            ellipsis={{ rows: 3, expandable: false }} // Limit text for cleaner look
                          >
                            {item.information}
                          </Paragraph>
                          <div
                            style={{
                              marginTop: "auto",
                              textAlign: "right",
                              fontSize: 14,
                              color: "#3F72AF", // Themed date color
                              fontWeight: "bold",
                            }}
                          >
                            📅 วันที่เผยแพร่:{" "}
                            {item.dashboardtime
                              ? new Date(item.dashboardtime).toLocaleDateString(
                                  "th-TH",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )
                              : "-"}
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                  <Empty description="ไม่พบข้อมูลข่าวประชาสัมพันธ์" />
                </div>
              )}

              {/* Pagination */}
              {dashboards.length > pageSize && (
                <div style={{ textAlign: "center", marginTop: 60 }}>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={dashboards.length}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    showTotal={(total, range) =>
                      `แสดง ${range[0]}-${range[1]} จากทั้งหมด ${total} รายการ`
                    } // Show total items
                    style={{ color: "#3F72AF" }}
                  />
                </div>
              )}
            </>
          )}
        </Content>
      </Layout>
    </>
  );
};

export default DashboardView;