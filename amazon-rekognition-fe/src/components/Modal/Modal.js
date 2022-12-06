import { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

import "../Modal/Modal.scss";
import Result from "../Result/Result";
function Modal({ data, onClick }) {
  const [result, setResult] = useState([]);
  const [bounding, setBounding] = useState([]);
  const [keys, setKeys] = useState([]);

  //Camera
  const webcamRef = useRef();
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const uploadAndDetect = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then((res) => res.blob());
    const fileForm = new FormData();
    fileForm.append("image", blob);
    await axios
      .post(`http://localhost:4000/api/upload`, fileForm)
      .then((res) => {
        console.log("success");
        console.log("res.data.image: ", res.data.image);
        detectHandler1(res.data.image);
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  const detectHandler1 = async (imgName) => {
    await axios
      .post(`http://localhost:4000/api/${data.api}`, {
        name: imgName,
      })
      .then((res) => {
        const arr = data.result(res);
        setResult(arr);
        setKeys(Object.keys(arr[0]) || []);
        setBounding(data.boundingBox(arr));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const detectHandler = () => {
    uploadAndDetect();
  };
  const renderBounding = () => {
    var image = document.getElementById("image");

    return bounding.map((item, index) => {
      console.log(image.height);
      return (
        <div
          key={index}
          style={{
            height: `${item.Height * videoConstraints.height}px`,
            width: `${item.Width * videoConstraints.width}px`,
            top: `${item.Top * videoConstraints.height}px`,
            left: `${item.Left * videoConstraints.width}px`,
            border: "3px solid rgba(255, 255, 255, 0.69)",
            borderRadius: "3%",
            position: "absolute",
          }}
        ></div>
      );
    });
  };

  return (
    <div className="modal-wrapper">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-header-title">{data.title}</h2>
        </div>
        <div className="modal-body">
          <p className="modal-body-description">{data.description}</p>
          <div className="modal-body-content">
            <div className="modal-body-content-req">
              <div className="modal-body-content-req-img">
                {/* <h3 className="modal-body-content-req-header">
                  Chọn 1 bức hình
                </h3>
                <div className="modal-body-content-req-img-upload">
                  <input
                    style={{ display: "none" }}
                    id="file"
                    className="modal-body-content-req-img-upload-fromFile"
                    type="file"
                    onChange={(e) => handleImageChange(e)}
                  />
                  <label htmlFor="file">
                    <img src={addImage} alt="addImage" />
                    <span>Add an Image</span>
                  </label>
                  <button
                    onClick={onFileUpload}
                    className="modal-body-content-req-img-upload-toS3"
                  >
                    Up to S3
                  </button>
                </div> */}

                <div className="modal-body-content-req-img-wrapper">
                  <div className="modal-body-content-req-img-wrapper-preview">
                    {/* <img
                      className="modal-body-content-req-img-wrapper-preview-img"
                      id="image"
                      src={preview ? preview : imgDefault}
                      alt="preview"
                    /> */}

                    {/* CAMERA */}
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      minScreenshotWidth={300}
                      minScreenshotHeight={300}
                      id="image"
                    ></Webcam>
                    {renderBounding()}
                  </div>
                </div>
              </div>
              <button
                className="modal-body-content-req-btn"
                onClick={detectHandler}
              >
                {data.title}
              </button>
            </div>
            <hr />
            <div className="modal-body-content-res">
              <Result data={result} keys={keys} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClick} className="modal-footer-button">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
