import * as THREE from 'three'

import Experience from '../Experience.js'
import vertex from './Shaders/Particles/vertex.glsl'
import fragment from './Shaders/Particles/fragment.glsl'


export default class Particles {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug
        this.renderer = this.experience.renderer.instance

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('particles')
        }
        this.debugObject = {}
        this.debugObject.count = 1500
        this.debugObject.size = 9 * this.renderer.getPixelRatio()

        // Setup
        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.BufferGeometry()
        this.positions = new Float32Array(this.debugObject.count * 3)
        this.scales = new Float32Array(this.debugObject.count * 1)
        for (let i = 0; i < this.debugObject.count; i++) // Multiply by 3 for same reason
        {
            const i3 = i * 3
            const angle = Math.random() * Math.PI * 2 
            const radius = 4 + Math.random() * 5 

            const x = Math.cos(angle ) * radius 
            const y = (Math.random() - 0.5) * 15 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
            const z = Math.sin(angle ) * radius

            this.positions[i3 + 0] = x
            this.positions[i3 + 1] = y
            this.positions[i3 + 2] = z

            this.scales[i] = Math.random()
        }
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values
        this.geometry.setAttribute('aScale', new THREE.BufferAttribute(this.positions, 1)) 
        
        
    }
    setMaterial() {
        // this.material = new THREE.PointsMaterial({
        //     size: this.debugObject.size,
        //     sizeAttenuation: this.debugObject.sizeAttenuation
        // })
        this.material = new THREE.ShaderMaterial({
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms:{
                uSize: {value: this.debugObject.size}
            }
        })

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.debugObject, 'size')
                .name('size')
                .min(1)
                .max(20)
                .step(0.5)
                .onChange(() => {
                    this.material.uniforms.uSize.value = this.debugObject.size
                })
        }
    }
    setMesh() {
        this.particles = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.particles)
    }

    update() {

        this.particles.rotation.y = this.experience.time.elapsed * 0.00001
    }
}