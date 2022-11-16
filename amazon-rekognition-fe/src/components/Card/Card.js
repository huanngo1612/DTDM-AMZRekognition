import { useState } from "react";
import Modal from "../Modal/Modal";
import "../Card/Card.scss";

function Card({ data }) {
  const [isShowModal, setIsShowModal] = useState(false);
  const handleShowModalClick = () => {
    setIsShowModal(true);
  };
  const handleCloseModal = () => {
    setIsShowModal(false);
  };

  return (
    <div className="card">
      <div className="card__body">
        <div className="card__illustration">
          <img src={data.img} className="card__image" alt="img_demo" />
        </div>
        <h2 className="card__title">{data.title}</h2>
        <p className="card__description">{data.description}</p>
      </div>
      <button onClick={handleShowModalClick} className="card__btn">
        Thử ngay
      </button>
      {isShowModal ? (
        <Modal onClick={handleCloseModal} data={data}></Modal>
      ) : null}
    </div>
  );
}

export default Card;
