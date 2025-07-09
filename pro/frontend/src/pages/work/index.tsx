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
  Input,
  Select,
} from "antd";
import {
  PlusOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { WorkInterface } from "../../interfaces/IWork";
import { GetWork, DeleteWorkByID } from "../../services/https/index";
import AdminSidebar from "../../components/Sider/AdminSidebar";
import styles from "./WorkTablePage.module.css";

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const WorkTablePage = () => {
  const [works, setWorks] = useState<WorkInterface[]>([]);
  const [filteredWorks, setFilteredWorks] = useState<WorkInterface[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<number | null>(null);

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchWorkList = async () => {
    const res = await GetWork();
    if (res) {
      setWorks(res);
      setFilteredWorks(res);
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

  useEffect(() => {
    let filtered = works;

    if (searchTitle.trim() !== "") {
      filtered = filtered.filter((w) =>
        w.title?.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    if (statusFilter !== null) {
      filtered = filtered.filter((w) => w.workstatus_id === statusFilter);
    }

    if (typeFilter !== null) {
      filtered = filtered.filter((w) => w.worktype_id === typeFilter);
    }

    setFilteredWorks(filtered);
  }, [searchTitle, statusFilter, typeFilter, works]);

  const columns = [
    {
      title: "ลำดับ",
      key: "index",
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
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
            {/* Title + Filters + Button in same row */}
            <Row
              justify="space-between"
              align="middle"
              style={{
                flexWrap: "wrap",
                rowGap: 12,
                columnGap: 12,
                marginBottom: 16,
              }}
            >
              <Col flex="1 1 200px">
                <Title level={3} className={styles.pageTitle} style={{ marginBottom: 0 }}>
                  รายการงานทั้งหมด
                </Title>
              </Col>

              <Col flex="1 1 100px">
                <Input
                  placeholder="ค้นหาหัวข้องาน"
                  prefix={<SearchOutlined />}
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
              </Col>

              <Col flex="1 1 10px">
                <Select
                  placeholder="เลือกสถานะงาน"
                  allowClear
                  style={{ width: "100%" }}
                  value={statusFilter ?? undefined}
                  onChange={(value) => setStatusFilter(value ?? null)}
                >
                  <Option value={1}>เปิดรับสมัคร</Option>
                  <Option value={2}>ปิดรับสมัคร</Option>
                </Select>
              </Col>

              <Col flex="1 1 10px">
                <Select
                  placeholder="เลือกประเภทงาน"
                  allowClear
                  style={{ width: "100%" }}
                  value={typeFilter ?? undefined}
                  onChange={(value) => setTypeFilter(value ?? null)}
                >
                  <Option value={1}>ค่าตอบแทน</Option>
                  <Option value={2}>จิตอาสา</Option>
                </Select>
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
              dataSource={filteredWorks.map((item) => ({ ...item, key: item.ID?.toString() }))}
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
