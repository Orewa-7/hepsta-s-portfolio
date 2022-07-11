import * as THREE from 'three'
import gsap from 'gsap'

import Experience from '../Experience.js'

export default class Raycaster {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.sizes = this.experience.sizes
        this.meshs = this.experience.world.images.meshs
        this.blackScreen = this.experience.world.images.blackScreen
        this.ImageDebugObject = this.experience.world.images.debugObject
        this.descriptions = this.experience.world.images.descriptions

        // Recup du DOM
        this.heading1 = document.querySelector('h1')
        this.body = document.getElementsByTagName("body")[0]
        this.blocDescription = document.querySelector('.bloc-description')
        this.seeMore = document.querySelector('.see-more')
        this.projectName = document.querySelector('.project-name')
        this.projectInfo = document.querySelector('.project-info')
        this.blocTitle = document.querySelector('.title')
        this.BacktoProject = document.querySelector('.back')
        this.canvas = document.querySelector('.webgl')

        /**
        * Sounds
        */
        this.whooshSound = new Audio('/Sounds/whoosh.mp3')
        const playWhooshSound = () => {
            this.whooshSound.play()
        }

        // Setup
        this.clicked = false
        this.currentObjectSelected = null
        this.setMouse()
        this.setRaycaster()

        /**
         * Event Listenner
         */
        this.seeMore.onclick = () => {
            console.log('on a cliquer sur see more')
        }

        // quand on clique sur le bouton "Back on revient dans les projets"
        this.BacktoProject.onclick = () => {
            // Si on a deja un object de selectionner
            if (this.currentObjectSelected) {
                playWhooshSound()
                //on remet la camera à sa place
                gsap.to(this.camera.instance.position, { x: this.camera.positionDeBase.x, y: this.camera.positionDeBase.y, z: this.camera.positionDeBase.z, duration: 1, ease: 'power4.inOut' })
                //on remet l'objet a sa place initial
                gsap.to(this.currentObjectSelected.position, { x: initialPosition.x, y: initialPosition.y, z: initialPosition.z, duration: 1, ease: 'power4.inOut' })
                // on remet l'index de H1 à 1
                gsap.to(this.heading1.style, { zIndex: 1, duration: 0.5, ease: 'power4.inOut' })
                gsap.to(this.heading1.style, { left: '50%', duration: 0.5, ease: 'power4.inOut' })

                gsap.to(this.blocDescription.style, { opacity: 0, duration: 1, ease: 'power4.inOut' })
                // // on repasse le black screen à opacite 0
                // gsap.to(this.blackScreen.material, { opacity: 0, duration: 1, ease: 'power4.inOut' })

                // On active le invisible
                this.seeMore.classList.toggle('invisible')
                this.blocTitle.classList.toggle('invisible')
                // this.projectInfo.classList.toggle('invisible')
                this.BacktoProject.classList.toggle('invisible')
                this.projectName.textContent = ''
                this.projectInfo.textContent = ''

                //SetTimeout pour attendre la fin de l'animation gsap
                window.setTimeout(() => {
                    //on remet la bonne rotation au mesh séléctionner
                    this.currentObjectSelected.lookAt(this.ImageDebugObject.lookAtVector)
                    // on enleve l'objet selectionner
                    this.currentObjectSelected = null
                }, 910)
            }
        }

