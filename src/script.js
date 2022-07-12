import './style.css'
// import Highway from '@dogstudio/highway'

import Experience from "./Experience/Experience.js"
// import Fade from './Fade.js'



let experience = new Experience(document.querySelector('canvas.webgl'))

// const H = new Highway.Core({
//     transitions: {
//         default: Fade
//     }
// })
const color = 'color: #bada55'
console.log('%c Hello, i assume that you are a curious developper ! ', color);
console.log('%c My Name is Orewa, and i like to create some cool website like this one...', color);
console.log('%c come check out my protfolio ', color);