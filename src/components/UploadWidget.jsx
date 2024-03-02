import { useEffect, useRef, useState } from "react";
import { Button, Form, Input, DatePicker, Select } from "antd";
import axios from "axios";

const UploadWidget = () => {
  const cloudinaryRef = useRef();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null); // Initial user data
  const userString = localStorage.getItem("user");
  const userObject = JSON.parse(userString);
  const id = userObject.user_id;
  const token = userObject.token;

  const widgetRef = useRef();
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dczzv5qji",
        uploadPress: "l1wqi4zx", // Double-check the actual preset name
        upload_preset: "l1wqi4zx", // Replace with your preset name
      },
      function (error, result) {
        if (result.event == "success") {
          // () => setImage(result.info.secure_url);
          onSubmit(result.info.secure_url);
        }
      }
    );
  }, []);

  const onSubmit = async (values) => {
    console.log(values);
    try {
      setLoading(true); // Signal loading state

      // Prepare updated user data based on form values
      const updatedUserData = {
        id,
        avatar: values,
        // Build the object with relevant fields and values from the form
      };

      const response = await axios.put(
        "http://localhost:3000/users/update",
        updatedUserData
      );

      message.success("Profile updated successfully!");
      // Handle successful update (e.g., redirect to profile page)
    } catch (error) {
      console.error("Error updating user data:", error);
      message.error("An error occurred while updating your profile.");
    } finally {
      setLoading(false); // Clear loading state
    }
    refreshPage(values);
  };
  return (
    <Button
      onClick={() => widgetRef.current.open()}
      type="dashed"
      className="btn-image"
    >
      Upload
    </Button>
  );
};

export default UploadWidget;
