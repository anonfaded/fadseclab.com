import flagImg from '../../assets/images/fadseclab_flag.png';
import './HeroShield.css';
import * as THREE from 'three';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties, RefObject } from 'react';

// All arrows fire from the Three.js tower turret muzzle.
const baseThreats = [
  { id: 'trackers', label: 'Trackers', lane: 82, delay: '0s', color: '#ff5a45', path: 'M326 100 C418 68 560 78 700 115' },
  { id: 'brokers', label: 'Data brokers', lane: 132, delay: '1.35s', color: '#ff3f35', path: 'M326 100 C438 104 570 128 702 141' },
  { id: 'spyware', label: 'Spyware', lane: 182, delay: '2.7s', color: '#ff7264', path: 'M326 100 C414 154 540 202 696 163' },
];
const guardianOffsetX = 30;
const shotCycleMs = 4050;
const impactTimeMs = 2916;

const shieldPath = 'M90 4 C118 12 146 18 168 30 L160 128 C154 178 126 214 90 238 C54 214 26 178 20 128 L12 30 C34 18 62 12 90 4Z';
const shieldInsetPath = 'M90 12 C114 19 137 25 155 34 L149 124 C144 166 119 198 90 220 C61 198 36 166 31 124 L25 34 C43 25 66 19 90 12Z';
const shieldCorePath = 'M90 0 C118 10 146 17 170 29 L162 130 C156 182 127 220 90 244 C53 220 24 182 18 130 L10 29 C34 17 62 10 90 0Z';
const guardianBodyBase = 'M781 147 Q777 155 768 190'; // Curved top for smooth shoulder joint
const guardianBodyHit = guardianBodyBase;
const guardianShieldShoulder = { x: 780, y: 143 }; // Aligned with flag arm
const guardianShieldElbowBase = { x: 744, y: 166 };
const guardianShieldElbowHit = { x: 752, y: 168 }; // Elbow nudges right + slightly down on impact — upper arm rotates subtly
const guardianShieldHandBase = { x: 706, y: 176 };
const guardianShieldHandHit = { x: 722, y: 176 }; // Hand recoils RIGHT only — pure horizontal, same Y = no up/down
const guardianBackHip = { x: 768, y: 188 };
const guardianBackKneeBase = { x: 726, y: 216 }; // Centered midpoint + forward offset → equal upper/lower segments ≈50 each
const guardianBackKneeHit = guardianBackKneeBase;
const guardianBackFootBase = { x: 710, y: 258 };
const guardianFrontHip = { x: 768, y: 188 };
const guardianFrontKneeBase = { x: 790, y: 224 }; // Test: bend more toward left/shield side
const guardianFrontKneeHit = guardianFrontKneeBase;
const guardianFrontFootBase = { x: 830, y: 254 }; // Lower leg points left/inward like the back leg



function interpolatePath(base: string, target: string, amount: number) {
  const targetNumbers = target.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  let index = 0;

  return base.replace(/-?\d+(?:\.\d+)?/g, (value) => {
    const start = Number(value);
    const end = targetNumbers[index++] ?? start;
    const next = start + (end - start) * amount;
    return Number(next.toFixed(2)).toString();
  });
}

function interpolatePoint(base: { x: number; y: number }, target: { x: number; y: number }, amount: number) {
  return {
    x: base.x + (target.x - base.x) * amount,
    y: base.y + (target.y - base.y) * amount,
  };
}

function pathBetween(start: { x: number; y: number }, end: { x: number; y: number }) {
  return `M${start.x.toFixed(2)} ${start.y.toFixed(2)} L${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

function threatsFromMuzzle(x: number, y: number) {
  return baseThreats.map((threat, index) => {
    const end = index === 0
      ? { x: 603 + guardianOffsetX, y: 124 }
      : index === 1
        ? { x: 594 + guardianOffsetX, y: 151 }
        : { x: 584 + guardianOffsetX, y: 178 };
    const lift = index === 0 ? -38 : index === 1 ? 10 : 58;
    const c1x = x + (index === 0 ? 96 : index === 1 ? 116 : 92);
    const c1y = y + lift * 0.52;
    const c2x = end.x - (index === 0 ? 132 : index === 1 ? 122 : 138);
    const c2y = end.y - lift * 0.32;

    return {
      ...threat,
      path: `M${x} ${y} C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${end.x} ${end.y}`,
    };
  });
}

type Threat = (typeof baseThreats)[number];

function ThreatArrow({
  label,
  delay,
  color,
  path,
  id,
  repeat = true,
}: Threat & { repeat?: boolean }) {
  const motionRef = useRef<SVGAnimateMotionElement>(null);
  const pathId = repeat ? `threat-path-${id}` : `threat-path-${id}-${delay.replace(/[^a-z0-9]/gi, '')}`;

  useEffect(() => {
    if (!repeat) {
      window.requestAnimationFrame(() => motionRef.current?.beginElement());
    }
  }, [repeat]);

  return (
    <g className="hero-threat" style={{ '--delay': delay, '--threat': color } as CSSProperties}>
      <path id={pathId} className="hero-threat-path" d={path} />
      <g className={`hero-arrow${repeat ? '' : ' hero-arrow--manual'}`}>
        <animateMotion
          ref={motionRef}
          dur="4.05s"
          begin={repeat ? delay : 'indefinite'}
          repeatCount={repeat ? 'indefinite' : '1'}
          fill={repeat ? 'remove' : 'freeze'}
          rotate="auto"
          keyPoints="0;0;0.78;1;1"
          keyTimes="0;0.035;0.66;0.72;1"
          calcMode="spline"
          keySplines="0.25 0 0.25 1;0.18 0 0.18 1;0.16 1 0.3 1;0.2 0 0.2 1"
        >
          <mpath href={`#${pathId}`} />
        </animateMotion>
        <g className="hero-arrow-body">
          <line className="hero-arrow-trail" x1="-4" y1="0" x2="20" y2="0" />
          <line className="hero-arrow-shaft" x1="0" y1="0" x2="42" y2="0" />
          <path className="hero-arrow-head" d="M42 -7 58 0 42 7Z" />
          <path className="hero-arrow-fin" d="M0 0 -12 -8 -7 0 -12 8Z" />
          <text className="hero-arrow-label" x="12" y="-13">{label}</text>
        </g>
      </g>
    </g>
  );
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.Points) {
      child.geometry?.dispose();
      const material = child.material;
      if (Array.isArray(material)) {
        material.forEach((entry) => {
          if ('map' in entry && entry.map instanceof THREE.Texture) entry.map.dispose();
          entry.dispose();
        });
      } else {
        if (material && 'map' in material && material.map instanceof THREE.Texture) material.map.dispose();
        material?.dispose();
      }
    }
  });
}

