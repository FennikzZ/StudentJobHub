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
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { WorkInterface } from "../../interfaces/IWork";
import { GetWork, DeleteWorkByID } from "../../services/https/index";
import AdminSidebar from "../../components/Sider/AdminSidebar";
import styles from "./WorkTablePage.module.css";

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

  const handleDelete = async (id?: number, title?: string) => {
    if (!id) return;

    Modal.confirm({
      title: "คุณแน่ใจหรือไม่?",
      content: `คุณต้องการลบงาน "${title || "นี้"}" ใช่หรือไม่?`,
      okText: "ลบ",
      okType: "danger",
      cancelText: "ยกเลิก",
      centered: true,
      onOk: async () => {
        const res = await DeleteWorkByID(id);
        if (res) {
          messageApi.success("ลบงานสำเร็จ");
          fetchWorkList();
        } else {
          messageApi.error("ไม่สามารถลบงานได้");
        }
      },
    });
  };

  useEffect(() => {
    fetchWorkList();
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
      dataIndex: "photo",
      key: "photo",
      render: (photo: string) =>
        photo ? (
          <img src={photo} alt="งาน" className={styles.photo} />
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
      title: "จำนวน (คน)",
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
      align: "center" as const,
      render: (value: number) => {
        switch (value) {
          case 1:
            return <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 24 }} />;
          case 2:
            return <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 24 }} />;
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
      fixed: 'right' as const,
      align: "center" as const,
      render: (_: any, record: WorkInterface) => (
        <div className={styles.actions}>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/work/edit/${record.ID}`)}
            className={styles.editButton}
          >
            แก้ไข
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.ID, record.title)}
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
                <Title level={3} className={styles.pageTitle}>รายการงานทั้งหมด</Title>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/work/create")}
                  className={styles.createButton}
                >
                  สร้างงานใหม่
                </Button>
              </Col>
            </Row>

            <Divider />

            <Table
              bordered
              columns={columns}
              dataSource={works.map((item) => ({ ...item, key: item.ID?.toString() }))}
              pagination={{ pageSize: 10 }}
              scroll={{ x: "max-content" }}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default WorkTablePage;
