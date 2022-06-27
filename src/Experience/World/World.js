import Experience from '../Experience.js'
import Images from './Images.js'
import Raycaster from './Raycaster.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
    
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.images = new Images()
            this.raycaster = new Raycaster()
        })
    }

    resize()
    {
        this.images.resize()
    }

    update()
    {
        if(this.images && this.raycaster) {
            this.raycaster.update()
            this.images.update()  
        }
            
    }
}