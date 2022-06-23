import Experience from '../Experience.js'
import Images from './Images.js'

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
        })
    }

    resize()
    {
        this.images.resize()
    }

    update()
    {
        if(this.images)
            this.images.update()    
    }
}