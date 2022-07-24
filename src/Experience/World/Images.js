import * as THREE from 'three'
import gsap from 'gsap'

import Experience from '../Experience.js'
import imageVertexShader from './shaders/Images/vertex.glsl'
import imageFragmentShader from './shaders/Images/fragment.glsl'

export default class Images {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera
        this.debug = this.experience.debug
        this.currentObjectSelected = null


        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('images')
        }
        this.debugObject = {}
        this.debugObject.lookAtVector = new THREE.Vector3(0, 2, 1)
        this.debugObject.scale = new THREE.Vector2(1.164, 1.336)
        this.debugObject.speedRotationMobile = 0.007

        //Steup pour la wheel 
        this.radius = 2
        this.numberOfImages = 5
        this.radianInterval = (2.0 * Math.PI) / this.numberOfImages
        this.centerOfWheel = {
            x: 0,
            y: 0
        }

        // Recup du DOM
        this.scrollIndicator = document.querySelector('.scroll-indicator-section')
        this.scrollDisapear = false
        this.heading1 = document.querySelector('h1')
        // this.nav = document.querySelector('nav')
        // this.nav.style.zIndex = '1'
        // this.aboutButton = document.querySelector('.about')
        this.aboutButton = document.querySelector('.button-about')
        this.passed = true

        // Setup
        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()


        // Event listenner au wheel à la sourie ou au pad
        this.scroll = 0
        this.scrollTarget = 0
        this.currentScroll = 0
        let scroll_speed = 0.0
        window.addEventListener('wheel', event => {
            if (!this.scrollDisapear) {
                gsap.to(this.scrollIndicator, { opacity: 0, duration: 1 })
                gsap.to(this.scrollIndicator, { scaleX: 0, scaleY: 0, }).delay(1)
                this.scrollDisapear = true
            }

            if (!this.currentObjectSelected) {

                this.scrollTarget = event.wheelDelta * 0.5
                // this.heading1.style.zIndex = '1'
                if (!this.meshs.length == 0) {
                    for (let i = 0; i < this.meshs.length; i++) {

                        //Pour simuler la rotations sur le centre
                        this.meshs[i].lookAt(this.debugObject.lookAtVector)
                        //effet papier dans le glsl
                        this.meshs[i].material.uniforms.uScroll.value = this.currentScroll * 100
                    }
                }
            }
        })

        // Event qui attend la fin de scroll
        this.createWheelStopListener(window, () => {
            if (!this.meshs.length == 0) {
                for (let i = 0; i < this.meshs.length; i++) {
                    //Je lui donne 20 parce que dans vertex.glsl je fais un abs(clamp(-20,20))
                    this.meshs[i].material.uniforms.uScroll.value = 10
                    gsap.to(this.meshs[i].material.uniforms.uScroll, { duration: 0.5, value: 1, ease: 'SlowMo.ease.config(0.1, 1, false)' })
                }
            }

        })

        //Event pour le scroll mobile 
        let count_mobile = 0
        let direction_mobile
        let ancientDirection_mobile = 0
        let scroll_speed_mobile = 0
        // Touchemove pour mobile 
        window.addEventListener("touchmove", event => {
            // calcul pour savoir la direction_mobile du touchmove et changer la direction_mobile de la wheel
            direction_mobile = event.changedTouches[0].clientX
            if (direction_mobile - ancientDirection_mobile > 0) {
                scroll_speed_mobile += -(count_mobile + 1)
            }
            else {
                scroll_speed_mobile += (count_mobile + 1)
            }
            ancientDirection_mobile = direction_mobile

            // mettre en place les Meshs
            if (!this.meshs.length == 0) {
                for (let i = 0; i < this.meshs.length; i++) {
                    //on replace chaque mesh en fonction du wheel
                    this.meshs[i].position.set(
                        this.centerOfWheel.x + (Math.cos((this.radianInterval * i + scroll_speed_mobile * this.debugObject.speedRotationMobile)) * this.radius),
                        this.centerOfWheel.y + (Math.sin((this.radianInterval * i + scroll_speed_mobile * this.debugObject.speedRotationMobile)) * this.radius),
                        0);
                    //Pour simuler la rotations sur le centre
                    this.meshs[i].lookAt(this.debugObject.lookAtVector)
                    //effet papier dans le glsl
                    this.meshs[i].material.uniforms.uScroll.value = scroll_speed_mobile
                }
            }
        })

        window.addEventListener("touchend", event => {
            for (let i = 0; i < this.meshs.length; i++) {
                //Je lui donne 20 parce que dans vertex.glsl je fais un abs(clamp(-20,20))
                this.meshs[i].material.uniforms.uScroll.value = 10
                gsap.to(this.meshs[i].material.uniforms.uScroll, { duration: 0.5, value: 1, ease: 'SlowMo.ease.config(0.1, 1, false)' })
            }
        })

        // Dragging le contenu
        let direction
        let ancientDirection = 0
        window.addEventListener('mousedown', event => {

            if (!this.scrollDisapear) {
                const tl = gsap.timeline()
                tl.to(this.scrollIndicator, { opacity: 0, duration: 1 })
                    .to(this.scrollIndicator, { scaleX: 0, scaleY: 0 })
                this.scrollDisapear = true
            }


            // Quand on drag and drop
            window.onmousemove = (event) => {
                window.removeEventListener('click', this.experience.world.raycaster.clickEvent)

                // calcul pour savoir la direction du touchmove et changer la direction de la wheel
                direction = event.clientX

                if (direction - ancientDirection > 0) {
                    // scroll_speed_drag += -(count + 1)
                    this.scrollTarget = 30
                }
                else {
                    // scroll_speed_drag += (count + 1)
                    this.scrollTarget = -30
                }
                ancientDirection = direction


                // mettre en place les Meshs
                if (!this.meshs.length == 0) {
                    for (let i = 0; i < this.meshs.length; i++) {

                        //effet papier dans le glsl
                        this.meshs[i].material.uniforms.uScroll.value = this.scrollTarget
                    }
                }
            }

        })
        // arret du drag
        window.addEventListener('mouseup', event => {
            window.onmousemove = null
            window.setTimeout(() => {
                for (let i = 0; i < this.meshs.length; i++) {
                    if (!this.currentObjectSelected) {
                        //Je lui donne 20 parce que dans vertex.glsl je fais un abs(clamp(-20,20))
                        this.meshs[i].material.uniforms.uScroll.value = 10
                        gsap.to(this.meshs[i].material.uniforms.uScroll, { duration: 0.5, value: 1, ease: 'SlowMo.ease.config(0.1, 1, false)' })
                    }

                }
            }, 300)

        })
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(1, 1, 50, 100) //THREE.PlaneGeometry(1, 1.5, 50, 100)
        this.geometry.scale(this.debugObject.scale.x, this.debugObject.scale.y, 1)
    }

    setTextures() {
        this.textures = {}
        this.arraytextures = []
        this.names = []
        this.descriptions = []
        // on recupere toute les texture et on les store dans un array 
        for (let item in this.resources.items) {
            // this.resources.items[item].encoding = THREE.sRGBEncoding
            // this.arraytextures.push(this.resources.items[item])
            this.arraytextures.push(this.resources.items[item].file)

            // this.names.push(item)
            this.names.push(this.resources.items[item].projectName)

            // this.descriptions.push(this.resources.items[item].description)
            this.descriptions[this.resources.items[item].projectName] = this.resources.items[item].description
        }
    }

    setMaterial() {
        this.materials = []

        let material
        for (let i = 0; i < this.numberOfImages; i++) {
            material = new THREE.ShaderMaterial({
                vertexShader: imageVertexShader,
                fragmentShader: imageFragmentShader,
                uniforms: {
                    uTexture: { value: this.arraytextures[i] },
                    uScroll: { value: 0 },
                },
            })
            this.materials.push(material)

        }

    }

    setMesh() {

        this.meshs = []
        let indexZ = 0
        //je cree un tableau de meshes 
        for (let i = 0; i < this.numberOfImages; i++) {
            const mesh = new THREE.Mesh(this.geometry, this.materials[i])
            mesh.position.set(
                this.centerOfWheel.x + (Math.cos(this.radianInterval * i) * this.radius),
                this.centerOfWheel.y + (Math.sin(this.radianInterval * i) * this.radius),
                indexZ);
            indexZ += 0.01
            mesh.name = this.names[i]

            this.meshs.push(mesh)
            this.scene.add(mesh)
            //Pour simuler la rotations sur le centre des meshs
            this.meshs[i].lookAt(this.debugObject.lookAtVector)
            this.meshs[i].scale.set(this.debugObject.scale.x, this.debugObject.scale.y, 1)
        }


        // Debug
        if (this.debug.active) {

            //Scale of the mesh
            this.debugFolder
                .add(this.debugObject.scale, 'x')
                .name('scaleX')
                .min(0)
                .max(2)
                .step(0.001)
                .onChange(() => {
                    for (let i = 0; i < this.meshs.length; i++) {
                        this.meshs[i].scale.set(this.debugObject.scale.x, this.debugObject.scale.y, 1)
                    }
                })
            this.debugFolder
                .add(this.debugObject.scale, 'y')
                .name('scaleY')
                .min(0)
                .max(2)
                .step(0.001)
                .onChange(() => {
                    for (let i = 0; i < this.meshs.length; i++) {
                        this.meshs[i].scale.set(this.debugObject.scale.x, this.debugObject.scale.y, 1)
                    }
                })

            // LookAt y
            this.debugFolder
                .add(this.debugObject.lookAtVector, 'y')
                .name('lookAtY')
                .min(0)
                .max(10)
                .step(0.001)
                .onChange(() => {
                    for (let i = 0; i < this.meshs.length; i++) {
                        this.meshs[i].lookAt(this.debugObject.lookAtVector)
                    }
                })

            // LookAt z
            this.debugFolder
                .add(this.debugObject.lookAtVector, 'z')
                .name('lookAtZ')
                .min(0)
                .max(10)
                .step(0.001)
                .onChange(() => {
                    for (let i = 0; i < this.meshs.length; i++) {
                        this.meshs[i].lookAt(this.debugObject.lookAtVector)
                    }
                })
        }

    }
    updateMeshes() {
        if (!this.meshs.length == 0 && !this.currentObjectSelected) {
            for (let i = 0; i < this.meshs.length; i++) {
                this.meshs[i].position.set(
                    (Math.cos((this.radianInterval * i - this.currentScroll)) * this.radius),
                    (Math.sin((this.radianInterval * i - this.currentScroll)) * this.radius),
                    0);

                this.meshs[i].lookAt(this.debugObject.lookAtVector)
            }
        }
    }
    resize() {
    }

    update() {

        if (this.experience.loadingBar.sceneReady && this.passed) {
            this.heading1.style.transform = `translate(-50%, -50%) scale(1, 1)`
            this.aboutButton.style.transform = 'scale(1,1)'
            // this.nav.style.transform = `scale(1,1)`
            this.scrollIndicator.style.opacity = 0.7
            this.passed = false
        }

        this.currentObjectSelected = this.experience.world.raycaster.currentObjectSelected
        // On update le scroll
        this.updateMeshes()
        this.scroll += (this.scrollTarget - this.scroll) * 0.1
        this.scroll *= 0.9
        this.scrollTarget *= 0.9
        this.currentScroll += this.scroll * 0.001

    }


    //Listener de fin de scroll 
    createWheelStopListener(element, callback, timeout) {
        var handle = null;
        var onScroll = function () {
            if (handle) {
                clearTimeout(handle);
            }
            handle = setTimeout(callback, timeout || 700); // default 200 ms
        };
        element.addEventListener('wheel', onScroll);
        return function () {
            element.removeEventListener('wheel', onScroll);
        };
    }
}