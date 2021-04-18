import "./styles/main.scss";
import _ from "lodash";
import React from "react";
import ReactDom from "react-dom";
import moment from "moment";
console.log("OKE");

const a = [1, 2, 3, 4, 5];

_.forEach(a, console.log);

ReactDom.render(
  React.createElement(
    "div",
    { className: "QUOC" },
    "HELLO WORLD",
    moment().format(new Date().toLocaleString())
  ),
  document.querySelector("#root")
);
