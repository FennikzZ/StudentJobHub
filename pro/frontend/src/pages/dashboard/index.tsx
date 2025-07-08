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
  Modal,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { DashboardInterface } from "../../interfaces/IDashboard";
import {
  GetDashboard,
  DeleteDashboardByID,
} from "../../services/https/index";
import AdminSidebar from "../../components/Sider/AdminSidebar";
import styles from "./DashboardTablePage.module.css";

const { Title } = Typography;
const { Content } = Layout;

const DashboardTablePage = () => {
  const [dashboards, setDashboards] = useState<DashboardInterface[]>([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchDashboardList = async () => {
    const res = await GetDashboard();
    if (res) {
      setDashboards(res);
    } else {
      messageApi.error("ไม่สามารถโหลดข้อมูลกระดานข่าวได้");
    }
  };

  const handleDelete = async (id?: number, subject?: string) => {
    if (!id) return;

    Modal.confirm({
      title: "คุณแน่ใจหรือไม่?",
      content: `คุณต้องการลบข่าวเรื่อง "${subject}" ใช่หรือไม่?`,
      okText: "ลบ",
      okType: "danger",
      cancelText: "ยกเลิก",
      centered: true,
      onOk: async () => {
        const res = await DeleteDashboardByID(id);
        if (res) {
          messageApi.success("ลบสำเร็จ");
          fetchDashboardList();
        } else {
          messageApi.error("ไม่สามารถลบข้อมูลได้");
        }
      },
    });
  };

  useEffect(() => {
    fetchDashboardList();
  }, []);

  const columns = [
    {
  title: "ลำดับ",
  key: "index",
  width: 60,
  align: "center" as const,
  render: (_: any, __: any, index: number) => index + 1,
}
,
    {
      title: "รูปภาพ",
      dataIndex: "image",
      key: "image",
      render: (image: string) =>
        image ? (
          <img
            src={image}
            alt="ภาพข่าว"
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
      title: "หัวข้อข่าว",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "รายละเอียด",
      dataIndex: "information",
      key: "information",
      ellipsis: true,
    },
    {
      title: "วันที่เผยแพร่",
      dataIndex: "dashboardtime",
      key: "dashboardtime",
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString("th-TH") : "-",
      align: "center" as const,
    },
    {
      title: "การจัดการ",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: DashboardInterface) => (
        <div className={styles.actions}>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/dashboard/edit/${record.ID}`)}
            className={styles.editButton}
          >
            แก้ไข
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.ID, record.subject)}
            className={styles.deleteButton}
          >
            ลบ
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout className={styles.layout}>
      <div className={styles.sidebarWrapper}>
        <AdminSidebar />
      </div>

      <Layout style={{ marginLeft: 250 }}>
        <Content className={styles.content}>
          {contextHolder}
          <Card className={styles.card}>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={3} className={styles.pageTitle}>
                  รายการข่าวประชาสัมพันธ์
                </Title>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/dashboard/create")}
                  className={styles.createButton}
                >
                  เพิ่มข่าวใหม่
                </Button>
              </Col>
            </Row>

            <Divider />

            <Table
              bordered
              columns={columns}
              dataSource={dashboards.map((item) => ({
                ...item,
                key: item.ID?.toString(),
              }))}
              pagination={{ pageSize: 10 }}
              scroll={{ x: "max-content" }}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardTablePage;
