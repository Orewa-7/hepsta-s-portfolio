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

        this.scalePianoUpdated = false
        this.scaleJeffDeBrugesUpdated = false
        this.scaleEpoptiqueUpdated = false
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
        this.setJeffDeBruges()
        this.setEpoptique()
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
                case 'Jeff de Bruges': this.setOpacityJeffDeBruges(true)
                    break
                case 'EPOPTIQUE': this.setOpacityepoptique(true)
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
                case 'Jeff de Bruges': this.setOpacityJeffDeBruges(false)
                    break
                case 'EPOPTIQUE': this.setOpacityepoptique(false)
                    break
            }

            this.isClickedSeeMore = !this.isClickedSeeMore
        }
    }

    /**
     * Le Piano
     */
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
        this.pianoGeometry = new THREE.PlaneGeometry(1.5, 1.5)
    }
    setPianoMaterial() {
        this.pianoMaterials = []


        for (let i = 0; i < 16; i++) {
            this.pianoTextures[i].encoding = THREE.sRGBEncoding
            const material = new THREE.MeshBasicMaterial({ map: this.pianoTextures[i], transparent: true, opacity: 0, depthWrite: false })
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
        this.scalePianoUpdated = true
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

    /**
     * Jeff de Bruges
     */
     setJeffDeBruges() {
        this.setJeffDeBrugesTexture()
        this.setJeffDeBrugesGeometry()
        this.setJeffDeBrugesMaterial()
        this.setJeffDeBrugesMesh()
    }
    setJeffDeBrugesTexture() {
        this.jeffDeBrugesScaleRatio = []
        this.jeffDeBrugesTextures = []

        this.textureLoader = new THREE.TextureLoader()
        for (let i = 0; i < 17; i++) {
            this.jeffDeBrugesTextures[i] = new THREE.TextureLoader().load(`/Projects/Jeff-De-Bruges/Jeff-De-Bruges-${i + 1}.jpg`, (tex) => {
                this.jeffDeBrugesScaleRatio.push(this.jeffDeBrugesTextures[i].image.height / this.jeffDeBrugesTextures[i].image.width)
            })

        }
    }
    setJeffDeBrugesGeometry() {
        this.jeffDeBrugesGeometry = new THREE.PlaneGeometry(2, 2)
    }
    setJeffDeBrugesMaterial() {
        this.jeffDeBrugesMaterials = []


        for (let i = 0; i < 17; i++) {
            this.jeffDeBrugesTextures[i].encoding = THREE.sRGBEncoding
            const material = new THREE.MeshBasicMaterial({ map: this.jeffDeBrugesTextures[i], transparent: true, opacity: 0, depthWrite: false })
            this.jeffDeBrugesMaterials.push(material)
        }
    }
    setJeffDeBrugesMesh() {
        this.jeffDeBrugesMeshs = []
        for (let i = 0; i < 17; i++) {
            const jeffDeBrugesMesh = new THREE.Mesh(this.jeffDeBrugesGeometry, this.jeffDeBrugesMaterials[i])
            jeffDeBrugesMesh.position.x = 4
            jeffDeBrugesMesh.position.y = i * 2
            jeffDeBrugesMesh.position.z = 3
            jeffDeBrugesMesh.rotation.y -= Math.PI * 0.5


            this.scene.add(jeffDeBrugesMesh)

            this.jeffDeBrugesMeshs.push(jeffDeBrugesMesh)
        }
    }
    updateJeffDeBrugesScale() {
        for (let i = 0; i < 17; i++) {
            this.jeffDeBrugesMeshs[i].scale.set(1, this.jeffDeBrugesScaleRatio[i])
        }
        this.scaleUpdated = true
    }
    setOpacityJeffDeBruges(opacity){
        if(opacity){
            for(let i = 0; i < 17; i++){
                gsap.to(this.jeffDeBrugesMeshs[i].material, {opacity: 1, duration: 1})
            }
        }else {
            for(let i = 0; i < 17; i++){
                gsap.to(this.jeffDeBrugesMeshs[i].material, {opacity: 0, duration: 1})
            }
        }

    }

    /**
     * Epoptique
     */
     setEpoptique() {
        this.setEpoptiqueTexture()
        this.setEpoptiqueGeometry()
        this.setEpoptiqueMaterial()
        this.setEpoptiqueMesh()
    }
    setEpoptiqueTexture() {
        this.epoptiqueScaleRatio = []
        this.epoptiqueTextures = []

        this.textureLoader = new THREE.TextureLoader()
        for (let i = 0; i < 15; i++) {
            this.epoptiqueTextures[i] = new THREE.TextureLoader().load(`/Projects/EPOPTIQUE/EPOPTIQUE-${i + 1}.jpg`, (tex) => {
                this.epoptiqueScaleRatio.push(this.epoptiqueTextures[i].image.height / this.epoptiqueTextures[i].image.width)
            })

        }
    }
    setEpoptiqueGeometry() {
        this.epoptiqueGeometry = new THREE.PlaneGeometry(1.5, 1.5)
    }
    setEpoptiqueMaterial() {
        this.epoptiqueMaterials = []


        for (let i = 0; i < 15; i++) {
            this.epoptiqueTextures[i].encoding = THREE.sRGBEncoding
            const material = new THREE.MeshBasicMaterial({ map: this.epoptiqueTextures[i], transparent: true, opacity: 0, depthWrite: false })
            this.epoptiqueMaterials.push(material)
        }
    }
    setEpoptiqueMesh() {
        this.epoptiqueMeshs = []
        for (let i = 0; i < 15; i++) {
            const epoptiqueMesh = new THREE.Mesh(this.epoptiqueGeometry, this.epoptiqueMaterials[i])
            epoptiqueMesh.position.x = 4
            epoptiqueMesh.position.y = i * 2
            epoptiqueMesh.position.z = 3
            epoptiqueMesh.rotation.y -= Math.PI * 0.5


            this.scene.add(epoptiqueMesh)

            this.epoptiqueMeshs.push(epoptiqueMesh)
        }
    }
    updateEpoptiqueScale() {
        for (let i = 0; i < 15; i++) {
            this.epoptiqueMeshs[i].scale.set(1, this.epoptiqueScaleRatio[i])
        }
        this.scaleEpoptiqueUpdated = true
        console.log(this.epoptiqueScaleRatio)
    }
    setOpacityepoptique(opacity){
        if(opacity){
            for(let i = 0; i < 15; i++){
                gsap.to(this.epoptiqueMeshs[i].material, {opacity: 1, duration: 1})
            }
        }else {
            for(let i = 0; i < 15; i++){
                gsap.to(this.epoptiqueMeshs[i].material, {opacity: 0, duration: 1})
            }
        }

    }


    /**
     * Updating things
     */
    updateMeshs() {
        if (this.pianoMeshs /*&& this.pianoMeshs[0].material.opacity === 1*/)  {
            let margin = 3
            let wholeWidth = margin * this.pianoMeshs.length
            for (let i = 0; i < 16; i++) {
                this.pianoMeshs[i].position.y = (margin * i + this.currentScroll + 42069 * wholeWidth) % wholeWidth - 5 * margin
            }
        }
        if (this.jeffDeBrugesMeshs /*&& this.pianoMeshs[0].material.opacity === 1*/) {
            let margin = 3
            let wholeWidth = margin * this.jeffDeBrugesMeshs.length
            for (let i = 0; i < 17; i++) {
                this.jeffDeBrugesMeshs[i].position.y = (margin * i + this.currentScroll + 42069 * wholeWidth) % wholeWidth - 5 * margin
            }
        }
        if (this.epoptiqueMeshs /*&& this.epoptiqueMeshs[0].material.opacity === 1*/)  {
            let margin = 3
            let wholeWidth = margin * this.epoptiqueMeshs.length
            for (let i = 0; i < 15; i++) {
                this.epoptiqueMeshs[i].position.y = (margin * i + this.currentScroll + 42069 * wholeWidth) % wholeWidth - 5 * margin
            }
        }
    }

    update() {
        if (!this.scalePianoUpdated && this.pianoScaleRatio.length == 16 && this.pianoMeshs.length == 16) {
            this.updatePianoScale()
        }
        if (!this.scaleJeffDeBrugesUpdated && this.jeffDeBrugesScaleRatio.length == 17 && this.jeffDeBrugesMeshs.length == 17) {
            this.updateJeffDeBrugesScale()
        }
        if (!this.scaleEpoptiqueUpdated && this.epoptiqueScaleRatio.length == 15 && this.epoptiqueMeshs.length == 15) {
            this.updateEpoptiqueScale()
        }
        this.updateMeshs()
        this.scroll += (this.scrollTarget - this.scroll) * 0.1
        this.scrollTarget *= 0.9
        this.scroll *= 0.9
        this.currentScroll += this.scroll * 0.01

        this.currentObjectSelected = this.experience.world.raycaster.currentObjectSelected

    }
}