function HeroAdversaryThreeScene({
  onMuzzleProject,
  manualShotPulse,
}: {
  onMuzzleProject: (point: { clientX: number; clientY: number }) => void;
  manualShotPulse: number;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const manualShotPulseRef = useRef(manualShotPulse);

  useEffect(() => {
    manualShotPulseRef.current = manualShotPulse;
  }, [manualShotPulse]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
    camera.position.set(0.06, 2.7, 8.35);
    camera.lookAt(-0.5, 1.02, -0.04);

    const ambient = new THREE.HemisphereLight(0xb0bac6, 0x0a0706, 1.22);
    const key = new THREE.DirectionalLight(0xecf2ff, 2.6);
    key.position.set(3.8, 5.8, 4.8);
    key.castShadow = true;
    key.shadow.mapSize.set(512, 512);
    const redFill = new THREE.PointLight(0xff2f24, 2.2, 9);
    redFill.position.set(-1.65, 1.35, 1.5);
    const coolRim = new THREE.PointLight(0x9fc1ff, 1.15, 10);
    coolRim.position.set(2.8, 1.7, -1.6);
    scene.add(ambient, key, redFill, coolRim);

    const root = new THREE.Group();
    root.position.set(-0.22, 0.02, 0);
    root.scale.setScalar(0.78);
    root.rotation.y = 0;
    scene.add(root);

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x10130f,
      roughness: 0.88,
      metalness: 0.02,
    });
    const terrainSideMat = new THREE.MeshStandardMaterial({
      color: 0x080908,
      roughness: 0.96,
      metalness: 0,
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x4c555a,
      roughness: 0.74,
      metalness: 0.5,
    });
    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: 0x111416,
      roughness: 0.8,
      metalness: 0.38,
    });
    const redMat = new THREE.MeshStandardMaterial({
      color: 0x9d261f,
      roughness: 0.56,
      metalness: 0.2,
      emissive: 0x250503,
    });
    const railMat = new THREE.MeshStandardMaterial({ color: 0x596267, roughness: 0.58, metalness: 0.64 });
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x7e1f19, roughness: 0.7, metalness: 0.18 });
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x2a2926, roughness: 0.94, metalness: 0.02 });

    const tubeBetween = (start: THREE.Vector3, end: THREE.Vector3, radius: number, material: THREE.Material, segments = 12) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, start.distanceTo(end), segments), material);
      mesh.position.copy(start).lerp(end, 0.5);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    const roundedBoxGeometry = (width: number, height: number, depth: number, radius: number) => {
      const shape = new THREE.Shape();
      const x = -width / 2;
      const y = -height / 2;
      shape.moveTo(x + radius, y);
      shape.lineTo(x + width - radius, y);
      shape.quadraticCurveTo(x + width, y, x + width, y + radius);
      shape.lineTo(x + width, y + height - radius);
      shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      shape.lineTo(x + radius, y + height);
      shape.quadraticCurveTo(x, y + height, x, y + height - radius);
      shape.lineTo(x, y + radius);
      shape.quadraticCurveTo(x, y, x + radius, y);
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: radius * 0.32,
        bevelThickness: radius * 0.28,
        curveSegments: 8,
      });
      geometry.center();
      return geometry;
    };

    const createSignTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.fillStyle = '#120f0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#8f261f';
      ctx.fillRect(0, 0, canvas.width, 78);
      ctx.fillStyle = '#171717';
      for (let i = -40; i < canvas.width; i += 72) {
        ctx.save();
        ctx.translate(i, 0);
        ctx.rotate(-0.22);
        ctx.fillRect(0, -18, 34, 112);
        ctx.restore();
      }
      ctx.strokeStyle = '#645b58';
      ctx.lineWidth = 8;
      ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);
      ctx.fillStyle = '#f1e7df';
      ctx.font = '800 64px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ADVERSARY', canvas.width / 2, 144);
      ctx.fillStyle = '#ff5b45';
      ctx.font = '800 33px monospace';
      ctx.fillText('SURVEILLANCE ZONE', canvas.width / 2, 188);
      ctx.fillStyle = '#868b8f';
      [42, 598].forEach((x) => {
        [44, 212].forEach((y) => {
          ctx.beginPath();
          ctx.arc(x, y, 9, 0, Math.PI * 2);
          ctx.fill();
        });
      });
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      texture.needsUpdate = true;
      return texture;
    };

    const terrainShape = new THREE.Shape();
    terrainShape.moveTo(-3.35, -1.22);
    terrainShape.bezierCurveTo(-2.34, -1.58, -0.5, -1.66, 2.25, -1.16);
    terrainShape.bezierCurveTo(2.56, -0.4, 2.38, 0.62, 1.78, 1.26);
    terrainShape.bezierCurveTo(0.26, 1.46, -1.38, 0.82, -2.42, 0.08);
    terrainShape.bezierCurveTo(-3.0, -0.34, -3.28, -0.76, -3.35, -1.22);

    const terrain = new THREE.Mesh(
      new THREE.ExtrudeGeometry(terrainShape, {
        depth: 0.28,
        bevelEnabled: true,
        bevelSize: 0.06,
        bevelThickness: 0.06,
        bevelSegments: 5,
        curveSegments: 24,
      }),
      [terrainMat, terrainSideMat],
    );
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -0.14;
    terrain.receiveShadow = true;
    root.add(terrain);

    const ridgeMat = new THREE.LineBasicMaterial({ color: 0x5b655a, transparent: true, opacity: 0.34 });
    [
      [new THREE.Vector3(-2.35, 0.02, -0.58), new THREE.Vector3(-0.68, 0.04, -0.24), new THREE.Vector3(1.48, 0.05, 0.18)],
      [new THREE.Vector3(-1.95, 0.03, 0.08), new THREE.Vector3(-0.42, 0.04, 0.36), new THREE.Vector3(1.68, 0.05, 0.68)],
      [new THREE.Vector3(-2.85, 0.02, -0.9), new THREE.Vector3(-0.92, 0.03, -1.04), new THREE.Vector3(1.56, 0.04, -0.78)],
    ].forEach((points) => {
      const curve = new THREE.CatmullRomCurve3(points);
      root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(28)), ridgeMat));
    });

    const signTexture = createSignTexture();
    if (signTexture) {
      const board = new THREE.Group();
      board.position.set(1.12, 0.66, 1.02);
      board.rotation.x = -0.03;
      board.rotation.y = 0;
      root.add(board);
      const boardFace = new THREE.Mesh(
        new THREE.PlaneGeometry(2.28, 0.9),
        new THREE.MeshBasicMaterial({ map: signTexture, side: THREE.DoubleSide, depthTest: false }),
      );
      boardFace.position.z = 0.055;
      boardFace.castShadow = true;
      boardFace.renderOrder = 5;
      board.add(boardFace);
      const boardBack = new THREE.Mesh(roundedBoxGeometry(2.4, 1.02, 0.07, 0.04), darkSteelMat);
      boardBack.position.z = -0.035;
      boardBack.castShadow = true;
      board.add(boardBack);
      board.add(tubeBetween(new THREE.Vector3(-0.68, -0.86, -0.04), new THREE.Vector3(-0.68, -0.39, -0.04), 0.022, railMat, 10));
      board.add(tubeBetween(new THREE.Vector3(0.68, -0.86, -0.04), new THREE.Vector3(0.68, -0.39, -0.04), 0.022, railMat, 10));
    }

    const fenceTop = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.95, 0.62, 0.42),
      new THREE.Vector3(-2.65, 0.68, -0.48),
      new THREE.Vector3(-1.5, 0.74, -0.94),
      new THREE.Vector3(-0.2, 0.8, -1.02),
      new THREE.Vector3(1.05, 0.84, -0.72),
      new THREE.Vector3(1.55, 0.82, -0.02),
      new THREE.Vector3(0.85, 0.72, 0.64),
      new THREE.Vector3(-0.55, 0.62, 0.82),
    ], false);
    const fenceBase = fenceTop.getPoints(48).map((p) => new THREE.Vector3(p.x, 0.08, p.z));
    const fenceTopPoints = fenceTop.getPoints(48);
    const railTop = new THREE.Mesh(new THREE.TubeGeometry(fenceTop, 128, 0.018, 12), railMat);
    const railMid = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(
      fenceTopPoints.map((p) => new THREE.Vector3(p.x, 0.48, p.z)),
      false,
    ), 128, 0.012, 12), railMat);
    const railBase = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(fenceBase, false), 128, 0.014, 12), railMat);
    railTop.castShadow = true;
    railMid.castShadow = true;
    railBase.castShadow = true;
    root.add(railTop, railMid, railBase);

    const meshMat = new THREE.LineBasicMaterial({ color: 0x6f777b, transparent: true, opacity: 0.16 });
    for (let i = 0; i < 14; i += 1) {
      const t = i / 14;
      const p = fenceTop.getPointAt(t);
      const height = 0.78 + Math.sin(t * Math.PI * 2) * 0.04;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.034, height, 14), darkSteelMat);
      post.position.set(p.x, height / 2 + 0.05, p.z);
      post.castShadow = true;
      post.receiveShadow = true;
      root.add(post);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.045, 0.035, 14), railMat);
      cap.position.set(p.x, height + 0.08, p.z);
      cap.castShadow = true;
      root.add(cap);
      if (i % 2 === 1) {
        const next = fenceTop.getPointAt((i + 0.55) / 14);
        root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(p.x, 0.7, p.z),
          new THREE.Vector3(next.x, 0.18, next.z),
        ]), meshMat));
        root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(p.x, 0.22, p.z),
          new THREE.Vector3(next.x, 0.66, next.z),
        ]), meshMat));
      }
      if (i === 3 || i === 10) {
        const fallen = tubeBetween(
          new THREE.Vector3(p.x - 0.16, 0.16, p.z + 0.04),
          new THREE.Vector3(p.x + 0.28, 0.42, p.z - 0.1),
          0.014,
          railMat,
          10,
        );
        fallen.rotation.z += 0.12;
        root.add(fallen);
      }
    }

    const tower = new THREE.Group();
    tower.position.set(-0.18, 0.1, -0.1);
    root.add(tower);
    [
      [-0.48, -0.34],
      [0.48, -0.34],
      [-0.38, 0.34],
      [0.38, 0.34],
    ].forEach(([x, z]) => {
      const block = new THREE.Mesh(roundedBoxGeometry(0.34, 0.13, 0.28, 0.035), concreteMat);
      block.position.set(x, 0.04, z);
      block.castShadow = true;
      block.receiveShadow = true;
      tower.add(block);
    });
    [
      [-0.48, 0.08, -0.34, -0.16, 2.12, -0.08],
      [0.48, 0.08, -0.34, 0.16, 2.12, -0.08],
      [-0.38, 0.08, 0.34, -0.13, 2.12, 0.1],
      [0.38, 0.08, 0.34, 0.13, 2.12, 0.1],
    ].forEach(([x1, y1, z1, x2, y2, z2]) => {
      const start = new THREE.Vector3(x1, y1, z1);
      const end = new THREE.Vector3(x2, y2, z2);
      tower.add(tubeBetween(start, end, 0.024, steelMat, 16));
    });
    [
      [new THREE.Vector3(-0.48, 0.32, -0.34), new THREE.Vector3(0.36, 0.78, 0.24)],
      [new THREE.Vector3(0.48, 0.32, -0.34), new THREE.Vector3(-0.34, 0.78, 0.24)],
      [new THREE.Vector3(-0.34, 0.88, 0.24), new THREE.Vector3(0.24, 1.3, -0.12)],
      [new THREE.Vector3(0.36, 0.88, 0.24), new THREE.Vector3(-0.24, 1.3, -0.12)],
      [new THREE.Vector3(-0.24, 1.42, -0.1), new THREE.Vector3(0.16, 1.9, 0.07)],
      [new THREE.Vector3(0.24, 1.42, -0.1), new THREE.Vector3(-0.16, 1.9, 0.07)],
    ].forEach(([start, end]) => {
      tower.add(tubeBetween(start, end, 0.01, steelMat, 10));
    });
    [0.42, 0.82, 1.24, 1.66].forEach((y) => {
      const halfWidth = 0.46 - y * 0.08;
      const halfDepth = 0.32 - y * 0.05;
      [
        [new THREE.Vector3(-halfWidth, y, -halfDepth), new THREE.Vector3(halfWidth, y, -halfDepth)],
        [new THREE.Vector3(-halfWidth, y, halfDepth), new THREE.Vector3(halfWidth, y, halfDepth)],
        [new THREE.Vector3(-halfWidth, y, -halfDepth), new THREE.Vector3(-halfWidth, y, halfDepth)],
        [new THREE.Vector3(halfWidth, y, -halfDepth), new THREE.Vector3(halfWidth, y, halfDepth)],
      ].forEach(([start, end]) => {
        tower.add(tubeBetween(start, end, 0.012, steelMat, 10));
      });
    });
    const towerDeck = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.08, 32), darkSteelMat);
    towerDeck.position.y = 2.18;
    towerDeck.scale.z = 0.55;
    towerDeck.castShadow = true;
    tower.add(towerDeck);

    const turret = new THREE.Group();
    turret.position.set(0, 2.42, -0.05);
    turret.rotation.y = 0;
    tower.add(turret);
    const turretBody = new THREE.Mesh(roundedBoxGeometry(0.52, 0.28, 0.36, 0.045), darkSteelMat);
    turretBody.castShadow = true;
    turret.add(turretBody);
    const turretLid = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.05, 0.4), redMat);
    turretLid.position.y = 0.17;
    turretLid.castShadow = true;
    turret.add(turretLid);
    const barrelGroup = new THREE.Group();
    turret.add(barrelGroup);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.64, 20), steelMat);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.x = 0.48;
    barrel.castShadow = true;
    barrelGroup.add(barrel);
    const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.05, 24), redMat);
    muzzle.rotation.z = Math.PI / 2;
    muzzle.position.x = 0.8;
    barrelGroup.add(muzzle);
    const launchAnchor = new THREE.Object3D();
    launchAnchor.position.set(0.9, 0, 0);
    turret.add(launchAnchor);
    const sensor = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 24), redMat);
    sensor.rotation.z = Math.PI / 2;
    sensor.position.set(-0.27, 0.03, -0.19);
    turret.add(sensor);
    const antenna = new THREE.Group();
    antenna.position.set(-0.08, 0.16, 0.02);
    turret.add(antenna);
    antenna.add(tubeBetween(new THREE.Vector3(0, -0.04, 0), new THREE.Vector3(0, 0.42, 0), 0.011, steelMat, 12));
    antenna.add(tubeBetween(new THREE.Vector3(-0.07, -0.04, 0), new THREE.Vector3(0.07, -0.04, 0), 0.008, steelMat, 8));
    antenna.add(tubeBetween(new THREE.Vector3(-0.11, 0.25, 0), new THREE.Vector3(0.11, 0.25, 0), 0.007, steelMat, 8));
    antenna.add(tubeBetween(new THREE.Vector3(-0.08, 0.14, 0), new THREE.Vector3(0.08, 0.14, 0), 0.006, steelMat, 8));
    const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.025, 16, 10), redMat);
    antennaTip.position.y = 0.45;
    antenna.add(antennaTip);
    const muzzleFlash = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.22, 24),
      new THREE.MeshBasicMaterial({ color: 0xff6048, transparent: true, opacity: 0 }),
    );
    muzzleFlash.rotation.z = -Math.PI / 2;
    muzzleFlash.scale.set(1, 0.42, 0.42);
    muzzleFlash.position.x = 0.9;
    turret.add(muzzleFlash);

    const generator = new THREE.Group();
    generator.position.set(-1.62, 0.2, -0.18);
    generator.rotation.y = 0.05;
    root.add(generator);
    const genBody = new THREE.Mesh(roundedBoxGeometry(1.62, 0.96, 0.74, 0.08), darkSteelMat);
    genBody.castShadow = true;
    genBody.receiveShadow = true;
    generator.add(genBody);
    const genTop = new THREE.Mesh(roundedBoxGeometry(1.68, 0.14, 0.78, 0.045), redMat);
    genTop.position.y = 0.54;
    genTop.castShadow = true;
    generator.add(genTop);
    const ventMat = new THREE.MeshStandardMaterial({ color: 0x0b0d0e, roughness: 0.85, metalness: 0.25 });
    [-0.3, -0.18, -0.06].forEach((y, index) => {
      const vent = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.026, 0.02), ventMat);
      vent.position.set(-0.42, y + 0.18, 0.38);
      vent.rotation.z = -0.08;
      generator.add(vent);
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.4 - index * 0.04, 0.014, 0.018), steelMat);
      slot.position.set(-0.42, y + 0.18, 0.405);
      generator.add(slot);
    });
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.04, 32), redMat);
    core.rotation.z = Math.PI / 2;
    core.position.set(0.56, 0.02, 0.405);
    generator.add(core);
    const coreRing = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.012, 8, 48), redMat);
    coreRing.position.set(0.56, 0.02, 0.43);
    coreRing.rotation.y = Math.PI / 2;
    generator.add(coreRing);
    const hatchMat = new THREE.MeshStandardMaterial({ color: 0x24282a, roughness: 0.78, metalness: 0.42 });
    const leftDoor = new THREE.Mesh(roundedBoxGeometry(0.48, 0.54, 0.04, 0.035), hatchMat);
    leftDoor.position.set(-0.72, -0.02, 0.45);
    leftDoor.rotation.y = -0.38;
    leftDoor.castShadow = true;
    generator.add(leftDoor);
    const rightDoor = new THREE.Mesh(roundedBoxGeometry(0.4, 0.42, 0.04, 0.035), hatchMat);
    rightDoor.position.set(0.08, -0.04, 0.45);
    rightDoor.rotation.y = 0.22;
    rightDoor.castShadow = true;
    generator.add(rightDoor);
    [-0.14, -0.02, 0.1].forEach((y) => {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.018, 0.018), steelMat);
      rib.position.set(-0.02, y + 0.04, 0.46);
      generator.add(rib);
    });
    [-0.64, -0.48, -0.32, -0.16].forEach((x) => {
      const gridBar = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.48, 0.018), steelMat);
      gridBar.position.set(x, -0.03, 0.47);
      generator.add(gridBar);
    });
    [-0.48, -0.22, 0.04, 0.3].forEach((x) => {
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.012, 12), steelMat);
      bolt.position.set(x, 0.38, 0.47);
      bolt.rotation.x = Math.PI / 2;
      generator.add(bolt);
    });
    const exhaustStack = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.42, 18), darkSteelMat);
    exhaustStack.position.set(0.86, 0.62, -0.1);
    exhaustStack.rotation.z = -0.18;
    exhaustStack.castShadow = true;
    generator.add(exhaustStack);
    const exhaustCap = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.06, 18), steelMat);
    exhaustCap.position.set(0.9, 0.84, -0.1);
    exhaustCap.rotation.z = -0.18;
    generator.add(exhaustCap);

    const lamp = new THREE.Group();
    lamp.position.set(-2.02, 0.08, 0.55);
    root.add(lamp);
    lamp.add(tubeBetween(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.24, 0), 0.026, darkSteelMat, 14));
    lamp.add(tubeBetween(new THREE.Vector3(0, 1.24, 0), new THREE.Vector3(0.22, 1.32, 0.06), 0.018, darkSteelMat, 10));
    const lampHead = new THREE.Mesh(roundedBoxGeometry(0.24, 0.12, 0.16, 0.028), darkSteelMat);
    lampHead.position.set(0.29, 1.34, 0.09);
    lamp.add(lampHead);
    const lampBulb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 14, 10), new THREE.MeshStandardMaterial({
      color: 0xffcc96,
      emissive: 0xa85f22,
      emissiveIntensity: 0.8,
      roughness: 0.42,
      metalness: 0.1,
    }));
    lampBulb.position.set(0.35, 1.3, 0.09);
    lamp.add(lampBulb);
    const lampGlow = new THREE.PointLight(0xffb56a, 1.3, 4.6);
    lampGlow.position.set(0.36, 1.29, 0.1);
    root.add(lampGlow);

    const smokeMat = new THREE.MeshBasicMaterial({ color: 0x8f989e, transparent: true, opacity: 0.12, depthWrite: false });
    const smokePuffs = [0, 1, 2, 3].map((index) => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(0.09 + index * 0.018, 18, 12), smokeMat.clone());
      puff.position.set(-1.02 + index * 0.03, 0.78 + index * 0.12, -0.12 + index * 0.01);
      root.add(puff);
      puff.userData.phase = index / 4;
      return puff;
    });

    const cablePoints = [
      new THREE.Vector3(-1.22, 0.16, 0.12),
      new THREE.Vector3(-0.92, 0.08, 0.02),
      new THREE.Vector3(-0.55, 0.08, -0.14),
      new THREE.Vector3(-0.36, 0.28, -0.27),
      ...Array.from({ length: 18 }, (_, index) => {
        const y = 0.34 + index * 0.105;
        const angle = index * 0.92;
        return new THREE.Vector3(-0.34 + Math.cos(angle) * 0.105, y, -0.24 + Math.sin(angle) * 0.08);
      }),
      new THREE.Vector3(-0.1, 2.18, -0.14),
      new THREE.Vector3(-0.02, 2.36, -0.11),
    ];
    const cableCurve = new THREE.CatmullRomCurve3(cablePoints);
    const cableMesh = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 120, 0.024, 14), cableMat);
    cableMesh.castShadow = true;
    root.add(cableMesh);
    const electricityMat = new THREE.MeshBasicMaterial({ color: 0xff664d, transparent: true, opacity: 0.95 });
    const electricityPulse = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 10), electricityMat);
    root.add(electricityPulse);
    const sparkLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0.12, 0.03, 0)]),
      new THREE.LineBasicMaterial({ color: 0xff7a58, transparent: true, opacity: 0.75 }),
    );
    root.add(sparkLine);

    const signalRings = [0, 1, 2].map((index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.14, 0.006, 8, 72),
        new THREE.MeshBasicMaterial({ color: 0xff5642, transparent: true, opacity: 0.78 }),
      );
      ring.position.copy(tower.position).add(new THREE.Vector3(-0.08, 2.97, -0.08));
      ring.rotation.x = 0;
      ring.userData.phase = index / 3;
      root.add(ring);
      return ring;
    });

    let lastProjectedMuzzle: { clientX: number; clientY: number } | null = null;
    const projectMuzzleToSvg = () => {
      const canvasRect = renderer.domElement.getBoundingClientRect();
      if (canvasRect.width <= 0 || canvasRect.height <= 0) return;

      const world = new THREE.Vector3();
      launchAnchor.getWorldPosition(world);
      world.project(camera);

      const next = {
        clientX: canvasRect.left + ((world.x + 1) / 2) * canvasRect.width,
        clientY: canvasRect.top + ((1 - world.y) / 2) * canvasRect.height,
      };

      if (!Number.isFinite(next.clientX) || !Number.isFinite(next.clientY)) return;
      if (
        lastProjectedMuzzle
        && Math.abs(lastProjectedMuzzle.clientX - next.clientX) < 0.5
        && Math.abs(lastProjectedMuzzle.clientY - next.clientY) < 0.5
      ) {
        return;
      }

      lastProjectedMuzzle = next;
      onMuzzleProject(next);
    };

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const compact = viewportWidth <= 520;
      const tablet = viewportWidth <= 760;
      const pixelRatio = compact ? 1.25 : tablet ? 1.5 : 2;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatio));
      key.shadow.mapSize.set(compact ? 256 : 512, compact ? 256 : 512);
      root.scale.setScalar(compact ? 0.76 : tablet ? 0.76 : 0.78);
      root.position.set(compact ? -0.32 : tablet ? -0.28 : -0.22, compact ? -0.08 : tablet ? -0.06 : 0.02, 0);
      renderer.setSize(Math.max(1, width), Math.max(1, height), false);
      camera.aspect = Math.max(1, width) / Math.max(1, height);
      camera.updateProjectionMatrix();
      window.requestAnimationFrame(projectMuzzleToSvg);
    };
    resize();
    const projectionTimers = [120, 420, 900].map((delay) => window.setTimeout(projectMuzzleToSvg, delay));

    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let isSceneVisible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isSceneVisible = entry.isIntersecting;
    });
    visibilityObserver.observe(mount);

    let animationStart: number | null = null;
    let lastConsumedManualPulse = manualShotPulseRef.current;
    const manualRecoilMoments: number[] = [];
    let lastRenderTime = 0;
    renderer.setAnimationLoop((time) => {
      const viewportWidth = window.innerWidth;
      const frameBudget = viewportWidth <= 520 ? 40 : viewportWidth <= 760 ? 33 : 24;
      if (!isSceneVisible || time - lastRenderTime < frameBudget) return;
      lastRenderTime = time;
      animationStart ??= time;
      const elapsed = (time - animationStart) / 1000;
      const pendingManualShots = manualShotPulseRef.current - lastConsumedManualPulse;
      if (pendingManualShots > 0) {
        for (let index = 0; index < pendingManualShots; index += 1) {
          manualRecoilMoments.push(elapsed);
        }
        lastConsumedManualPulse = manualShotPulseRef.current;
      }
      signalRings.forEach((ring) => {
        const progress = (elapsed * 0.52 + ring.userData.phase) % 1;
        const scale = 0.72 + progress * 1.95;
        ring.scale.setScalar(scale);
        const material = ring.material;
        if (material instanceof THREE.MeshBasicMaterial) {
          material.opacity = Math.max(0, 0.54 * (1 - progress));
        }
      });
      const antennaTipMaterial = antennaTip.material;
      if (antennaTipMaterial instanceof THREE.MeshStandardMaterial) {
        const blink = 0.5 + Math.sin(elapsed * 5.8) * 0.5;
        antennaTipMaterial.emissiveIntensity = 0.42 + blink * 1.2;
      }
      const lampBulbMaterial = lampBulb.material;
      if (lampBulbMaterial instanceof THREE.MeshStandardMaterial) {
        const flicker = 0.78 + Math.sin(elapsed * 9.2) * 0.13 + Math.sin(elapsed * 23.5) * 0.04;
        lampBulbMaterial.emissiveIntensity = flicker;
        lampGlow.intensity = 1.22 + flicker * 0.42;
      }
      smokePuffs.forEach((puff) => {
        const progress = (elapsed * 0.12 + puff.userData.phase) % 1;
        puff.position.y = 0.84 + progress * 0.7;
        puff.position.x = -1.02 + Math.sin(progress * Math.PI * 2) * 0.08;
        puff.position.z = -0.12 + Math.cos(progress * Math.PI * 2) * 0.04;
        puff.scale.setScalar(0.8 + progress * 1.15);
        const material = puff.material;
        if (material instanceof THREE.MeshBasicMaterial) {
          material.opacity = 0.14 * (1 - progress);
        }
      });
      const cableProgress = (elapsed * 0.42) % 1;
      electricityPulse.position.copy(cableCurve.getPointAt(cableProgress));
      electricityPulse.scale.setScalar(0.7 + Math.sin(elapsed * 14) * 0.22);
      const sparkStart = cableCurve.getPointAt(cableProgress);
      const sparkEnd = cableCurve.getPointAt(Math.min(0.995, cableProgress + 0.02));
      sparkLine.geometry.setFromPoints([sparkStart, sparkEnd]);

      const shotCycle = 4.05;
      const autoRecoil = [0, 1.35, 2.7].reduce((maxRecoil, delay) => {
        const phase = ((elapsed - delay + shotCycle) % shotCycle);
        const amount = phase < 0.045 ? 1 - phase / 0.045 : 0;
        return Math.max(maxRecoil, amount);
      }, 0);
      let manualRecoil = 0;
      for (let index = manualRecoilMoments.length - 1; index >= 0; index -= 1) {
        const delta = elapsed - manualRecoilMoments[index];
        if (delta > 0.18) {
          manualRecoilMoments.splice(index, 1);
          continue;
        }
        const amount = delta < 0.055 ? 1 - delta / 0.055 : Math.max(0, 1 - (delta - 0.055) / 0.125) * 0.42;
        manualRecoil = Math.max(manualRecoil, amount);
      }
      const recoil = Math.max(autoRecoil, manualRecoil);
      barrelGroup.position.x = -recoil * 0.08;
      muzzleFlash.scale.set(1 + recoil * 1.4, 0.42 + recoil * 0.16, 0.42 + recoil * 0.16);
      const flashMaterial = muzzleFlash.material;
      if (flashMaterial instanceof THREE.MeshBasicMaterial) {
        flashMaterial.opacity = recoil * 0.42;
      }
      turret.rotation.y = Math.sin(elapsed * 1.5) * 0.014;
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      projectionTimers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
      visibilityObserver.disconnect();
      disposeObject(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onMuzzleProject]);

  return (
    <div className="hero-adversary-three" aria-hidden="true">
      <div ref={mountRef} className="hero-adversary-three-canvas" />
      <div className="hero-adversary-three-label hero-adversary-three-label--zone">Adversary grid</div>
      <div className="hero-adversary-three-label hero-adversary-three-label--gen">Surveillance core</div>
    </div>
  );
}

