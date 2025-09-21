import * as THREE from 'three';

class ThreeAnimation {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.wavyBackground = null;
    this.animationId = null;
    this.isInitialized = false;

    // Bind handleResize once and store it
    this.handleResize = this.handleResize.bind(this);
  }

  init() {
    if (!this.container || this.isInitialized) return;

    // Create scene
    this.scene = new THREE.Scene();

    // Create camera
    const { width, height } = this.container.getBoundingClientRect();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Add window resize handler
    window.addEventListener('resize', this.handleResize);

    this.isInitialized = true;
  }

  createStarField(count = 800) {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = count;
    const posArray = new Float32Array(particlesCnt * 3);
    const scaleArray = new Float32Array(particlesCnt);

    for (let i = 0; i < particlesCnt * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    for (let i = 0; i < particlesCnt; i++) {
      scaleArray[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.025,
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particles);
  }

  createWavyBackground() {
    const geometry = new THREE.PlaneGeometry(10, 10, 50, 50);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x6366f1) },
        color2: { value: new THREE.Color(0x8b5cf6) }
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z = sin(pos.x * 2.0 + time) * 0.2 + cos(pos.y * 2.0 + time) * 0.2;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;

        void main() {
          vec3 color = mix(color1, color2, vUv.y);
          gl_FragColor = vec4(color, 0.5);
        }
      `,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -2;
    this.scene.add(mesh);

    this.wavyBackground = { mesh, material };
  }

  animate() {
    if (!this.isInitialized) return;

    this.animationId = requestAnimationFrame(this.animate.bind(this));

    if (this.particles) {
      this.particles.rotation.x += 0.0001;
      this.particles.rotation.y += 0.00015;
      const positions = this.particles.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const y = positions.getY(i);
        positions.setY(i, y + Math.sin((Date.now() + i) * 0.0002) * 0.0005);
      }
      positions.needsUpdate = true;
    }

    if (this.wavyBackground) {
      this.wavyBackground.material.uniforms.time.value += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    if (!this.isInitialized) return;

    const { width, height } = this.container.getBoundingClientRect();
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  start() {
    if (!this.isInitialized) {
      this.init();
    }
    this.animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    this.stop();

    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }

    window.removeEventListener('resize', this.handleResize);

    if (this.particles) {
      this.scene.remove(this.particles);
      this.particles.geometry.dispose();
      this.particles.material.dispose();
      this.particles = null;
    }

    if (this.wavyBackground) {
      this.scene.remove(this.wavyBackground.mesh);
      this.wavyBackground.mesh.geometry.dispose();
      this.wavyBackground.mesh.material.dispose();
      this.wavyBackground = null;
    }

    this.renderer.dispose();
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.isInitialized = false;
  }
}

export default ThreeAnimation;
