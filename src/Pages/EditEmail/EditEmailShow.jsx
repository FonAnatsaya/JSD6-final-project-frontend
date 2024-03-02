import "./EditEmail.css";
import { Button, Form, Input, message } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditEmailShow = () => {
  const navigate = useNavigate();
  const [componentSize, setComponentSize] = useState("default");
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const userString = localStorage.getItem("user");
  const userObject = JSON.parse(userString);
  const id = userObject.user_id;
  const token = userObject.token;
  useEffect(() => {
    const url = `http://localhost:3000/users/${id}`;
    axios
      .get(url)
      .then((response) => {
        // console.log(response.data);
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
      setLoading(true);

      const updatedUserData = {
        id: id,
        email: email,
      };

      const response = await axios
        .put("http://localhost:3000/users/editemail", updatedUserData)
        .then((response) => {
          if (response.status === 200) {
            message.success("Profile updated successfully!");
            navigate("/profile");
          } else {
            throw new Error("Error updating user data");
          }
        });
    } catch (error) {
      console.error("Error updating user data:", error);
      message.error("An error occurred while updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return <p>Loading user data...</p>;
  }

  return (
    <>
      <div className="card">
        <h2 style={{ marginBottom: 40 }}>Edit Email</h2>
        <Form Form onFinish={onSubmit} loading={loading}>
          <Form.Item
            label="Old Email"
            name="oldemail"
            rules={[
              {
                required: true,
                message: "Please input your Old Email!",
              },
            ]}
            onChange={(e) => setOldEmail(e.target.value)}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="New Email"
            name="newemail"
            rules={[
              {
                required: true,
                message: "Please input your New Email!",
              },
            ]}
            onChange={(e) => setEmail(e.target.value)}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Confirm New Email"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your New Email!",
              },
            ]}
            onChange={(e) => setConfirmEmail(e.target.value)}
          >
            <Input />
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

export default EditEmailShow;
