import { ZERO_POINT_ENCODE, MAX_SIZE } from './constant.js';
import { secp256k1 } from '@noble/curves/secp256k1';

const worker = (inputPoint, map, start, end) => {
    for (let low = start; low < end; low++) {
        let point;
        if (low === 0) {
            // eslint-disable-next-line
            point = inputPoint.subtract(secp256k1.ProjectivePoint.ZERO);
        } else {
            // eslint-disable-next-line
            let x_low = BigInt(low) % secp256k1.CURVE.n;
            // eslint-disable-next-line
            let point_low = secp256k1.ProjectivePoint.BASE.multiply(x_low);
            point = inputPoint.subtract(point_low);
        }
        let encoded;
        // eslint-disable-next-line
        if (point.equals(secp256k1.ProjectivePoint.ZERO)) {
            encoded = ZERO_POINT_ENCODE;
        } else {
            encoded = point.toHex();
        }
        let hi = map.get(encoded);
        if (hi !== undefined) {
            return { res: (hi << MAX_SIZE / 2) + low, isExist: true };
        }
    }
    return { res: 0, isExist: false };
}

// console.log(self);
self.addEventListener("message", (res) => {
    const { data, start, end, map, index } = res.data;
    // console.log('map',map)
    // // eslint-disable-next-line
    const inputPoint = secp256k1.ProjectivePoint.fromHex(data);
    const workerData = worker(inputPoint, map, start, end);
    // console.log('index',index)
    self.postMessage({...workerData});
    if(workerData.res){
        self.close()
    }
})
