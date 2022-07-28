import * as THREE from 'three'

import Experience from '../Experience.js'

export default class Parallax {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug

        this.clamp = (num, min, max) => Math.min(Math.max(num, min), max)

        // Setup
        this.setMouse()
        this.setGroup()
        this.setClock()
    }

    setMouse() {

        this.cursor = {}
        this.cursor.x = 0
        this.cursor.y = 0

        window.addEventListener('mousemove', (event) => {
            this.cursor.x = event.clientX / this.sizes.width - 0.5
            this.cursor.y = event.clientY / this.sizes.height - 0.5

        })
    }

    setGroup() {
        this.cameraGroup = new THREE.Group()
        this.scene.add(this.cameraGroup)
        this.cameraGroup.add(this.camera.instance)
    }

    setClock() {
        this.clock = new THREE.Clock()
        this.previousTime = 0
    }

    update() {

        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.previousTime
        this.previousTime = elapsedTime

        this.parallaxX = this.cursor.x * 0.5
        this.parallaxY = - this.cursor.y * 0.5

        // this.cameraGroup.position.x += (this.parallaxX - this.cameraGroup.position.x) * 0.1 * deltaTime * 5
        // this.cameraGroup.position.y += (this.parallaxY - this.cameraGroup.position.y) * 0.1 * deltaTime * 5
        this.cameraGroup.position.x += this.clamp((this.parallaxX - this.cameraGroup.position.x) * 0.1 * deltaTime * 5, -0.25, 0.25) 
        this.cameraGroup.position.y += this.clamp((this.parallaxY - this.cameraGroup.position.y) * 0.1 * deltaTime * 5, -0.25, 0.25)

    }

}