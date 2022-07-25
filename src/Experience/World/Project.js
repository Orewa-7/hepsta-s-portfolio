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

        this.scaleUpdated = false
        this.isClickedSeeMore = false

        // DOM
        this.seeMore = document.querySelector('.see-more')
        this.blocDescription = document.querySelector('.bloc-description')
        this.BacktoProject = document.querySelector('.button-back')
        this.scrollIndicator = document.querySelector('.description-scroll-container')



        this.seeMore.onclick = () => {
            this.clickSeeMore()
        }

        this.setPiano()
    }

    clickSeeMore() {

        if (!this.isClickedSeeMore && !gsap.isTweening(this.camera.instance.rotation)) 
        {
            gsap.to(this.camera.instance.rotation, { y: this.camera.instance.rotation.y - Math.PI * 0.5, duration: 1})

            const tl = gsap.timeline()

            tl.to(this.BacktoProject, { scaleX: 0, scaleY: 0, duration: 0.5 })
            tl.call(()=> {
            this.BacktoProject.classList.toggle('invisible')
            this.scrollIndicator.classList.toggle('invisible')
            })
            tl.to(this.scrollIndicator, { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.7)' })
            

            this.isClickedSeeMore = !this.isClickedSeeMore
        } 
        else if (this.isClickedSeeMore && !gsap.isTweening(this.camera.instance.rotation)) 
        {
            gsap.to(this.camera.instance.rotation, { y: this.camera.instance.rotation.y + Math.PI * 0.5, duration: 1})
            
            const tl = gsap.timeline()
            tl.to(this.scrollIndicator, {scaleX: 0, scaleY:0, duration: 0.5})
            tl.call(()=> {
                this.BacktoProject.classList.toggle('invisible')
                this.scrollIndicator.classList.toggle('invisible')
                })
            tl.to(this.BacktoProject, { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.7)' })
            

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
            const material = new THREE.MeshBasicMaterial({ map: this.pianoTextures[i] })
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
            console.log(i, this.pianoMeshs[i].material.map.source.data.height / this.pianoMeshs[i].material.map.source.data.width, this.pianoScaleRatio[i])
            this.pianoMeshs[i].scale.set(1, this.pianoScaleRatio[i])
        }
        this.scaleUpdated = true
    }

    update() {

        if (!this.scaleUpdated && this.pianoScaleRatio.length == 16 && this.pianoMeshs.length == 16) {
            this.updatePianoScale()

        }
    }
}