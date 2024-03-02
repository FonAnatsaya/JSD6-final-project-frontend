import "./activityCardStyle.css";
import "./activityFormStyle.css";
import "./activityHeader.css";
import Layout from "../Layout";
import ActivityCard from "./ActivityCard";
import ActivityForm from "./ActivityForm";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import ActivityHeader from "./ActivityHeader";
import { Flex } from "antd";
import { Content } from "antd/es/layout/layout";

function ActivityList() {
  const [activityItems, setActivityItems] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formDisplay, setFormDisplay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));

  const userString = localStorage.getItem("user");
  const userObject = JSON.parse(userString);
  const user_id = userObject.user_id;
  const token = userObject.token;

  useEffect(() => {
    getActivityInfo();
  }, []);

  useEffect(() => {
    if (formDisplay) {
      setIsFormOpen(true);
    }
  }, [formDisplay]);

  useEffect(() => {
    if (selectedDate) {
      getActivityInfo();
    }
  }, [selectedDate]);

  const getActivityInfo = () => {
    const userID_selectedDate = { user_id, selectedDate };
    axios
      .post("http://localhost:3000/activityInfoGetData", userID_selectedDate, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // console.log(response.data);
        setActivityItems((prev) => {
          return response.data.map((each) => {
            return { ...each, date: dayjs(each.date) };
          });
        });
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

  const createItem = (item) => {
    // console.log(item);
    const newActivity = { ...item, user_id };
    // console.log(newActivity.date);
    axios
      .post("http://localhost:3000/activityInfo", newActivity, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 201) {
          getActivityInfo();
        }
      })
      .catch((error) => {
        console.error("Failed to add data", error);
      });
  };

  const deleteItem = (id) => {
    axios
      .delete(`http://localhost:3000/activityInfo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          getActivityInfo();
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
    axios
      .put("http://localhost:3000/activityInfo", item, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          getActivityInfo();
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
      <Flex vertical style={{ padding: "96px 128px 0px 128px" }}>
        <ActivityHeader
          setFormDisplay={setFormDisplay}
          setSelectedDate={setSelectedDate}
        />
        <Content style={{ height: "100vh", overflow: "auto" }}>
          {activityItems.map((item) => {
            return (
              <ActivityCard
                key={item._id}
                eachCardItem={item}
                deleteItem={deleteItem}
                setFormDisplay={setFormDisplay}
                updateItem={updateItem}
              />
            );
          })}
        </Content>
        <ActivityForm
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          createItem={createItem}
          updateItem={updateItem}
          formDisplay={formDisplay}
          setFormDisplay={setFormDisplay}
        />
      </Flex>
    </Layout>
  );
}

export default ActivityList;
