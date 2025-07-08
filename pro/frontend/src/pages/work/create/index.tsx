import {
  Button,
  Col,
  Row,
  Form,
  Input,
  Card,
  message,
  DatePicker,
  InputNumber,
  Select,
  Upload,
  Layout,
} from "antd";
import { useState } from "react";
import { PlusOutlined, FileImageOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import { WorkInterface } from "../../../interfaces/IWork";
import { CreateWork } from "../../../services/https/index";
import dayjs from "dayjs";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import AdminSidebar from "../../../components/Sider/AdminSidebar";

const { Content } = Layout;
const { Option } = Select;

const defaultPosition: [number, number] = [14.883451, 102.010589];

const LocationPicker = ({ onSelect }: { onSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const WorkEdit = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<any[]>([]);
  const [workTypeID, setWorkTypeID] = useState<number>(1);
  const [position, setPosition] = useState<[number, number]>(defaultPosition);

  const onChange = ({ fileList: newFileList }: { fileList: any[] }) => {
    setFileList(newFileList);
    form.setFieldsValue({ photo: newFileList });
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
    const data: WorkInterface = {
      ...values,
      worktime: values.worktime.toISOString(),
      photo: fileList[0]?.thumbUrl || "",
      paid: workTypeID === 1 ? values.paid : null,
      volunteer: workTypeID === 2 ? values.volunteer : null,
      worktype_id: values.WorkTypeID,
      workstatus_id: values.WorkStatusID,
      latitude: position[0],
      longitude: position[1],
    };

    const res = await CreateWork(data);

    if (res) {
      messageApi.success("สร้างงานสำเร็จ");
      setTimeout(() => navigate("/work"), 1500);
    } else {
      messageApi.error("เกิดข้อผิดพลาดในการสร้างงาน");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Sidebar */}
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

      {/* Main Content */}
      <Layout style={{ marginLeft: 250 }}>
        <Content style={{ padding: "32px", backgroundColor: "#dbe2ef" }}>
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
            <div style={{ marginBottom: 24 }}>
              <h1
                style={{
                  margin: 0,
                  padding: 0,
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "#112D4E",
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                สร้างงานใหม่
              </h1>
              <div
                style={{
                  width: 1410,
                  height: 4,
                  backgroundColor: "#434c86",
                  marginTop: 21,
                  borderRadius: 2,
                  
                }}
              />
            </div>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Row gutter={24}>
                {/* Form Area */}
                <Col xs={24} md={14}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item name="title" label="หัวข้องาน" rules={[{ required: true, message: "กรุณากรอกหัวข้องาน" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="WorkStatusID" label="สถานะงาน" rules={[{ required: true, message: "กรุณากรอกสถานะงาน" }]}>
                        <Select placeholder="เลือกสถานะ">
                          <Option value={1}>เปิดรับสมัคร</Option>
                          <Option value={2}>ปิดรับสมัคร</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="workcount" label="จำนวนคนที่ต้องการ" rules={[{ required: true, message: "กรุณากรอกจำนวนคน" }]}>
                        <InputNumber min={1} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="place" label="สถานที่จัดงาน" rules={[{ required: true, message: "กรุณากรอกสถานที่จัดงาน" }]}>
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item name="WorkTypeID" label="ประเภทงาน" rules={[{ required: true, message: "กรุณากรอกประเภทงาน" }]}>
                        <Select onChange={(value) => setWorkTypeID(value)}>
                          <Option value={1}>มีค่าตอบแทน</Option>
                          <Option value={2}>จิตอาสา</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    {workTypeID === 1 && (
                      <Col span={12}>
                        <Form.Item name="paid" label="ค่าตอบแทน (บาท)" rules={[{ required: true, message: "กรุณากรอกค่าตอบแทน" }]}>
                          <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                    )}
                    {workTypeID === 2 && (
                      <Col span={12}>
                        <Form.Item name="volunteer" label="จำนวนชั่วโมงจิตอาสา" rules={[{ required: true, message: "กรุณากรอกชั่วโมงจิตอาสา" }]}>
                          <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                    )}
                    <Col span={24}>
                      <Form.Item name="worktime" label="วันและเวลาทำงาน" rules={[{ required: true, message: "กรุณากรอกวันและเวลางาน" }]}>
                        <DatePicker
                          showTime
                          style={{ width: "100%" }}
                          disabledDate={(current) => current && current < dayjs().startOf("day")}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={20}>
                      <Form.Item name="description" label="รายละเอียดงาน" rules={[{ required: true, message: "กรุณากรอกรายละเอียดงาน" }]}>
                        <Input.TextArea rows={4} />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        name="photo"
                        label="รูปภาพ"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                        rules={[{ required: true, message: "กรุณาอัปโหลดรูป" }]}
                      >
                        <ImgCrop rotationSlider>
                          <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            onPreview={onPreview}
                            beforeUpload={() => false}
                            maxCount={1}
                          >
                            {fileList.length < 1 && (
                              <div>
                                <FileImageOutlined style={{ fontSize: "34px", color: "#3F72AF" }} />
                                <div style={{ marginTop: 8, color: "#3F72AF" }}>อัปโหลด</div>
                              </div>
                            )}
                          </Upload>
                        </ImgCrop>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                {/* Map Area */}
                <Col xs={24} md={10}>
                  <div style={{ marginBottom: 8, fontWeight: 600 }}>เลือกพิกัดจากแผนที่</div>
                  <MapContainer
                    center={defaultPosition}
                    zoom={15}
                    style={{ height: "430px", width: "100%", borderRadius: 8 }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position} />
                    <LocationPicker onSelect={(lat, lng) => setPosition([lat, lng])} />
                  </MapContainer>

                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={12}>
                      <Form.Item label="ละติจูด">
                        <Input value={position[0]} readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="ลองจิจูด">
                        <Input value={position[1]} readOnly />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                {/* Buttons */}
                <Col span={24} style={{ display: "flex", justifyContent: "flex-end", marginTop: 32, gap: 10 }}>
                  <Link to="/work">
                    <Button>ยกเลิก</Button>
                  </Link>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    style={{ backgroundColor: "#3F72AF", borderColor: "#3F72AF" }}
                  >
                    บันทึกงาน
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

export default WorkEdit;
