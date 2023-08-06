import {Schema} from 'type-fest';

type A = {
  a: boolean,
  b: {
    c: string,
    z: {
      m: number[]
    }
  }
}

type Z1 = Schema<A, PatchOperation<A>>;
type Z2 = Patch<A>;



const a: A = {
  a: true,
  b: {
    c: 'aaaa',
    z: {
      m: [1]
    }
  }
};

const z: Z2 = {
  $unset: ['b'],
  b: {$unset: ['z', 'c']},
};

type P0 = Patch<A>
type P1 = PartialDeep<A>;
type P2 = Partial<A>


const aPatch: P0 = {$set: {a: true}};
const aDeep: P1 = {b: {c: 'dd'}};
const aPart: P2 = {a: false};

const a2: P1 = a;
