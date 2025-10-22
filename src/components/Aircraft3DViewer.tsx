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
        color={isSelected ? "#3b82f6" : "#e8e8e8"}
        emissive={isSelected ? "#3b82f6" : "#000000"}
        emissiveIntensity={isSelected ? 0.5 : 0}
        metalness={0.3}
        roughness={0.6}
      />
    </mesh>
  );
};

const AircraftModel = ({ selectedPartId, onPartClick }: Aircraft3DViewerProps) => {
  const geometries = useMemo(() => {
    // Kadłub główny (Fuselage) - bardziej realistyczny kształt
    const fuselageGeometry = new THREE.CylinderGeometry(0.35, 0.28, 5, 32);
    fuselageGeometry.rotateZ(Math.PI / 2);
    
    // Dziób (Nose)
    const noseGeometry = new THREE.SphereGeometry(0.35, 32, 32, 0, Math.PI);
    noseGeometry.rotateY(-Math.PI / 2);
    
    // Ogon (Tail cone)
    const tailGeometry = new THREE.ConeGeometry(0.28, 0.8, 32);
    tailGeometry.rotateZ(-Math.PI / 2);

    // Kabina (Cockpit) - przezroczysta część
    const cockpitGeometry = new THREE.SphereGeometry(0.38, 32, 32, 0, Math.PI * 0.8, 0, Math.PI * 0.5);
    cockpitGeometry.rotateY(-Math.PI / 2);
    cockpitGeometry.rotateZ(-Math.PI * 0.15);

    // Skrzydła (Wings) - z profilem lotniczym
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(3, 0);
    wingShape.quadraticCurveTo(3.2, 0.05, 3, 0.1);
    wingShape.lineTo(0, 0.1);
    wingShape.quadraticCurveTo(-0.1, 0.05, 0, 0);
    
    const extrudeSettings = { depth: 1.5, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 };
    const wingGeometry = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
    wingGeometry.rotateX(Math.PI / 2);
    wingGeometry.rotateY(Math.PI / 2);

    // Osłona silnika (Engine Cowling)
    const cowlingGeometry = new THREE.CylinderGeometry(0.4, 0.35, 1, 32);
    cowlingGeometry.rotateZ(Math.PI / 2);

    // Kołpak śmigła (Spinner)
    const spinnerGeometry = new THREE.ConeGeometry(0.25, 0.5, 32);
    spinnerGeometry.rotateZ(-Math.PI / 2);

    // Śmigło (Propeller) - 2 łopaty
    const propellerGeometry = new THREE.BoxGeometry(0.12, 2.5, 0.08);

    // Statecznik poziomy (Horizontal Stabilizer)
    const hStabilizerGeometry = new THREE.BoxGeometry(2.5, 0.08, 1);

    // Statecznik pionowy (Vertical Stabilizer)
    const vStabilizerGeometry = new THREE.BoxGeometry(0.08, 1.2, 0.9);

    // Lotki (Ailerons)
    const aileronGeometry = new THREE.BoxGeometry(1.5, 0.12, 0.35);

    // Klapy (Flaps)
    const flapGeometry = new THREE.BoxGeometry(1.2, 0.12, 0.3);

    // Ster wysokości (Elevator)
    const elevatorGeometry = new THREE.BoxGeometry(2.2, 0.1, 0.3);

    // Ster kierunku (Rudder)
    const rudderGeometry = new THREE.BoxGeometry(0.1, 0.9, 0.35);

    // Koła (Wheels)
    const noseWheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.12, 24);
    const mainWheelGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 24);

    // Wsporniki (Struts)
    const strutGeometry = new THREE.CylinderGeometry(0.04, 0.04, 1.5, 12);

    // Podwozie (Landing gear struts)
    const gearStrutGeometry = new THREE.CylinderGeometry(0.06, 0.04, 0.8, 12);

    return {
      fuselage: fuselageGeometry,
      nose: noseGeometry,
      tail: tailGeometry,
      cockpit: cockpitGeometry,
      wing: wingGeometry,
      cowling: cowlingGeometry,
      spinner: spinnerGeometry,
      propeller: propellerGeometry,
      hStabilizer: hStabilizerGeometry,
      vStabilizer: vStabilizerGeometry,
      aileron: aileronGeometry,
      flap: flapGeometry,
      elevator: elevatorGeometry,
      rudder: rudderGeometry,
      noseWheel: noseWheelGeometry,
      mainWheel: mainWheelGeometry,
      strut: strutGeometry,
      gearStrut: gearStrutGeometry,
    };
  }, []);

  return (
    <group>
      {/* Kadłub główny */}
      <AircraftPartMesh
        partId={8}
        position={[0, 0, 0]}
        geometry={geometries.fuselage}
        isSelected={selectedPartId === 8}
        onClick={onPartClick}
      />

      {/* Dziób samolotu (część kadłuba) */}
      <mesh
        position={[2.5, 0, 0]}
        geometry={geometries.nose}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick(8);
        }}
      >
        <meshStandardMaterial
          color={selectedPartId === 8 ? "#3b82f6" : "#e8e8e8"}
          emissive={selectedPartId === 8 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 8 ? 0.5 : 0}
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>

      {/* Ogon samolotu (część kadłuba) */}
      <mesh
        position={[-2.9, 0, 0]}
        geometry={geometries.tail}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick(8);
        }}
      >
        <meshStandardMaterial
          color={selectedPartId === 8 ? "#3b82f6" : "#e8e8e8"}
          emissive={selectedPartId === 8 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 8 ? 0.5 : 0}
        />
      </mesh>

      {/* Przednia szyba (Cockpit) */}
      <mesh
        position={[1.5, 0.15, 0]}
        geometry={geometries.cockpit}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick(4);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <meshPhysicalMaterial
          color={selectedPartId === 4 ? "#3b82f6" : "#87ceeb"}
          transparent
          opacity={0.3}
          metalness={0.1}
          roughness={0.1}
          emissive={selectedPartId === 4 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 4 ? 0.3 : 0}
        />
      </mesh>

      {/* Osłona silnika */}
      <AircraftPartMesh
        partId={3}
        position={[2.8, 0, 0]}
        geometry={geometries.cowling}
        isSelected={selectedPartId === 3}
        onClick={onPartClick}
      />

      {/* Kołpak śmigła */}
      <mesh
        position={[3.5, 0, 0]}
        geometry={geometries.spinner}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick(2);
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
          color={selectedPartId === 2 ? "#3b82f6" : "#2c3e50"}
          emissive={selectedPartId === 2 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 2 ? 0.5 : 0}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Śmigło - łopata 1 */}
      <AircraftPartMesh
        partId={1}
        position={[3.8, 0, 0]}
        geometry={geometries.propeller}
        isSelected={selectedPartId === 1}
        onClick={onPartClick}
      />

      {/* Śmigło - łopata 2 (obrócona o 90°) */}
      <mesh
        position={[3.8, 0, 0]}
        geometry={geometries.propeller}
        rotation={[0, 0, Math.PI / 2]}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick(1);
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
          color={selectedPartId === 1 ? "#3b82f6" : "#34495e"}
          emissive={selectedPartId === 1 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 1 ? 0.5 : 0}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Skrzydło lewe */}
      <mesh
        position={[0.3, 0.1, -3]}
        geometry={geometries.wing}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick(5);
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
          color={selectedPartId === 5 ? "#3b82f6" : "#e74c3c"}
          emissive={selectedPartId === 5 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 5 ? 0.5 : 0}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>

      {/* Skrzydło prawe */}
      <mesh
        position={[0.3, 0.1, 3]}
        geometry={geometries.wing}
        rotation={[0, 0, Math.PI]}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick(5);
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
          color={selectedPartId === 5 ? "#3b82f6" : "#e74c3c"}
          emissive={selectedPartId === 5 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 5 ? 0.5 : 0}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>

      {/* Lotka lewa */}
      <AircraftPartMesh
        partId={6}
        position={[-1.2, 0.1, -4.2]}
        geometry={geometries.aileron}
        isSelected={selectedPartId === 6}
        onClick={onPartClick}
      />

      {/* Lotka prawa */}
      <mesh
        position={[-1.2, 0.1, 4.2]}
        geometry={geometries.aileron}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick(6);
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
          color={selectedPartId === 6 ? "#3b82f6" : "#8b9cb6"}
          emissive={selectedPartId === 6 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 6 ? 0.5 : 0}
        />
      </mesh>

      {/* Klapa lewa */}
      <AircraftPartMesh
        partId={7}
        position={[0.5, 0, -2.2]}
        geometry={geometries.flap}
        isSelected={selectedPartId === 7}
        onClick={onPartClick}
      />

      {/* Klapa prawa */}
      <mesh
        position={[0.5, 0, 2.2]}
        geometry={geometries.flap}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick(7);
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
          color={selectedPartId === 7 ? "#3b82f6" : "#8b9cb6"}
          emissive={selectedPartId === 7 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 7 ? 0.5 : 0}
        />
      </mesh>

      {/* Wspornik lewy */}
      <AircraftPartMesh
        partId={16}
        position={[-0.8, -0.55, -2]}
        geometry={geometries.strut}
        isSelected={selectedPartId === 16}
        onClick={onPartClick}
      />

      {/* Wspornik prawy */}
      <mesh
        position={[-0.8, -0.55, 2]}
        geometry={geometries.strut}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick(16);
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
          color={selectedPartId === 16 ? "#3b82f6" : "#7f8c8d"}
          emissive={selectedPartId === 16 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 16 ? 0.5 : 0}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Statecznik poziomy */}
      <AircraftPartMesh
        partId={9}
        position={[-3.2, 0.1, 0]}
        geometry={geometries.hStabilizer}
        isSelected={selectedPartId === 9}
        onClick={onPartClick}
      />

      {/* Ster wysokości */}
      <AircraftPartMesh
        partId={10}
        position={[-4, 0.08, 0]}
        geometry={geometries.elevator}
        isSelected={selectedPartId === 10}
        onClick={onPartClick}
      />

      {/* Statecznik pionowy */}
      <AircraftPartMesh
        partId={11}
        position={[-3.2, 0.7, 0]}
        geometry={geometries.vStabilizer}
        isSelected={selectedPartId === 11}
        onClick={onPartClick}
      />

      {/* Ster kierunku */}
      <AircraftPartMesh
        partId={12}
        position={[-3.9, 0.7, 0]}
        geometry={geometries.rudder}
        isSelected={selectedPartId === 12}
        onClick={onPartClick}
      />

      {/* Podwozie przednie - strut */}
      <mesh
        position={[2, -0.5, 0]}
        geometry={geometries.gearStrut}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick(14);
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
          color={selectedPartId === 14 ? "#3b82f6" : "#7f8c8d"}
          emissive={selectedPartId === 14 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 14 ? 0.5 : 0}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Podwozie przednie - koło */}
      <mesh
        position={[2, -0.95, 0]}
        geometry={geometries.noseWheel}
        rotation={[0, 0, Math.PI / 2]}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick(14);
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
          color={selectedPartId === 14 ? "#3b82f6" : "#2c3e50"}
          emissive={selectedPartId === 14 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 14 ? 0.5 : 0}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Podwozie główne lewe - strut */}
      <mesh
        position={[-0.2, -0.5, -1.2]}
        geometry={geometries.gearStrut}
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
          color={selectedPartId === 15 ? "#3b82f6" : "#7f8c8d"}
          emissive={selectedPartId === 15 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 15 ? 0.5 : 0}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Podwozie główne lewe - koło */}
      <mesh
        position={[-0.2, -1, -1.2]}
        geometry={geometries.mainWheel}
        rotation={[0, 0, Math.PI / 2]}
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
          color={selectedPartId === 15 ? "#3b82f6" : "#2c3e50"}
          emissive={selectedPartId === 15 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 15 ? 0.5 : 0}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Podwozie główne prawe - strut */}
      <mesh
        position={[-0.2, -0.5, 1.2]}
        geometry={geometries.gearStrut}
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
          color={selectedPartId === 15 ? "#3b82f6" : "#7f8c8d"}
          emissive={selectedPartId === 15 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 15 ? 0.5 : 0}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Podwozie główne prawe - koło */}
      <mesh
        position={[-0.2, -1, 1.2]}
        geometry={geometries.mainWheel}
        rotation={[0, 0, Math.PI / 2]}
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
          color={selectedPartId === 15 ? "#3b82f6" : "#2c3e50"}
          emissive={selectedPartId === 15 ? "#3b82f6" : "#000000"}
          emissiveIntensity={selectedPartId === 15 ? 0.5 : 0}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
};

export default function Aircraft3DViewer({ selectedPartId, onPartClick }: Aircraft3DViewerProps) {
  return (
    <Canvas shadows camera={{ position: [10, 5, 10], fov: 50 }}>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={25}
        target={[0, 0, 0]}
      />
      
      {/* Oświetlenie */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-10, 5, -5]} intensity={0.5} />
      <hemisphereLight args={["#87ceeb", "#f0e68c", 0.4]} />
      
      <Suspense fallback={null}>
        <AircraftModel selectedPartId={selectedPartId} onPartClick={onPartClick} />
      </Suspense>
      
      {/* Pomocnicza siatka */}
      <gridHelper args={[30, 30, "#cccccc", "#e0e0e0"]} position={[0, -1.2, 0]} />
    </Canvas>
  );
}
