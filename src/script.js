import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { MeshBasicMaterial, SphereGeometry } from 'three'
import gsap from 'gsap'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Debug
 */
const gui = new dat.GUI()

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
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()
// const matcapTexture = textureLoader.load('/textures/matcaps/1.png')

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
            'Developer, Pipe Dreamer, All Round Nice Guy.',
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
const mesh1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial
)
mesh1.castShadow = true
mesh1.receiveShadow = true

const moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(20, 32, 16),
    new THREE.MeshStandardMaterial
)
moonMesh.castShadow = true
moonMesh.receiveShadow = true

mesh1.position.set(0, 0, -2)
moonMesh.position.set(0, -objectsDistance * 10, -30)

scene.add(mesh1, moonMesh)

// const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Particles
 */
// Geometry
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
const directionalLight = new THREE.DirectionalLight('#ffffff', 0.8)
directionalLight.position.set(3, 1, 0)
directionalLight.castShadow = true

const ambientLight = new THREE.AmbientLight('#ffffff', 0.2)

gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)

scene.add(directionalLight, ambientLight)

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
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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

    if(t < 0){
        mesh1.position.z = -2 + t * objectsDistance
        mesh1.position.y = t * (objectsDistance * 2)  
    }
    if(mesh1.position.y < 0.5){
        camera.lookAt(mesh1.position)
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

    // Animate meshes
    mesh1.rotation.x += deltaTime * 0.1
    mesh1.rotation.y += deltaTime * 0.12
    
    document.body.onscroll = moveCamera
    moveCamera();
    

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()