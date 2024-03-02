import Layout from "../Layout.jsx";
import "./TutorialCSS.css";
import Accordian from "../Tutorial/Accordioncard.jsx";
import Addvideo from "../Tutorial/Addvideo.jsx";
import axios from "axios";
import React, { useEffect, useState } from "react";

function TutorialPage() {
  const [accordionItems, setAccordionItems] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formDisplay, setFormDisplay] = useState(null);

  const userString = localStorage.getItem("user");
  const userObject = JSON.parse(userString);
  const user_id = userObject.user_id;
  const token = userObject.token;

  // useEffect(() => {
  //   if (items) {
  //     setAccordionItems([
  //       ...items.map(item => ({
  //         ...item,
  //         toggled: false
  //       }))
  //     ])
  //   }
  // }, [items])

  useEffect(() => {
    getVideoInfo();
  }, []);

  useEffect(() => {
    // console.log(formDisplay);
    if (formDisplay) {
      setIsFormOpen(true);
    }
  }, [formDisplay]);

  const getVideoInfo = () => {
    axios
      .post(
        "http://localhost:3000/tutorialsGetData",
        { user_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setAccordionItems(response.data);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

  const createItem = (item) => {
    // console.log(item);
    const swapUrl = item.video.replace("watch?v=", "embed/");
    const newVideo = { ...item, user_id, video: swapUrl };
    axios
      .post("http://localhost:3000/tutorialsCreateData", newVideo, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 201) {
          // console.log(response.data);
          getVideoInfo();
        }
      })
      .catch((error) => {
        console.error("Failed to add data", error);
      });
  };

  const deleteItem = (id) => {
    axios
      .delete(`http://localhost:3000/tutorialsDeleteData/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          getVideoInfo();
        } else {
          // console.log(`Response from API : ${response.json}`);
        }
      })
      .catch((error) => {
        console.error("Failed to delete", error);
      });
  };

  const updateItem = (item) => {
    // console.log(item);
    const swapUrl = item.video.replace("watch?v=", "embed/");
    const newVideo = { ...item, video: swapUrl };
    axios
      .put("http://localhost:3000/tutorialsUpdateData", newVideo, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          getVideoInfo();
        } else {
          console.error("Failed to update");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Layout>
      <Accordian
        keepOthersOpen={false}
        accordionItems={accordionItems}
        setAccordionItems={setAccordionItems}
        deleteItem={deleteItem}
        setFormDisplay={setFormDisplay}
      />
      <Addvideo
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        createItem={createItem}
        updateItem={updateItem}
        formDisplay={formDisplay}
        setFormDisplay={setFormDisplay}
      />
    </Layout>
  );
}
export default TutorialPage;
