import "./ProgressPage.css";
import Layout from "../Layout";
import ProgressChart from "./ProgressChart";
import ProgressActivityCard from "./ProgressActivityCard";
import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { Content } from "antd/es/layout/layout";

function ProgressPage() {
  const [activityItems, setActivityItems] = useState([]);
  const [queryDate, setQueryDate] = useState(dayjs(new Date()));

  // get user data from localStorage
  const userString = localStorage.getItem("user");
  const userObject = JSON.parse(userString);
  const user_id = userObject.user_id;
  const token = userObject.token;

  useEffect(() => {
    // Call the getActivityInfo function whenever queryDate changes
    if (queryDate) {
      getActivityInfo();
    }
  }, [queryDate]);

  useEffect(() => {
    getActivityInfo();
  }, []);

  const date = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toDateString();
    return <p className="activityCard-date">{formattedDate}</p>;
  };

  const getActivityInfo = () => {
    const userID_queryDate = { user_id, selectedDate: queryDate };

    axios
      .post("http://localhost:3000/activityInfoGetData", userID_queryDate, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setActivityItems((prev) => {
          return response.data
            .map((each) => ({ ...each, date: dayjs(each.date) }))
            .filter((item) => item.actualTime);
        });
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

  const onSelectedDateChange = (date) => {
    setQueryDate(date);
  };

  return (
    <Layout>
      <div className="progress">
        <div className="head">
          <h2>Progress</h2>
          {date()}
          <div style={{ marginTop: "10px" }}>
            <DatePicker
              onChange={onSelectedDateChange}
              defaultValue={dayjs(new Date())}
            />
          </div>
        </div>
        <ProgressChart queryDate={queryDate} />
        <Content style={{ height: "390px", width: "auto", overflow: "auto" }}>
          {activityItems.map((item, index) => {
            return (
              <ProgressActivityCard
                key={item._id}
                index={index}
                eachCardItem={item}
              />
            );
          })}
        </Content>
      </div>
    </Layout>
  );
}

export default ProgressPage;
