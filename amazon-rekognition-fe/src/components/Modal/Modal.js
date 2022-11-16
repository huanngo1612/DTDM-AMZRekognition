import { useState } from "react";
import axios from "axios";
import imgDefault from "../../assets/images/img_default.png";
import addImage from "../../assets/images/addImage.png";
import "../Modal/Modal.scss";
import Result from "../Result/Result";
function Modal({ data, onClick }) {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [preview, setPreview] = useState(null);
  const [image2, setImage2] = useState(null);
  const [imageName2, setImageName2] = useState(null);
  const [preview2, setPreview2] = useState(null);

  const [isDetect, setIsDetect] = useState(false);
  const [result, setResult] = useState([]);
  const [bounding, setBounding] = useState([]);
  const [bounding2, setBounding2] = useState([]);
  const [keys, setKeys] = useState([]);

  const handleImageChange = (e) => {
    console.log(e.target.files);
    let reader = new FileReader();
    let file = e.target.files[0];
    if (!file) {
      return;
    }

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(file);
      setPreview(reader.result);
      setIsDetect(false);
      setKeys([]);
    };
  };
  const handleImage2Change = (e) => {
    console.log(e.target.files);
    let reader = new FileReader();
    let file = e.target.files[0];
    if (!file) {
      return;
    }

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage2(file);
      setPreview2(reader.result);
      setIsDetect(false);
      setKeys([]);
    };
  };

  const onFileUpload = async () => {
    if (!image) {
      alert("Chưa có hình ảnh");
      return;
    }
    const fileForm = new FormData();
    fileForm.append("image", image);

    await axios
      .post(`http://localhost:4000/api/upload`, fileForm)
      .then((res) => {
        console.log("success");
        console.log("res.data.image: ", res.data.image);
        setImageName(res.data.image);
        if ((data.id === 5 && imageName2) || data.id !== 5) {
          setIsDetect(true);
        } else {
          setIsDetect(false);
        }
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };
  const onFileUpload2 = async () => {
    if (!image2) {
      alert("Chưa có hình ảnh");
      return;
    }
    const fileForm = new FormData();
    fileForm.append("image", image2);

    await axios
      .post(`http://localhost:4000/api/upload`, fileForm)
      .then((res) => {
        console.log("success");
        console.log("res.data.image: ", res.data.image);
        setImageName2(res.data.image);
        if (data.id === 5 && imageName) {
          setIsDetect(true);
        } else {
          setIsDetect(false);
        }
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  const detectHandler = async () => {
    await axios
      .post(`http://localhost:4000/api/${data.api}`, {
        name: imageName,
        name2: imageName2,
      })
      .then((res) => {
        const arr = data.result(res);
        setResult(arr);
        setKeys(Object.keys(arr[0]) || []);
        if (data.id === 5) {
          setBounding(data.boundingBox(res));
          setBounding2(data.boundingBox2(arr));
        } else {
          setBounding(data.boundingBox(arr));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const renderBounding = () => {
    var image = document.getElementById("image");
    return bounding.map((item, index) => {
      return (
        <div
          key={index}
          style={{
            height: `${item.Height * image.height}px`,
            width: `${item.Width * image.width}px`,
            top: `${item.Top * image.height}px`,
            left: `${item.Left * image.width}px`,
            border: "3px solid rgba(255, 255, 255, 0.69)",
            borderRadius: "3%",
            position: "absolute",
          }}
        ></div>
      );
    });
  };
  const renderBounding2 = () => {
    return bounding2.map((item, index) => {
      return (
        <div
          key={index}
          style={{
            height: `${item.Height * 380}px`,
            width: `${item.Width * 580}px`,
            top: `${item.Top * 710}px`,
            left: `${item.Left * 580}px`,
            border: "3px solid rgba(255, 255, 255, 0.69)",
            borderRadius: "3%",
            position: "absolute",
            display: "block",
          }}
        ></div>
      );
    });
  };
  console.log(bounding);
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
                <h3 className="modal-body-content-req-header">
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
                </div>

                <div className="modal-body-content-req-img-wrapper">
                  <div className="modal-body-content-req-img-wrapper-preview">
                    <img
                      className="modal-body-content-req-img-wrapper-preview-img"
                      id="image"
                      src={preview ? preview : imgDefault}
                      alt="preview"
                    />
                    {renderBounding()}
                  </div>
                </div>
                {data.id === 5 && (
                  <>
                    <h3
                      className="modal-body-content-req-header"
                      style={{ marginTop: "30px" }}
                    >
                      Chọn 1 bức hình để so sánh
                    </h3>
                    <div className="modal-body-content-req-img-upload">
                      <input
                        style={{ display: "none" }}
                        id="file2"
                        className="modal-body-content-req-img-upload-fromFile"
                        type="file"
                        onChange={(e) => handleImage2Change(e)}
                      />
                      <label htmlFor="file2">
                        <img src={addImage} alt="addImage" />
                        <span>Add an Image</span>
                      </label>
                      <button
                        onClick={onFileUpload2}
                        className="modal-body-content-req-img-upload-toS3"
                      >
                        Up to S3
                      </button>
                    </div>
                    <div className="modal-body-content-req-img-wrapper">
                      <div className="modal-body-content-req-img-wrapper-preview">
                        <img
                          className="modal-body-content-req-img-wrapper-preview-img"
                          id="image"
                          src={preview2 ? preview2 : imgDefault}
                          alt="preview"
                        />
                        {renderBounding2()}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <button
                className="modal-body-content-req-btn"
                disabled={!isDetect}
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