        // variable pour stocker la position initial avant le click
        let initialPosition
        const clickEvent = () => {
            //Si on a pas d'object deja séléctionner ET qu'on hover un object
            if (this.currentIntersect && !this.currentObjectSelected) {
                // on s'assure qu'on a pas déjà un object séléctionner
                if (this.currentObjectSelected == null) {
                    this.currentObjectSelected = this.currentIntersect.object
                    initialPosition = new THREE.Vector3(this.currentIntersect.object.position.x, this.currentIntersect.object.position.y, this.currentIntersect.object.position.z)
                    gsap.to(this.heading1.style, { zIndex: -1, duration: 0.1, ease: 'power4.inOut' })
                    gsap.to(this.heading1.style, { left: '-100%', duration: 0.1, ease: 'power4.inOut' })

                    gsap.to(this.blocDescription.style, { opacity: 1, duration: 1, ease: 'power4.inOut' })


                    // On desactive le invisible
                    this.seeMore.classList.toggle('invisible')
                    this.blocTitle.classList.toggle('invisible')
                    // this.projectInfo.classList.toggle('invisible')
                    this.BacktoProject.classList.toggle('invisible')
                    this.projectName.append(this.currentIntersect.object.name)
                    this.projectInfo.append(this.descriptions[this.currentIntersect.object.name])

                    // on lui dit de ragarder lui meme donc en face
                    this.currentIntersect.object.lookAt(this.currentIntersect.object.position)

                    // on bouge la camera et l'objet en haut
                    gsap.to(this.currentIntersect.object.position, { x: -0.75, y: 4.5, z: 1, duration: 1, ease: 'power4.inOut' })
                    gsap.to(this.camera.instance.position, { x: 0, y: 4.5, z: 4, duration: 1, ease: 'power4.inOut' })


                }
            }
        }
        //on passe l'event du click à image pour le remove quand on mousemove
        this.clickEvent = clickEvent

        // on add l'eevent du click
        window.addEventListener('click', clickEvent)

        // on destock l'object selectionner si on wheel comme ça si on reclique on a pas de bug
        // window.addEventListener('wheel', event => {
        //     if (this.currentObjectSelected) {
        //         this.currentObjectSelected = null
        //         gsap.to(this.camera.instance.position, { x: this.camera.positionDeBase.x, y: this.camera.positionDeBase.y, z: this.camera.positionDeBase.z, duration: 0.1, ease: 'power4.inOut' })

        //         gsap.to(this.heading1.style, { zIndex: 1, duration: 0.5, ease: 'power4.inOut' })
        //         gsap.to(this.heading1.style, { left: '50%', duration: 0.5, ease: 'power4.inOut' })
        //         this.seeMore.classList.toggle('invisible')
        //         this.blocTitle.classList.toggle('invisible')
        //         this.BacktoProject.classList.toggle('invisible')
        //         // this.projectInfo.classList.toggle('invisible')
        //         this.projectName.textContent = ''
        //         this.projectInfo.textContent = ''
        //     }
        // })
        // window.addEventListener("touchmove", event => {
        //     if (this.currentObjectSelected) {
        //         this.currentObjectSelected = null
        //         gsap.to(this.camera.instance.position, { x: this.camera.positionDeBase.x, y: this.camera.positionDeBase.y, z: this.camera.positionDeBase.z, duration: 0.1, ease: 'power4.inOut' })
        //         gsap.to(this.heading1.style, { left: '50%', duration: 0.1, ease: 'power4.inOut' })
        //         this.seeMore.classList.toggle('invisible')
        //         this.blocTitle.classList.toggle('invisible')
        //         this.BacktoProject.classList.toggle('invisible')
        //         // this.projectInfo.classList.toggle('invisible')
        //         this.projectName.textContent = ''
        //         this.projectInfo.textContent = ''
        //     }
        // })

        // si on a séléctionner la photo on desactive le dragging pendant la selection
        window.addEventListener("mousedown", event => {

            if (this.currentObjectSelected) {
                window.onmousemove = null
            }
        })

        // on annule le onmousemove et on re add le clickevent (parce qu'on enleve dans images.js dans le onmousemove())
        window.addEventListener("mouseup", function (e) {
            window.onmousemove = null
            window.setTimeout(() => {
                window.addEventListener('click', clickEvent)
            })
        });

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
        this.instance.setFromCamera(this.mouse, this.camera.instance)
        this.intersects = this.instance.intersectObjects(this.meshs)

        if (this.intersects.length) {
            // Mouse enter
            if (!this.currentIntersect) {
                // on modifie les cursor
                this.body.style.cursor = 'pointer'
            }

            this.currentIntersect = this.intersects[0]
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