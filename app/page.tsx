"use client"

import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useRef, useState, useEffect } from "react"
import * as THREE from "three"

const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

interface BoxWithEdgesProps {
  position: [number, number, number] | THREE.Vector3;
}

const BoxWithEdges = ({ position }: BoxWithEdgesProps) => {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshPhysicalMaterial 
          color="#0070f3"
          roughness={0.1}
          metalness={0.8}
          transparent={true}
          opacity={0.9}
          transmission={0.5}
          clearcoat={1}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, 0.5)]} />
        <lineBasicMaterial color="#214dbd" linewidth={2} />
      </lineSegments>
    </group>
  )
}

interface BoxLetterProps {
  letter: string;
  position: [number, number, number] | THREE.Vector3;
}

const BoxLetter = ({ letter, position }: BoxLetterProps) => {
  const group = useRef<THREE.Group>(null);

  const getLetterShape = (letter: string): number[][] => {
    // Default letter shape (fallback)
    if (!letter || typeof letter !== 'string') {
      return [
        [1,1,1],
        [1,0,1],
        [1,1,1]
      ];
    }

    const shapes: { [key: string]: number[][] } = {
      N: [
        [1,0,0,0,1],
        [1,1,0,0,1],
        [1,0,1,0,1],
        [1,0,0,1,1],
        [1,0,0,0,1],
      ],
      E: [
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [1,0,0],
        [1,1,1],
      ],
      X: [
        [1,0,0,0,1],
        [0,1,0,1,0],
        [0,0,1,0,0],
        [0,1,0,1,0],
        [1,0,0,0,1],
      ],
      T: [
        [1,1,1],
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [0,1,0],
      ],
    }
    return shapes[letter] || shapes['N']; // Default to 'N' if letter is not found
  }

  const letterShape = getLetterShape(letter);

  return (
    <group ref={group} position={position}>
      {letterShape.map((row, i) =>
        row.map((cell, j) => {
          if (cell) {
            let xOffset = j * 0.5 - (letter === 'T' ? 1 : letter === 'E' ? 0.5 : letter === 'X' || letter === 'N' ? 1 : 0.75);
            
            if (letter === 'N') {
              if (j === 0) {
                xOffset = -0.5;
              } else if (j === 1) {
                xOffset = 0;
              } else if (j === 2) {
                xOffset = 0.25;
              } else if (j === 3) {
                xOffset = 0.5;
              } else if (j === 4) {
                xOffset = 1;
              }
            }
            
            if (letter === 'X') {
              if (j === 0) {
                xOffset = -1;
              } else if (j === 1) {
                xOffset = -0.75;
              } else if (j === 2) {
                xOffset = -0.25;
              } else if (j === 3) {
                xOffset = 0.25;
              } else if (j === 4) {
                xOffset = 0.5;
              }
            }
            
            return (
              <BoxWithEdges 
                key={`${i}-${j}`} 
                position={[xOffset, (4 - i) * 0.5 - 1, 0]}
              />
            );
          }
          return null;
        })
      )}
    </group>
  );
}

const Scene = () => {
  const { size } = useThree();
  const [letters, setLetters] = useState<string[]>(['N', 'E', 'X', 'T']);
  const orbitControlsRef = useRef<any>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(isMobile());
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <group position={[-0.5, 0, 0]} rotation={[0, Math.PI / 1.5, 0]}>
        {letters.map((letter, index) => (
          <BoxLetter key={index} letter={letter} position={[-3.75 + index * 2.5, 0, 0]} />
        ))}
      </group>
      <OrbitControls 
        ref={orbitControlsRef}
        enableZoom
        enablePan
        enableRotate
        autoRotate
        autoRotateSpeed={2}
        rotation={[Math.PI, 0, 0]}
      />
      
      <ambientLight intensity={0.5} />
      
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
      
      <Environment 
        files={isMobileDevice 
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download3-7FArHVIJTFszlXm2045mQDPzsZqAyo.jpg"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dither_it_M3_Drone_Shot_equirectangular-jpg_San_Francisco_Big_City_1287677938_12251179%20(1)-NY2qcmpjkyG6rDp1cPGIdX0bHk3hMR.jpg"
        }
        background
      />
    </>
  )
}

export default function Component() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas camera={{ position: [10.047021, -0.127436, -11.137374], fov: 50 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
