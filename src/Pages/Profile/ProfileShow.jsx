import Layout from "../Layout";
import {
  BulbFilled,
  UserOutlined,
  MailOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { Avatar, Space } from "antd";
import { Typography } from "antd";
import { Button, Flex } from "antd";
import Img from "../../assets/profile.jpg";
import ProfileBanner from "../../assets/background-profile.png";
import "./Profile.css";
import axios from "axios";
import { useEffect, useState } from "react";

const ProfileShow = () => {
  const { Title, Text, Link } = Typography;
  const [userData, setUserData] = useState(null);

  const userString = localStorage.getItem("user");
  const userObject = JSON.parse(userString);
  const id = userObject.user_id;
  const token = userObject.token;

  useEffect(() => {
    axios
      .get(`http://localhost:3000/users/${id}`)
      .then((response) => {
        setUserData(response.data.user);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  if (!userData) {
    return <p>Loading user data...</p>;
  }

  return (
    <>
      <div className="card">
        {/* <img src={ProfileBanner} alt="" /> */}
        <div className="wrapper-card" style={{ position: "relative" }}>
          <Avatar
            size={130}
            style={{
              marginTop: 170,
              marginLeft: 60,
              backgroundColor: "#ffffff",
              position: "absolute",
            }}
          >
            <img
              src={userData.avatar}
              alt="Profile"
              style={{
                marginTop: 8,
                width: "100%",
                height: "100%",
                objectFit: "center",
                borderRadius: "100%",
              }}
            />
          </Avatar>
          <div
            className="di"
            style={{ marginTop: 105, marginLeft: 180, position: "absolute" }}
          >
            <Title style={{ fontSize: "30px", marginTop: 120, marginLeft: 35 }}>
              {userData.username}
            </Title>
            <Text type="secondary" style={{ marginLeft: 35 }}>
              {userData.email}
            </Text>
          </div>
          {/* <div className="button-show" style={{ marginTop: 60, marginLeft: 220, position: "absolute" }}> */}
          <div type="primary" className="btn-show">
            &#8203;
          </div>
          <Button
            type="primary"
            className="btn-show"
            style={{
              // marginTop: 150,
              marginTop: 240,
              marginLeft: 516,
              backgroundColor: "#117e27",
              position: "absolute",
            }}
          >
            Weight: {userData.weight} kg
          </Button>
          <Button
            type="primary"
            className="btn-show"
            style={{
              marginTop: 240,
              marginLeft: 656,
              backgroundColor: "#117e27",
              position: "absolute",
            }}
          >
            Height: {userData.height} cm
          </Button>
          <Button
            type="primary"
            className="btn-show"
            style={{
              marginLeft: 814,
              backgroundColor: "#117e27",
              marginTop: 240,
              position: "absolute",
            }}
          >
            BMI :{" "}
            {Math.floor(
              (userData.weight / (userData.height * userData.height)) *
                10000 *
                100
            ) / 100}
          </Button>
          <div></div>
          {/* </div> */}
        </div>
        <div
          className="dashboard"
          style={{ marginTop: 70, marginLeft: 100, position: "absolute" }}
        >
          <Title style={{ marginTop: 35, marginBottom: 32, fontSize: "28px" }}>
            Dashboard
          </Title>
          <div className="menu" style={{ marginTop: 5 }}>
            <Link
              href="/editProfile"
              style={{ color: "#000", fontSize: "18px", marginBottom: "32px" }}
            >
              <UserOutlined style={{ color: "#117e27" }} /> Edit Profile
            </Link>
            <Link
              href="/editPassword"
              style={{ color: "#000", fontSize: "18px", marginBottom: "32px" }}
            >
              <KeyOutlined style={{ color: "#117e27" }} /> Edit Password
            </Link>
            <Link
              href="/editEmail"
              style={{ color: "#000", fontSize: "18px", marginBottom: "32px" }}
            >
              <MailOutlined style={{ color: "#117e27" }} /> Edit Email
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileShow;
