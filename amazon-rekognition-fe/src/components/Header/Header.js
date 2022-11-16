import React from "react";
import logoAWSRekognition from "../../assets/images/logo_aws_rekognition.png";
import "../Header/Header.scss";

function Header() {
  return (
    <div className="header">
      <img
        className="project-display"
        src={logoAWSRekognition}
        alt="AWS Logo"
      />

      <div className="title-display">Một số tính năng Amazon Rekognition</div>
      <div className="earth"></div>
    </div>
  );
}

export default Header;
