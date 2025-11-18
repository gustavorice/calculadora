// Three.js Scene Setup
let scenes = [];
let mouse = { x: 0, y: 0 };

// Track mouse movement
document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Create Ear Shape Geometry
function createEarGeometry() {
    const shape = new THREE.Shape();
    
    // Outer ear contour
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0, -1, 0.5, -1.5, 1, -1.2);
    shape.bezierCurveTo(1.5, -0.8, 1.8, 0, 1.8, 0.8);
    shape.bezierCurveTo(1.8, 1.5, 1.5, 2, 1, 2.2);
    shape.bezierCurveTo(0.5, 2.4, 0, 2.2, -0.3, 1.8);
    shape.bezierCurveTo(-0.5, 1.5, -0.5, 1, -0.3, 0.5);
    shape.bezierCurveTo(-0.2, 0.2, 0, 0, 0, 0);
    
    // Inner ear detail (hole)
    const hole = new THREE.Path();
    hole.moveTo(0.5, 0.5);
    hole.bezierCurveTo(0.5, 0.2, 0.7, 0, 1, 0);
    hole.bezierCurveTo(1.2, 0, 1.3, 0.3, 1.3, 0.6);
    hole.bezierCurveTo(1.3, 0.9, 1.1, 1.2, 0.8, 1.2);
    hole.bezierCurveTo(0.5, 1.2, 0.5, 0.8, 0.5, 0.5);
    
    shape.holes.push(hole);
    
    const extrudeSettings = {
        depth: 0.3,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 3
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// Create Abstract Ear Geometry
function createAbstractEarGeometry() {
    const geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
    return geometry;
}

// Create Futuristic Ear Geometry
function createFuturisticEarGeometry() {
    const geometry = new THREE.IcosahedronGeometry(1.2, 1);
    return geometry;
}

// Create Organic Ear Geometry
function createOrganicEarGeometry() {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    // Deform the sphere to make it ear-like
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        
        positions.setX(i, x * (1 + Math.sin(y * 2) * 0.3));
        positions.setZ(i, z * (1 + Math.cos(x * 2) * 0.2));
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
}

// Initialize Scene
function initScene(containerId, geometryType, color, rotationSpeed = 0.005) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create geometry based on type
    let geometry;
    switch(geometryType) {
        case 'ear':
            geometry = createEarGeometry();
            break;
        case 'abstract':
            geometry = createAbstractEarGeometry();
            break;
        case 'futuristic':
            geometry = createFuturisticEarGeometry();
            break;
        case 'organic':
            geometry = createOrganicEarGeometry();
            break;
        default:
            geometry = createEarGeometry();
    }
    
    const material = new THREE.MeshPhongMaterial({
        color: color,
        shininess: 100,
        specular: 0x444444,
        flatShading: geometryType === 'futuristic'
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x6366f1, 1);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x818cf8, 0.8);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);
    
    camera.position.z = 5;
    
    // Store scene data
    scenes.push({
        scene,
        camera,
        renderer,
        mesh,
        container,
        rotationSpeed,
        lights: [pointLight1, pointLight2]
    });
    
    return { scene, camera, renderer, mesh };
}

// Initialize Hero Scene with multiple ears
function initHeroScene() {
    const container = document.getElementById('hero-canvas');
    if (!container) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create multiple ear objects
    const ears = [];
    const geometries = [
        createEarGeometry(),
        createAbstractEarGeometry(),
        createFuturisticEarGeometry(),
        createOrganicEarGeometry()
    ];
    
    const colors = [0x6366f1, 0x818cf8, 0xa5b4fc, 0xc7d2fe];
    
    for (let i = 0; i < 4; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: colors[i],
            shininess: 100,
            specular: 0x444444,
            transparent: true,
            opacity: 0.7
        });
        
        const mesh = new THREE.Mesh(geometries[i], material);
        
        // Position ears in a circle
        const angle = (i / 4) * Math.PI * 2;
        mesh.position.x = Math.cos(angle) * 8;
        mesh.position.y = Math.sin(angle) * 4;
        mesh.position.z = -5;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        scene.add(mesh);
        ears.push(mesh);
    }
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x6366f1, 1.5);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x818cf8, 1);
    pointLight2.position.set(-10, -10, 5);
    scene.add(pointLight2);
    
    camera.position.z = 15;
    
    scenes.push({
        scene,
        camera,
        renderer,
        mesh: ears,
        container,
        rotationSpeed: 0.002,
        isHero: true,
        lights: [pointLight1, pointLight2]
    });
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    scenes.forEach(sceneData => {
        const { scene, camera, renderer, mesh, rotationSpeed, isHero, lights } = sceneData;
        
        if (isHero && Array.isArray(mesh)) {
            // Animate multiple ears in hero section
            mesh.forEach((ear, index) => {
                ear.rotation.x += rotationSpeed * (index + 1);
                ear.rotation.y += rotationSpeed * (index + 1);
                
                // React to mouse movement
                ear.rotation.x += mouse.y * 0.001;
                ear.rotation.y += mouse.x * 0.001;
                
                // Floating animation
                ear.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
            });
            
            // Animate lights
            lights[0].position.x = Math.sin(Date.now() * 0.001) * 10;
            lights[0].position.y = Math.cos(Date.now() * 0.001) * 10;
        } else if (mesh) {
            // Animate single ear
            mesh.rotation.x += rotationSpeed;
            mesh.rotation.y += rotationSpeed * 1.5;
            
            // React to mouse movement
            mesh.rotation.x += mouse.y * 0.002;
            mesh.rotation.y += mouse.x * 0.002;
        }
        
        renderer.render(scene, camera);
    });
}

// Handle Window Resize
window.addEventListener('resize', () => {
    scenes.forEach(sceneData => {
        const { camera, renderer, container, isHero } = sceneData;
        
        if (isHero) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        } else {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
});

// Scroll Animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hero scene
    initHeroScene();
    
    // Initialize gallery scenes
    initScene('canvas-1', 'ear', 0x6366f1, 0.005);
    initScene('canvas-2', 'abstract', 0x818cf8, 0.008);
    initScene('canvas-3', 'futuristic', 0xa5b4fc, 0.006);
    initScene('canvas-4', 'organic', 0xc7d2fe, 0.004);
    
    // Initialize about scene
    initScene('about-canvas', 'ear', 0x6366f1, 0.003);
    
    // Start animation loop
    animate();
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.gallery-item, .feature-card, .about-text');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

console.log('🎨 AURALIS - Design que escuta 👂');
