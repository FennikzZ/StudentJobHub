import { useEffect, useState } from "react";
import {
    Layout,
    Row,
    Col,
    Card,
    Typography,
    Input,
    Select,
    Tag,
    message,
    Button,
    Pagination,
} from "antd";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import { GetWork } from "../../../services/https";
import { WorkInterface } from "../../../interfaces/IWork";
import bannerImage from "../../../assets/bannerblue.png";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const WorkView = () => {
    const [works, setWorks] = useState<WorkInterface[]>([]);
    const [selectedWork, setSelectedWork] = useState<WorkInterface | null>(null);
    const [searchText, setSearchText] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const navigate = useNavigate();

    const fetchWorkList = async () => {
        const res = await GetWork();
        if (res) {
            setWorks(res);
            setSelectedWork(res[0]);
        } else {
            messageApi.error("ไม่สามารถดึงข้อมูลงานได้");
        }
    };

    useEffect(() => {
        fetchWorkList();
    }, []);

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

    const paginatedWorks = filteredWorks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <>
            <Navbar />
            <Layout style={{ backgroundColor: "#F9F7F7", minHeight: "100vh", overflow: "hidden" }}>
                <Content style={{ padding: 24, height: "calc(100vh - 64px)", overflow: "hidden" }}>
                    {contextHolder}

                    <div
                        style={{
                            position: "relative",
                            marginBottom: 24,
                            borderRadius: 4,
                            overflow: "hidden",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        }}
                    >
                        <img
                            src={bannerImage}
                            alt="Banner"
                            style={{ width: "100%", maxHeight: 1200, objectFit: "cover" }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                background: "rgba(243, 243, 243, 0.2)",
                                padding: "20px 24px",
                                borderRadius: 10,
                                display: "flex",
                                gap: 16,
                                flexWrap: "wrap",
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

                    <Row gutter={24} style={{ height: "calc(100vh - 400px)" }}>
                        <Col xs={24} md={10} lg={8} style={{ height: "100%", overflowY: "auto" }}>
                            <Title level={4}>📋 รายการงาน</Title>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {paginatedWorks.map((work) => (
                                    <Card
                                        key={work.ID}
                                        hoverable
                                        onClick={() => setSelectedWork(work)}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 16,
                                            borderRadius: 8,
                                            backgroundColor: selectedWork?.ID === work.ID ? "#E3F2FD" : "#fff",
                                            border: selectedWork?.ID === work.ID ? "2px solid #2196F3" : "1px solid #f0f0f0",
                                            cursor: "pointer",
                                        }}
                                        bodyStyle={{ padding: 12 }}
                                    >
                                        <img
                                            alt={work.title || ""}
                                            src={work.photo || ""}
                                            style={{
                                                width: 80,
                                                height: 80,
                                                objectFit: "cover",
                                                borderRadius: 8,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <div style={{ marginBottom: 8 }}>
                                                <Title level={5} style={{ margin: 0 }}>{work.title || "-"}</Title>
                                                <Paragraph style={{ fontSize: 12, margin: 0 }} ellipsis={{ rows: 2 }}>
                                                    {work.description || "-"}
                                                </Paragraph>
                                            </div>
                                            <div style={{ fontSize: 12, color: "#555" }}>
                                                <div>📍 {work.place || "-"}</div>
                                                <div>🕒 {work.worktime ? new Date(work.worktime).toLocaleString("th-TH") : "-"}</div>
                                                <div>👥 {work.workuse ?? 0} / {work.workcount ?? 0} คน</div>
                                                <Tag
                                                    color={work.workstatus_id === 1 ? "green" : "red"}
                                                    style={{ fontWeight: "bold", borderRadius: 4, marginTop: 4 }}
                                                >
                                                    {work.workstatus_id === 1 ? "📢 เปิดรับสมัคร" : "🔒 ปิดรับสมัคร"}
                                                </Tag>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={filteredWorks.length}
                                    onChange={(page) => setCurrentPage(page)}
                                    style={{ marginTop: 16, textAlign: "center" }}
                                />
                            </div>
                        </Col>

                        <Col xs={24} md={14} lg={16} style={{ height: "100%", overflowY: "hidden" }}>
                            <Title level={4}>🧾 รายละเอียดงาน</Title>
                            {selectedWork ? (
                                <Card style={{ borderRadius: 12 }}>
                                    <img
                                        src={selectedWork.photo || ""}
                                        alt="Work"
                                        style={{
                                            width: "100%",
                                            maxHeight: 300,
                                            objectFit: "cover",
                                            borderRadius: 8,
                                            marginBottom: 16,
                                        }}
                                    />
                                    <Title level={5}>{selectedWork.title}</Title>
                                    <Paragraph>
                                        <strong>รายละเอียด:</strong> {selectedWork.description || "-"}
                                    </Paragraph>
                                    <Paragraph>
                                        <strong>สถานที่:</strong> {selectedWork.place || "-"}
                                    </Paragraph>
                                    <Paragraph>
                                        <strong>เวลา:</strong> {selectedWork.worktime ? new Date(selectedWork.worktime).toLocaleString("th-TH") : "-"}
                                    </Paragraph>
                                    <Paragraph>
                                        <strong>จำนวนที่สมัครแล้ว:</strong> {selectedWork.workuse ?? 0} / {selectedWork.workcount ?? 0}
                                    </Paragraph>
                                    <Paragraph>
                                        <strong>สถานะ:</strong> <Tag color={selectedWork.workstatus_id === 1 ? "green" : "red"}>
                                            {selectedWork.workstatus_id === 1 ? "📢 เปิดรับสมัคร" : "🔒 ปิดรับสมัคร"}
                                        </Tag>
                                    </Paragraph>
                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Button
                                            type="primary"
                                            onClick={() => navigate(`/work/apply/${selectedWork.ID}`)}
                                            disabled={selectedWork.workstatus_id !== 1}
                                            style={{ backgroundColor: "#F4A261", borderColor: "#F4A261" }}
                                        >
                                            ❤ ลงทะเบียน
                                        </Button>
                                    </div>
                                </Card>
                            ) : (
                                <Paragraph>กรุณาเลือกงานจากด้านซ้าย</Paragraph>
                            )}
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </>
    );
};

export default WorkView;
