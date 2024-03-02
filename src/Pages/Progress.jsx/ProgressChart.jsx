import "./ProgressChart.css";
import ProgressBarChartJs from "./ProgressBarChartJs";
import ProgressDonutChartJs from "./ProgressDonutChartJs";
import { useEffect, useState } from "react";
import axios from "axios";

function ProgressChart({ queryDate }) {
  const [activitysListbyTypes, setActivitysListbyTypes] = useState([]);
  const [activitysListbyDate, setActivitysListbyDate] = useState([]);

  // get user data from localStorage
  const userString = localStorage.getItem("user");
  const userObject = JSON.parse(userString);
  const user_id = userObject.user_id;
  const token = userObject.token;
  const userID_queryDate = { user_id, selectedDate: queryDate };

  useEffect(() => {
    const getDataTypes = async () => {
      const response = await axios.post(
        "http://localhost:3000/activityInfoChartDonut",
        userID_queryDate,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setActivitysListbyTypes(response.data.data);
    };

    const getDataDate = async () => {
      const response = await axios.post(
        "http://localhost:3000/activityInfoChartBar",
        userID_queryDate,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setActivitysListbyDate(response.data.data);
    };

    getDataTypes();
    getDataDate();
  }, [queryDate]);
  // test
  // console.log("date", activitysListbyDate);
  // console.log("types", activitysListbyTypes);

  return (
    <div className="chart">
      <ProgressBarChartJs activitysListbyDate={activitysListbyDate} />
      <ProgressDonutChartJs activitysListbyTypes={activitysListbyTypes} />
    </div>
  );
}

export default ProgressChart;
