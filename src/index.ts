import "./styles/main.scss";
import image from "Images/background.jpg";
console.log("IMPORTED FROM SCRIPT ALIAS", image);
// import _ from "lodash";
// import React from "react";
// import ReactDom from "react-dom";
// import moment from "moment";
console.log("OKE");

const a = [1, 2, 3, 4, 5];

const root = document.querySelector("#root");

const img = document.createElement("img");

img.src = image;

root?.appendChild(img);
