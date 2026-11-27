// Layers3D — a real WebGL (three.js) scene: image layers stack up as 3D slabs,
// one per step, with soft shadows, a translucent writable layer, gentle
// auto-orbit and drag-to-rotate. Reuses the same YAML as `layerStack`
// (layers: [{label}], writable: {label}). Client-only.
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function cssColor(cssVar, fallback) {
  try {
    const el = document.createElement('span');
    el.style.color = `var(${cssVar})`;
    el.style.display = 'none';
    document.body.appendChild(el);
    const c = getComputedStyle(el).color;
    el.remove();
    return new THREE.Color(c);
  } catch {
    return new THREE.Color(fallback);
  }
}

export default function Layers3D({ layers = [], writable, activeStep = 0 }) {
  const mountRef = useRef(null);
  const stepRef = useRef(activeStep);
  stepRef.current = activeStep;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W0 = mount.clientWidth || 600;
    const H0 = mount.clientHeight || 360;

    const accent = cssColor('--accent', '#2f6bd8');
    const ink = cssColor('--ink', '#2b2620');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, W0 / H0, 0.1, 100);
    camera.position.set(5.2, 4.4, 6.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W0, H0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // lights
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.05));
    const fill = new THREE.DirectionalLight(0xffffff, 0.5);
    fill.position.set(-4, 2, 6);
    scene.add(fill);
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(5, 9, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1; key.shadow.camera.far = 30;
    key.shadow.camera.left = -8; key.shadow.camera.right = 8;
    key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
    scene.add(key);

    const slabW = 3, slabD = 2, slabH = 0.5, gap = 0.08;
    const items = [...layers.map((l) => ({ ...l, writable: false })), ...(writable ? [{ ...writable, writable: true }] : [])];
    const total = items.length;
    const stackH = total * (slabH + gap);

    // ground shadow catcher
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(6, 48),
      new THREE.ShadowMaterial({ opacity: 0.16 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = true;
    scene.add(ground);

    // build slabs
    const meshes = items.map((it, i) => {
      const geo = new THREE.BoxGeometry(slabW, slabH, slabD);
      const shade = it.writable ? 0.58 : 0.24 + (i / Math.max(total - 1, 1)) * 0.4;
      const color = accent.clone().lerp(new THREE.Color(0xffffff), shade);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.55,
        metalness: 0.05,
        transparent: true,
        opacity: it.writable ? 0.5 : 1,
        depthWrite: !it.writable,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.position.set(0, i * (slabH + gap) + slabH / 2, 0);
      mesh.scale.set(0.001, 0.001, 0.001);
      mesh.userData.baseY = mesh.position.y;
      scene.add(mesh);
      // edge outline for definition
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.3 }),
      );
      mesh.add(edges);
      return mesh;
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, stackH * 0.45, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotateSpeed = 1.1;
    controls.minPolarAngle = Math.PI * 0.18;
    controls.maxPolarAngle = Math.PI * 0.46;
    controls.update();

    let raf;
    const tick = () => {
      const s = stepRef.current;
      // reveal rule: read-only layer i visible when step >= i; writable when step >= layers.length
      meshes.forEach((m, i) => {
        const isWritable = items[i].writable;
        const visible = isWritable ? s >= layers.length : s >= i;
        const target = visible ? 1 : 0.001;
        m.scale.y += (target - m.scale.y) * 0.16;
        m.scale.x += ((visible ? 1 : 0.001) - m.scale.x) * 0.16;
        m.scale.z += ((visible ? 1 : 0.001) - m.scale.z) * 0.16;
        m.position.y = m.userData.baseY * m.scale.y;
        if (isWritable) {
          const want = (s >= layers.length + 1) ? 0.72 : 0.42; // glow a touch on copy-up step
          m.material.opacity += (want * (visible ? 1 : 0) - m.material.opacity) * 0.14;
        }
      });
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose?.(); });
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [layers, writable]);

  const names = [...layers, ...(writable ? [{ ...writable, writable: true }] : [])];
  return (
    <div className="w-three">
      <div className="three-canvas" ref={mountRef} />
      <div className="three-legend">
        {names.map((n, i) => {
          const isW = n.writable;
          const on = isW ? activeStep >= layers.length : activeStep >= i;
          const active = isW ? activeStep >= layers.length : activeStep === i;
          return (
            <div key={i} className={`three-leg ${on ? 'is-on' : ''} ${active ? 'is-active' : ''} ${isW ? 'is-writable' : ''}`}>
              <span className="three-leg__dot" />{n.label}
            </div>
          );
        })}
      </div>
      <div className="three-hint mono">drag to rotate</div>
    </div>
  );
}
