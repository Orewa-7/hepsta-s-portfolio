import Highway from "@dogstudio/highway"
import gsap from 'gsap'

import Experience from "./Experience/Experience.js"



export default class Fade extends Highway.Transition {
    out({ from, done }) {
        
        gsap.timeline({ onComplete: done }).to(from, 0.5, { opacity: 0 })
    }

    in({ from, to, done }) {
        this.experience = new Experience()
        if (to.getAttribute('data-router-view') === 'home') {
            const experience = new Experience(document.querySelector('canvas.webgl'), true)
        }
        from.remove()
        gsap.timeline({ onComplete: done }).fromTo(to, 0.5, { opacity: 0 }, { opacity: 1 })

    }

    
}