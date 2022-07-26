import * as THREE from 'three'
import { gsap } from 'gsap'
import Experience from '../Experience.js'

export default class LoadingBar {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.loadingBarElement = document.querySelector('.loading-bar')
        this.percentageDOM = document.querySelector('.percentage')
        this.buttonStart = document.querySelector('.button-loader')

        /**
        * Sounds
        */
         this.spaceSound = new Audio('/Sounds/space-sound.mp3')
        this.playSpaceSound = () => {
            this.spaceSound.play()
            this.spaceSound.loop = true
         }
        
        this.sceneReady = false
        this.isCameraUpdated = false

        this.loadingManager = new THREE.LoadingManager(
            // Loaded 
            () => {
                gsap.to(this.buttonStart, {opacity: 1, duration:1 })
                this.buttonStart.style.display = 'block'

                gsap.to(this.percentageDOM, {opacity: 0, duration:1 })

                this.loadingBarElement.classList.add('ended')
                this.loadingBarElement.style.transform = ''

                this.buttonStart.onclick = () =>{
                    
                    this.playSpaceSound()

                    gsap.to(this.buttonStart, {opacity: 0, duration:0.5 })

                    window.setTimeout(() => {
                        this.camera.instance.position.y = this.initialPosition
                        this.mesh.position.y = this.initialPosition

                        gsap.to(this.material.uniforms.uAlpha, { duration: 3, value: 0, delay: 0.5 })

                        this.buttonStart.style.display = 'none'
                    }, 500)
    
                    window.setTimeout(() => {
                        this.sceneReady = true
                    }, 1500)

                }
                
            },

            // Progress
            (itemURL, itemsLoaded, itemsTotal) => {
                const progressRatio = itemsLoaded / itemsTotal
                const progressPercent = { value: 0 }

                gsap.to(progressPercent, {
                    value: progressRatio * 100,
                    duration: 1, roundProps: {
                        value: 1
                    },
                    ease: 'power4.out',
                    onUpdate: () => {
                        this.percentageDOM.innerHTML = `${progressPercent.value}%`
                      }
                })

                this.loadingBarElement.style.transform = `scaleX(${progressRatio})`
            }
        )

        // Setup
        this.setGeometry()
        this.setMaterial()
        this.setMesh()

    }

    setGeometry() {
        this.geometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uAlpha: { value: 1 },
            },
            vertexShader: `
                void main(){
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uAlpha;
                void main(){
                    gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
                }
            `
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y = 2
        this.scene.add(this.mesh)
    }

    update(){
        if(!this.isCameraUpdated && this.camera){
            this.initialPosition = this.camera.instance.position.y 
            console.log('one step')
            this.camera.instance.position.y = -5
            this.mesh.position.y = -5
            this.isCameraUpdated = true
        }
        this.camera = this.experience.camera

    }
}