function MeshTower() {
  const rings = [
    { y: 82, l: 38, r: 64 },
    { y: 118, l: 31, r: 70 },
    { y: 158, l: 23, r: 77 },
    { y: 199, l: 15, r: 84 },
    { y: 232, l: 8, r: 91 },
  ];

  return (
    <g className="hero-ad-tower" transform="translate(135 15) scale(0.9)">
      <ellipse className="hero-ad-shadow" cx="49" cy="239" rx="58" ry="10" />
      <polygon className="hero-ad-tower-side-fill" points="64,82 76,76 102,225 91,232" />
      <polygon className="hero-ad-tower-fill" points="38,82 64,82 91,232 8,232" />
      <polygon className="hero-ad-tower-top-cap" points="38,82 64,82 76,76 49,76" />
      {rings.map((ring) => (
        <g key={ring.y}>
          <line className="hero-ad-tower-ring" x1={ring.l} y1={ring.y} x2={ring.r} y2={ring.y} />
          <line className="hero-ad-tower-side-ring" x1={ring.r} y1={ring.y} x2={ring.r + 9} y2={ring.y - 5} />
        </g>
      ))}
      <line className="hero-ad-tower-leg hero-ad-tower-leg--edge" x1="38" y1="82" x2="8" y2="232" />
      <line className="hero-ad-tower-leg hero-ad-tower-leg--edge" x1="64" y1="82" x2="91" y2="232" />
      <line className="hero-ad-tower-leg hero-ad-tower-leg--rear" x1="76" y1="76" x2="102" y2="225" />
      <line className="hero-ad-tower-leg" x1="46" y1="85" x2="29" y2="232" />
      <line className="hero-ad-tower-leg" x1="57" y1="85" x2="73" y2="232" />
      {rings.slice(0, -1).map((top, index) => {
        const bottom = rings[index + 1];
        return (
          <g key={`tower-brace-${top.y}`}>
            <line className="hero-ad-tower-brace" x1={top.l} y1={top.y} x2={bottom.r} y2={bottom.y} />
            <line className="hero-ad-tower-brace" x1={top.r} y1={top.y} x2={bottom.l} y2={bottom.y} />
          </g>
        );
      })}
      <line className="hero-ad-tower-foot" x1="8" y1="232" x2="-8" y2="242" />
      <line className="hero-ad-tower-foot" x1="8" y1="232" x2="27" y2="243" />
      <line className="hero-ad-tower-foot" x1="91" y1="232" x2="69" y2="243" />
      <line className="hero-ad-tower-foot" x1="91" y1="232" x2="108" y2="241" />
      <ellipse className="hero-ad-tower-pad" cx="-8" cy="242" rx="5" ry="1.8" />
      <ellipse className="hero-ad-tower-pad" cx="27" cy="243" rx="5" ry="1.8" />
      <ellipse className="hero-ad-tower-pad" cx="69" cy="243" rx="5" ry="1.8" />
      <ellipse className="hero-ad-tower-pad" cx="108" cy="241" rx="5" ry="1.8" />

      <g className="hero-ad-launcher">
        <ellipse className="hero-ad-launcher-ring" cx="52" cy="82" rx="34" ry="8.2" />
        <polygon className="hero-ad-launcher-top" points="27,74 74,74 88,64 42,64" />
        <polygon className="hero-ad-launcher-face" points="32,74 74,74 69,54 38,54" />
        <polygon className="hero-ad-launcher-side" points="74,74 88,64 82,47 69,54" />
        <path className="hero-ad-launcher-detail" d="M41 60 H65 M39 66 H69" />
        <path className="hero-ad-barrel" d="M72 62 L89 58 H112 V67 H89 Z" />
        <ellipse className="hero-ad-muzzle" cx="112" cy="62" rx="3.2" ry="5.2" />
      </g>

      {baseThreats.map((t) => (
        <ellipse key={t.id} className="hero-muzzle-flash"
          cx="112" cy="62" rx="15" ry="8"
          style={{ '--pod-delay': t.delay, '--threat': t.color } as CSSProperties}
        />
      ))}

      <line className="hero-ad-antenna" x1="52" y1="54" x2="52" y2="32" />
      <path className="hero-ad-antenna-cross" d="M42 43 H62 M46 38 H58" />
      <circle className="hero-antenna-tip-dot" cx="52" cy="32" r="2.2" />
    </g>
  );
}

