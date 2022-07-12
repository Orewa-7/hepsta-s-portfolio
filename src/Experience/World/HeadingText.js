import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

import Experience from '../Experience.js'
import vertex from './Shaders/HeadingText/vertex.glsl'
import fragment from './Shaders/HeadingText/fragment.glsl'


export default class HeadingText {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug

        //setup
        this.loadFont()

    }

    loadFont() {
        /**
         * Fonts
        */
        this.fontLoader = new FontLoader()

        this.fontLoader.load(
            '/Fonts/helvetiker_regular.typeface.json',
            (font) => {
                const textGeometry = new TextGeometry(
                    'H e p s t a \' s   p o r t f o l i o',
                    // 'Hepsta\'s portfolio',
                    {
                        font: font,
                        size: 0.1,
                        height: 0,
                        curveSegments: 12,
                    }
                )
                const textMaterial = new THREE.ShaderMaterial({
                    blending: THREE.AdditiveBlending,
                    vertexShader: vertex,
                    fragmentShader: fragment,
                    uniforms:{
                        uTime: {value: 0}
                    }
                })
                this.text = new THREE.Mesh(textGeometry, textMaterial)
                textGeometry.center()
                this.text.position.y = 3

                this.text.lookAt(0,2,4)
                this.scene.add(this.text)
            }
        )
    }

    update(){
        if(this.text){
            this.text.material.uniforms.uTime.value = this.experience.time.elapsed
            this.text.lookAt(0,2,4)
        }
        
    }
}