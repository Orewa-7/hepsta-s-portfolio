import Experience from '../Experience.js'

export default class Raycaster
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.meshs = this.experience.world.images.meshs

        console.log(this.meshs)



    }
}