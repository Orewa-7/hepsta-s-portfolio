import * as THREE from 'three'
import gsap from 'gsap'

import Experience from '../Experience.js'
import imageVertexShader from './shaders/Images/vertex.glsl'
import imageFragmentShader from './shaders/Images/fragment.glsl'
import imageFragmentShader2 from './shaders/Images/fragment2.glsl'


export default class Images {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('images')
        }
        this.debugObject = {}
        this.debugObject.lookAtVector = new THREE.Vector3(0, 9, 3)
        this.debugObject.scale = new THREE.Vector2(1, 1)

        //Steup pour la wheel 
        this.imageRadius = 1;
        this.radius = 5
        this.numberOfImages = 25
        this.radianInterval = (2.0 * Math.PI) / this.numberOfImages;
        this.centerOfWheel = {
            x: 0,
            y: 0
        }

        // Recup du DOM
        this.heading1 = document.querySelector('h1')

        // Setup
        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()

        // Event listenner au wheel à la sourie ou au pad NE MARCHE PAS AVEC TEL 
        let scroll_speed = 0.0;
        window.addEventListener('wheel', event => {
            scroll_speed += event.deltaY
            if (!this.meshs.length == 0) {
                for (let i = 0; i < this.meshs.length; i++) {
                    //on replace chaque mesh en fonction du wheel
                    this.meshs[i].position.set(
                        this.centerOfWheel.x + (Math.cos(this.radianInterval * i + scroll_speed) * this.radius),
                        this.centerOfWheel.y + (Math.sin(this.radianInterval * i + scroll_speed) * this.radius),
                        0);
                    //Pour simuler la rotations sur le centre
                    this.meshs[i].lookAt(this.debugObject.lookAtVector)
                    //effet papier dans le glsl
                    this.meshs[i].material.uniforms.uScroll.value = scroll_speed

                    
                }
                console.log(2,this.meshs[1].material.uniforms.uTexture)
            }

        })

        // Event qui attend la fin de scroll
        this.createWheelStopListener(window, () => {
            if (!this.meshs.length == 0) {
                console.log('stoping')
                for (let i = 0; i < this.meshs.length; i++) {
                    //Je lui donne 20 parce que dans vertex.glsl je fais un abs(clamp(-20,20))
                    this.meshs[i].material.uniforms.uScroll.value = 20
                    gsap.to(this.meshs[i].material.uniforms.uScroll, { duration: 0.5, value: 3, ease: 'SlowMo.ease.config(0.1, 1, false)' })
                }
            }
        })

        //Event pour le scroll mobile 
        let count = 0
        let direction
        let ancientDirection = 0
        let scroll_speed_mobile = 0
        window.addEventListener("touchmove", event => {

            // calcul pour savoir la direction du touchmove et changer la direction de la wheel
            direction = event.changedTouches[0].clientX
            if (direction - ancientDirection < 0) {
                scroll_speed_mobile += -(count + 2)
            }
            else {
                scroll_speed_mobile += (count + 2)
            }
            ancientDirection = direction

            if (!this.meshs.length == 0) {
                for (let i = 0; i < this.meshs.length; i++) {
                    //on replace chaque mesh en fonction du wheel
                    this.meshs[i].position.set(
                        this.centerOfWheel.x + (Math.cos(this.radianInterval * i + scroll_speed_mobile) * this.radius),
                        this.centerOfWheel.y + (Math.sin(this.radianInterval * i + scroll_speed_mobile) * this.radius),
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
                this.meshs[i].material.uniforms.uScroll.value = 20
                gsap.to(this.meshs[i].material.uniforms.uScroll, { duration: 0.5, value: 3, ease: 'SlowMo.ease.config(0.1, 1, false)' })
            }
        })

    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(1, 1, 50, 100) //THREE.PlaneGeometry(1, 1.5, 50, 100)
        this.geometry.scale(1, 1, 1)
    }

    setTextures() {
        this.textures = {}
        this.arraytextures = []


        for (let item in this.resources.items) {
            this.arraytextures.push(this.resources.items[item])
        }

        this.textures.flag = this.resources.items.ahmed1
        this.textures.flag.encoding = THREE.sRGBEncoding
    }

    setMaterial() {
        this.materials = []
        this.material = new THREE.ShaderMaterial({
            vertexShader: imageVertexShader,
            fragmentShader: imageFragmentShader,
            uniforms: {
                uTexture: { value: this.arraytextures[1] },
                uScroll: { value: 0 },
            },
        })
        let material
        for (let i = 0; i < 4; i++) {
            material = new THREE.ShaderMaterial({
                vertexShader: imageVertexShader,
                fragmentShader: imageFragmentShader2,
                uniforms: {
                    uTexture: { value: this.arraytextures[3] },
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
            const mesh = new THREE.Mesh(this.geometry, this.material)
            mesh.position.set(
                this.centerOfWheel.x + (Math.cos(this.radianInterval * i) * this.radius),
                this.centerOfWheel.y + (Math.sin(this.radianInterval * i) * this.radius),
                indexZ);
            indexZ += 0.01
            this.meshs.push(mesh)
            this.scene.add(mesh)
            //Pour simuler la rotations sur le centre des meshs
            this.meshs[i].lookAt(this.debugObject.lookAtVector)
        }
        this.meshs[0].material.uniforms.uTexture.value = this.arraytextures[0]
        this.meshs[1].material = this.materials[1]
        this.meshs[2].material = this.materials[2]
        this.meshs[3].material = this.materials[3]
        console.log(2,this.meshs[1].material.uniforms.uTexture)


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


    resize() {
    }

    update() {

        if (this.experience.loadingBar.sceneReady) {
            this.heading1.style.transform = `translate(-50%, -50%) scale(1, 1)`
        }
    }


    //Listener de fin de scroll 
    createWheelStopListener(element, callback, timeout) {
        var handle = null;
        var onScroll = function () {
            if (handle) {
                clearTimeout(handle);
            }
            handle = setTimeout(callback, timeout || 600); // default 200 ms
        };
        element.addEventListener('wheel', onScroll);
        return function () {
            element.removeEventListener('wheel', onScroll);
        };
    }
}