// Shared fence helpers for the curved perimeter.
type FencePost = { foot: { x: number; y: number }; top: { x: number; y: number }; w: number };

function renderFencePosts(posts: FencePost[]) {
  return posts.map((post) => (
    <g key={`p${post.foot.x}-${post.foot.y}`}>
      <ellipse className="hero-ad-fence-foot" cx={post.foot.x + post.w * 0.5} cy={post.foot.y + 3} rx={post.w * 1.65} ry={post.w * 0.5} />
      <polygon className="hero-ad-fence-cap" points={`${post.top.x - 2},${post.top.y + 1} ${post.top.x + post.w + 2},${post.top.y - 2} ${post.top.x + post.w + 6},${post.top.y - 7} ${post.top.x + 2},${post.top.y - 4}`} />
      <polygon className="hero-ad-fence-post" points={`${post.foot.x},${post.foot.y} ${post.foot.x + post.w},${post.foot.y - 1.8} ${post.top.x + post.w},${post.top.y - 2.4} ${post.top.x},${post.top.y}`} />
      <polygon className="hero-ad-fence-post-side" points={`${post.foot.x + post.w},${post.foot.y - 1.8} ${post.foot.x + post.w + 4},${post.foot.y - 5} ${post.top.x + post.w + 4},${post.top.y - 6} ${post.top.x + post.w},${post.top.y - 2.4}`} />
    </g>
  ));
}

function TerritoryFloor() {
  // Hilly adversary terrain island: raised land mass, no water, no sharp polygon enclosure.
  return (
    <g className="hero-territory-floor">
      <ellipse className="hero-territory-floor-shadow" cx="-25" cy="285" rx="315" ry="42" />
      <path
        className="hero-territory-floor-slab"
        d="M286 92 C220 100 128 124 39 158 C-57 195 -151 249 -294 318 C-163 332 39 325 224 296 C226 257 231 218 243 178 C253 139 268 107 286 92Z"
      />
      <path
        className="hero-territory-floor-front"
        d="M-294 318 C-161 332 39 325 224 296 C220 308 204 317 176 323 C25 350 -154 350 -300 334 C-306 329 -304 323 -294 318Z"
      />
      <path className="hero-territory-floor-ridge" d="M250 117 C166 137 81 166 -10 205 M226 188 C127 222 17 249 -116 274 M205 276 C65 301 -97 310 -252 310" />
      <path className="hero-territory-floor-rim" d="M286 92 C220 100 128 124 39 158 C-57 195 -151 249 -294 318" />
    </g>
  );
}

function FencePerimeter() {
  const posts: FencePost[] = [
    { foot: { x: 224, y: 268 }, top: { x: 224, y: 196 }, w: 8 },
    { foot: { x: 242, y: 214 }, top: { x: 242, y: 157 }, w: 7 },
    { foot: { x: 263, y: 150 }, top: { x: 263, y: 105 }, w: 6 },
    { foot: { x: 286, y: 88 }, top: { x: 286, y: 51 }, w: 5 },
    { foot: { x: 206, y: 109 }, top: { x: 206, y: 72 }, w: 5 },
    { foot: { x: 90, y: 156 }, top: { x: 90, y: 121 }, w: 4 },
    { foot: { x: -38, y: 232 }, top: { x: -38, y: 196 }, w: 3 },
    { foot: { x: -294, y: 323 }, top: { x: -294, y: 276 }, w: 3 },
    { foot: { x: -146, y: 323 }, top: { x: -146, y: 276 }, w: 5 },
    { foot: { x: 0, y: 318 }, top: { x: 0, y: 271 }, w: 6 },
    { foot: { x: 120, y: 307 }, top: { x: 120, y: 260 }, w: 7 },
    { foot: { x: 224, y: 295 }, top: { x: 224, y: 248 }, w: 8 },
  ];

  return (
    <g className="hero-ad-fence hero-ad-fence-perimeter">
      <path className="hero-ad-fence-rail hero-ad-fence-rail--top" d="M224 196 C237 165 265 91 286 51 C218 60 131 93 38 150 C-29 190 -128 250 -294 276 C-142 280 66 267 224 248 C226 233 226 213 224 196" />
      <path className="hero-ad-fence-rail hero-ad-fence-rail--mid" d="M224 222 C238 181 265 112 286 70 C214 83 126 117 34 171 C-35 212 -135 266 -294 299 C-139 300 67 286 224 270 C226 253 226 235 224 222" />
      <path className="hero-ad-fence-rail" d="M224 268 C239 214 264 137 286 88 C210 105 116 135 22 171 C-99 218 -196 277 -294 323 C-139 327 71 314 224 295 C228 285 228 276 224 268" />
      <path className="hero-ad-fence-soft-mesh" d="M260 105 C186 127 107 158 24 202 M222 154 C127 190 33 229 -88 268 M207 263 C77 281 -63 292 -224 300" />
      {renderFencePosts(posts)}
      <g className="hero-fence-electric" aria-hidden="true">
        <path className="hero-fence-bolt hero-fence-bolt--a" d="M241 151 L247 144 L246 153 L254 148" />
        <path className="hero-fence-bolt hero-fence-bolt--b" d="M263 99 L269 92 L268 101 L276 96" />
        <path className="hero-fence-bolt hero-fence-bolt--c" d="M279 65 L285 58 L284 67 L292 62" />
      </g>
    </g>
  );
}

