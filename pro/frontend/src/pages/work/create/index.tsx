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
} from "antd";
import { useState } from "react";
import { PlusOutlined, FileImageOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import { WorkInterface } from "../../../interfaces/IWork";
import { CreateWork } from "../../../services/https/index";
import dayjs from "dayjs";

const WorkCreate = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<any[]>([]);
  const [workTypeID, setWorkTypeID] = useState<number>(0);

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
    };

    const res = await CreateWork(data);

    if (res) {
      messageApi.success("สร้างงานสำเร็จ");
      setTimeout(() => {
        navigate("/work");
      }, 1500);
    } else {
      messageApi.error("เกิดข้อผิดพลาดในการสร้างงาน");
    }

  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        backgroundColor: "rgba(233, 213, 255, 0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {contextHolder}
      <Card
        style={{
          width: "100%",
          maxWidth: "1200px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h2 style={{ color: "#6B21A8", fontSize: "28px", fontWeight: "bold", marginTop: 0 }}>
          สร้างงานใหม่
        </h2>
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item name="title" label="หัวข้องาน" rules={[{ required: true }]}>
                <Input placeholder="เช่น เก็บขยะชายหาด" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="place" label="สถานที่จัดงาน" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="latitude" label="ละติจูด" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="longitude" label="ลองจิจูด" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="workcount" label="จำนวนคนที่ต้องการ" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="worktime" label="วันและเวลาทำงาน" rules={[{ required: true }]}>
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  disabledDate={(current) => current && current < dayjs().startOf("day")}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="description" label="รายละเอียดงาน" rules={[{ required: true }]}>
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="WorkStatusID" label="สถานะงาน" rules={[{ required: true }]}>
                <Select placeholder="เลือกสถานะ">
                  <Select.Option value={1}>เปิดรับสมัคร</Select.Option>
                  <Select.Option value={2}>ปิดรับสมัคร</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="WorkTypeID" label="ประเภทงาน" rules={[{ required: true }]}>
                <Select placeholder="เลือกประเภทงาน" onChange={(value) => setWorkTypeID(value)}>
                  <Select.Option value={1}>มีค่าตอบแทน</Select.Option>
                  <Select.Option value={2}>จิตอาสา</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {workTypeID === 1 && (
              <Col xs={24} sm={12}>
                <Form.Item name="paid" label="ค่าตอบแทน (บาท)" rules={[{ required: true }]}>
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            )}
            {workTypeID === 2 && (
              <Col xs={24} sm={12}>
                <Form.Item name="volunteer" label="จำนวนชั่วโมงจิตอาสา" rules={[{ required: true }]}>
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            )}
            <Col xs={24}>
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
    </div>
  );
};

export default WorkCreate;
