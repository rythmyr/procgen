/// <reference lib="webworker" />

// import { IChunkData, IWorldData } from './models/worker-chunk-data.model';
// import Noise from 'src/scripts/noise';
//
// const noise = new Noise();

addEventListener('message', ({ data }) => {
  const response = `worker response to ${data}`;
  const sharedBuffer = new SharedArrayBuffer(200);
  postMessage({response, sharedBuffer}, []);
});

//const generateChunkVoxelData = (chunkData: IChunkData, chunkSize: number): void => {
//  chunkData.voxelData = [];
//  const voxelDataIndex: (x: number, y: number, z: number) => number = (x, y, z) => {
//    if (x >= chunkSize || y >= chunkSize || z >= chunkSize || x < 0 || y < 0 || z < 0) {
//      return -1;
//    }
//    return x * chunkSize * chunkSize + y * chunkSize + z;
//  };
//
//  const toWorldCoords = (chunkPos: number, localPos: number) => (chunkPos * chunkSize) + localPos;
//
//  const blockValuePeriod = 960;
//  const blockDomainWarpOffsetPeriod = 640;
//  const blockDomainWarpRange = 40;
//  const blockThreshold = .4;
//
//  const colorValuePeriod = 960;
//  const colorDomainWarpOffsetPeriod = 20;
//  const colorDomainWarpRange = 40;
//
//  for (let x = 0; x < chunkSize; x++) {
//    const worldX = toWorldCoords(chunkData.position.x, x);
//    for (let z = 0; z < chunkSize; z++) {
//      const worldZ = toWorldCoords(chunkData.position.z, z);
//      for (let y = 0; y < chunkSize; y++) {
//        const worldY = toWorldCoords(chunkData.position.y, y);
//
//
//        const domainOffsetX = (noise.noise2d(
//          worldY / blockDomainWarpOffsetPeriod,
//          worldZ / blockDomainWarpOffsetPeriod
//        ) - .5) * blockDomainWarpRange;
//        const domainOffsetY = (noise.noise2d(
//          worldX / blockDomainWarpOffsetPeriod,
//          worldZ / blockDomainWarpOffsetPeriod
//        ) - .5) * blockDomainWarpRange;
//        const domainOffsetZ = (noise.noise2d(
//          worldX / blockDomainWarpOffsetPeriod,
//          worldY / blockDomainWarpOffsetPeriod
//        ) - .5) * blockDomainWarpRange;
//
//        const colorDomainOffsetX = (noise.noise2d(
//          worldY / colorDomainWarpOffsetPeriod,
//          worldZ / colorDomainWarpOffsetPeriod
//        ) - .5) * colorDomainWarpRange;
//        const colorDomainOffsetY = (noise.noise2d(
//          worldX / colorDomainWarpOffsetPeriod,
//          worldZ / colorDomainWarpOffsetPeriod
//        ) - .5) * colorDomainWarpRange;
//        const colorDomainOffsetZ = (noise.noise2d(
//          worldX / colorDomainWarpOffsetPeriod,
//          worldY / colorDomainWarpOffsetPeriod
//        ) - .5) * colorDomainWarpRange;
//
//        let yContrib = 0;
//        if (worldY > 0 && worldY < 160) {
//          yContrib = worldY / 160;
//        } else if ( worldY >= 160) {
//          yContrib = 1;
//        }
//
//        const perlinValue1 = noise.noise3d(
//          (worldX + domainOffsetX) / blockValuePeriod,
//          (worldY + domainOffsetY) / blockValuePeriod,
//          (worldZ + domainOffsetZ) / blockValuePeriod
//        ) * yContrib;
//
//        const perlinValue2 = noise.noise3d(
//          (worldX + domainOffsetX) / blockValuePeriod * 4,
//          (worldY + domainOffsetY) / blockValuePeriod * 4,
//          (worldZ + domainOffsetZ) / blockValuePeriod * 4
//        );
//
//        const perlinValue3 = noise.noise3d(
//          (worldX + domainOffsetX) / blockValuePeriod * 16,
//          (worldY + domainOffsetY) / blockValuePeriod * 16,
//          (worldZ + domainOffsetZ) / blockValuePeriod * 16
//        );
//
//        const perlinValue = (perlinValue1 * .6 + perlinValue2 * .3 + perlinValue3 * .1);
//
//        const chunkVoxelIndex = voxelDataIndex(x, y, z);
//        if (perlinValue <= blockThreshold) {
//          const r = noise.noise2d(
//            (worldX + colorDomainOffsetX) / colorValuePeriod,
//            (worldY + colorDomainOffsetY) / colorValuePeriod
//          );
//          const g = noise.noise2d(
//            (worldY + colorDomainOffsetY) / colorValuePeriod,
//            (worldZ + colorDomainOffsetZ) / colorValuePeriod
//          );
//          const b = noise.noise2d(
//            (worldX + colorDomainOffsetX) / colorValuePeriod,
//            (worldZ + colorDomainOffsetZ) / colorValuePeriod
//          );
//
//          chunkData.voxelData[chunkVoxelIndex] = {
//            exists: true,
//            color: {r, g, b}
//          };
//        } else {
//          chunkData.voxelData[chunkVoxelIndex] = {
//            exists: false
//          };
//        }
//      }
//    }
//  }
//};
//
//const generateChunkMesh = (chunkData: IChunkData, worldData: IWorldData): IChunkData => {
//  if (!chunkData.meshNeedsUpdate) {
//    return chunkData;
//  }
//
//  const colors: number[] = [];
//  const positions: number[] = [];
//  const normals: number[] = [];
//  const indices: number[] = [];
//
//  const chunkSize = worldData.chunkSize;
//
//  const voxelDataIndex: (x: number, y: number, z: number) => number = (x, y, z) => {
//    if (x >= chunkSize || y >= chunkSize || z >= chunkSize || x < 0 || y < 0 || z < 0) {
//      return -1;
//    }
//    return x * chunkSize * chunkSize + y * chunkSize + z;
//  };
//
//  let currentIndex = 0;
//  for (let x = 0; x < chunkSize; x++) {
//    for (let y = 0; y < chunkSize; y++) {
//      for (let z = 0; z < chunkSize; z++) {
//        const voxelData = chunkData.voxelData[voxelDataIndex(x, y, z)];
//        if (!(voxelData && voxelData.color)) {
//          continue;
//        }
//
//        const {r, g, b} = voxelData.color;
//
//        // -z
//        (() => {
//          let voxel2;
//          const voxel2Index = voxelDataIndex(x, y, z - 1);
//          if (voxel2Index === -1) {
//            const borderChunk = worldData.chunkDataMap
//              [chunkData.position.x]?.
//              [chunkData.position.y]?.
//              [chunkData.position.z - 1];
//            if (!borderChunk) { return; }
//            voxel2 = borderChunk?.voxelData[voxelDataIndex(x, y, chunkSize - 1)];
//          } else {
//            voxel2 = chunkData.voxelData[voxel2Index];
//          }
//          if (voxel2?.color) {
//            return;
//          }
//          colors.push(r * .9, g * .9, b * .9);
//          colors.push(r * .9, g * .9, b * .9);
//          colors.push(r * .9, g * .9, b * .9);
//          colors.push(r * .9, g * .9, b * .9);
//
//          positions.push(x + 0, y + 0, z + 0);
//          positions.push(x + 0, y + 1, z + 0);
//          positions.push(x + 1, y + 1, z + 0);
//          positions.push(x + 1, y + 0, z + 0);
//
//          normals.push(0, 0, -1);
//          normals.push(0, 0, -1);
//          normals.push(0, 0, -1);
//          normals.push(0, 0, -1);
//
//          indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
//          currentIndex += 4;
//
//        }) ();
//
//        // +z
//        (() => {
//          let voxel2;
//          const voxel2Index = voxelDataIndex(x, y, z + 1);
//          if (voxel2Index === -1) {
//            const borderChunk = worldData.chunkDataMap
//              [chunkData.position.x]?.
//              [chunkData.position.y]?.
//              [chunkData.position.z + 1];
//            if (!borderChunk) { return; }
//            voxel2 = borderChunk?.voxelData[voxelDataIndex(x, y, 0)];
//          } else {
//            voxel2 = chunkData.voxelData[voxel2Index];
//          }
//          if (voxel2?.color) {
//            return;
//          }
//          colors.push(r * .8, g * .8, b * .8);
//          colors.push(r * .8, g * .8, b * .8);
//          colors.push(r * .8, g * .8, b * .8);
//          colors.push(r * .8, g * .8, b * .8);
//
//          positions.push(x + 1, y + 1, z + 1);
//          positions.push(x + 0, y + 1, z + 1);
//          positions.push(x + 0, y + 0, z + 1);
//          positions.push(x + 1, y + 0, z + 1);
//
//          normals.push(0, 0, 1);
//          normals.push(0, 0, 1);
//          normals.push(0, 0, 1);
//          normals.push(0, 0, 1);
//
//          indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
//          currentIndex += 4;
//        }) ();
//
//        // -x
//        (() => {
//          let voxel2;
//          const voxel2Index = voxelDataIndex(x - 1, y, z);
//          if (voxel2Index === -1) {
//            const borderChunk = worldData.chunkDataMap
//              [chunkData.position.x - 1]?.
//              [chunkData.position.y]?.
//              [chunkData.position.z];
//            if (!borderChunk) { return; }
//            voxel2 = borderChunk?.voxelData[voxelDataIndex(chunkSize - 1, y, z)];
//          } else {
//            voxel2 = chunkData.voxelData[voxel2Index];
//          }
//          if (voxel2?.color) {
//            return;
//          }
//          colors.push(r * .95, g * .95, b * .95);
//          colors.push(r * .95, g * .95, b * .95);
//          colors.push(r * .95, g * .95, b * .95);
//          colors.push(r * .95, g * .95, b * .95);
//
//          positions.push(x, y + 0, z + 1);
//          positions.push(x, y + 1, z + 1);
//          positions.push(x, y + 1, z + 0);
//          positions.push(x, y + 0, z + 0);
//
//          normals.push(-1, 0, 0);
//          normals.push(-1, 0, 0);
//          normals.push(-1, 0, 0);
//          normals.push(-1, 0, 0);
//
//          indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
//          currentIndex += 4;
//        }) ();
//
//        // +x
//        (() => {
//          let voxel2;
//          const voxel2Index = voxelDataIndex(x + 1, y, z);
//          if (voxel2Index === -1) {
//            const borderChunk = worldData.chunkDataMap
//              [chunkData.position.x + 1]?.
//              [chunkData.position.y]?.
//              [chunkData.position.z];
//            if (!borderChunk) { return; }
//            voxel2 = borderChunk?.voxelData[voxelDataIndex(0, y, z)];
//          } else {
//            voxel2 = chunkData.voxelData[voxel2Index];
//          }
//          if (voxel2?.color) {
//            return;
//          }
//          colors.push(r * .85, g * .85, b * .85);
//          colors.push(r * .85, g * .85, b * .85);
//          colors.push(r * .85, g * .85, b * .85);
//          colors.push(r * .85, g * .85, b * .85);
//
//          positions.push(x + 1, y + 0, z + 0);
//          positions.push(x + 1, y + 1, z + 0);
//          positions.push(x + 1, y + 1, z + 1);
//          positions.push(x + 1, y + 0, z + 1);
//
//          normals.push(1, 0, 0);
//          normals.push(1, 0, 0);
//          normals.push(1, 0, 0);
//          normals.push(1, 0, 0);
//
//          indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
//          currentIndex += 4;
//        }) ();
//
//        // -y
//        (() => {
//          let voxel2;
//          const voxel2Index = voxelDataIndex(x, y - 1, z);
//          if (voxel2Index === -1) {
//            const borderChunk = worldData.chunkDataMap
//              [chunkData.position.x]?.
//              [chunkData.position.y - 1]?.
//              [chunkData.position.z];
//            if (!borderChunk) { return; }
//            voxel2 = borderChunk?.voxelData[voxelDataIndex(x, chunkSize - 1, z)];
//          } else {
//            voxel2 = chunkData.voxelData[voxel2Index];
//          }
//          if (voxel2?.color) {
//            return;
//          }
//          colors.push(r * .75, g * .75, b * .75);
//          colors.push(r * .75, g * .75, b * .75);
//          colors.push(r * .75, g * .75, b * .75);
//          colors.push(r * .75, g * .75, b * .75);
//
//          positions.push(x + 1, y + 0, z + 1);
//          positions.push(x + 0, y + 0, z + 1);
//          positions.push(x + 0, y + 0, z + 0);
//          positions.push(x + 1, y + 0, z + 0);
//
//          normals.push(0, -1, 0);
//          normals.push(0, -1, 0);
//          normals.push(0, -1, 0);
//          normals.push(0, -1, 0);
//
//          indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
//          currentIndex += 4;
//        }) ();
//
//        // +y
//        (() => {
//          let voxel2;
//          const voxel2Index = voxelDataIndex(x, y + 1, z);
//          if (voxel2Index === -1) {
//            const borderChunk = worldData.chunkDataMap
//              [chunkData.position.x]?.
//              [chunkData.position.y + 1]?.
//              [chunkData.position.z];
//            if (!borderChunk) { return; }
//            voxel2 = borderChunk?.voxelData[voxelDataIndex(x, 0, z)];
//          } else {
//            voxel2 = chunkData.voxelData[voxel2Index];
//          }
//          if (voxel2?.color) {
//            return;
//          }
//          colors.push(r, g, b);
//          colors.push(r, g, b);
//          colors.push(r, g, b);
//          colors.push(r, g, b);
//
//          positions.push(x + 1, y + 1, z + 0);
//          positions.push(x + 0, y + 1, z + 0);
//          positions.push(x + 0, y + 1, z + 1);
//          positions.push(x + 1, y + 1, z + 1);
//
//          normals.push(0, 1, 0);
//          normals.push(0, 1, 0);
//          normals.push(0, 1, 0);
//          normals.push(0, 1, 0);
//
//          indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
//          currentIndex += 4;
//        }) ();
//      }
//    }
//  }
//  chunkData.meshVertColors = new Float32Array(colors);
//  chunkData.meshVertPositions = new Float32Array(positions);
//  chunkData.meshVertNormals = new Float32Array(normals);
//  chunkData.meshVertIndices = new Uint32Array(indices);
//
//  return chunkData;
//};
//
