
export interface IVoxelData {
  exists: boolean;
  color?: {
    r: number;
    g: number;
    b: number;
  };
}

export interface IChunkData {
  passesCompleted: number;
  voxelsPopulated: boolean;
  voxelData: IVoxelData[];
  position: {
    x: number;
    y: number;
    z: number;
  };
  meshNeedsUpdate: boolean;

  extraData: any;

  // mesh data
  meshVertPositions: Float32Array;
  meshVertColors: Float32Array;
  meshVertNormals: Float32Array;
  meshVertIndices: Uint32Array;
}

export interface IWorldData {
  adjacentChunks: IChunkData[];
}

