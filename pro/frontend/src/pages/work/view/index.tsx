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
  Modal,
} from "antd";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import { GetWork, RegisterWork } from "../../../services/https";
import { WorkInterface } from "../../../interfaces/IWork";
import bannerImage from "../../../assets/bannerblue.png";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapRefresher = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 300);
  }, [map]);
  return null;
};

const WorkView = () => {
  const [works, setWorks] = useState<WorkInterface[]>([]);
  const [selectedWork, setSelectedWork] = useState<WorkInterface | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("user_id"));

  const fetchWorkList = async () => {
    const res = await GetWork();
    if (res) {
      setWorks(res);
    } else {
      messageApi.error("ไม่สามารถดึงข้อมูลงานได้");
    }
  };

  const handleRegister = async (workId: number | undefined) => {
    if (!workId || !userId) {
      messageApi.error("ไม่สามารถลงทะเบียนได้: ไม่พบข้อมูลผู้ใช้หรือรหัสงาน");
      return;
    }

    try {
      const result = await RegisterWork(workId, userId);
      messageApi.success("ลงทะเบียนสำเร็จ!");
      fetchWorkList();
      setModalVisible(false);
    } catch (error: any) {
      messageApi.error(`ลงทะเบียนล้มเหลว: ${error.message}`);
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

  const paginatedWorks = filteredWorks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <Navbar />
      <Layout style={{ backgroundColor: "#F9F7F7", minHeight: "100vh" }}>
        <Content style={{ padding: 24 }}>
          {contextHolder}

          <div style={{ position: "relative", marginBottom: 24 }}>
            <img
              src={bannerImage}
              alt="Banner"
              style={{ width: "100%", objectFit: "cover", maxHeight: 400 }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(255, 255, 255, 0.85)",
                padding: "16px 20px",
                borderRadius: 8,
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <Search
                placeholder="ค้นหาชื่องาน..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                style={{ width: 240 }}
              />
              <Select defaultValue="" onChange={setFilterType} style={{ width: 180 }}>
                <Option value="">ทุกประเภท</Option>
                <Option value="volunteer">งานจิตอาสา</Option>
                <Option value="paid">งานค่าตอบแทน</Option>
              </Select>
              <Select defaultValue="" onChange={setFilterStatus} style={{ width: 180 }}>
                <Option value="">ทุกสถานะ</Option>
                <Option value="open">เปิดรับสมัคร</Option>
                <Option value="closed">ปิดรับสมัคร</Option>
              </Select>
            </div>
          </div>

          <Title level={4}>📋 รายการงาน</Title>
          <Row gutter={[24, 24]}>
            {paginatedWorks.map((work) => (
              <Col xs={24} sm={12} lg={8} key={work.ID}>
                <Card
  hoverable
  onClick={() => {
    setSelectedWork(work);
    setModalVisible(true);
  }}
  bodyStyle={{ padding: 16 }}
>
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <img
      alt={work.title}
      src={work.photo || ""}
      style={{
        width: 50,
        height: 50,
        objectFit: "cover",
        borderRadius: "50%", // ทำให้เป็นวงกลม
        border: "2px solid #eee",
      }}
    />
    <div>
      <Title level={5} style={{ margin: 0 }}>
        {work.title}
      </Title>
      <Paragraph style={{ margin: "4px 0", fontSize: 13 }}>
        {work.description}
      </Paragraph>
    </div>
  </div>

  <div style={{ marginTop: 12 }}>
    <Paragraph style={{ fontSize: 13, marginBottom: 4 }}>
      🕒 <strong>วันเวลา:</strong>{" "}
      {new Date(work.worktime || "").toLocaleString("th-TH")}
    </Paragraph>
    <Paragraph style={{ fontSize: 13, marginBottom: 4 }}>
      👥 <strong>จำนวนที่รับ:</strong> {work.workuse ?? 0} / {work.workcount ?? 0} คน
    </Paragraph>
    <Paragraph style={{ fontSize: 13, marginBottom: 4 }}>
      🏷️ <strong>ประเภทงาน:</strong>{" "}
      {work.worktype_id === 1 ? "💵 งานค่าตอบแทน" : "💖 งานจิตอาสา"}
    </Paragraph>

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Tag color={work.workstatus_id === 1 ? "green" : "red"}>
        {work.workstatus_id === 1 ? "📢 เปิดรับสมัคร" : "❌ ปิดรับสมัคร"}
      </Tag>

    </div>
  </div>
</Card>

              </Col>
            ))}
          </Row>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredWorks.length}
            onChange={setCurrentPage}
            style={{ marginTop: 24, textAlign: "center" }}
          />

          <Modal
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            title="🧾 รายละเอียดงาน"
            width={1000}
          >
            {selectedWork && (
              <div style={{ padding: 8 }}>
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={14}>
                    <img
                      src={selectedWork.photo || ""}
                      alt="Work"
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        borderRadius: 8,
                        marginBottom: 16,
                      }}
                    />
                    <Title level={4} style={{ color: "#112D4E" }}>
                      🧠 {selectedWork.title}
                    </Title>
                    <Paragraph>
                      📝 <strong>รายละเอียด:</strong> {selectedWork.description || "-"}
                    </Paragraph>
                    <Paragraph>
                      📍 <strong>สถานที่:</strong> {selectedWork.place || "-"}
                    </Paragraph>
                    <Paragraph>
                      🕒 <strong>วันเวลา:</strong>{" "}
                      {selectedWork.worktime
                        ? new Date(selectedWork.worktime).toLocaleString("th-TH")
                        : "-"}
                    </Paragraph>
                    <Paragraph>
                      👥 <strong>จำนวนสมัครแล้ว:</strong> {selectedWork.workuse ?? 0} / {selectedWork.workcount ?? 0}
                    </Paragraph>
                    <Paragraph>
                      🏷️ <strong>ประเภทงาน:</strong>{" "}
                      {selectedWork.worktype_id === 1 ? "💵 มีค่าตอบแทน" : "💖 จิตอาสา"}
                    </Paragraph>
                    {selectedWork.worktype_id === 1 && (
                      <Paragraph>
                        💸 <strong>ค่าตอบแทน:</strong> {selectedWork.paid ?? 0} บาท
                      </Paragraph>
                    )}
                    {selectedWork.worktype_id === 2 && (
                      <Paragraph>
                        ⏳ <strong>ชั่วโมงจิตอาสา:</strong> {selectedWork.volunteer ?? 0} ชั่วโมง
                      </Paragraph>
                    )}
                    <Paragraph>
                      🔒 <strong>สถานะ:</strong>{" "}
                      <Tag color={selectedWork.workstatus_id === 1 ? "green" : "red"}>
                        {selectedWork.workstatus_id === 1 ? "📢 เปิดรับสมัคร" : "❌ ปิดรับสมัคร"}
                      </Tag>
                    </Paragraph>
                  </Col>

                  <Col xs={24} md={10}>
                    <div
                      style={{
                        height: 400,
                        width: "100%",
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    >
                      <MapContainer
                        center={[selectedWork.latitude ?? 0, selectedWork.longitude ?? 0]}
                        zoom={13}
                        scrollWheelZoom={true}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <MapRefresher />
                        <TileLayer
                          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[selectedWork.latitude ?? 0, selectedWork.longitude ?? 0]} />
                      </MapContainer>
                    </div>
                  </Col>
                </Row>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                  <Button
                    type="primary"
                    onClick={() => handleRegister(selectedWork.ID)}
                    disabled={selectedWork.workstatus_id !== 1}
                    style={{ backgroundColor: "#3F72AF", borderColor: "#3F72AF" }}
                  >
                    ❤️ ลงทะเบียนเข้าร่วม
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