function PowerCables() {
  // Cable travels ground level, then spirals around left tower leg as it climbs
  // Left leg: base ~(169, 186), top ~(157, 78), center x changes from 169→157
  // Spiral wraps around the leg with lateral motion (left-right oscillation around leg)
  const cable = `
    M60,265
    L140,265
    C150,265 158,264 163,258
    C168,200 172,175 167,150
    C162,135 157,120 158,100
    C159,88 160,78 160,78
    C159,95 160,110 161,130
    C162,150 165,170 169,185
    C167,210 150,260 90,265
  `;

  return (
    <g className="hero-power-cables" aria-hidden="true">
      <path className="hero-power-cable-shadow" d={cable} />
      <path className="hero-power-cable hero-power-cable--tower" d={cable} />
      <path className="hero-power-pulse hero-power-pulse--tower" d={cable} />
    </g>
  );
}

function PowerGenerator() {
  const s = 1.5;  // Scale factor
  const offsX = -120, offsY = -110;  // Positioned deeper in compound so top peeks above front fence
  const SDX = 14 * s, SDY = -9 * s;

  return (
    <g className="hero-generator" transform={`translate(${offsX} ${offsY})`}>
      <g className="hero-generator-smoke" aria-hidden="true">
        <ellipse className="hero-generator-smoke-puff hero-generator-smoke-puff--a" cx={166*s} cy={200*s} rx={6.2*s} ry={3.3*s} />
        <ellipse className="hero-generator-smoke-puff hero-generator-smoke-puff--b" cx={174*s} cy={190*s} rx={8.1*s} ry={4.5*s} />
        <ellipse className="hero-generator-smoke-puff hero-generator-smoke-puff--c" cx={163*s} cy={181*s} rx={9.6*s} ry={5.2*s} />
      </g>
      <ellipse className="hero-generator-shadow" cx={88*s} cy={271*s} rx={66*s} ry={9*s} />
      <line className="hero-generator-skid" x1={38*s} y1={263*s} x2={142*s} y2={257*s} />
      <line className="hero-generator-skid" x1={46*s} y1={270*s} x2={148*s} y2={264*s} />
      <polygon className="hero-generator-side" points={`${142*s},${218*s} ${142*s + SDX},${218*s + SDY} ${142*s + SDX},${255*s + SDY} ${142*s},${262*s}`} />
      <polygon className="hero-generator-top" points={`${34*s},${226*s} ${142*s},${218*s} ${142*s + SDX},${218*s + SDY} ${34*s + SDX},${226*s + SDY}`} />
      <polygon className="hero-generator-face" points={`${34*s},${226*s} ${142*s},${218*s} ${142*s},${262*s} ${34*s},${270*s}`} />
      <polygon className="hero-generator-stripe" points={`${34*s},${226*s} ${142*s},${218*s} ${142*s},${230*s} ${34*s},${238*s}`} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
        const stripeTopY = (x: number) => (226 - ((x - 34) * 8) / 108) * s;
        const stripeBottomY = (x: number) => (238 - ((x - 34) * 8) / 108) * s;
        return (
          <polygon
            key={index}
            className="hero-generator-mark"
            points={`${(43 + index * 12)*s},${stripeTopY(43 + index * 12)} ${(51 + index * 12)*s},${stripeTopY(51 + index * 12)} ${(47 + index * 12)*s},${stripeBottomY(47 + index * 12)} ${(39 + index * 12)*s},${stripeBottomY(39 + index * 12)}`}
          />
        );
      })}
      <g className="hero-generator-exhaust">
        <path className="hero-generator-exhaust-pipe" d={`M${140*s} ${224*s} C${148*s} ${218*s} ${151*s} ${212*s} ${157*s} ${208*s}`} />
        <polygon className="hero-generator-muffler" points={`${153*s},${206*s} ${169*s},${201*s} ${175*s},${209*s} ${158*s},${216*s}`} />
        <ellipse className="hero-generator-muffler-cap" cx={174*s} cy={205*s} rx={3.1*s} ry={5.1*s} transform={`rotate(-25 ${174*s} ${205*s})`} />
        <path className="hero-generator-exhaust-nozzle" d={`M${176*s} ${204*s} L${183*s} ${201*s}`} />
      </g>
      <path className="hero-generator-vent" d={`M${48*s} ${243*s} L${76*s} ${241*s} M${48*s} ${249*s} L${78*s} ${247*s} M${48*s} ${255*s} L${73*s} ${253*s}`} />
      <polygon className="hero-generator-panel" points={`${44*s},${240*s} ${84*s},${237*s} ${84*s},${258*s} ${44*s},${261*s}`} />
      <ellipse className="hero-generator-core" cx={116*s} cy={243*s} rx={11.5*s} ry={13.5*s} />
      <ellipse className="hero-generator-core-ring" cx={116*s} cy={243*s} rx={6.8*s} ry={8.5*s} />
      <path className="hero-generator-bolt-icon" d={`M${116*s} ${235*s} L${109*s} ${244*s} H${116*s} L${112*s} ${252*s} L${124*s} ${240*s} H${118*s} Z`} />
      <circle className="hero-generator-port" cx={136*s} cy={236*s} r={3.2*s} />
      <circle className="hero-generator-port hero-generator-port--lower" cx={139*s} cy={247*s} r={2.6*s} />
      <circle className="hero-generator-bolt" cx={41*s} cy={239*s} r={1.6*s} />
      <circle className="hero-generator-bolt" cx={137*s} cy={232*s} r={1.6*s} />
      <circle className="hero-generator-bolt" cx={41*s} cy={265*s} r={1.6*s} />
      <circle className="hero-generator-bolt" cx={137*s} cy={257*s} r={1.6*s} />
      <text className="hero-generator-title" x={87*s} y={228.5*s} textAnchor="middle" transform={`rotate(-4 ${87*s} ${228.5*s})`} fontSize={`${20*s}`}>ADVERSARY</text>
      <text className="hero-generator-sub" x={87*s} y={234.2*s} textAnchor="middle" transform={`rotate(-4 ${87*s} ${234.2*s})`} fontSize={`${15*s}`}>SURVEILLANCE ZONE</text>
    </g>
  );
}

function TerrainIsland() {
  // Tower world-space footprint: x≈129–219, center x=174, base y≈194
  // Island is a wide isometric hexagonal slab, moved up (smaller y values)
  return (
    <g className="hero-terrain-island">
      <ellipse className="hero-island-shadow" cx="174" cy="220" rx="68" ry="13" />
      {/* Top face — wide hexagon, moved up */}
      <polygon className="hero-island-top" points="174,160 228,170 228,193 174,205 120,193 120,170" />
      {/* Front-bottom visible side face */}
      <polygon className="hero-island-side" points="120,193 228,193 234,208 174,216 114,208" />
      {/* Surface ridge texture lines for depth */}
      <path className="hero-island-ridge" d="M144,171 L212,193 M154,203 L208,166 M120,181 L174,205" />
      {/* Front edge highlight */}
      <path className="hero-island-front" d="M120,193 L174,205 L228,193" />
    </g>
  );
}

function GeneratorIsland() {
  const s = 1.5;
  const offsX = -120, offsY = -110;
  return (
    <g className="hero-generator-island" transform={`translate(${offsX} ${offsY})`}>
      <ellipse className="hero-generator-island-shadow" cx={91*s} cy={275*s} rx={88*s} ry={13*s} />
      <polygon className="hero-generator-island-top" points={`${12*s},${267*s} ${48*s},${241*s} ${135*s},${235*s} ${168*s},${257*s} ${132*s},${284*s} ${19*s},${286*s}`} />
      <polygon className="hero-generator-island-side" points={`${19*s},${286*s} ${132*s},${284*s} ${168*s},${257*s} ${162*s},${268*s} ${131*s},${294*s} ${15*s},${293*s}`} />
      <path className="hero-generator-island-ridge" d={`M${24*s} ${270*s} L${80*s} ${244*s} M${49*s} ${282*s} L${136*s} ${255*s} M${14*s} ${278*s} L${55*s} ${249*s}`} />
    </g>
  );
}

function ThreatBorder() {
  return (
    <g className="hero-threat-border" aria-hidden="true">
      {/* Territory ground fills behind everything */}
      <TerritoryFloor />
      <TerrainIsland />
      <GeneratorIsland />
      {/* Curved perimeter renders behind the tower/generator where depth requires it. */}
      <FencePerimeter />

      <MeshTower />
      <PowerCables />

      <circle className="hero-signal-ring hero-signal-ring--s1" cx="183" cy="47" r="4" />
      <circle className="hero-signal-ring hero-signal-ring--s2" cx="183" cy="47" r="4" />
      <circle className="hero-signal-ring hero-signal-ring--s3" cx="183" cy="47" r="4" />

      <PowerGenerator />
    </g>
  );
}

function ShieldImpactMark({ className, delay, x, y }: { className: string; delay: string; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={className} style={{ '--delay': delay } as CSSProperties}>
        <path className="hero-shield-impact-cross" d="M-13 0 H13 M0 -13 V13" />
        <path className="hero-shield-impact-bolt hero-shield-impact-bolt--a" d="M-3 -2 L8 -10 L4 -1 L16 -5" />
        <path className="hero-shield-impact-bolt hero-shield-impact-bolt--b" d="M-2 2 L-15 9 L-8 1 L-20 4" />
        <circle className="hero-shield-impact-core" r="3.2" />
        <circle className="hero-shield-impact-chip hero-shield-impact-chip--a" cx="-18" cy="-8" r="1.8" />
        <circle className="hero-shield-impact-chip hero-shield-impact-chip--b" cx="18" cy="7" r="1.5" />
      </g>
    </g>
  );
}

function emitHeroHit(hitId: number) {
  window.dispatchEvent(new CustomEvent('fadsec:hero-hit', { detail: { hitId } }));
}

const cursorSmokeConfigs = [
  { radiusX: 10.2, radiusY: 6.2, blur: 3.8, driftX: 0.15, driftY: 0.35 },
  { radiusX: 13.6, radiusY: 8.6, blur: 5.1, driftX: 0.35, driftY: 0.7 },
  { radiusX: 17.8, radiusY: 11.6, blur: 6.6, driftX: 0.55, driftY: 1.1 },
  { radiusX: 22.2, radiusY: 14.6, blur: 8.2, driftX: 0.8, driftY: 1.55 },
  { radiusX: 27, radiusY: 18, blur: 9.8, driftX: 1, driftY: 2 },
] as const;

