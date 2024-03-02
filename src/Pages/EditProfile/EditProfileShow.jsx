import Layout from "../Layout";
import { BulbFilled, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Space,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from "antd";
import UploadWidget from "../../components/UploadWidget";
import { Typography } from "antd";
// import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import { Flex } from "antd";
import "./EditProfile.css";
import React, { useState, useEffect } from "react";
import Img from "../../assets/profile.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfileShow = () => {
  const [publicId, setPublicId] = useState("");
  // Replace with your own cloud name
  const [cloudName] = useState("dczzv5qji");
  // Replace with your own upload preset
  const [uploadPreset] = useState("kwoevm4v");
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const userObject = JSON.parse(userString);
  const id = userObject.user_id;
  const token = userObject.token;

  const [userData, setUserData] = useState(null); // Initial user data
  const [name, setName] = useState(""); // Initial user data
  const [birthday, setBirthday] = useState(""); // Initial user data
  const [weight, setWeight] = useState(""); // Initial user data
  const [height, setHeight] = useState(""); // Initial user data
  const [loading, setLoading] = useState(false); // Flag for API request state
  const [gender, setGender] = useState("");

  const refreshPage = () => {
    window.location.reload();
  };

  const [imageUrl, setImageUrl] = useState(null);
  let image;

  const [uwConfig] = useState({
    cloudName,
    uploadPreset,
  });

  // Create a Cloudinary instance and set your cloud name.

  function onChangeDate(date, dateString) {
    setBirthday(dateString);
  }

  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const myImage = cld.image(publicId);
  useEffect(() => {
    const url = `http://localhost:3000/users/${id}`;

    axios
      .get(url)
      .then((response) => {
        setUserData(response.data.user);
        setName(userData.username);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []); // No dependency array to run only once

  const onSubmit = async (values) => {
    // console.log("test");
    try {
      setLoading(true); // Signal loading state

      // Prepare updated user data based on form values
      const updatedUserData = {
        id: id,
        username: name,
        birthday: birthday,
        weight: weight,
        height: height,
        gender: gender,
        // Build the object with relevant fields and values from the form
      };

      const response = await axios
        .put("http://localhost:3000/users/update", updatedUserData)
        .then((response) => {
          if (response.status === 200) {
            message.success("Profile updated successfully!");
            navigate("/profile");
          } else {
            throw new Error("Error updating user data");
          }
        });

      // Handle successful update (e.g., redirect to profile page)
    } catch (error) {
      console.error("Error updating user data:", error);
      message.error("An error occurred while updating your profile.");
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  // useEffect(() => {

  // }, [userData])

  if (!userData) {
    return <p>Loading user data...</p>;
  }

  return (
    <>
      <div className="card">
        <h2 className="mt">Edit Profile</h2>
        <div className="wrapper-edit" style={{ marginLeft: 120 }}>
          <Avatar
            shape="square"
            size={100}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #D9D9D9",
              padding: 6,
            }}
          >
            <img
              src={userData.avatar}
              alt="Profile"
              style={{
                // marginTop: ,
                width: "100%",
                height: "100%",
                objectFit: "center",
                // borderRadius: "100%", // Add if needed
              }}
            />
          </Avatar>
          <div className="box">
            <h5 style={{ marginLeft: 50 }}>Profile picture</h5>
            <UploadWidget refreshPage={refreshPage} />
            <Button
              onClick={() => refreshPage()}
              type="dashed"
              className="btn-image"
            >
              Clear Cache
            </Button>
          </div>
        </div>

        <Form onFinish={onSubmit} loading={loading}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: false, message: "Please input your name!" }]}
            // Use state variable here
            onChange={(e) => setName(e.target.value)} // Update state on change
            style={{
              marginTop: 30,
            }}
          >
            <Input defaultValue={userData.username} />
          </Form.Item>

          <Form.Item label="Birthday">
            <DatePicker onChange={onChangeDate} />
          </Form.Item>
          {/* defaultValue={userData.birthday}/> */}
          <Form.Item
            label="Gender"
            name="Gender"
            rules={[
              {
                required: false,
                message: "Please select your Gender!",
              },
            ]}
            onChange={(e) => setGender(e.target.value)}
          >
            <Select
              placeholder="Select your gender"
              defaultValue={userData.gender}
            >
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Weight"
            name="Weight"
            rules={[
              {
                // required: true,
                message: "Please input your Weight!",
              },
            ]}
            onChange={(e) => setWeight(e.target.value)}
          >
            <Input suffix="kg" defaultValue={userData.weight} />
          </Form.Item>

          <Form.Item
            label="Height"
            name="Height"
            rules={[
              {
                // required: true,
                message: "Please input your Height!",
              },
            ]}
            onChange={(e) => setHeight(e.target.value)}
          >
            <Input suffix="cm" defaultValue={userData.height} />
          </Form.Item>
          <div className="button-save">
            <Button
              href="/profile"
              style={{
                width: "300px",
                height: "32px",
                fontSize: "16px",
                marginRight: "24px",
              }}
            >
              Cancel
            </Button>
            <Button
              htmlType="submit"
              type="submit"
              style={{
                width: "300px",
                height: "32px",
                fontSize: "16px",
                backgroundColor: "#D9D9D9",
                color: "#000000",
              }}
            >
              Confirm
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default EditProfileShow;
