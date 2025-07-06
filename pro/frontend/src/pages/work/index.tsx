import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Row,
  Card,
  Table,
  Typography,
  Divider,
  message,
  Layout,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { WorkInterface } from "../../interfaces/IWork";
import { GetWork, DeleteWorkByID } from "../../services/https/index";
import AdminSidebar from "../../components/Sider/AdminSidebar";

const { Title } = Typography;
const { Content } = Layout;

const WorkTablePage = () => {
  const [works, setWorks] = useState<WorkInterface[]>([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchWorkList = async () => {
    const res = await GetWork();
    if (res) {
      setWorks(res);
    } else {
      messageApi.error("ไม่สามารถดึงข้อมูลงานได้");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const confirmed = window.confirm("คุณแน่ใจว่าต้องการลบงานนี้ใช่หรือไม่?");
    if (!confirmed) return;
    const res = await DeleteWorkByID(id);
    if (res) {
      messageApi.success("ลบงานสำเร็จ");
      fetchWorkList();
    } else {
      messageApi.error("ไม่สามารถลบงานได้");
    }
  };

  useEffect(() => {
    fetchWorkList();
  }, []);

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "ID",
      width: 60,
      fixed: 'left' as const, // ✅ Fix type
    },
    {
      title: "รูปภาพ",
      dataIndex: "photo",
      key: "photo",
      render: (photo: string) =>
        photo ? (
          <img
            src={photo}
            alt="งาน"
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ) : (
          "-"
        ),
    },
    {
      title: "หัวข้องาน",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "รายละเอียด",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "จำนวนคนที่ต้องการ",
      dataIndex: "workcount",
      key: "workcount",
      align: "center" as const,
    },
    {
      title: "วันเวลา",
      dataIndex: "worktime",
      key: "worktime",
      render: (value: string) => new Date(value).toLocaleString("th-TH"),
    },
    {
      title: "สถานที่",
      dataIndex: "place",
      key: "place",
    },
    {
      title: "สถานะ",
      dataIndex: "workstatus_id",
      key: "workstatus_id",
      render: (value: number) => {
        switch (value) {
          case 1:
            return "เปิดรับสมัคร";
          case 2:
            return "ปิดรับสมัคร";
          default:
            return "-";
        }
      },
    },
    {
      title: "ประเภท",
      dataIndex: "worktype_id",
      key: "worktype_id",
      render: (value: number) => {
        switch (value) {
          case 1:
            return "ค่าตอบแทน";
          case 2:
            return "จิตอาสา";
          default:
            return "-";
        }
      },
    },
    {
      title: "รูปแบบ",
      key: "reward",
      render: (_: any, record: WorkInterface) =>
        record.paid
          ? `${record.paid} บาท`
          : record.volunteer
          ? `${record.volunteer} ชั่วโมง`
          : "-",
    },
    {
      title: "การจัดการ",
      key: "actions",
      fixed: 'right' as const, // ✅ Fix type
      render: (_: any, record: WorkInterface) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="link"
            onClick={() => navigate(`/work/edit/${record.ID}`)}
            style={{ color: "#3B82F6" }}
          >
            แก้ไข
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.ID)}>
            ลบ
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 250,
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          backgroundColor: "#fff",
          borderRight: "1px solid #f0f0f0",
          zIndex: 1000,
        }}
      >
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <Layout style={{ marginLeft: 250 }}>
        <Content
          style={{
            padding: "24px",
            backgroundColor: "rgba(233, 213, 255, 0.4)",
            minHeight: "100vh",
          }}
        >
          {contextHolder}
          <Card
            style={{
              width: "100%",
              maxWidth: "100%",
              margin: "0 auto",
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "24px",
            }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={3} style={{ color: "#6B21A8", margin: 0 }}>
                  รายการงานทั้งหมด
                </Title>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/work/create")}
                  style={{
                    backgroundColor: "#9333EA",
                    borderColor: "#9333EA",
                  }}
                >
                  สร้างงานใหม่
                </Button>
              </Col>
            </Row>

            <Divider />

            <Table
              bordered
              columns={columns}
              dataSource={works.map((item) => ({
                ...item,
                key: item.ID?.toString(),
              }))}
              pagination={{ pageSize: 6 }}
              scroll={{ x: "max-content" }}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default WorkTablePage;
