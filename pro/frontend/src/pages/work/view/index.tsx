import { useEffect, useState } from "react";
import {
    Card,
    Col,
    Row,
    Typography,
    Layout,
    message,
    Tag,
    Input,
    Select,
    Modal,
    Button,
} from "antd";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import { WorkInterface } from "../../../interfaces/IWork";
import { GetWork } from "../../../services/https/index";
import bannerImage from "../../../assets/banner.png";

const { Title, Paragraph } = Typography;
const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const WorkView = () => {
    const [works, setWorks] = useState<WorkInterface[]>([]);
    const [searchText, setSearchText] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [selectedWork, setSelectedWork] = useState<WorkInterface | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const fetchWorkList = async () => {
        const res = await GetWork();
        if (res) {
            setWorks(res);
        } else {
            messageApi.error("ไม่สามารถดึงข้อมูลงานได้");
        }
    };

    useEffect(() => {
        fetchWorkList();
    }, []);

    const showModal = (work: WorkInterface) => {
        setSelectedWork(work);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setSelectedWork(null);
        setIsModalVisible(false);
    };

    const filteredWorks = works.filter((work) => {
        const matchesSearch = (work.title || "").toLowerCase().includes(searchText.toLowerCase());
        const matchesType =
            filterType === "" ||
            (filterType === "volunteer" && work.worktype_id === 2) ||
            (filterType === "paid" && work.worktype_id === 1);
        const matchesStatus =
            filterStatus === "" ||
            (filterStatus === "open" && work.workstatus_id === 1) ||
            (filterStatus === "closed" && work.workstatus_id === 2);
        return matchesSearch && matchesType && matchesStatus;
    });

    return (
        <>
            <Navbar />
            <Layout style={{ backgroundColor: "#F9F7F7", minHeight: "100vh" }}>
                <Content style={{ padding: "24px" }}>
                    {contextHolder}

                    {/* ✅ Banner & Search */}
                    <div
                        style={{
                            position: "relative",
                            marginBottom: 32,
                            borderRadius: 16,
                            overflow: "hidden",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        }}
                    >
                        <img
                            src={bannerImage}
                            alt="Banner"
                            style={{ width: "100%", maxHeight: 300, objectFit: "cover" }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "12px",
                                background: "rgba(255, 255, 255, 0.9)",
                                padding: "20px 24px",
                                borderRadius: 12,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                        >
                            <Search
                                placeholder="ค้นหาชื่องาน..."
                                allowClear
                                onChange={(e) => setSearchText(e.target.value)}
                                value={searchText}
                                style={{ width: 240 }}
                            />
                            <Select
                                defaultValue=""
                                onChange={(value) => setFilterType(value)}
                                style={{ width: 180 }}
                            >
                                <Option value="">ทุกประเภท</Option>
                                <Option value="volunteer">งานจิตอาสา</Option>
                                <Option value="paid">งานค่าตอบแทน</Option>
                            </Select>
                            <Select
                                defaultValue=""
                                onChange={(value) => setFilterStatus(value)}
                                style={{ width: 180 }}
                            >
                                <Option value="">ทุกสถานะ</Option>
                                <Option value="open">เปิดรับสมัคร</Option>
                                <Option value="closed">ปิดรับสมัคร</Option>
                            </Select>
                        </div>
                    </div>

                    <Title
                        level={3}
                        style={{ color: "#112D4E", marginBottom: 24, textAlign: "center" }}
                    >
                        🏠 รายการงานทั้งหมด
                    </Title>

                    <Row gutter={[24, 24]} justify="center">
                        {filteredWorks.map((work) => (
                            <Col key={work.ID} xs={24} sm={12} md={8} lg={6}>
                               <Card
  hoverable
  cover={
    <img
      alt={work.title || ""}
      src={work.photo || ""}
      style={{
        height: 160,
        objectFit: "cover",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }}
    />
  }
  style={{
    borderRadius: 12,
    background: "#ffffff",
    position: "relative",
  }}
  bodyStyle={{ padding: 16 }}
>
  <Title level={5} style={{ marginBottom: 8 }}>
    {work.title || "-"}
  </Title>
  <Paragraph ellipsis={{ rows: 2 }}>
    {work.description || "-"}
  </Paragraph>
  <Paragraph style={{ fontSize: 12, marginBottom: 4 }}>
    📍 {work.place || "-"}
  </Paragraph>
  <Paragraph style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
    🕒 {work.worktime ? new Date(work.worktime).toLocaleString("th-TH") : "-"}
  </Paragraph>
  <Paragraph style={{ fontSize: 12, marginBottom: 4 }}>
    👥 สมัครแล้ว {work.workuse ?? 0} / {work.workcount ?? 0} คน
  </Paragraph>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
    }}
  >
    <Tag
      color={work.workstatus_id === 1 ? "#3F72AF" : "#FF4D4F"}
      style={{ fontWeight: "bold", borderRadius: 8 }}
    >
      {work.workstatus_id === 1
        ? "📢 เปิดรับสมัคร"
        : "🔒 ปิดรับสมัคร"}
    </Tag>

    <button
      onClick={() => showModal(work)}
      style={{
        backgroundColor: "#2D9CDB",
        color: "#fff",
        border: "none",
        padding: "6px 12px",
        borderRadius: 8,
        fontWeight: "bold",
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      ℹ️ รายละเอียดงาน
    </button>
  </div>
</Card>

                            </Col>
                        ))}
                    </Row>

                    {/* ✅ Modal แสดงรายละเอียดงาน */}
                    <Modal
                        title={selectedWork?.title || "รายละเอียดงาน"}
                        open={isModalVisible}
                        onCancel={handleCloseModal}
                        footer={null}
                        centered
                        width={600}
                    >
                        {selectedWork && (
                            <div>
                                <img
                                    src={selectedWork.photo || ""}
                                    alt="Work"
                                    style={{
                                        width: "100%",
                                        maxHeight: 250,
                                        objectFit: "cover",
                                        borderRadius: 8,
                                        marginBottom: 16,
                                    }}
                                />
                                <Paragraph><strong>รายละเอียด:</strong> {selectedWork.description || "-"}</Paragraph>
                                <Paragraph><strong>สถานที่:</strong> {selectedWork.place || "-"}</Paragraph>
                                <Paragraph><strong>เวลา:</strong> {selectedWork.worktime ? new Date(selectedWork.worktime).toLocaleString("th-TH") : "-"}</Paragraph>
                                <Paragraph><strong>สมัครแล้ว:</strong> {selectedWork.workuse ?? 0} / {selectedWork.workcount ?? 0}</Paragraph>
                                <Paragraph>
                                    <strong>สถานะ:</strong>{" "}
                                    {selectedWork.workstatus_id === 1 ? (
                                        <Tag color="#3F72AF">📢 เปิดรับสมัคร</Tag>
                                    ) : (
                                        <Tag color="#FF4D4F">🔒 ปิดรับสมัคร</Tag>
                                    )}
                                </Paragraph>

                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                                    <Button
                                        type="primary"
                                        onClick={() => navigate(`/work/edit/${selectedWork.ID}`)}
                                        disabled={selectedWork.workstatus_id !== 1}
                                        style={{ backgroundColor: "#F4A261", borderColor: "#F4A261" }}
                                    >
                                        ❤ ลงทะเบียน
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Modal>
                </Content>
            </Layout>
        </>
    );
};

export default WorkView;