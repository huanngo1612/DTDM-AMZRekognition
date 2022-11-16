import imgRekCompareFaces from "../../assets/images/img_rek_compareFaces.png";
import imgRekDetectCelebrity from "../../assets/images/img_rek_detectCelebrity.png";
import imgRekDetectFace from "../../assets/images/img_rek_detectFace.png";
import imgRekDetectLabel from "../../assets/images/img_rek_detectLabel.png";
import imgRekDetectText from "../../assets/images/img_rek_detectText.png";
import Card from "../Card/Card";
import "../Cards/Cards.scss";

const ITEMS = [
  {
    id: 1,
    img: imgRekDetectLabel,
    title: "Phát hiện vật thể",
    description:
      "Phát hiện các vật thể, bối cảnh, hành động và hiển thị số % chính xác",
    api: "labels",
    result(res) {
      if (res.data.data.Labels.length === 0) {
        alert("Không tìm thấy!!!");
      } else {
        return res.data.data.Labels;
      }
    },
    boundingBox: function (arr) {
      const arrBoundingBox = [];
      arr.forEach((result, index) => {
        for (let i = 0; i < arr[index].Instances.length; i++) {
          let boudingBox = arr[index].Instances[i].BoundingBox;
          arrBoundingBox.push(boudingBox);
        }
      });
      return arrBoundingBox;
    },
  },
  {
    id: 2,
    img: imgRekDetectText,
    title: "Phát hiện văn bản",
    description:
      "Tự động phát hiện văn bản và trích xuất chúng ra từ ảnh của bạn",
    api: "texts",
    result(res) {
      if (res.data.data.TextDetections.length === 0) {
        alert("Không tìm thấy!!!");
      } else {
        const arr = res.data.data.TextDetections.filter(
          (item) => item.Type !== "WORD"
        );
        return arr;
      }
    },
    boundingBox: function (arr) {
      const arrBoundingBox = [];
      arr.forEach((result, index) => {
        let boudingBox = arr[index].Geometry.BoundingBox;
        arrBoundingBox.push(boudingBox);
      });
      return arrBoundingBox;
    },
  },
  {
    id: 3,
    img: imgRekDetectFace,
    title: "Phát hiện gương mặt",
    description:
      "Lấy dữ liệu phân tích về các thuộc tính trên gương mặt và số % chính xác",
    api: "faces",
    result(res) {
      if (res.data.data.FaceDetails.length === 0) {
        alert("Không tìm thấy!!!");
      } else {
        return res.data.data.FaceDetails;
      }
    },
    boundingBox: function (arr) {
      const arrBoundingBox = [];
      arr.forEach((result, index) => {
        let boudingBox = arr[index].BoundingBox;
        arrBoundingBox.push(boudingBox);
      });
      return arrBoundingBox;
    },
  },
  // {
  //   id: 4,
  //   img: imgRekDetectCelebrity,
  //   title: "Nhận diện người nổi tiếng",
  //   description:
  //     "Nhận diện những người nổi tiếng trong hình ảnh và số % chính xác",
  //   api: "celeb",
  //   result(res) {
  //     if (res.data.data.CelebrityFaces.length === 0) {
  //       alert("Không tìm thấy!!!");
  //     } else {
  //       return res.data.data.CelebrityFaces;
  //     }
  //   },
  //   boundingBox: function (arr) {
  //     const arrBoundingBox = [];
  //     arr.forEach((result, index) => {
  //       let boudingBox = arr[index].Face.BoundingBox;
  //       arrBoundingBox.push(boudingBox);
  //     });
  //     return arrBoundingBox;
  //   },
  // },
  // {
  //   id: 5,
  //   img: imgRekCompareFaces,
  //   title: "So sánh các gương mặt",
  //   description: "So sánh các gương mặt trong 2 bức hình được truyền vào",
  //   api: "compare",
  //   result(res) {
  //     // let countSameFace = 0;
  //     // res.data.data.FaceMatches.forEach((face, index) => {
  //     //   if (face.Similarity >= 80) countSameFace++;
  //     // });
  //     return res.data.data.FaceMatches;
  //   },
  //   boundingBox: function (res) {
  //     const arrBoundingBox = [];
  //     let boudingBox = res.data.data.SourceImageFace.BoundingBox;
  //     arrBoundingBox.push(boudingBox);
  //     return arrBoundingBox;
  //   },
  //   boundingBox2: function (arr) {
  //     const arrBoundingBox = [];
  //     arr.forEach((result, index) => {
  //       let boudingBox = arr[index].Face.BoundingBox;
  //       arrBoundingBox.push(boudingBox);
  //     });
  //     return arrBoundingBox;
  //   },
  // },
];

function Cards() {
  return (
    <div className="wrapper">
      <div className="wrapper-card">
        {ITEMS.map((item, id) => (
          <Card key={id} data={item} />
        ))}
      </div>
    </div>
  );
}

export default Cards;
