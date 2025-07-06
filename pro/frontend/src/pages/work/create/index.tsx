import {
  Button,
  Col,
  Row,
  Divider,
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

const defaultPosition: [number, number] = [14.883451, 102.010589];

const LocationPicker = ({ onSelect }: { onSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const WorkCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<any[]>([]);
  const [workTypeID, setWorkTypeID] = useState<number>(0);
  const [position, setPosition] = useState<[number, number]>(defaultPosition);

  const onChange = ({ fileList: newFileList }: { fileList: any[] }) => {
    setFileList(newFileList);
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
      photo: fileList.length > 0 ? fileList[0].thumbUrl : "",
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
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar แบบติดจอ */}
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

      {/* เนื้อหาหลักเลื่อนอิสระ */}
      <Layout style={{ marginLeft: 250 }}>
        <Content
          style={{
            height: "100vh",
            overflowY: "auto",
            padding: "24px",
            backgroundColor: "#f5f5f5",
          }}
        >
          {contextHolder}
          <Card>
            <h2 style={{ textAlign: "center", fontSize: 24, fontWeight: "bold" }}>สร้างงานใหม่</h2>
            <Divider />
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item name="photo" label="รูปภาพประกอบ">
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
                            <FileImageOutlined style={{ fontSize: "34px" }} />
                            <div style={{ marginTop: 8 }}>อัพโหลด</div>
                          </div>
                        )}
                      </Upload>
                    </ImgCrop>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item name="description" label="รายละเอียดงาน" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item name="title" label="หัวข้องาน" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="workcount" label="จำนวนคนที่ต้องการ" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="worktime" label="วันและเวลาทำงาน" rules={[{ required: true }]}>
                    <DatePicker
                      showTime
                      style={{ width: "100%" }}
                      disabledDate={(current) => current && current < dayjs().startOf("day")}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item name="WorkStatusID" label="สถานะงาน" rules={[{ required: true }]}>
                    <Select placeholder="เลือกสถานะ">
                      <Select.Option value={1}>เปิดรับสมัคร</Select.Option>
                      <Select.Option value={2}>ปิดรับสมัคร</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="WorkTypeID" label="ประเภทงาน" rules={[{ required: true }]}>
                    <Select placeholder="เลือกประเภทงาน" onChange={(value) => setWorkTypeID(value)}>
                      <Select.Option value={1}>มีค่าตอบแทน</Select.Option>
                      <Select.Option value={2}>จิตอาสา</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                {workTypeID === 1 && (
                  <Col xs={24} sm={8}>
                    <Form.Item name="paid" label="ค่าตอบแทน (บาท)" rules={[{ required: true }]}>
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                )}
                {workTypeID === 2 && (
                  <Col xs={24} sm={8}>
                    <Form.Item name="volunteer" label="จำนวนชั่วโมงจิตอาสา" rules={[{ required: true }]}>
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                )}

                <Col xs={24} sm={8}>
                  <Form.Item name="place" label="สถานที่จัดงาน" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item label="ละติจูด">
                    <Input value={position[0]} readOnly />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item label="ลองจิจูด">
                    <Input value={position[1]} readOnly />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="เลือกพิกัดจากแผนที่">
                    <MapContainer center={defaultPosition} zoom={13} style={{ height: "250px", width: "50%" }}>
                      <TileLayer
                        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={position} />
                      <LocationPicker onSelect={(lat, lng) => setPosition([lat, lng])} />
                    </MapContainer>
                  </Form.Item>
                </Col>

                <Col xs={24} style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <Link to="/work">
                    <Button>ยกเลิก</Button>
                  </Link>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    style={{ backgroundColor: "#9333EA", borderColor: "#9333EA" }}
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

export default WorkCreate;
