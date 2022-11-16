import "../Result/Result.scss";
function Result({ data, keys }) {
  return (
    <div className="wrapper-result">
      <h3 className="modal-body-content-res-header">Kết quả</h3>
      <p className="modal-body-content-res-description">
        Các kết quả được phát hiện:
      </p>
      {keys[0] === "Name" ||
      keys[0] === "DetectedText" ||
      keys[1] === "Name" ? (
        <div>
          {data.map((item, index) => (
            <table key={index}>
              {index === 0 ? (
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>
                      {keys[0] === "DetectedText" ? "DetectedText" : "Name"}
                    </th>
                    <th>{keys[0] === "Urls" ? "Urls" : "Confidence"}</th>
                  </tr>
                </thead>
              ) : (
                <></>
              )}
              <tbody>
                <tr>
                  <td>{index + 1}</td>
                  <td>{item.Name || item.DetectedText}</td>
                  <td>{Math.floor(item.Confidence) || item.Urls[0]}</td>
                </tr>
              </tbody>
            </table>
          ))}
        </div>
      ) : (
        <div>
          {keys[1] === "AgeRange" ? (
            <div>
              {data.map((item, index) => (
                <div key={index}>
                  <table>
                    <tr>
                      <td>
                        Độ tuổi từ {item.AgeRange.Low} đến {item.AgeRange.High}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Giới tính:{" "}
                        {item.Gender.Confidence > 80
                          ? item.Gender.Value === "Male"
                            ? "Nam"
                            : "Nữ"
                          : "Không xác định được giới tính"}
                      </td>
                    </tr>
                    {item.Smile.Value ? (
                      <tr>
                        <td>Đang cười</td>
                      </tr>
                    ) : (
                      <tr>
                        <td>Không cười</td>
                      </tr>
                    )}
                    {item.Eyeglasses.Value || item.Sunglasses.Value ? (
                      <tr>
                        <td>Có đeo kính</td>
                      </tr>
                    ) : (
                      <tr>
                        <td>Không đeo kính</td>
                      </tr>
                    )}

                    {item.Beard.Value ? (
                      <tr>
                        <td> Có râu</td>
                      </tr>
                    ) : (
                      <tr>
                        <td> Không có râu</td>
                      </tr>
                    )}
                    {item.EyesOpen.Value ? (
                      <tr>
                        <td>Mắt đang mở</td>
                      </tr>
                    ) : (
                      <tr>
                        <td>Mắt đang đóng</td>
                      </tr>
                    )}
                    {item.MouthOpen.Value ? (
                      <tr>
                        <td>Miệng đang mở</td>
                      </tr>
                    ) : (
                      <tr>
                        <td>Miệng không mở</td>
                      </tr>
                    )}
                  </table>
                  <hr />
                </div>
              ))}
            </div>
          ) : (
            <div>
              {keys[0] === "Similarity" ? (
                <p
                  style={{
                    marginTop: "40%",
                    fontWeight: "500",
                    fontSize: "30px",
                  }}
                >
                  Có khuôn mặt giống với hình nguồn
                </p>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Result;
