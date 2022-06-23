import * as THREE from 'three'
import { gsap } from 'gsap'
import Experience from '../Experience.js'

export default class LoadingBar
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.loadingBarElement = document.querySelector('.loading-bar')
        this.sceneReady = false
        this.loadingManager = new THREE.LoadingManager(
            // Loaded 
            () => {
                window.setTimeout(() =>
                {
                    gsap.to(this.material.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

                    this.loadingBarElement.classList.add('ended')
                    this.loadingBarElement.style.transform = ''
                }, 500)
        
                window.setTimeout(() =>
                {
                    this.sceneReady = true
                }, 1500)
            },
        
            // Progress
            (itemURL, itemsLoaded, itemsTotal) =>
            {
                const progressRatio = itemsLoaded / itemsTotal
                this.loadingBarElement.style.transform = `scaleX(${progressRatio})`
            }
        )

        // Setup
        this.setGeometry()
        this.setMaterial()
        this.setMesh()

    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
    }

    setMaterial()
    {
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

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y = 5
        this.scene.add(this.mesh)
    }
}