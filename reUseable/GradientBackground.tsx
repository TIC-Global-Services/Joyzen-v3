"use client"
import React, { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'

/**
 * GradientConfig defines a single gradient blob.
 * - color: hex string e.g. "#b4def7"
 * - position: [x, y] normalized center (0–1 range, 0,0 = bottom-left)
 * - radius: how large the blob spreads (0–1, default ~0.4)
 * - opacity: blob opacity (0–1, default 1)
 * - speed: animation speed multiplier (default 1)
 */
export interface GradientConfig {
    color: string
    position: [number, number]
    radius?: number
    opacity?: number
    speed?: number
}

interface GradientBackgroundProps {
    gradients: GradientConfig[]
    className?: string
    style?: React.CSSProperties
}

// ─── GLSL Shaders ───────────────────────────────────────────────────────────────

const vertex = /* glsl */ `
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
    }
`

/**
 * Fragment shader that renders up to 6 animated gradient blobs.
 * Each blob drifts in a unique Lissajous-like orbit driven by uTime.
 */
const fragment = /* glsl */ `
    precision highp float;

    varying vec2 vUv;
    uniform float uTime;
    uniform float uAspect;

    // Each blob: vec4(r, g, b, opacity)
    uniform vec4 uColors[6];
    // Each blob: vec4(cx, cy, radius, speed)
    uniform vec4 uBlobs[6];
    uniform int uCount;

    void main() {
        // Correct for aspect ratio so blobs are circular
        vec2 st = vUv;
        st.x *= uAspect;

        vec3 color = vec3(0.0);
        float totalAlpha = 0.0;

        for (int i = 0; i < 6; i++) {
            if (i >= uCount) break;

            vec4 blob = uBlobs[i];
            float speed = blob.w;

            // Animate position with unique offsets per blob
            float fi = float(i);
            vec2 center = blob.xy;
            center.x *= uAspect;

            // Lissajous-like drift
            center.x += sin(uTime * speed * 0.3 + fi * 1.7) * 0.08;
            center.y += cos(uTime * speed * 0.25 + fi * 2.3) * 0.06;

            // Also pulse the radius slightly
            float radius = blob.z + sin(uTime * speed * 0.4 + fi * 3.1) * 0.02;

            float dist = distance(st, center);
            // Soft falloff
            float strength = 1.0 - smoothstep(0.0, radius, dist);
            strength = strength * strength; // softer edges

            float opacity = uColors[i].a;
            color += uColors[i].rgb * strength * opacity;
            totalAlpha += strength * opacity;
        }

        totalAlpha = clamp(totalAlpha, 0.0, 1.0);
        gl_FragColor = vec4(color, totalAlpha);
    }
`

// ─── Helpers ────────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '')
    return [
        parseInt(h.substring(0, 2), 16) / 255,
        parseInt(h.substring(2, 4), 16) / 255,
        parseInt(h.substring(4, 6), 16) / 255,
    ]
}

// ─── Component ──────────────────────────────────────────────────────────────────

const GradientBackground: React.FC<GradientBackgroundProps> = ({
    gradients,
    className = '',
    style = {},
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const rendererRef = useRef<InstanceType<typeof Renderer> | null>(null)
    const rafRef = useRef<number>(0)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        // Clamp to max 6 blobs
        const blobs = gradients.slice(0, 6)

        // ── Create Renderer ──
        const renderer = new Renderer({
            alpha: true,
            premultipliedAlpha: false,
            antialias: true,
        })
        rendererRef.current = renderer
        const gl = renderer.gl
        gl.clearColor(0, 0, 0, 0)
        gl.canvas.style.width = '100%'
        gl.canvas.style.height = '100%'
        gl.canvas.style.position = 'absolute'
        gl.canvas.style.inset = '0'
        canvasRef.current = gl.canvas as HTMLCanvasElement
        container.appendChild(gl.canvas as HTMLCanvasElement)

        // ── Build uniform arrays ──
        const uColors: number[] = []
        const uBlobs: number[] = []

        for (let i = 0; i < 6; i++) {
            if (i < blobs.length) {
                const b = blobs[i]
                const [r, g, bVal] = hexToRgb(b.color)
                uColors.push(r, g, bVal, b.opacity ?? 1.0)
                uBlobs.push(
                    b.position[0],
                    b.position[1],
                    b.radius ?? 0.4,
                    b.speed ?? 1.0,
                )
            } else {
                uColors.push(0, 0, 0, 0)
                uBlobs.push(0, 0, 0, 0)
            }
        }

        // ── Geometry & Program ──
        const geometry = new Triangle(gl)
        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uAspect: { value: 1 },
                uCount: { value: blobs.length },
                uColors: { value: uColors },
                uBlobs: { value: uBlobs },
            },
            transparent: true,
            depthTest: false,
        })
        const mesh = new Mesh(gl, { geometry, program })

        // ── Resize Handler ──
        const onResize = () => {
            const w = container.clientWidth
            const h = container.clientHeight
            renderer.setSize(w, h)
            program.uniforms.uAspect.value = w / h
        }
        onResize()

        const resizeObserver = new ResizeObserver(onResize)
        resizeObserver.observe(container)

        // ── Animation Loop ──
        let startTime = performance.now()
        const update = () => {
            const elapsed = (performance.now() - startTime) / 1000
            program.uniforms.uTime.value = elapsed
            renderer.render({ scene: mesh })
            rafRef.current = requestAnimationFrame(update)
        }
        rafRef.current = requestAnimationFrame(update)

        // ── Cleanup ──
        return () => {
            cancelAnimationFrame(rafRef.current)
            resizeObserver.disconnect()
            if (canvasRef.current && container.contains(canvasRef.current)) {
                container.removeChild(canvasRef.current)
            }
            rendererRef.current = null
        }
    }, [gradients])

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 -z-10 overflow-hidden pointer-events-none ${className}`}
            style={{ transform: 'translateZ(0)', ...style }}
        />
    )
}

export default GradientBackground
