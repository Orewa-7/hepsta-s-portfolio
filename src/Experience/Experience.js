import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from "./Utils/Sizes.js"
import Time from "./Utils/Time.js"
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import sources from './sources.js'
import LoadingBar from './Utils/LoadingBar.js'

let instance = null
export default class Experience
{
    constructor(canvas)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this

        // Global access
        window.experience = this

        // Options
        this.canvas = canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.loadingBar = new LoadingBar()
        this.resources = new Resources(sources, this.loadingBar)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()
        })
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
        this.world.resize()
    }

    update()
    {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }
}