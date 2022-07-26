import * as THREE from 'three'
import gsap from 'gsap'

import Experience from "../Experience";

export default class About{

    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug

        // this.aboutButton = document.querySelector('.about')
        this.aboutButton = document.querySelector('.button-about')
        this.aboutBloc = document.querySelector('.bloc-about')
        this.firstArrow = document.querySelector('.arrow-first-left')
        this.secondArrow = document.querySelector('.arrow-second-left')

        /**
        * Sounds
        */
         this.windSound = new Audio('/Sounds/wind.mp3')
        this.playWindSound = () => {
             this.windSound.play()
         }
        
        this.isClicked = false
        this.aboutButton.onclick = () => {
            this.playWindSound()
            this.clickEvent()
            this.isClicked = !this.isClicked
        }

        //setup
        this.setTexture()
        this.setGeometry()
        this.setMaterial()
        this.setMesh()

    }

    setTexture(){
        this.texture = new THREE.TextureLoader().load('/textures/hepsta.jpg', (tex) => {
            // console.log( tex.image.height/ tex.image.width )
            // console.log( this.texture.image.width/ this.texture.image.height )
        })
    }

    setGeometry(){
        this.geometry = new THREE.PlaneGeometry(1, 1.25)
    }
    setMaterial(){
        
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            depthWrite: false,
            opacity: 0,
        })
        this.texture.encoding = THREE.sRGBEncoding
    }
    setMesh(){
        this.plane = new THREE.Mesh(this.geometry, this.material)
        this.plane.position.y = 2
        this.plane.position.z = 3.5
        this.plane.position.x = -3
        this.plane.rotation.y += Math.PI * 0.5
        this.plane.scale.set(1.25, 1.25)
        this.scene.add(this.plane)
    }
    clickEvent(){
        this.aboutButton.onclick = null
        if(!this.isClicked){
            // on rentre
            // camera
            gsap.to(this.camera.instance.rotation, {y: this.camera.instance.rotation.y + Math.PI * 0.5, duration: 1})
            gsap.to(this.camera.instance.position, {z: this.camera.instance.position.z - 1, duration: 1})
            
            // Object
            gsap.to(this.plane.material, {opacity: 1, duration: 3})

            // DOM
            this.aboutBloc.classList.toggle('invisible')
            gsap.to(this.aboutBloc.style, {opacity: 1, duration: 3})

            //on change le text content
            // this.aboutButton.textContent = ''
            // this.aboutButton.append('Back')
            this.firstArrow.classList.remove('arrow-first-left')
            this.secondArrow.classList.remove('arrow-second-left')
            this.firstArrow.classList.add('arrow-first-right')
            this.secondArrow.classList.add('arrow-second-right')

            // Pour eviter que la camera bouge durant le flip
            window.setTimeout(()=>{
                this.aboutButton.onclick = () => {
                    this.playWindSound()
                    this.clickEvent()
                    this.isClicked = !this.isClicked
                }
            }, 1000)


        } else {
            // on sort
            // camera
            gsap.to(this.camera.instance.rotation, {y: this.camera.instance.rotation.y - Math.PI * 0.5, duration: 1})
            gsap.to(this.camera.instance.position, {z: this.camera.instance.position.z + 1, duration: 1})

            // Object
            gsap.to(this.plane.material, {opacity: 0, duration: 0.3})

            // DOM
            this.aboutBloc.classList.toggle('invisible')
            gsap.to(this.aboutBloc.style, {opacity: 0, duration: 0.3})

            //on change le text content
            // this.aboutButton.textContent = ''
            // this.aboutButton.append('About')
            this.firstArrow.classList.remove('arrow-first-right')
            this.secondArrow.classList.remove('arrow-second-right')
            this.firstArrow.classList.add('arrow-first-left')
            this.secondArrow.classList.add('arrow-second-left')


            // Pour eviter que la camera bouge durant le flip
            window.setTimeout(()=>{
                this.aboutButton.onclick = () => {
                    this.playWindSound()
                    this.clickEvent()
                    this.isClicked = !this.isClicked
                }
            }, 1000)

        }
        
    }
    update(){

    }
}