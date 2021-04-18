import "./styles/main.scss";
import image from "Images/background.jpg";
console.log("IMPORTED FROM SCRIPT ALIAS", image);

console.log("OKE");

const a = [1, 2, 3, 4, 5];

const root = document.querySelector("#root");

const img = document.createElement("img");
img.src = image;

const h1 = document.createElement("h1");
// document.body.style.fontFamily = "Kiss Boom";
h1.textContent = "HELLO FROM QUOC";

root?.appendChild(img);
root?.appendChild(h1);
