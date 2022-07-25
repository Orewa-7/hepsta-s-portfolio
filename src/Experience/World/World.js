import Experience from '../Experience.js'
import Images from './Images.js'
import Parallax from './Parallax.js'
import Particles from './Particles.js'
import Raycaster from './Raycaster.js'
import HeadingText from './HeadingText.js'
import About from './About.js'
import Project from './Project.js'

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
            this.particles = new Particles()
            this.parallax = new Parallax()
            this.HeadingText = new HeadingText()
            this.about = new About()
            this.project = new Project()
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

        if(this.particles){
            this.particles.update()
        }

        if(this.parallax){
            this.parallax.update()
        }
        if(this.HeadingText){
            this.HeadingText.update()
        }
        if(this.about){
            this.about.update()
        }
        if(this.project){
            this.project.update()
        }
            
    }
}