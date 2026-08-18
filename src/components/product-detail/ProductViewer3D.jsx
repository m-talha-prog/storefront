import { Suspense, useRef, useState, useCallback, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useTexture, Html } from '@react-three/drei'

const ROTATE_STEP = THREE.MathUtils.degToRad(6)
const ZOOM_STEP = 0.3

function RotatingProductBox({ imageUrl }) {
  const texture = useTexture(imageUrl)

  return (
    <mesh>
      <boxGeometry args={[1.6, 1.6, 1.6]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

function LoadingFallback() {
  return (
    <Html center>
      <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        Loading 3D preview…
      </p>
    </Html>
  )
}

function ContextLossHandler({ onLost, onRestored }) {
  const { gl } = useThree()

  useEffect(() => {
    const canvas = gl.domElement

    function handleLost(event) {
      event.preventDefault()
      onLost()
    }

    function handleRestored() {
      onRestored()
    }

    canvas.addEventListener('webglcontextlost', handleLost)
    canvas.addEventListener('webglcontextrestored', handleRestored)

    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost)
      canvas.removeEventListener('webglcontextrestored', handleRestored)
    }
  }, [gl, onLost, onRestored])

  return null
}

export function ProductViewer3D({ imageUrl, productName }) {
  const controlsRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [contextLost, setContextLost] = useState(false)

  const handleKeyDown = useCallback((event) => {
    const controls = controlsRef.current
    if (!controls) return

    const offset = new THREE.Vector3()
      .copy(controls.object.position)
      .sub(controls.target)
    const spherical = new THREE.Spherical().setFromVector3(offset)

    switch (event.key) {
      case 'ArrowLeft':
        spherical.theta -= ROTATE_STEP
        break
      case 'ArrowRight':
        spherical.theta += ROTATE_STEP
        break
      case 'ArrowUp':
        spherical.phi = Math.max(0.15, spherical.phi - ROTATE_STEP)
        break
      case 'ArrowDown':
        spherical.phi = Math.min(Math.PI - 0.15, spherical.phi + ROTATE_STEP)
        break
      case '+':
      case '=':
        spherical.radius = Math.max(controls.minDistance, spherical.radius - ZOOM_STEP)
        break
      case '-':
        spherical.radius = Math.min(controls.maxDistance, spherical.radius + ZOOM_STEP)
        break
      default:
        return
    }

    event.preventDefault()
    const newOffset = new THREE.Vector3().setFromSpherical(spherical)
    controls.object.position.copy(controls.target).add(newOffset)
    controls.update()
  }, [])

  return (
    <div
      tabIndex={0}
      role="application"
      aria-label={`Interactive 3D preview of ${productName}. Use arrow keys to rotate, plus and minus to zoom.`}
      aria-describedby="viewer-3d-description"
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="relative h-96 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <p id="viewer-3d-description" className="sr-only">
        A rotatable 3D preview of {productName}, showing the product image
        wrapped around a 3D model. This is a supplementary visual — the full
        product photos and description are available elsewhere on this page.
      </p>

      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          powerPreference: 'low-power',
          antialias: true,
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} intensity={1.4} />

        <ContextLossHandler
          onLost={() => setContextLost(true)}
          onRestored={() => setContextLost(false)}
        />

        <Suspense fallback={<LoadingFallback />}>
          <RotatingProductBox imageUrl={imageUrl} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          autoRotate={!isFocused}
          autoRotateSpeed={2}
          minDistance={2}
          maxDistance={6}
        />
      </Canvas>

      {contextLost && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/90 dark:bg-gray-900/90">
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center px-4">
            3D view paused to save resources — it will resume automatically.
          </p>
        </div>
      )}
    </div>
  )
}