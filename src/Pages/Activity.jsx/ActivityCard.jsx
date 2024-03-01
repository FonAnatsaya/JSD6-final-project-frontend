import runningImage from "../../assets/activityTypePictures/running.png";
import swimmingImage from "../../assets/activityTypePictures/swimming.png";
import yogaImage from "../../assets/activityTypePictures/yoga.png";
import boxingImage from "../../assets/activityTypePictures/boxing.png";
import bodyWeightImage from "../../assets/activityTypePictures/weightTraining.png";
import { Button, Modal } from "antd";
import {
  FieldTimeOutlined,
  EditOutlined,
  UserOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useRef, useState, useEffect } from "react";

const activityImage = {
  running: runningImage,
  swimming: swimmingImage,
  yoga: yogaImage,
  boxing: boxingImage,
  "body weight": bodyWeightImage,
};

function ActivityCard({
  eachCardItem,
  deleteItem,
  setFormDisplay,
  updateItem,
}) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const timer = useRef();
  useEffect(() => {
    if (isRunning) {
      timer.current = setInterval(() => setTime((time) => time + 1), 1000);
    }
    return () => clearInterval(timer.current);
  }, [isRunning]);

  const getHours = (time) => Math.floor((time / 60 / 60) % 24);
  const getMinutes = (time) => Math.floor((time / 60) % 60);
  const getSeconds = (time) => Math.floor(time % 60);

  const formatTime = (time) => {
    const hours = getHours(time) < 10 ? "0" + getHours(time) : getHours(time);
    const minutes =
      getMinutes(time) < 10 ? "0" + getMinutes(time) : getMinutes(time);
    const seconds =
      getSeconds(time) < 10 ? "0" + getSeconds(time) : getSeconds(time);
    return hours + ":" + minutes + ":" + seconds;
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: "Are you sure to delete this activity?",
      icon: <ExclamationCircleFilled />,
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteItem(id);
      },
    });
  };

  const handleFinish = (item) => {
    const itemUpdatedTime = {
      ...item,
      actualTime: time,
    };
    setIsRunning(false);
    updateItem(itemUpdatedTime);
  };

  return (
    <div className="activityCard-card">
      <div className="activityCard-card-imageContainer">
        <img
          className="activityCard-card-image"
          src={activityImage[eachCardItem.activityType]}
        />
      </div>
      <div className="activityCard-card-content">
        <div className="activityCard-card-topContent">
          <div className="activityCard-card-topContent-left">
            Goal: {eachCardItem.hourGoal} Hours {eachCardItem.minuteGoal} Mins
          </div>
          <div className="activityCard-card-topContent-right">
            <div className="activityCard-card-topContent-right-timeCounting">
              <FieldTimeOutlined style={{ width: "16px" }} />
              {eachCardItem?.actualTime
                ? formatTime(eachCardItem.actualTime)
                : formatTime(time)}
            </div>
            <Button
              className="editButton"
              onClick={() => {
                setFormDisplay({
                  ...eachCardItem,
                });
              }}
            >
              <EditOutlined />
            </Button>
            <Button
              className="deleteButton"
              onClick={() => showDeleteConfirm(eachCardItem._id)}
            >
              <DeleteOutlined />
            </Button>
          </div>
        </div>
        <div className="activityCard-card-middleContent">
          {eachCardItem.activityType}
        </div>
        <div className="activityCard-card-lastContent">
          <div className="activityCard-card-lastContent-text">
            <div
              style={{
                border: "2px solid #45ae3a",
                borderRadius: "50%",
              }}
            >
              <UserOutlined
                style={{
                  color: "#45ae3a",
                  width: "22px",
                  height: "22px",
                }}
              />
            </div>
            {eachCardItem.description}
          </div>
          <div className="activityCard-card-lastContent-buttons">
            {!isRunning && time === 0 && !eachCardItem.actualTime && (
              <Button
                className="card-startButton card-buttons"
                type="primary"
                onClick={() => setIsRunning(true)}
              >
                START
              </Button>
            )}
            {isRunning && !eachCardItem.actualTime && (
              <Button
                className="card-finishButton card-buttons"
                type="primary"
                onClick={() => setIsRunning(false)}
              >
                Stop
              </Button>
            )}
            {!isRunning && time > 0 && !eachCardItem.actualTime && (
              <Button
                className="card-startButton card-buttons"
                type="primary"
                onClick={() => setIsRunning(true)}
              >
                RESUME
              </Button>
            )}

            {!isRunning && time > 0 && !eachCardItem.actualTime && (
              <Button
                className="card-finishButton card-buttons"
                type="primary"
                onClick={() => handleFinish(eachCardItem)}
              >
                Finish
              </Button>
            )}
            {eachCardItem.actualTime && (
              <h4>
                Total time : {getHours(eachCardItem.actualTime)} Hours{" "}
                {getMinutes(eachCardItem.actualTime)} Minutes{" "}
                {getSeconds(eachCardItem.actualTime)} Seconds
              </h4>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;
