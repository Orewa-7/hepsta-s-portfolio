import * as THREE from 'three'
import gsap from 'gsap'

import Experience from '../Experience.js'
import { ceilPowerOfTwo } from 'three/src/math/MathUtils.js'

export default class Raycaster {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.sizes = this.experience.sizes
        this.meshs = this.experience.world.images.meshs
        this.blackScreen = this.experience.world.images.blackScreen
        this.ImageDebugObject = this.experience.world.images.debugObject

        // Recup du DOM
        this.heading1 = document.querySelector('h1')
        this.body = document.getElementsByTagName("body")[0]

        // Setup
        this.clicked = false
        this.setMouse()
        this.setRaycaster()


        // variable pour stocker la position initial avant le click
        let initialPosition
        window.addEventListener('click', () => {


            // Si on a deja un object de selectionner
            if (this.currentObjectSelected) {
                //on remet la camera à sa place
                gsap.to(this.camera.position, { x: 0, y: 5, z: 4, duration: 0.5, ease: 'power4.inOut' })
                //on remet l'objet a sa place initial
                gsap.to(this.currentObjectSelected.position, { x: initialPosition.x, y: initialPosition.y, z: initialPosition.z, duration: 0.5, ease: 'power4.inOut' })
                // on remet l'index de H1 à 1
                gsap.to(this.heading1.style, { zIndex: 1, duration: 0.5, ease: 'power4.inOut' })
                gsap.to(this.heading1.style, { left: '50%', duration: 0.5, ease: 'power4.inOut' })
                // // on repasse le black screen à opacite 0
                // gsap.to(this.blackScreen.material, { opacity: 0, duration: 1, ease: 'power4.inOut' })

                //SetTimeout pour attendre la fin de l'animation gsap
                window.setTimeout(() => {
                    //on remet la bonne rotation au mesh séléctionner
                    this.currentObjectSelected.lookAt(this.ImageDebugObject.lookAtVector)
                    // on enleve l'objet selectionner
                    this.currentObjectSelected = null
                }, 510)



            }
            //Si on a pas d'object deja séléctionner ET qu'on hover un object
            else if (this.currentIntersect) {
                // on s'assure qu'on a pas déjà un object séléctionner 
                if (this.currentObjectSelected == null) {
                    this.currentObjectSelected = this.currentIntersect.object
                    initialPosition = new THREE.Vector3(this.currentIntersect.object.position.x, this.currentIntersect.object.position.y, this.currentIntersect.object.position.z)
                    gsap.to(this.heading1.style, { zIndex: -1, duration: 0.5, ease: 'power4.inOut' })
                    gsap.to(this.heading1.style, { left: '-100%', duration: 0.1, ease: 'power4.inOut' })
                    // on centre l'objet selectionner
                    gsap.to(this.currentIntersect.object.position, { x: 0, y: 5, z: 1.25, duration: 1, ease: 'power4.inOut' })
                    // // on repasse le black screen à opacite 0.7
                    // // gsap.to(this.blackScreen.material.uniforms.uAlpha, { value: 0.7, duration: 1, ease: 'power4.inOut' })
                    // gsap.to(this.blackScreen.material, { opacity: 0.4, duration: 1, ease: 'power4.inOut' })
                    // on lui dit de ragarder lui meme donc en face
                    this.currentIntersect.object.lookAt(this.currentIntersect.object.position)

                    // on bouge la camera et l'objet en haut
                    gsap.to(this.camera.position, { x: 0, y: 8, z: 4, duration: 1, ease: 'power4.inOut' })
                    gsap.to(this.currentIntersect.object.position, { x: -0.75, y: 8, z: 1, duration: 1, ease: 'power4.inOut' })

                }


            }
            window.setTimeout(() => {
                // console.log(this.blackScreen.material.opacity)

            }, 1100)
        })
        // on destock l'object selectionner si on wheel comme ça si on reclique on a pas de bug
        window.addEventListener('wheel', event => {
            if (this.currentObjectSelected) {
                this.currentObjectSelected = null
                gsap.to(this.camera.position, { x: 0, y: 5, z: 4, duration: 0.2, ease: 'power4.inOut' })
                gsap.to(this.heading1.style, { left: '50%', duration: 0.5, ease: 'power4.inOut' })
            }
        })
        window.addEventListener("touchmove", event => {
            if (this.currentObjectSelected) {
                this.currentObjectSelected = null
                gsap.to(this.camera.position, { x: 0, y: 5, z: 4, duration: 0.2, ease: 'power4.inOut' })
                gsap.to(this.heading1.style, { left: '50%', duration: 0.5, ease: 'power4.inOut' })
            }
        })
        
    }

    setMouse() {
        this.mouse = new THREE.Vector2()

        window.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX / this.sizes.width * 2 - 1
            this.mouse.y = - (event.clientY / this.sizes.height) * 2 + 1
        })
    }

    setRaycaster() {

        this.instance = new THREE.Raycaster()
        this.intersects = this.instance.intersectObjects(this.meshs)
        this.currentIntersect = null
    }


    update() {
        this.instance.setFromCamera(this.mouse, this.camera)
        this.intersects = this.instance.intersectObjects(this.meshs)

        if (this.intersects.length) {
            // Mouse enter
            if (!this.currentIntersect) {
                // on modifie les cursor
                this.body.style.cursor = 'pointer'
            }

            this.currentIntersect = this.intersects[0]
            // console.log(this.currentIntersect.object.name)
        }
        else {
            // Mouse leave
            if (this.currentIntersect) {
                // on modifie les cursor
                this.body.style.cursor = 'default'
            }

            this.currentIntersect = null
        }
    }
}