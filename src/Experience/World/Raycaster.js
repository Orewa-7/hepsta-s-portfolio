import * as THREE from 'three'
import gsap from 'gsap'

import Experience from '../Experience.js'

export default class Raycaster {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.sizes = this.experience.sizes
        this.meshs = this.experience.world.images.meshs
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
            if (this.currentObjectSelected){
                gsap.to(this.currentObjectSelected.position, { x: initialPosition.x, y: initialPosition.y, z: initialPosition.z, duration: 0.5, ease: 'power4.inOut' })

                //SetTimeout pour attendre la fin de l'animation gsap
                window.setTimeout(() => {
                    this.currentObjectSelected.lookAt(this.ImageDebugObject.lookAtVector)
                    this.currentObjectSelected = null
                }, 510)
                
                

            }
            //Si on a pas d'object deja séléctionner ET qu'on hover un object
            else if (this.currentIntersect) {
                // on s'assure qu'on a pas déjà un object séléctionner 
                if (this.currentObjectSelected == null){
                    this.currentObjectSelected = this.currentIntersect.object
                    initialPosition = new THREE.Vector3(this.currentIntersect.object.position.x, this.currentIntersect.object.position.y, this.currentIntersect.object.position.z) 
                    gsap.to(this.heading1.style, { zIndex: -1, duration: 0.5, ease: 'power4.inOut' })
                    gsap.to(this.currentIntersect.object.position, { x: 0, y: 5, z: 1.25, duration: 1, ease: 'power4.inOut' })
                    this.currentIntersect.object.lookAt(this.currentIntersect.object.position)
                }


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
            console.log(this.currentIntersect.object.name)
        }
        else {
            // Mouse leave
            if (this.currentIntersect) {
                // on modifie les cursor
                this.body.style.cursor = 'default'
            }

            this.currentIntersect = null
        }

        // for (const intersect of intersects) {
        //     intersect.object.material.color.set('#0000ff')
        // }

        // for (const object of objectsToTest) {
        //     if (!intersects.find(intersect => intersect.object === object)) {
        //         object.material.color.set('#ff0000')
        //     }
        // }
    }
}