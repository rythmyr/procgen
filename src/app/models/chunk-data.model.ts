import * as Three from 'three';

export interface IVoxelData {
  color?: Three.Color;
}

export interface IChunkData {
  voxelsPopulated: boolean;
  voxelData: IVoxelData[];
  position: Three.Vector3;
  meshNeedsUpdate: boolean;
  mesh?: Three.Mesh;
}

export const chunkDataDefaults: Readonly<IChunkData> = {
    voxelsPopulated: false,
    voxelData: [],
    meshNeedsUpdate: true,
    position: new Three.Vector3(),
    mesh: undefined
};

export interface IWorldData {
  chunkDataMap: {
    [x: number]: {
      [y: number]: {
        [z: number]: IChunkData;
      };
    };
  };
  chunkDataArray: IChunkData[];
  chunkSize: number;
}

export const worldDataDefaults: Readonly<IWorldData> = {
  chunkSize: 16,
  chunkDataMap: {},
  chunkDataArray: []
};

export const defaultData:
  <T>(data: Partial<T>, defaults: T) => T =
  <T>(data: Partial<T>, defaults: T) => ({...defaults, ...data});
