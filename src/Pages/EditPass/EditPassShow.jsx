import "./EditPass.css";
import { Button, Form, Input, DatePicker } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";

const EditPassShow = () => {
  const [componentSize, setComponentSize] = useState("default");
  const [newPassword, setNewPassword] = useState("");
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const userString = localStorage.getItem("user");
  const userObject = JSON.parse(userString);
  const id = userObject.user_id;
  const token = userObject.token;

  const onSubmit = async (values) => {
    // console.log("test");
    try {
      setLoading(true);

      const updatedUserData = {
        id: id,
        password: newPassword,
      };

      const response = await axios.put(
        "http://localhost:3000/users/editpassword",
        updatedUserData
      );

      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      message.error("An error occurred while updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const url = `http://localhost:3000/users/${id}`;
    axios
      .get(url)
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
        <h2 style={{ marginBottom: 40 }}>Edit Password</h2>
        <Form Form onFinish={onSubmit} loading={loading}>
          <Form.Item
            label="Old Password"
            name="oldpassword"
            rules={[
              {
                required: true,
                message: "Please input your old password!",
              },
            ]}
            onChange={(e) => setOldPassword(e.target.value)}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newpassword"
            rules={[
              {
                required: true,
                message: "Please input your New Password!",
              },
            ]}
            onChange={(e) => setNewPassword(e.target.value)}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmpassword"
            rules={[
              {
                required: true,
                message: "Please confirm your New Password!",
                validator: (_, value) => {
                  if (!newPassword || newPassword !== value) {
                    return Promise.reject("Passwords do not match!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
            onChange={(e) => setNewPassword(e.target.value)}
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

export default EditPassShow;
