import * as THREE from 'three'
import gsap from 'gsap'

import Experience from '../Experience'

export default class Project {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug
        this.currentObjectSelected = null

        this.scaleUpdated = false
        this.isClickedSeeMore = false

        // DOM
        this.seeMore = document.querySelector('.see-more')
        this.blocDescription = document.querySelector('.bloc-description')
        this.BacktoProject = document.querySelector('.button-back')
        this.scrollIndicator = document.querySelector('.description-scroll-container')


        this.scrollTarget = 0
        this.currentScroll = 0
        this.scroll = 0
        window.addEventListener('wheel', event => {
            this.projectsWheelHandler(event)
        })

        this.seeMore.onclick = () => {
            this.clickSeeMore()
        }

        this.setPiano()
    }
    projectsWheelHandler(event) {
        this.scrollTarget = event.wheelDelta
    }

    clickSeeMore() {

        if (!this.isClickedSeeMore && !gsap.isTweening(this.camera.instance.rotation)) {
            gsap.to(this.camera.instance.rotation, { y: this.camera.instance.rotation.y - Math.PI * 0.5, duration: 1 })

            const tl = gsap.timeline()

            tl.to(this.BacktoProject, { scaleX: 0, scaleY: 0, duration: 0.5 })
            tl.call(() => {
                this.BacktoProject.classList.toggle('invisible')
                this.scrollIndicator.classList.toggle('invisible')
            })
            tl.to(this.scrollIndicator, { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.7)' })
            switch (this.currentObjectSelected.name) {
                case 'Le Piano': this.setOpacitypiano(true)
                    break
            }

            this.isClickedSeeMore = !this.isClickedSeeMore
        }
        else if (this.isClickedSeeMore && !gsap.isTweening(this.camera.instance.rotation)) {
            gsap.to(this.camera.instance.rotation, { y: this.camera.instance.rotation.y + Math.PI * 0.5, duration: 1 })

            const tl = gsap.timeline()
            tl.to(this.scrollIndicator, { scaleX: 0, scaleY: 0, duration: 0.5 })
            tl.call(() => {
                this.BacktoProject.classList.toggle('invisible')
                this.scrollIndicator.classList.toggle('invisible')
            })
            tl.to(this.BacktoProject, { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.7)' })
            switch (this.currentObjectSelected.name) {
                case 'Le Piano': this.setOpacitypiano(false)
                    break
            }

            this.isClickedSeeMore = !this.isClickedSeeMore
        }
    }

    setPiano() {
        this.setPianoTexture()
        this.setPianoGeometry()
        this.setPianoMaterial()
        this.setPianoMesh()
    }
    setPianoTexture() {
        this.pianoScaleRatio = []
        this.pianoTextures = []

        this.textureLoader = new THREE.TextureLoader()
        for (let i = 0; i < 16; i++) {
            this.pianoTextures[i] = new THREE.TextureLoader().load(`/Projects/Le-Piano/PIANO-${i + 1}.jpg`, (tex) => {
                this.pianoScaleRatio.push(this.pianoTextures[i].image.height / this.pianoTextures[i].image.width)
            })

        }
    }
    setPianoGeometry() {
        this.pianoGeometry = new THREE.PlaneGeometry(1, 1)
    }
    setPianoMaterial() {
        this.pianoMaterials = []


        for (let i = 0; i < 16; i++) {
            this.pianoTextures[i].encoding = THREE.sRGBEncoding
            const material = new THREE.MeshBasicMaterial({ map: this.pianoTextures[i], transparent: true, opacity: 0 })
            this.pianoMaterials.push(material)
        }
    }
    setPianoMesh() {
        this.pianoMeshs = []
        for (let i = 0; i < 16; i++) {
            const pianoMesh = new THREE.Mesh(this.pianoGeometry, this.pianoMaterials[i])
            pianoMesh.position.x = 4
            pianoMesh.position.y = i * 2
            pianoMesh.position.z = 3
            pianoMesh.rotation.y -= Math.PI * 0.5


            this.scene.add(pianoMesh)

            this.pianoMeshs.push(pianoMesh)
        }
    }
    updatePianoScale() {
        for (let i = 0; i < 16; i++) {
            this.pianoMeshs[i].scale.set(1, this.pianoScaleRatio[i])
        }
        this.scaleUpdated = true
    }
    setOpacitypiano(opacity){
        if(opacity){
            for(let i = 0; i < 16; i++){
                gsap.to(this.pianoMeshs[i].material, {opacity: 1, duration: 1})
            }
        }else {
            for(let i = 0; i < 16; i++){
                gsap.to(this.pianoMeshs[i].material, {opacity: 0, duration: 1})
            }
        }

    }
    updateMeshs() {
        if (this.pianoMeshs) {
            let margin = 2
            let wholeWidth = margin * this.pianoMeshs.length
            for (let i = 0; i < 16; i++) {
                this.pianoMeshs[i].position.y = (margin * i + this.currentScroll + 42069 * wholeWidth) % wholeWidth - 5 * margin
            }
        }
    }

    update() {
        if (!this.scaleUpdated && this.pianoScaleRatio.length == 16 && this.pianoMeshs.length == 16) {
            this.updatePianoScale()
        }
        this.updateMeshs()
        this.scroll += (this.scrollTarget - this.scroll) * 0.1
        this.scrollTarget *= 0.9
        this.scroll *= 0.9
        this.currentScroll += this.scroll * 0.01

        this.currentObjectSelected = this.experience.world.raycaster.currentObjectSelected

    }
}