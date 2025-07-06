import { Col, Row, Card, Input, Select } from "antd";
import "./home.css";

import Navbar from "../../components/Navbar/Navbar"; // ✅ เพิ่มตรงนี้

import bannerImage from "../../assets/banner.png";
import photoasa from "../../assets/asa.jpg";
import photoint from "../../assets/int.jpg";
import photopart from "../../assets/part.jpg";

const { Search } = Input;
const { Option } = Select;

export default function Dashboard() {
  const bannerHeight = 300;

  return (
    <>
      <Navbar /> {/* ✅ แสดง Navbar ด้านบนสุด */}
      
      <Row gutter={[16, 16]}>
        {/* --- Banner ที่มี Search --- */}
        <Col xs={24}>
          <div style={{ position: "relative", height: bannerHeight }}>
            <Card
              bordered={false}
              style={{
                marginBottom: 16,
                padding: 0,
                boxShadow: "rgba(17, 45, 78, 0.2) 0px 7px 29px 0px",
                overflow: "hidden",
                height: "100%",
                backgroundColor: "#F9F7F7",
              }}
              bodyStyle={{ padding: 0, height: "100%" }}
            >
              <img
                src={bannerImage}
                alt="Dashboard Banner"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </Card>

            {/* กล่องค้นหาใน Banner */}
            <div className="banner-search-container">
              <Search
                placeholder="ค้นหางานที่คุณสนใจ..."
                enterButton="ค้นหา"
                size="large"
                onSearch={(value) => console.log("Search:", value)}
                style={{ flex: 2, minWidth: 200 }}
              />
              <Select
                size="large"
                defaultValue=""
                style={{ flex: 1, minWidth: 200 }}
                onChange={(value) => console.log("ประเภทงาน:", value)}
              >
                <Option value="">ทุกประเภท</Option>
                <Option value="volunteer">งานจิตอาสา</Option>
                <Option value="recommended">งานแนะนำ</Option>
                <Option value="parttime">งานพาร์ทไทม์</Option>
              </Select>
            </div>
          </div>
        </Col>

        {/* --- หมวดหมู่งาน --- */}
        <Col xs={24} style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} className="job-card">
                <h3 className="category-title">งานจิตอาสา</h3>
                <img src={photoasa} alt="งานจิตอาสา" className="category-image" />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} className="job-card">
                <h3 className="category-title">งานแนะนำ</h3>
                <img src={photoint} alt="งานแนะนำ" className="category-image" />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} className="job-card">
                <h3 className="category-title">งานพาร์ทไทม์</h3>
                <img src={photopart} alt="งานพาร์ทไทม์" className="category-image" />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
