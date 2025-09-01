import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import styled from "styled-components";
import { makeRippleSphere } from "../Utils/makeRippleSphere.js";

const VisualizerCanvas = ({ settings }) => {
  const canvasRef = useRef(null);

  // three / audio
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const rafRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());

  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const freqBufRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [analyserReady, setAnalyserReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // init once parent has size
  useEffect(() => {
    const canvas = canvasRef.current;
    const audio = settings.audioRef?.current;
    if (!canvas || !audio) return;

    const waitUntilReady = () => {
      const parent = canvas.parentElement;
      if (!parent || parent.clientWidth === 0 || parent.clientHeight === 0) {
        requestAnimationFrame(waitUntilReady);
        return;
      }

      const width = parent.clientWidth;
      const height = parent.clientHeight;
      setDimensions({ width, height });

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      rendererRef.current = renderer;

      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.set(0, 0, 25);
      cameraRef.current = camera;

      // Light (optional)
      scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 0.6));

      setReady(true);

      // Audio init on first user gesture
      const initializeAudio = () => {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
        }
        const audioCtx = audioCtxRef.current;
        audioCtx
          .resume()
          .catch((err) => console.warn("Could not resume audio context:", err));

        if (!analyserRef.current) {
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 1024;
          const src = audioCtx.createMediaElementSource(audio);
          src.connect(analyser);
          analyser.connect(audioCtx.destination);
          analyserRef.current = analyser;
          freqBufRef.current = new Uint8Array(analyser.frequencyBinCount);
          setAnalyserReady(true);
        }

        window.removeEventListener("click", initializeAudio);
      };

      window.addEventListener("click", initializeAudio, { once: true });

      // Resize
      const handleResize = () => {
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        setDimensions({ width: w, height: h });
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", handleResize);
      handleResize();

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("click", initializeAudio);
        cancelAnimationFrame(rafRef.current);

        if (meshRef.current) {
          disposeObject(meshRef.current);
          scene.remove(meshRef.current);
          meshRef.current = null;
        }
        renderer.dispose();

        if (audioCtxRef.current) {
          audioCtxRef.current.close().catch(() => {});
          audioCtxRef.current = null;
        }
        analyserRef.current = null;
        freqBufRef.current = null;

        scene.clear();
        rendererRef.current = null;
        sceneRef.current = null;
        cameraRef.current = null;

        setReady(false);
      };
    };

    waitUntilReady();
  }, [settings.audioRef]);

  // create/update mesh
  useEffect(() => {
    if (!ready) return;
    const scene = sceneRef.current;
    if (!scene) return;

    if (meshRef.current) {
      disposeObject(meshRef.current);
      scene.remove(meshRef.current);
      meshRef.current = null;
    }

    const radius = settings.radius ?? 7;
    const segW = settings.segW ?? 150;
    const segH = settings.segH ?? 60;
    const color = settings.color ?? 0x50afa3;

    const sphere = makeRippleSphere(radius, segW, segH, color);
    sphere.position.set(0, 0, 0);
    scene.add(sphere);
    meshRef.current = sphere;
  }, [
    ready,
    dimensions.width,
    dimensions.height,
    settings.radius,
    settings.segW,
    settings.segH,
    settings.color,
  ]);

  // ---- YOUR ANIMATION LOOP (adapted) ----
  useEffect(() => {
    if (!ready) return;

    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const sphere = meshRef.current;
    const analyser = analyserRef.current;
    const frequency = freqBufRef.current;
    const clock = clockRef.current;

    if (!renderer || !scene || !camera || !sphere) return;

    // external helpers (optional): pass via settings if you have them
    const water = settings.water ?? null;
    const camHelper = settings.camHelper ?? { update: () => {} };
    const lightHelper = settings.lightHelper ?? { update: () => {} };
    const controls = settings.controls ?? { update: () => {} };

    let sphereLevel = 0;
    const mat = sphere.material;

    // ensure uniforms exist (your ShaderMaterial does)
    if (!mat.uniforms) mat.uniforms = {};

    const tick = () => {
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();

      // pull frequency data if analyser ready
      if (analyserReady && analyser && frequency) {
        analyser.getByteFrequencyData(frequency);

        const n = frequency.length;

        // --- bass ---
        let bassSum = 0;
        const bassEnd = Math.max(1, Math.floor(n * 0.12)); // lowest ~12%
        for (let i = 0; i < bassEnd; i++) bassSum += frequency[i];
        const bass = bassSum / bassEnd; // 0..255

        const k = 0.5; // responsiveness
        sphereLevel += (bass - sphereLevel) * k;

        const s = 1.0 + (sphereLevel / 255) * 0.7; // 1.0..1.7
        sphere.scale.set(s, s, s);

        // --- mids ---
        const midsEnd = Math.max(bassEnd + 1, Math.floor(n * 0.5));
        let midsSum = 0;
        for (let i = bassEnd; i < midsEnd; i++) midsSum += frequency[i];
        const mids = midsSum / Math.max(1, midsEnd - bassEnd);

        sphere.userData.mS ??= 0;
        sphere.userData.mS += (mids - sphere.userData.mS) * 0.2;

        // map 0..255 -> world amp units
        const amp = (sphere.userData.mS / 255) * 5;

        // shader uniforms
        if (mat.uniforms.uTime) mat.uniforms.uTime.value += dt;
        if (mat.uniforms.uAmp) mat.uniforms.uAmp.value = amp;
      } else {
        // even without analyser, keep time moving
        if (mat.uniforms?.uTime) mat.uniforms.uTime.value += dt;
      }

      // vertical bob
      // sphere.position.y = 5 + Math.sin(t);

      // optional externals
      water?.tick?.(t);
      camHelper?.update?.();
      lightHelper?.update?.();
      controls?.update?.();

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [
    ready,
    analyserReady,
    settings.water,
    settings.camHelper,
    settings.lightHelper,
    settings.controls,
  ]);
  // --------------------------------------

  return <StyledCanvas ref={canvasRef} />;
};

function disposeObject(obj) {
  if (obj.geometry) obj.geometry.dispose();
  if (obj.material) {
    if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose?.());
    else obj.material.dispose?.();
  }
}

const StyledCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

export default VisualizerCanvas;
