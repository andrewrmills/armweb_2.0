import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange( () => { 
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */

 const updateAllMaterials = () => 
 {
     scene.traverse((child) => 
     {
         if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
         {
             child.material.envMapIntensity = debugObject.envMapIntensity
             child.material.needsUpdate = true
             child.castShadow = true
             child.receiveShadow = true
         }
     })
 }
 const gltfLoader = new GLTFLoader()

let lander

const loadObject = () => {
gltfLoader.load(
    '/models/lander.glb',
    (gltf) =>
    {
        lander = gltf.scene
        lander.scale.set(0.3, 0.3, 0.3)
        lander.position.set(0, 0, 0)
        lander.rotation.x = 0.5
        lander.castShadow = true
        lander.receiveShadow = true
        scene.add(lander)

        gui
        .add(gltf.scene.rotation, 'y')
        .min(-Math.PI)
        .max(Math.PI)
        .step(0.01)
        .name('rotation')

        updateAllMaterials()

    }
)
}

loadObject()


/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()

const moonColorTexture = textureLoader.load('./textures/moon/Dirt_BaseColor.jpg')
const moonAmbientOcclusionTexture = textureLoader.load('./textures/moon/Dirt_AmbientOcclusion.jpg')
const moonHeightTexture = textureLoader.load('./textures/moon/Dirt_Height.png')
const moonNormalTexture = textureLoader.load('./textures/moon/Dirt_Normal.jpg')
const moonRoughnessTexture = textureLoader.load('./textures/moon/Dirt_Roughness.jpg')

moonColorTexture.repeat.set(15, 15)
moonAmbientOcclusionTexture.repeat.set(15, 15)
moonHeightTexture.repeat.set(15, 15)
moonNormalTexture.repeat.set(15, 15)
moonRoughnessTexture.repeat.set(15, 15)

moonColorTexture.wrapS = THREE.RepeatWrapping
moonAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
moonHeightTexture.wrapS = THREE.RepeatWrapping
moonNormalTexture.wrapS = THREE.RepeatWrapping
moonRoughnessTexture.wrapS = THREE.RepeatWrapping

moonColorTexture.wrapT = THREE.RepeatWrapping
moonAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
moonHeightTexture.wrapT = THREE.RepeatWrapping
moonNormalTexture.wrapT = THREE.RepeatWrapping
moonRoughnessTexture.wrapT = THREE.RepeatWrapping

const matcapTexture = textureLoader.load('/textures/matcaps/1.png')

/**
 * Fonts
 */
 const fontLoader = new FontLoader()
 fontLoader.load(
     '/fonts/helvetiker_regular.typeface.json',
     (font) => {
         const textGeometry = new TextGeometry(
             'Andrew Mills',
             {
                 font: font,
                 size: 2,
                 height: 0.2,
                 curveSegments: 5,
                 bevelEnabled: true,
                 bevelThickness: 0.03,
                 bevelSize: 0.02,
                 bevelOffset: 0,
                 bevelSegments: 4
             }
         )
         textGeometry.center()
         const material = new THREE.MeshNormalMaterial
         // textMaterial.wireframe = true
         const text = new THREE.Mesh(textGeometry, material)
         text.position.set(-10, -5, -25)
         scene.add(text)
        }
 )
 fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const subTextGeometry = new TextGeometry(
            'Developer. Pipe Dreamer. All Round Nice Guy.',
            {
                font: font,
                size: 1,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        subTextGeometry.center()
        const material = new THREE.MeshNormalMaterial
        // textMaterial.wireframe = true
        const subText = new THREE.Mesh(subTextGeometry, material)
        subText.position.set(-4, -11, -25)
        scene.add(subText)
       }
)

// Meshes
const objectsDistance = 4

const moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(20, 32, 16),
    new THREE.MeshStandardMaterial({
        map: moonColorTexture,
        aoMap: moonAmbientOcclusionTexture,
        // displacementMap: moonHeightTexture,
        normalMap: moonNormalTexture,
        roughnessMap: moonRoughnessTexture
    })
)
moonMesh.castShadow = true
moonMesh.receiveShadow = true


moonMesh.position.set(0, -objectsDistance * 10, -30)

scene.add(moonMesh)


/**
 * Particles
 */
//Geometry
const particlesCount = 1000
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 50
    positions[i * 3 + 1] = objectsDistance * 2.5 - Math.random() * objectsDistance * 10
    positions[i * 3 + 2] = -30 + (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.1
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 0.4)
directionalLight.position.set(0, 1.5, 0.5)
directionalLight.castShadow = true

directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 40
directionalLight.shadow.camera.top = 20
directionalLight.shadow.camera.right = 20
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 20

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

const ambientLight = new THREE.AmbientLight('#ffffff', 0.2)

gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)

scene.add(directionalLight, ambientLight)

// console.log(directionalLight.shadow)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

/**
 * Scroll
 */

// let scrollY = window.scrollY
// let currentSection = 0

// window.addEventListener('scroll', () => 
// {
//     scrollY = window.scrollY

//     const newSection = Math.round(scrollY/sizes.height)

//     if(newSection != currentSection)
//     {
//         currentSection = newSection

//         gsap.to (
//             sectionMeshes[currentSection].rotation, 
//             {
//                 duration: 1.5,
//                 ease: 'power2.inOut',
//                 x: '+= 6',
//                 y: '+= 3',
//                 z: "+= 1.5"
//             }
//         )
//     }
// })

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX/sizes.width - 0.5
    cursor.y = event.clientY/sizes.height - 0.5
}
)

/**
 * Animate
 */

 const moveCamera = () => {
    const t = document.body.getBoundingClientRect().top/sizes.height

    if(lander){
        camera.lookAt(lander.position)
        lander.position.z = -2 + t * objectsDistance
        lander.position.y = t * (objectsDistance * 2)  
        if(lander.position.y < -26.8)
        {
            lander.position.y = -26.8
            lander.position.z = -15.4
        }
    }
  }

const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = -scrollY/sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = -cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate lander

    if(lander && lander.position.y > -10) {
        lander.rotation.y += deltaTime * 0.12
    }
    
    document.body.onscroll = moveCamera
    moveCamera();
    

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()