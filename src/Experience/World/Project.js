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
        this.scalePortraitsIUpdated = false
        this.scalePortraitsIIUpdated = false

        this.isClickedSeeMore = false

        this.tweening = false
        this.addons = 0

        /**
        * Sounds
        */
        this.windSound = new Audio('/Sounds/wind.mp3')
        this.playWindSound = () => {
            this.windSound.play()
        }

        // DOM
        // this.seeMore = document.querySelector('.see-more')
        this.seeMore = document.querySelector('.button-see-more')
        this.firstArrow = document.querySelector('.arrows-see-more').children[0]
        this.secondArrow = document.querySelector('.arrows-see-more').children[1]
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
            this.playWindSound()
            this.clickSeeMore()
        }

        this.clamp = (num, min, max) => Math.min(Math.max(num, min), max)

        this.setPiano()
        this.setJeffDeBruges()
        this.setEpoptique()
        this.setPortraitsI()
        this.setPortraitsII()
    }
    projectsWheelHandler(event) {
        // this.scrollTarget = - Math.sign(event.wheelDelta) * 25
        this.scrollTarget = - this.clamp(event.wheelDelta, -25, 25)
    }

    clickSeeMore() {

        if (!this.isClickedSeeMore && !gsap.isTweening(this.camera.instance.rotation)) {
            window.setTimeout(() => {
                this.scrollTarget = 50
            }, 1000)

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
                case 'Portraits I': this.setOpacityportraitsI(true)
                    break
                case 'Portraits II': this.setOpacityportraitsII(true)
                    break
            }

            this.firstArrow.classList.remove('arrow-first-right')
            this.secondArrow.classList.remove('arrow-second-right')
            this.firstArrow.classList.add('arrow-first-left')
            this.secondArrow.classList.add('arrow-second-left')
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
                case 'Portraits I': this.setOpacityportraitsI(false)
                    break
                case 'Portraits II': this.setOpacityportraitsII(false)
                    break
            }


            this.firstArrow.classList.remove('arrow-first-left')
            this.secondArrow.classList.remove('arrow-second-left')
            this.firstArrow.classList.add('arrow-first-right')
            this.secondArrow.classList.add('arrow-second-right')

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
                this.pianoScaleRatio[i] = (this.pianoTextures[i].image.height / this.pianoTextures[i].image.width).toFixed(2)
            })

        }
    }
    setPianoGeometry() {
        this.pianoGeometry = new THREE.PlaneGeometry(2, 2)
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
            pianoMesh.position.x = 5
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
    setOpacitypiano(opacity) {
        if (opacity) {
            for (let i = 0; i < 16; i++) {
                gsap.to(this.pianoMeshs[i].material, { opacity: 1, duration: 1 })
            }
        } else {
            for (let i = 0; i < 16; i++) {
                gsap.to(this.pianoMeshs[i].material, { opacity: 0, duration: 1 })
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
                this.jeffDeBrugesScaleRatio[i] = (this.jeffDeBrugesTextures[i].image.height / this.jeffDeBrugesTextures[i].image.width).toFixed(2)
            })

        }
    }
    setJeffDeBrugesGeometry() {
        this.jeffDeBrugesGeometry = new THREE.PlaneGeometry(2.5, 2.5)
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
            jeffDeBrugesMesh.position.x = 6
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
        this.scaleJeffDeBrugesUpdated = true
    }
    setOpacityJeffDeBruges(opacity) {
        if (opacity) {
            for (let i = 0; i < 17; i++) {
                gsap.to(this.jeffDeBrugesMeshs[i].material, { opacity: 1, duration: 1 })
            }
        } else {
            for (let i = 0; i < 17; i++) {
                gsap.to(this.jeffDeBrugesMeshs[i].material, { opacity: 0, duration: 1 })
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
                this.epoptiqueScaleRatio[i] = (this.epoptiqueTextures[i].image.height / this.epoptiqueTextures[i].image.width).toFixed(2)
            })

        }
    }
    setEpoptiqueGeometry() {
        this.epoptiqueGeometry = new THREE.PlaneGeometry(2.5, 2.5)
    }
    setEpoptiqueMaterial() {
        this.epoptiqueMaterials = []


        for (let i = 0; i < 15; i++) {
            this.epoptiqueTextures[i].encoding = THREE.sRGBEncoding
            const material = new THREE.MeshBasicMaterial({
                map: this.epoptiqueTextures[i],
                transparent: true,
                depthWrite: false,
                opacity: 0,
            })
            this.epoptiqueMaterials.push(material)
        }
    }
    setEpoptiqueMesh() {
        this.epoptiqueMeshs = []
        for (let i = 0; i < 15; i++) {
            const epoptiqueMesh = new THREE.Mesh(this.epoptiqueGeometry, this.epoptiqueMaterials[i])
            epoptiqueMesh.position.x = 6
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
    }
    setOpacityepoptique(opacity) {
        if (opacity) {
            for (let i = 0; i < 15; i++) {
                gsap.to(this.epoptiqueMeshs[i].material, { opacity: 1, duration: 1 })
            }
        } else {
            for (let i = 0; i < 15; i++) {
                gsap.to(this.epoptiqueMeshs[i].material, { opacity: 0, duration: 1 })
            }
        }

    }

    /**
    * Portraits I
    */
    setPortraitsI() {
        this.setPortraitsITexture()
        this.setPortraitsIGeometry()
        this.setPortraitsIMaterial()
        this.setPortraitsIMesh()
    }
    setPortraitsITexture() {
        this.portraitsIScaleRatio = []
        this.portraitsITextures = []

        this.textureLoader = new THREE.TextureLoader()
        for (let i = 0; i < 18; i++) {
            this.portraitsITextures[i] = new THREE.TextureLoader().load(`/Projects/Portraits/Portraits-I-${i + 1}.jpg`, (tex) => {
                this.portraitsIScaleRatio[i] = (this.portraitsITextures[i].image.height / this.portraitsITextures[i].image.width).toFixed(2)
            })

        }
    }
    setPortraitsIGeometry() {
        this.portraitsIGeometry = new THREE.PlaneGeometry(2, 2)
    }
    setPortraitsIMaterial() {
        this.portraitsIMaterials = []


        for (let i = 0; i < 18; i++) {
            this.portraitsITextures[i].encoding = THREE.sRGBEncoding
            const material = new THREE.MeshBasicMaterial({ map: this.portraitsITextures[i], transparent: true, opacity: 0, depthWrite: false })
            this.portraitsIMaterials.push(material)
        }
    }
    setPortraitsIMesh() {
        this.portraitsIMeshs = []
        for (let i = 0; i < 18; i++) {
            const portraitsIMesh = new THREE.Mesh(this.portraitsIGeometry, this.portraitsIMaterials[i])
            portraitsIMesh.position.x = 5
            portraitsIMesh.position.y = i * 2
            portraitsIMesh.position.z = 3
            portraitsIMesh.rotation.y -= Math.PI * 0.5


            this.scene.add(portraitsIMesh)

            this.portraitsIMeshs.push(portraitsIMesh)
        }
    }
    updatePortraitsIScale() {
        for (let i = 0; i < 18; i++) {
            this.portraitsIMeshs[i].scale.set(1, this.portraitsIScaleRatio[i])
        }
        this.scalePortraitsIUpdated = true
    }
    setOpacityportraitsI(opacity) {
        if (opacity) {
            for (let i = 0; i < 18; i++) {
                gsap.to(this.portraitsIMeshs[i].material, { opacity: 1, duration: 1 })
            }
        } else {
            for (let i = 0; i < 18; i++) {
                gsap.to(this.portraitsIMeshs[i].material, { opacity: 0, duration: 1 })
            }
        }

    }

    /**
    * Portraits II
    */
    setPortraitsII() {
        this.setPortraitsIITexture()
        this.setPortraitsIIGeometry()
        this.setPortraitsIIMaterial()
        this.setPortraitsIIMesh()
    }
    setPortraitsIITexture() {
        this.portraitsIIScaleRatio = []
        this.portraitsIITextures = []

        this.textureLoader = new THREE.TextureLoader()
        for (let i = 0; i < 8; i++) {
            this.portraitsIITextures[i] = new THREE.TextureLoader().load(`/Projects/Portraits/Portraits-II-${i + 1}.jpg`, (tex) => {
                this.portraitsIIScaleRatio[i] = (this.portraitsIITextures[i].image.height / this.portraitsIITextures[i].image.width).toFixed(2)
            })
        }

    }
    setPortraitsIIGeometry() {
        this.portraitsIIGeometry = new THREE.PlaneGeometry(2, 2)
    }
    setPortraitsIIMaterial() {
        this.portraitsIIMaterials = []


        for (let i = 0; i < 8; i++) {
            this.portraitsIITextures[i].encoding = THREE.sRGBEncoding
            const material = new THREE.MeshBasicMaterial({ map: this.portraitsIITextures[i], transparent: true, opacity: 0, depthWrite: false })
            this.portraitsIIMaterials.push(material)
        }
    }
    setPortraitsIIMesh() {
        this.portraitsIIMeshs = []
        for (let i = 0; i < 8; i++) {
            const portraitsIIMesh = new THREE.Mesh(this.portraitsIIGeometry, this.portraitsIIMaterials[i])
            portraitsIIMesh.position.x = 5
            portraitsIIMesh.position.y = i * 2
            portraitsIIMesh.position.z = 3
            portraitsIIMesh.rotation.y -= Math.PI * 0.5


            this.scene.add(portraitsIIMesh)

            this.portraitsIIMeshs.push(portraitsIIMesh)
        }
    }
    updatePortraitsIIScale() {
        for (let i = 0; i < 8; i++) {
            this.portraitsIIMeshs[i].scale.set(1, this.portraitsIIScaleRatio[i])
        }
        this.scalePortraitsIIUpdated = true
    }
    setOpacityportraitsII(opacity) {
        if (opacity) {
            for (let i = 0; i < 8; i++) {
                gsap.to(this.portraitsIIMeshs[i].material, { opacity: 1, duration: 1 })
            }
        } else {
            for (let i = 0; i < 8; i++) {
                gsap.to(this.portraitsIIMeshs[i].material, { opacity: 0, duration: 1 })
            }
        }

    }

    /******************************************** */

    /**
     * Updating things
     */
    updateMeshs() {
        if (this.pianoMeshs /*&& this.pianoMeshs[0].material.opacity === 1*/) {
            let margin = 4.5
            let snap = gsap.utils.snap(4.5)
            let wholeWidth = margin * this.pianoMeshs.length
            for (let i = 0; i < 16; i++) {
                let mouvement = (margin * i + this.currentScroll + 42069 * wholeWidth) % wholeWidth - 1 * margin + this.addons
                
                if (-0.001 < this.scrollTarget - this.scroll && this.scrollTarget - this.scroll < 0.001 && !gsap.isTweening(this.pianoMeshs[i].position)) {
                    gsap.to(this.pianoMeshs[i].position, { y: snap(mouvement), duration: 0.5 })
                    this.tweening = true
                }
                else if (!gsap.isTweening(this.pianoMeshs[i].position)) {
                    if (this.tweening) {
                        // this.addons += Math.sign(this.scroll) * (mouvement - snap(mouvement))
                        this.addons += (snap(mouvement) - mouvement)
                        this.tweening = false
                    }
                    this.pianoMeshs[i].position.y = mouvement
                }
                // this.pianoMeshs[i].position.y = (margin * i + this.currentScroll + 42069 * wholeWidth) % wholeWidth - 5 * margin
            }
        }
        if (this.jeffDeBrugesMeshs /*&& this.pianoMeshs[0].material.opacity === 1*/) {
            let margin = 4.5
            let snap = gsap.utils.snap(4.5)
            let wholeWidth = margin * this.jeffDeBrugesMeshs.length
            for (let i = 0; i < 17; i++) {
                let mouvement = (margin * i + this.currentScroll + 42069 * wholeWidth) % wholeWidth - 1 * margin + this.addons
                
                if (-0.001 < this.scrollTarget - this.scroll && this.scrollTarget - this.scroll < 0.001 && !gsap.isTweening(this.jeffDeBrugesMeshs[i].position)) {
                    gsap.to(this.jeffDeBrugesMeshs[i].position, { y: snap(mouvement), duration: 0.5 })
                    this.tweening = true
                }
                else if (!gsap.isTweening(this.jeffDeBrugesMeshs[i].position)) {
                    if (this.tweening) {
                        // this.addons += Math.sign(this.scroll) * (mouvement - snap(mouvement))
                        this.addons += (snap(mouvement) - mouvement)
                        this.tweening = false
                    }
                    this.jeffDeBrugesMeshs[i].position.y = mouvement
                }

                // this.jeffDeBrugesMeshs[i].position.y = (margin * i + this.currentScroll + 42069 * wholeWidth) % wholeWidth - 5 * margin
            }
        }
        if (this.epoptiqueMeshs /*&& this.epoptiqueMeshs[0].material.opacity === 1*/) {
            let margin = 4.5
            let snap = gsap.utils.snap(4.5)
            let wholeWidth = margin * this.epoptiqueMeshs.length
            for (let i = 0; i < 15; i++) {
                let mouvement = (margin * i + this.currentScroll + 42069 * wholeWidth) % wholeWidth - 1 * margin + this.addons
                
                if (-0.001 < this.scrollTarget - this.scroll && this.scrollTarget - this.scroll < 0.001 && !gsap.isTweening(this.epoptiqueMeshs[i].position)) {
                    gsap.to(this.epoptiqueMeshs[i].position, { y: snap(mouvement), duration: 0.5 })
                    this.tweening = true
                }
                else if (!gsap.isTweening(this.epoptiqueMeshs[i].position)) {
                    if (this.tweening) {
                        // this.addons += Math.sign(this.scroll) * (mouvement - snap(mouvement))
                        this.addons += (snap(mouvement) - mouvement)
                        this.tweening = false
                    }
                    this.epoptiqueMeshs[i].position.y = mouvement
                }

                // this.epoptiqueMeshs[i].position.y = (margin * i + this.currentScroll + 42069 * wholeWidth) % wholeWidth - 5 * margin
            }
        }
        if (this.portraitsIMeshs /*&& this.portraitsIMeshs[0].material.opacity === 1*/) {
            let margin = 4.5
            let snap = gsap.utils.snap(4.5)
            let wholeWidth = margin * this.portraitsIMeshs.length
            for (let i = 0; i < 18; i++) {
                let mouvement = (margin * i + this.currentScroll + 42069 * wholeWidth) % wholeWidth - 1 * margin + this.addons

                if (-0.001 < this.scrollTarget - this.scroll && this.scrollTarget - this.scroll < 0.001 && !gsap.isTweening(this.portraitsIMeshs[i].position)) {
                    gsap.to(this.portraitsIMeshs[i].position, { y: snap(mouvement), duration: 0.5 })
                    this.tweening = true
                }
                else if (!gsap.isTweening(this.portraitsIMeshs[i].position)) {
                    if (this.tweening) {
                        // this.addons += Math.sign(this.scroll) * (mouvement - snap(mouvement))
                        this.addons += (snap(mouvement) - mouvement)
                        this.tweening = false
                    }
                    this.portraitsIMeshs[i].position.y = mouvement
                }
                // this.portraitsIMeshs[i].position.y = (margin * i + this.currentScroll + 42069 * wholeWidth) % wholeWidth - 5 * margin
            }
        }
        if (this.portraitsIIMeshs /*&& this.portraitsIMeshs[0].material.opacity != 0*/) {
            let margin = 4.5
            let snap = gsap.utils.snap(4.5)
            let wholeWidth = margin * this.portraitsIIMeshs.length
            for (let i = 0; i < 8; i++) {
                let mouvement = (margin * i + this.currentScroll + 42069 * wholeWidth) % wholeWidth - 1 * margin + this.addons

                // if( -0.01 < this.scroll && this.scroll < 0.01 && !gsap.isTweening(this.portraitsIIMeshs[i].position)){
                //     gsap.to(this.portraitsIIMeshs[i].position, {y: snap(mouvement)})

                //     this.tweening = true
                // } 
                // else if (!gsap.isTweening(this.portraitsIIMeshs[i].position)) {
                //     if(this.tweening){
                //         this.addons += Math.sign(this.scroll) * (mouvement - snap(mouvement))
                //         this.tweening = false
                // console.log(this.addons)

                //     } 
                // this.portraitsIIMeshs[i].position.y = mouvement
                // }

                /**
                 * Le promble que j'ai c'est que gsap fonctionne tout le temps au début, il force la position pendant quelque milliseconde
                 * L'autre probleme c'est qu'on garde la position du else if si on veut re scroll
                 */

                //  this.portraitsIIMeshs[i].position.y = (margin * i + this.currentScroll + 42069 * wholeWidth) % wholeWidth - 5 * margin

                /**
                 * Autre 
                 */
                if (-0.001 < this.scrollTarget - this.scroll && this.scrollTarget - this.scroll < 0.001 && !gsap.isTweening(this.portraitsIIMeshs[i].position)) {
                    gsap.to(this.portraitsIIMeshs[i].position, { y: snap(mouvement), duration: 0.5 })
                    this.tweening = true
                }
                else if (!gsap.isTweening(this.portraitsIIMeshs[i].position)) {
                    if (this.tweening) {
                        // this.addons += Math.sign(this.scroll) * (mouvement - snap(mouvement))
                        this.addons += (snap(mouvement) - mouvement)
                        this.tweening = false
                    }
                    this.portraitsIIMeshs[i].position.y = mouvement
                }
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
        if (!this.scalePortraitsIUpdated && this.portraitsIScaleRatio.length == 18 && this.portraitsIMeshs.length == 18) {
            this.updatePortraitsIScale()
        }
        if (!this.scalePortraitsIIUpdated && this.portraitsIIScaleRatio.length == 8 && this.portraitsIIMeshs.length == 8) {
            this.updatePortraitsIIScale()
        }
        this.updateMeshs()
        this.scroll += (this.scrollTarget - this.scroll) * 0.1
        this.scrollTarget *= 0.9
        this.scroll *= 0.9
        this.currentScroll += this.scroll * 0.01

        this.currentObjectSelected = this.experience.world.raycaster.currentObjectSelected

    }
}