function HeldShield({ impactRef, showImpacts }: { impactRef: RefObject<SVGGElement | null>; showImpacts: boolean }) {
  return (
    <g ref={impactRef}>
      <g transform="translate(606 78) rotate(10 92 120) scale(0.66)">
        <g className="hero-shield-rig">
          <circle className="hero-shield-halo hero-shield-halo--outer" cx="92" cy="118" r="102" />
          <circle className="hero-shield-halo hero-shield-halo--inner" cx="92" cy="118" r="76" />
          <path className="hero-shield-shadow" d="M92 206 C128 206 160 216 160 228 C160 242 128 252 92 252 C56 252 24 242 24 228 C24 216 56 206 92 206Z" />
          <g className="hero-shield-body">
            <path className="hero-shield-side" d={shieldPath} transform="translate(8 8)" />
            <path className="hero-shield-depth" d={shieldInsetPath} />
            <path className="hero-shield-face" d={shieldCorePath} />
            <g className="hero-shield-plate" clipPath="url(#hero-shield-clip)">
              <path className="hero-shield-plate-base" d={shieldCorePath} />
              <path className="hero-shield-highlight" d="M54 30 C64 18 78 12 92 12 C81 42 78 82 78 124 C78 162 82 194 88 220 C68 210 56 192 46 166 C38 142 34 110 34 84 C34 60 40 40 54 30Z" />
              <path className="hero-shield-emblem" d="M86 92 L100 116 L86 140 L72 116 Z" transform="rotate(4 86 116)" />
              <path className="hero-shield-emblem hero-shield-emblem--inner" d="M86 102 L92 116 L86 130 L80 116 Z" transform="rotate(4 86 116)" />
              <g className="hero-shield-battle-marks">
                <path className="hero-shield-scar hero-shield-scar--one" d="M58 58 C53 71 57 83 50 96" />
                <path className="hero-shield-scar hero-shield-scar--two" d="M42 105 C37 118 42 130 34 144" />
                <path className="hero-shield-scar hero-shield-scar--three" d="M48 149 C43 162 48 175 41 188" />
                <path className="hero-shield-scar hero-shield-scar--four" d="M128 42 C122 55 127 67 119 80" />
                <path className="hero-shield-scar hero-shield-scar--five" d="M132 152 C125 166 130 178 121 191" />
                <path className="hero-shield-scar hero-shield-scar--six" d="M76 176 C70 188 75 199 68 211" />
                <path className="hero-shield-scar hero-shield-scar--seven" d="M146 92 C139 105 143 118 135 130" />
                <path className="hero-shield-scar hero-shield-scar--eight" d="M31 164 C27 176 31 188 26 199" />
                <path className="hero-shield-gouge" d="M118 76 L132 67 M122 81 L140 75" />
                <path className="hero-shield-gouge hero-shield-gouge--lower" d="M42 130 L55 123 M45 136 L63 131" />
                <path className="hero-shield-gouge hero-shield-gouge--edge" d="M129 139 L144 132 M133 145 L151 141" />
                <path className="hero-shield-hairline" d="M64 66 L55 82 M68 69 L59 90 M53 112 L44 128 M57 115 L48 137 M52 151 L43 169 M57 155 L49 181" />
                <path className="hero-shield-hairline hero-shield-hairline--right" d="M124 54 L116 73 M130 57 L122 82 M128 160 L118 179 M134 163 L124 190 M141 105 L132 124" />
                <circle className="hero-shield-pit" cx="48" cy="88" r="2.2" />
                <circle className="hero-shield-pit" cx="132" cy="122" r="2.5" />
                <circle className="hero-shield-pit" cx="83" cy="184" r="2" />
                <circle className="hero-shield-pit" cx="122" cy="92" r="1.9" />
                <circle className="hero-shield-pit" cx="58" cy="134" r="1.7" />
              </g>
              <circle className="hero-shield-rivet" cx="50" cy="42" r="3.5" />
              <circle className="hero-shield-rivet" cx="130" cy="42" r="3.5" />
              <circle className="hero-shield-rivet" cx="40" cy="198" r="3.5" />
              <circle className="hero-shield-rivet" cx="140" cy="198" r="3.5" />
              <circle className="hero-shield-rivet hero-shield-rivet--top" cx="90" cy="26" r="4.1" />
              <circle className="hero-shield-rivet hero-shield-rivet--mid" cx="90" cy="216" r="4.1" />
            </g>
            <path className="hero-shield-core" d={shieldCorePath} />
            <path className="hero-shield-rim" d={shieldCorePath} />
            {showImpacts && (
              <>
                <ShieldImpactMark className="hero-shield-impact-mark hero-shield-impact-mark--one" delay="0s" x={78} y={68} />
                <ShieldImpactMark className="hero-shield-impact-mark hero-shield-impact-mark--two" delay="1.35s" x={71} y={118} />
                <ShieldImpactMark className="hero-shield-impact-mark hero-shield-impact-mark--three" delay="2.7s" x={58} y={178} />
              </>
            )}
          </g>
        </g>
      </g>
    </g>
  );
}

function GuardianLegs({
  backUpperLegRef,
  backLowerLegRef,
  frontUpperLegRef,
  frontLowerLegRef,
}: {
  backUpperLegRef: RefObject<SVGPathElement | null>;
  backLowerLegRef: RefObject<SVGPathElement | null>;
  frontUpperLegRef: RefObject<SVGPathElement | null>;
  frontLowerLegRef: RefObject<SVGPathElement | null>;
}) {
  return (
    <>
      <path ref={backUpperLegRef} className="hero-guardian-leg hero-guardian-leg--back" d={pathBetween(guardianBackHip, guardianBackKneeBase)} />
      <path ref={backLowerLegRef} className="hero-guardian-leg hero-guardian-leg--back" d={pathBetween(guardianBackKneeBase, guardianBackFootBase)} />
      <path ref={frontUpperLegRef} className="hero-guardian-leg hero-guardian-leg--front" d={pathBetween(guardianFrontHip, guardianFrontKneeBase)} />
      <path ref={frontLowerLegRef} className="hero-guardian-leg hero-guardian-leg--front" d={pathBetween(guardianFrontKneeBase, guardianFrontFootBase)} />
    </>
  );
}

function GuardianFace({ leftEyeRef, rightEyeRef }: { leftEyeRef: RefObject<SVGCircleElement | null>; rightEyeRef: RefObject<SVGCircleElement | null> }) {
  return (
    <g className="hero-guardian-headgroup" transform="translate(0 32)">
      <circle className="hero-guardian-head" cx="782" cy="50" r="42" />
      <path className="hero-guardian-head-ring" d="M742 50 C742 24 762 8 782 8 C804 8 822 24 822 50 C822 76 804 92 782 92 C762 92 742 76 742 50Z" />
      <g className="hero-guardian-eyes">
        <path className="hero-eye-socket hero-eye-socket--near" d="M754 43 H772 C772 57 754 57 754 43Z" />
        <path className="hero-eye-socket hero-eye-socket--far" d="M780 43 H798 C798 57 780 57 780 43Z" />
        <g clipPath="url(#hero-eye-clip)">
          <circle ref={leftEyeRef} className="hero-eyeball" cx="762" cy="48" r="4.1" />
          <circle ref={rightEyeRef} className="hero-eyeball" cx="786" cy="48" r="4.1" />
        </g>
      </g>
    </g>
  );
}

