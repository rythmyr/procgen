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

export const makeChunkData:
  (chunkData: Partial<IChunkData>) => IChunkData =
  (chunkData: Partial<IChunkData>) => ({...chunkDataDefaults, ...chunkData});

export interface IWorldData {
  chunkSize: number;
  chunkData: IChunkData[];
}

export const worldDataDefaults: Readonly<IWorldData> = {
  chunkSize: 16,
  chunkData: []
};

export const makeWorldData:
  (worldData: Partial<IWorldData>) => IWorldData =
  (worldData: Partial<IWorldData>) => ({...worldDataDefaults, ...worldData});

export const defaultData:
  <T>(data: Partial<T>, defaults: T) => T =
  <T>(data: Partial<T>, defaults: T) => ({...defaults, ...data});
