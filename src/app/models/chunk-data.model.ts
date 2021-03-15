import * as three from 'three';

export class VoxelData {
  color?: three.Color;
}

export class ChunkData {
  voxels?: VoxelData[];
  position?: three.Vector3;
}