export default function HeroShield() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [projectedThreats, setProjectedThreats] = useState(baseThreats);
  const [manualThreats, setManualThreats] = useState<Threat[]>([]);
  const [manualShotPulse, setManualShotPulse] = useState(0);
  const [isMuzzleReady, setIsMuzzleReady] = useState(false);
  const cursorGroupRef = useRef<SVGGElement>(null);
  const cursorReticleRef = useRef<SVGGElement>(null);
  const cursorCentreRef = useRef<SVGCircleElement>(null);
  const cursorChargeRingRef = useRef<SVGCircleElement>(null);
  const cursorShotRingRef = useRef<SVGCircleElement>(null);
  const cursorSmokeRefs = useRef<(SVGGElement | null)[]>([]);
  const leftEyeRef = useRef<SVGCircleElement>(null);
  const rightEyeRef = useRef<SVGCircleElement>(null);
  const shieldImpactRef = useRef<SVGGElement>(null);
  const upperImpactRef = useRef<SVGGElement>(null);
  const shieldUpperArmRef = useRef<SVGPathElement>(null);
  const shieldForearmRef = useRef<SVGPathElement>(null);
  const shieldHandRigRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGPathElement>(null);
  const backUpperLegRef = useRef<SVGPathElement>(null);
  const backLowerLegRef = useRef<SVGPathElement>(null);
  const frontUpperLegRef = useRef<SVGPathElement>(null);
  const frontLowerLegRef = useRef<SVGPathElement>(null);
  const impactFrameRef = useRef<number | null>(null);
  const manualShotCounterRef = useRef(0);
  const manualShotLaneRef = useRef(0);
  const manualShotTimeoutsRef = useRef<number[]>([]);
  const eyeFrameRef = useRef<number | null>(null);
  const eyeLastTimeRef = useRef<number | null>(null);
  const cursorFrameRef = useRef<number | null>(null);
  const cursorStateRef = useRef({
    press: 0,
    scale: 1,
    scaleVelocity: 0,
    targetScale: 1,
    isHolding: false,
    shotPulse: 0,
    isVisible: false,
  });
  const eyeMotionRef = useRef([
    { ref: leftEyeRef, origin: { x: 762, y: 48 }, current: { x: 762, y: 48 }, velocity: { x: 0, y: 0 }, target: { x: 762, y: 48 } },
    { ref: rightEyeRef, origin: { x: 786, y: 48 }, current: { x: 786, y: 48 }, velocity: { x: 0, y: 0 }, target: { x: 786, y: 48 } },
  ]);

  const handleMuzzleProject = useCallback((point: { clientX: number; clientY: number }) => {
    const svg = svgRef.current;
    const screenCTM = svg?.getScreenCTM();
    if (!svg || !screenCTM) return;

    const svgPoint = svg.createSVGPoint();
    svgPoint.x = point.clientX;
    svgPoint.y = point.clientY;
    const localPoint = svgPoint.matrixTransform(screenCTM.inverse());
    const x = Number(localPoint.x.toFixed(1));
    const y = Number(localPoint.y.toFixed(1));

    setProjectedThreats((current) => {
      const currentStart = current[0]?.path.match(/^M([\d.-]+) ([\d.-]+)/);
      if (currentStart && Math.abs(Number(currentStart[1]) - x) < 0.5 && Math.abs(Number(currentStart[2]) - y) < 0.5) {
        return current;
      }

      return threatsFromMuzzle(x, y);
    });
    setIsMuzzleReady(true);
  }, []);

  const playImpact = useCallback(() => {
    if (impactFrameRef.current) {
      window.cancelAnimationFrame(impactFrameRef.current);
    }

    const duration = 260;
    const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);
    const applyImpact = (amount: number, shieldX: number) => {
      shieldImpactRef.current?.setAttribute('transform', `translate(${shieldX.toFixed(2)} 0)`);
      upperImpactRef.current?.setAttribute('transform', 'translate(0 0)');
      bodyRef.current?.setAttribute('d', interpolatePath(guardianBodyBase, guardianBodyHit, amount));
      
      // Horizontal recoil: elbow nudges right rotating upper arm, hand slides right, whole arm compresses naturally
      const elbow = interpolatePoint(guardianShieldElbowBase, guardianShieldElbowHit, amount);
      const shieldHand = interpolatePoint(guardianShieldHandBase, guardianShieldHandHit, amount);
      
      shieldUpperArmRef.current?.setAttribute('d', pathBetween(guardianShieldShoulder, elbow));
      shieldForearmRef.current?.setAttribute('d', pathBetween(elbow, shieldHand));
      
      // Pure horizontal translate — zero vertical movement
      shieldHandRigRef.current?.setAttribute(
        'transform',
        `translate(${(shieldHand.x - guardianShieldHandBase.x).toFixed(2)} 0)`
      );

      const backKnee = interpolatePoint(guardianBackKneeBase, guardianBackKneeHit, amount);
      const frontKnee = interpolatePoint(guardianFrontKneeBase, guardianFrontKneeHit, amount);
      backUpperLegRef.current?.setAttribute('d', pathBetween(guardianBackHip, backKnee));
      backLowerLegRef.current?.setAttribute('d', pathBetween(backKnee, guardianBackFootBase));
      frontUpperLegRef.current?.setAttribute('d', pathBetween(guardianFrontHip, frontKnee));
      frontLowerLegRef.current?.setAttribute('d', pathBetween(frontKnee, guardianFrontFootBase));
    };

    const step = (startTime: number) => {
      const tick = (time: number) => {
        const progress = Math.min(1, (time - startTime) / duration);
        let absorb: number;
        let shieldX: number;

        if (progress < 0.42) {
          const phase = easeOut(progress / 0.42);
          absorb = phase;
          shieldX = 2.5 * phase;
        } else if (progress < 0.64) {
          const phase = easeOut((progress - 0.42) / 0.22);
          absorb = 1 - 0.65 * phase;
          shieldX = 2.5 - 3.5 * phase;
        } else {
          const phase = easeOut((progress - 0.64) / 0.36);
          absorb = 0.35 * (1 - phase);
          shieldX = -1 * (1 - phase);
        }

        applyImpact(absorb, shieldX);

        if (progress < 1) {
          impactFrameRef.current = window.requestAnimationFrame(tick);
          return;
        }

        applyImpact(0, 0);
        impactFrameRef.current = null;
      };

      tick(startTime);
    };

    impactFrameRef.current = window.requestAnimationFrame(step);
  }, []);

  const fireManualShot = useCallback(() => {
    if (!isMuzzleReady || projectedThreats.length === 0) return;

    const lane = manualShotLaneRef.current % projectedThreats.length;
    manualShotLaneRef.current += 1;
    const sourceThreat = projectedThreats[lane];
    const shotId = `${sourceThreat.id}-manual-${manualShotCounterRef.current}`;
    manualShotCounterRef.current += 1;
    const shot: Threat = {
      ...sourceThreat,
      id: shotId,
      delay: '0s',
    };

    setManualThreats((current) => [...current.slice(-7), shot]);
    setManualShotPulse((current) => current + 1);

    const impactTimer = window.setTimeout(() => {
      playImpact();
      emitHeroHit(lane);
    }, impactTimeMs);
    const cleanupTimer = window.setTimeout(() => {
      setManualThreats((current) => current.filter((entry) => entry.id !== shotId));
    }, shotCycleMs + 160);
    manualShotTimeoutsRef.current.push(impactTimer, cleanupTimer);
  }, [isMuzzleReady, playImpact, projectedThreats]);

  const updateEyeState = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    const screenCTM = svg?.getScreenCTM();
    const localTarget = (() => {
      if (!svg || !screenCTM) return null;

      const point = svg.createSVGPoint();
      point.x = clientX;
      point.y = clientY;

      return point.matrixTransform(screenCTM.inverse());
    })();

    if (!localTarget) return;

    eyeMotionRef.current.forEach((eye) => {
      const dx = localTarget.x - eye.origin.x;
      const dy = localTarget.y - eye.origin.y;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(3.0, Math.hypot(dx, dy) / 30);

      eye.target.x = eye.origin.x + Math.cos(angle) * distance;
      eye.target.y = eye.origin.y + Math.sin(angle) * distance;
    });

    if (eyeFrameRef.current) return;

    const step = (time: number) => {
      const lastTime = eyeLastTimeRef.current ?? time;
      eyeLastTimeRef.current = time;
      const dt = Math.min(0.032, Math.max(0.001, (time - lastTime) / 1000));
      const stiffness = 280;
      const damping = 24;
      const maxOffset = 3.0;
      let stillMoving = false;

      eyeMotionRef.current.forEach((eye) => {
        const accelX = (eye.target.x - eye.current.x) * stiffness;
        const accelY = (eye.target.y - eye.current.y) * stiffness;

        eye.velocity.x = (eye.velocity.x + accelX * dt) * Math.exp(-damping * dt);
        eye.velocity.y = (eye.velocity.y + accelY * dt) * Math.exp(-damping * dt);
        eye.current.x += eye.velocity.x * dt;
        eye.current.y += eye.velocity.y * dt;

        const offsetX = eye.current.x - eye.origin.x;
        const offsetY = eye.current.y - eye.origin.y;
        const offsetDistance = Math.hypot(offsetX, offsetY);
        if (offsetDistance > maxOffset) {
          const scale = maxOffset / offsetDistance;
          eye.current.x = eye.origin.x + offsetX * scale;
          eye.current.y = eye.origin.y + offsetY * scale;

          const remainingX = eye.current.x - eye.origin.x;
          const remainingY = eye.current.y - eye.origin.y;
          if (remainingX * eye.velocity.x + remainingY * eye.velocity.y > 0) {
            eye.velocity.x *= 0.25;
            eye.velocity.y *= 0.25;
          }
        }

        if (eye.ref.current) {
          eye.ref.current.setAttribute('cx', String(eye.current.x));
          eye.ref.current.setAttribute('cy', String(eye.current.y));
        }

        if (Math.abs(eye.target.x - eye.current.x) > 0.02 || Math.abs(eye.target.y - eye.current.y) > 0.02) {
          stillMoving = true;
        }
      });

      if (stillMoving) {
        eyeFrameRef.current = window.requestAnimationFrame(step);
      } else {
        eyeFrameRef.current = null;
        eyeLastTimeRef.current = null;
      }
    };

    eyeFrameRef.current = window.requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (!isMuzzleReady) return undefined;

    const impactOffsets = [2916, 4266, 5616];
    const hitIntervals: number[] = [];
    const hitTimeouts = impactOffsets.map((offset, index) =>
      window.setTimeout(() => {
        playImpact();
        emitHeroHit(index);
        hitIntervals.push(window.setInterval(() => {
          playImpact();
          emitHeroHit(index);
        }, 4050));
      }, offset)
    );

    return () => {
      if (impactFrameRef.current) {
        window.cancelAnimationFrame(impactFrameRef.current);
      }
      hitTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      hitIntervals.forEach((intervalId) => window.clearInterval(intervalId));
    };
  }, [isMuzzleReady, playImpact]);

  useEffect(() => () => {
    manualShotTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    manualShotTimeoutsRef.current = [];
  }, []);

  useEffect(() => {
    const heroSection = svgRef.current?.closest<HTMLElement>('.hero-section');
    if (!heroSection) return undefined;

    const handleHeroClickShot = (event: PointerEvent) => {
      if (!event.isPrimary) return;
      fireManualShot();
    };

    heroSection.addEventListener('pointerup', handleHeroClickShot);
    return () => {
      heroSection.removeEventListener('pointerup', handleHeroClickShot);
    };
  }, [fireManualShot]);

  useEffect(() => {
    const heroSection = svgRef.current?.closest<HTMLElement>('.hero-section');
    const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!heroSection || !window.matchMedia('(pointer: fine)').matches) {
      return undefined;
    }

    const setCursorPosition = (clientX: number, clientY: number) => {
      if (cursorGroupRef.current) {
        cursorGroupRef.current.setAttribute('transform', `translate(${clientX} ${clientY})`);
      }
    };

    const showCursor = (event: PointerEvent) => {
      cursorStateRef.current.isVisible = true;
      cursorGroupRef.current?.setAttribute('opacity', '1');
      setCursorPosition(event.clientX, event.clientY);
      updateEyeState(event.clientX, event.clientY);
    };

    const hideCursor = () => {
      cursorStateRef.current.isVisible = false;
      cursorStateRef.current.isHolding = false;
      cursorStateRef.current.targetScale = 1;
      cursorGroupRef.current?.setAttribute('opacity', '0');
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!cursorStateRef.current.isVisible) {
        cursorStateRef.current.isVisible = true;
        cursorGroupRef.current?.setAttribute('opacity', '1');
      }
      setCursorPosition(event.clientX, event.clientY);
      updateEyeState(event.clientX, event.clientY);
    };

    const handlePointerDown = () => {
      if (!cursorStateRef.current.isVisible) return;
      cursorStateRef.current.isHolding = true;
      cursorStateRef.current.targetScale = 0.68;
      cursorStateRef.current.scaleVelocity = Math.min(cursorStateRef.current.scaleVelocity, -4);
      cursorStateRef.current.press = 1;
      cursorStateRef.current.shotPulse = 0;
    };

    const handlePointerUp = () => {
      if (!cursorStateRef.current.isHolding) return;
      cursorStateRef.current.isHolding = false;
      cursorStateRef.current.targetScale = 1;
      cursorStateRef.current.scaleVelocity = Math.max(cursorStateRef.current.scaleVelocity, 5.8);
      cursorStateRef.current.press = 0.75;
      cursorStateRef.current.shotPulse = 1;
    };

    const renderCursor = () => {
      const state = cursorStateRef.current;
      const dt = 1 / 60;
      state.press = state.isHolding ? Math.min(1, state.press + dt * 8.5) : Math.max(0, state.press - dt * 4.4);
      state.targetScale = state.isHolding ? 0.68 : 1;

      const scaleStiffness = 34;
      const scaleDamping = state.isHolding ? 11 : 8;
      const scaleAccel = (state.targetScale - state.scale) * scaleStiffness;
      state.scaleVelocity = (state.scaleVelocity + scaleAccel * dt) * Math.exp(-scaleDamping * dt);
      state.scale += state.scaleVelocity * dt;
      state.scale = Math.max(0.64, Math.min(1.16, state.scale));
      state.shotPulse = Math.max(0, state.shotPulse - dt * 4.2);

      const reticleScale = state.scale + state.shotPulse * 0.08;
      const centerRadius = 2.4 + state.press * 0.45;
      const chargeRadius = 8 + state.press * 5;
      const chargeOpacity = state.isHolding ? 0.18 + state.press * 0.42 : Math.max(0, state.press - 0.35) * 0.18;
      const shotProgress = 1 - state.shotPulse;
      const shotRadius = 10 + shotProgress * 16;
      const shotOpacity = state.shotPulse * 0.55;
      const smokeOpacity = state.isVisible && !motionReduced ? 0.1 + state.press * 0.18 + shotOpacity * 0.22 : 0;

      cursorReticleRef.current?.setAttribute('transform', `scale(${reticleScale.toFixed(3)})`);
      cursorCentreRef.current?.setAttribute('r', centerRadius.toFixed(2));
      cursorCentreRef.current?.setAttribute('opacity', (0.9 + state.press * 0.08).toFixed(2));
      cursorChargeRingRef.current?.setAttribute('r', chargeRadius.toFixed(2));
      cursorChargeRingRef.current?.setAttribute('opacity', chargeOpacity.toFixed(2));
      cursorShotRingRef.current?.setAttribute('r', shotRadius.toFixed(2));
      cursorShotRingRef.current?.setAttribute('opacity', shotOpacity.toFixed(2));

      cursorSmokeConfigs.forEach((config, index) => {
        const smoke = cursorSmokeRefs.current[index];
        if (!smoke) return;

        const opacity = smokeOpacity * Math.max(0.15, 1 - index * 0.18);
        const scale = 0.7 + state.press * 0.25 + shotOpacity * 0.35 + index * 0.04;

        smoke.setAttribute('transform', `translate(${(-index * config.driftX).toFixed(2)} ${(-config.driftY - index * 1.3).toFixed(2)}) scale(${scale.toFixed(3)})`);
        smoke.setAttribute('opacity', opacity.toFixed(2));
        smoke.style.filter = `blur(${config.blur.toFixed(2)}px)`;
      });

      if (motionReduced) {
        cursorSmokeConfigs.forEach((_, index) => {
          const smoke = cursorSmokeRefs.current[index];
          if (smoke) {
            smoke.setAttribute('opacity', '0');
          }
        });
        cursorChargeRingRef.current?.setAttribute('opacity', '0');
        cursorShotRingRef.current?.setAttribute('opacity', '0');
      }

      cursorFrameRef.current = window.requestAnimationFrame(renderCursor);
    };

    heroSection.addEventListener('pointerenter', showCursor);
    heroSection.addEventListener('pointerleave', hideCursor);
    heroSection.addEventListener('pointermove', handlePointerMove);
    heroSection.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    cursorFrameRef.current = window.requestAnimationFrame(renderCursor);

    return () => {
      if (cursorFrameRef.current) {
        window.cancelAnimationFrame(cursorFrameRef.current);
        cursorFrameRef.current = null;
      }
      if (eyeFrameRef.current) {
        window.cancelAnimationFrame(eyeFrameRef.current);
        eyeFrameRef.current = null;
      }
      heroSection.removeEventListener('pointerenter', showCursor);
      heroSection.removeEventListener('pointerleave', hideCursor);
      heroSection.removeEventListener('pointermove', handlePointerMove);
      heroSection.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [updateEyeState]);

  const cursorOverlay = (
    <svg className="hero-cursor-overlay" aria-hidden="true">
      <g ref={cursorGroupRef} className="hero-custom-cursor" opacity="0" pointerEvents="none">
        {cursorSmokeConfigs.map((config, index) => (
          <g
            key={`cursor-smoke-${index}`}
            ref={(node) => {
              cursorSmokeRefs.current[index] = node;
            }}
            className="hero-cursor-smoke"
            opacity={0}
          >
            <ellipse
              data-smoke-shape
              className="hero-cursor-smoke-cloud"
              cx="0"
              cy="0"
              rx={config.radiusX}
              ry={config.radiusY}
              fill="rgba(255, 63, 87, 0.34)"
              stroke="rgba(255, 178, 188, 0.18)"
              strokeWidth="0.6"
              vectorEffect="non-scaling-stroke"
            />
            <ellipse
              data-smoke-shape
              className="hero-cursor-smoke-cloud hero-cursor-smoke-cloud--inner"
              cx="0"
              cy="0"
              rx={config.radiusX * 0.55}
              ry={config.radiusY * 0.55}
              fill="rgba(255, 202, 208, 0.22)"
            />
          </g>
        ))}
        <circle ref={cursorShotRingRef} className="hero-cursor-shot-ring" cx="0" cy="0" r="11" fill="none" stroke="rgba(255, 63, 87, 0.72)" strokeWidth="1.4" opacity="0" vectorEffect="non-scaling-stroke" />
        <g ref={cursorReticleRef} className="hero-cursor-reticle">
          <circle ref={cursorChargeRingRef} className="hero-cursor-charge-ring" cx="0" cy="0" r="9.5" fill="rgba(255, 63, 87, 0.08)" stroke="rgba(255, 63, 87, 0.72)" strokeWidth="1.2" opacity="0" vectorEffect="non-scaling-stroke" />
          <line className="hero-cursor-h" x1="-12" y1="0" x2="12" y2="0" stroke="rgba(255, 63, 87, 0.94)" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
          <line className="hero-cursor-v" x1="0" y1="-12" x2="0" y2="12" stroke="rgba(255, 63, 87, 0.94)" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
          <circle ref={cursorCentreRef} className="hero-cursor-center" cx="0" cy="0" r="2.4" fill="rgba(255, 63, 87, 0.98)" />
        </g>
      </g>
    </svg>
  );

  return (
    <>
      <div className="hero-defense" aria-label="FadSec Lab blocks trackers, spyware, and data brokers before they reach users">
      <HeroAdversaryThreeScene onMuzzleProject={handleMuzzleProject} manualShotPulse={manualShotPulse} />
      <svg ref={svgRef} className="hero-defense-svg" viewBox="0 0 900 300" role="img" focusable="false">
        <defs>
          <radialGradient id="hero-guardian-head" cx="34%" cy="26%" r="70%">
            <stop offset="0%" stopColor="rgba(58,64,77,1)" />
            <stop offset="44%" stopColor="rgba(36,41,52,1)" />
            <stop offset="100%" stopColor="rgba(15,18,25,1)" />
          </radialGradient>
          <linearGradient id="hero-guardian-body" x1="744" y1="136" x2="812" y2="238" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(44,49,59,1)" />
            <stop offset="44%" stopColor="rgba(23,28,36,1)" />
            <stop offset="100%" stopColor="rgba(10,12,16,1)" />
          </linearGradient>
          <linearGradient id="hero-shield-face-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(219,68,86,0.98)" />
            <stop offset="35%" stopColor="rgba(168,31,48,0.98)" />
            <stop offset="72%" stopColor="rgba(109,15,31,0.98)" />
            <stop offset="100%" stopColor="rgba(53,8,16,1)" />
          </linearGradient>
          <linearGradient id="hero-shield-side-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(136,22,40,0.98)" />
            <stop offset="100%" stopColor="rgba(54,8,16,1)" />
          </linearGradient>
          <linearGradient id="hero-shield-plate-grad" x1="0" x2="0.95" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(228,81,99,0.96)" />
            <stop offset="38%" stopColor="rgba(174,40,59,0.98)" />
            <stop offset="72%" stopColor="rgba(109,15,31,0.98)" />
            <stop offset="100%" stopColor="rgba(52,8,16,1)" />
          </linearGradient>
          <linearGradient id="hero-shield-boss-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(238, 115, 129, 0.98)" />
            <stop offset="45%" stopColor="rgba(192, 52, 71, 0.98)" />
            <stop offset="100%" stopColor="rgba(93, 18, 31, 1)" />
          </linearGradient>
          <linearGradient id="hero-shield-rivet-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(232, 170, 177, 0.98)" />
            <stop offset="55%" stopColor="rgba(164, 74, 89, 1)" />
            <stop offset="100%" stopColor="rgba(83, 29, 41, 1)" />
          </linearGradient>
          <linearGradient id="hero-shield-highlight-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,242,243,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <radialGradient id="hero-shield-core" cx="42%" cy="35%" r="62%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
            <stop offset="48%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id="hero-floor" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(232,51,74,0.08)" />
            <stop offset="52%" stopColor="rgba(232,51,74,0.16)" />
            <stop offset="100%" stopColor="rgba(232,51,74,0)" />
          </linearGradient>
          <clipPath id="hero-shield-clip">
            <path d={shieldCorePath} />
          </clipPath>
          <clipPath id="hero-eye-clip">
            <path d="M754 43 H772 C772 57 754 57 754 43Z" />
            <path d="M780 43 H798 C798 57 780 57 780 43Z" />
          </clipPath>
          <linearGradient id="hero-border-zone-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#03060e" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#0a0e1e" stopOpacity="0.72" />
          </linearGradient>
          <pattern id="hero-border-hatch" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <line x1="0" y1="12" x2="12" y2="0" stroke="rgba(255, 86, 62, 0.055)" strokeWidth="0.9" />
            <line x1="0" y1="0" x2="12" y2="12" stroke="rgba(255, 140, 112, 0.035)" strokeWidth="0.7" />
          </pattern>
          {/* Chain-link diamond mesh for fence panel fill */}
          <pattern id="hero-fence-mesh-pat" x="0" y="0" width="9" height="9" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="4.5" y2="4.5" stroke="rgba(255, 146, 120, 0.48)" strokeWidth="0.7" />
            <line x1="4.5" y1="4.5" x2="9" y2="0" stroke="rgba(255, 146, 120, 0.48)" strokeWidth="0.7" />
            <line x1="0" y1="4.5" x2="4.5" y2="9" stroke="rgba(210, 92, 74, 0.42)" strokeWidth="0.65" />
            <line x1="4.5" y1="9" x2="9" y2="4.5" stroke="rgba(210, 92, 74, 0.42)" strokeWidth="0.65" />
          </pattern>
          <pattern id="hero-fence-mesh" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 0 L6 6 M6 0 L0 6" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="0.45" />
          </pattern>
          <pattern id="hero-hazard-stripes" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="5" height="10" fill="#7f1d1d" />
            <rect x="5" width="5" height="10" fill="#18181b" />
          </pattern>

          {/* Concrete Quarantine Wall Gradients */}
          <linearGradient id="hero-concrete-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2c2c31" />
            <stop offset="40%" stopColor="#3a3a41" />
            <stop offset="80%" stopColor="#25252a" />
            <stop offset="100%" stopColor="#1c1c1f" />
          </linearGradient>
        </defs>

        <ellipse className="hero-defense-floor" cx="520" cy="254" rx="350" ry="24" />

        <ThreatBorder />

        <g className="hero-guardian" transform={`translate(${guardianOffsetX} 0)`}>
          <ellipse className="hero-guardian-shadow" cx="760" cy="260" rx="118" ry="20" />
          <g className="hero-guardian-recoil">
            <g transform="translate(-10 2)">
              <GuardianLegs
                backUpperLegRef={backUpperLegRef}
                backLowerLegRef={backLowerLegRef}
                frontUpperLegRef={frontUpperLegRef}
                frontLowerLegRef={frontLowerLegRef}
              />
              <g className="hero-guardian-upper">
                <g ref={upperImpactRef}>
                  <path ref={shieldUpperArmRef} className="hero-guardian-arm hero-guardian-arm--shield" d={pathBetween(guardianShieldShoulder, guardianShieldElbowBase)} />
                  <path ref={shieldForearmRef} className="hero-guardian-arm hero-guardian-arm--shield" d={pathBetween(guardianShieldElbowBase, guardianShieldHandBase)} />
                  <g ref={shieldHandRigRef}>
                    <path className="hero-guardian-hand hero-guardian-hand--shield" d="M694 171 C696 168 700 167 703 170 C702 175 698 176 695 174 Z" />
                    <HeldShield impactRef={shieldImpactRef} showImpacts={isMuzzleReady} />
                  </g>
                  <path className="hero-guardian-arm hero-guardian-arm--flag" d="M780 143 L820 142 L872 109" />
                    {/* place flag so its bottom-right aligns with palm center (872,109) */}
                    <image className="hero-held-flag" href={flagImg} x="736" y="8" width="180" height="135" preserveAspectRatio="xMidYMid meet" />
                    <ellipse className="hero-guardian-hand hero-guardian-hand--flag" cx="872" cy="109" rx="10" ry="8" />
                  <path ref={bodyRef} className="hero-guardian-body" d={guardianBodyBase} />
                  <GuardianFace leftEyeRef={leftEyeRef} rightEyeRef={rightEyeRef} />
                </g>
              </g>
            </g>
          </g>
        </g>

        {isMuzzleReady && (
          <>
            {projectedThreats.map((threat) => (
              <ThreatArrow key={threat.id} {...threat} />
            ))}
            {manualThreats.map((threat) => (
              <ThreatArrow key={threat.id} {...threat} repeat={false} />
            ))}
          </>
        )}
      </svg>
      </div>
      {createPortal(cursorOverlay, document.body)}
    </>
  );
}
