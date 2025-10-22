import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

interface Aircraft3DViewerProps {
  selectedPartId: number | null;
  onPartClick: (partId: number) => void;
}

interface AircraftPartMeshProps {
  partId: number;
  position: [number, number, number];
  geometry: THREE.BufferGeometry;
  isSelected: boolean;
  onClick: (partId: number) => void;
}

const AircraftPartMesh = ({ partId, position, geometry, isSelected, onClick }: AircraftPartMeshProps) => {
  return (
    <mesh
      position={position}
      geometry={geometry}
      onClick={(e) => {
        e.stopPropagation();
        onClick(partId);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <meshStandardMaterial
        color={isSelected ? "#3b82f6" : "#8b9cb6"}
        emissive={isSelected ? "#3b82f6" : "#000000"}
        emissiveIntensity={isSelected ? 0.5 : 0}
      />
    </mesh>
  );
};

const AircraftModel = ({ selectedPartId, onPartClick }: Aircraft3DViewerProps) => {
  // Memoize geometries to prevent recreation on every render
  const geometries = useMemo(() => {
    // Kadłub (Fuselage) - id: 8
    const fuselageGeometry = new THREE.CylinderGeometry(0.3, 0.3, 4, 32);
    fuselageGeometry.rotateZ(Math.PI / 2);

    // Kołpak śmigła (Spinner) - id: 2
    const spinnerGeometry = new THREE.ConeGeometry(0.2, 0.4, 32);
    spinnerGeometry.rotateZ(-Math.PI / 2);

    // Osłona silnika (Engine Cowling) - id: 3
    const cowlingGeometry = new THREE.CylinderGeometry(0.35, 0.3, 0.8, 32);
    cowlingGeometry.rotateZ(Math.PI / 2);

    return {
      fuselage: fuselageGeometry,
      wing: new THREE.BoxGeometry(6, 0.1, 1),
      hStabilizer: new THREE.BoxGeometry(2, 0.08, 0.6),
      vStabilizer: new THREE.BoxGeometry(0.08, 0.8, 0.6),
      propeller: new THREE.BoxGeometry(0.1, 2, 0.1),
      spinner: spinnerGeometry,
      cowling: cowlingGeometry,
      aileron: new THREE.BoxGeometry(1.2, 0.12, 0.3),
      flap: new THREE.BoxGeometry(1, 0.12, 0.25),
      elevator: new THREE.BoxGeometry(1.8, 0.1, 0.25),
      rudder: new THREE.BoxGeometry(0.1, 0.6, 0.25),
      noseWheel: new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16),
      mainWheel: new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16),
      strut: new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8),
    };
  }, []);

  return (
    <group>
      {/* Kadłub */}
      <AircraftPartMesh
        partId={8}
        position={[0, 0, 0]}
        geometry={geometries.fuselage}
        isSelected={selectedPartId === 8}
        onClick={onPartClick}
      />

      {/* Osłona silnika */}
      <AircraftPartMesh
        partId={3}
        position={[2.2, 0, 0]}
        geometry={geometries.cowling}
        isSelected={selectedPartId === 3}
        onClick={onPartClick}
      />

      {/* Kołpak śmigła */}
      <AircraftPartMesh
        partId={2}
        position={[2.8, 0, 0]}
        geometry={geometries.spinner}
        isSelected={selectedPartId === 2}
        onClick={onPartClick}
      />

      {/* Śmigło */}
      <AircraftPartMesh
        partId={1}
        position={[3, 0, 0]}
        geometry={geometries.propeller}
        isSelected={selectedPartId === 1}
        onClick={onPartClick}
      />

      {/* Skrzydła */}
      <AircraftPartMesh
        partId={5}
        position={[0, 0, 0]}
        geometry={geometries.wing}
        isSelected={selectedPartId === 5}
        onClick={onPartClick}
      />

      {/* Lotka lewa */}
      <AircraftPartMesh
        partId={6}
        position={[-2.5, 0, 0]}
        geometry={geometries.aileron}
        isSelected={selectedPartId === 6}
        onClick={onPartClick}
      />

      {/* Klapa lewa */}
      <AircraftPartMesh
        partId={7}
        position={[-1, 0, 0.1]}
        geometry={geometries.flap}
        isSelected={selectedPartId === 7}
        onClick={onPartClick}
      />

      {/* Wspornik lewy */}
      <AircraftPartMesh
        partId={16}
        position={[-1.5, -0.6, 0]}
        geometry={geometries.strut}
        isSelected={selectedPartId === 16}
        onClick={onPartClick}
      />

      {/* Statecznik poziomy */}
      <AircraftPartMesh
        partId={9}
        position={[-2, 0, 0]}
        geometry={geometries.hStabilizer}
        isSelected={selectedPartId === 9}
        onClick={onPartClick}
      />

      {/* Ster wysokości */}
      <AircraftPartMesh
        partId={10}
        position={[-2.5, 0, 0]}
        geometry={geometries.elevator}
        isSelected={selectedPartId === 10}
        onClick={onPartClick}
      />

      {/* Statecznik pionowy */}
      <AircraftPartMesh
        partId={11}
        position={[-2, 0.4, 0]}
        geometry={geometries.vStabilizer}
        isSelected={selectedPartId === 11}
        onClick={onPartClick}
      />

      {/* Ster kierunku */}
      <AircraftPartMesh
        partId={12}
        position={[-2.4, 0.4, 0]}
        geometry={geometries.rudder}
        isSelected={selectedPartId === 12}
        onClick={onPartClick}
      />

      {/* Podwozie przednie */}
      <AircraftPartMesh
        partId={14}
        position={[1.5, -0.8, 0]}
        geometry={geometries.noseWheel}
        isSelected={selectedPartId === 14}
        onClick={onPartClick}
      />

      {/* Podwozie główne lewe */}
      <AircraftPartMesh
        partId={15}
        position={[-0.5, -0.8, -0.8]}
        geometry={geometries.mainWheel}
        isSelected={selectedPartId === 15}
        onClick={onPartClick}
      />

      {/* Podwozie główne prawe */}
      <mesh
        position={[-0.5, -0.8, 0.8]}
        geometry={geometries.mainWheel}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick(15);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <meshStandardMaterial
          color={selectedPartId === 15 ? "#3b82f6" : "#8b9cb6"}
          emissive={selectedPartId === 15 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 15 ? 0.5 : 0}
        />
      </mesh>
    </group>
  );
};

export default function Aircraft3DViewer({ selectedPartId, onPartClick }: Aircraft3DViewerProps) {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[8, 3, 8]} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <Suspense fallback={null}>
        <AircraftModel selectedPartId={selectedPartId} onPartClick={onPartClick} />
      </Suspense>
      <gridHelper args={[20, 20]} />
    </Canvas>
  );
}
