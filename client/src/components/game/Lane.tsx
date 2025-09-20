import Ghost from "./Ghost";
import { GhostData } from "../../lib/stores/useGhostGame";

interface LaneProps {
  laneIndex: number;
  ghosts: GhostData[];
}

export default function Lane({ laneIndex, ghosts }: LaneProps) {
  return (
    <div style={{
      flex: 1,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 10px'
    }}>
      {/* Lane label */}
      <div style={{
        position: 'absolute',
        bottom: '70px',
        fontSize: '16px',
        color: '#ffffff',
        fontWeight: 'bold'
      }}>
        {laneIndex === 0 ? '←' : laneIndex === 1 ? '↓' : '→'}
      </div>

      {/* Render ghosts in this lane */}
      <div style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        gap: '15px',
        paddingTop: '20px'
      }}>
        {ghosts.map((ghost, index) => (
          <Ghost
            key={ghost.id}
            ghost={ghost}
            isClosest={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
