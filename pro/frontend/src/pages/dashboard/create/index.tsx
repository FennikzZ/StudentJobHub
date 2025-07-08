import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  message,
  Row,
  Upload,
} from "antd";
import { PlusOutlined, FileImageOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import { useState } from "react";
import dayjs from "dayjs";
import { CreateDashboard } from "../../../services/https";
import { DashboardInterface } from "../../../interfaces/IDashboard";
import AdminSidebar from "../../../components/Sider/AdminSidebar";

const { Content } = Layout;

const DashboardCreate = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onChange = ({ fileList: newFileList }: { fileList: any[] }) => {
    setFileList(newFileList);
    form.setFieldsValue({ image: newFileList });
  };

  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src as string;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onFinish = async (values: any) => {
    const data: DashboardInterface = {
      subject: values.subject,
      information: values.information,
      dashboardtime: dayjs().toISOString(),
      image: fileList[0]?.thumbUrl || "",
    };

    const res = await CreateDashboard(data);
    if (res) {
      messageApi.success("สร้างข่าวสำเร็จ");
      setTimeout(() => navigate("/dashboard"), 1500);
    } else {
      messageApi.error("เกิดข้อผิดพลาดในการสร้างข่าว");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <div
        style={{
          width: 250,
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          backgroundColor: "#1E3A8A",
          zIndex: 1000,
        }}
      >
        <AdminSidebar />
      </div>

      <Layout style={{ marginLeft: 250 }}>
        <Content style={{ padding: 32, backgroundColor: "#dbe2ef" }}>
          {contextHolder}
          <Card
            style={{
              width: "100%",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              backgroundColor: "#ffffff",
            }}
          >
            <h1
              style={{
                textAlign: "center",
                fontSize: 32,
                fontWeight: 800,
                color: "#112D4E",
              }}
            >
              เพิ่มข่าวประชาสัมพันธ์
            </h1>

            <div
              style={{
                width: "100%",
                height: 4,
                backgroundColor: "#434c86",
                marginTop: 21,
                borderRadius: 2,
              }}
            />

            <Form
              layout="vertical"
              onFinish={onFinish}
              form={form}
              style={{ marginTop: 32 }}
            >
              {/* แถวที่ 1: Upload รูป ให้อยู่ตรงกลางจริงๆ */}
              <Row justify="center">
                <Col
                  xs={24}
                  md={12}
                  lg={8}
                  style={{ display: "flex", justifyContent: "right" }}
                >
                  <Form.Item
                    name="image"
                    label="รูปภาพประกอบ"
                    valuePropName="fileList"
                    getValueFromEvent={(e) =>
                      Array.isArray(e) ? e : e?.fileList
                    }
                    rules={[
                      { required: true, message: "กรุณาอัปโหลดรูปภาพ" },
                    ]}
                    style={{ width: "100%", maxWidth: 300 }}
                  >
                    <ImgCrop rotationSlider>
                      <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                        beforeUpload={() => false}
                        maxCount={1}
                        style={{ width: "100%" }}
                      >
                        {fileList.length < 1 && (
                          <div style={{ textAlign: "center" }}>
                            <FileImageOutlined
                              style={{ fontSize: 48, color: "#3F72AF" }}
                            />
                            <div
                              style={{
                                marginTop: 8,
                                fontSize: 16,
                                color: "#3F72AF",
                              }}
                            >
                              อัปโหลด
                            </div>
                          </div>
                        )}
                      </Upload>
                    </ImgCrop>
                  </Form.Item>
                </Col>
              </Row>

              {/* แถวที่ 2: หัวข้อ + รายละเอียด */}
              <Row gutter={24}>
                <Col xs={24} md={7}>
                  <Form.Item
                    name="subject"
                    label="หัวข้อข่าว"
                    rules={[
                      { required: true, message: "กรุณาระบุหัวข้อข่าว" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={17}>
                  <Form.Item
                    name="information"
                    label="รายละเอียด"
                    rules={[
                      { required: true, message: "กรุณาระบุรายละเอียด" },
                    ]}
                  >
                    <Input.TextArea rows={1} />
                  </Form.Item>
                </Col>
              </Row>

              {/* ปุ่ม */}
              <Row justify="end" gutter={16}>
                <Col>
                  <Link to="/dashboard">
                    <Button>ยกเลิก</Button>
                  </Link>
                </Col>
                <Col>
                  <Button
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    style={{
                      backgroundColor: "#3F72AF",
                      color: "#fff",
                      borderColor: "#3F72AF",
                    }}
                  >
                    บันทึกข่าว
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardCreate;
