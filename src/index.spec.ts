import { F } from './index'

const u = {
  add: (a: number, b: number) => a + b,
  multiply: (a: number, b: number) => a * b,
  divide: (a: number, b: number) => a / b,
  subtract: (a: number, b: number) => a - b,
  pow: (a: number, b: number) => a ** b,
  result: (x: number) => `Result: ${x}`,
  debug: (x: any) => {
    console.log(x)
    return x
  },
  promise: {
    delay: (ms: number) => (x: any) => new Promise(resolve => setTimeout(() => resolve(x), ms)),
    add: (a: number, b: number) => Promise.resolve(u.add(a, b)),
    multiply: (a: number, b: number) => Promise.resolve(u.multiply(a, b)),
    divide: (a: number, b: number) => Promise.resolve(u.divide(a, b)),
    subtract: (a: number, b: number) => Promise.resolve(u.subtract(a, b)),
    pow: (a: number, b: number) => Promise.resolve(u.pow(a, b)),
  }
}

describe('FPipes', () => {
  describe('Simple pipe', () => {
    it('should return pipe value if no pipe is chained', () => {
      const pipe = F.pipe(2).value()
      expect(pipe).toBe(2)
    })
    it('should return the result of chained pipes', () => {
      const pipe = F
        .pipe(2)
        .pipe(x => u.add(x, 2))
        .pipe(x => u.multiply(x, 2))
        .value()
      expect(pipe).toBe(8)
    })
    it('should return switch chain types based on the return type of the chained function', () => {
      const pipe = F
        .pipe('1000')
        .pipe(parseFloat)
        .pipe(x => u.multiply(x, 2))
        .pipe(x => u.divide(x, 4))
        .pipe(x => u.subtract(x, 1))
        .value()
      expect(pipe).toBe(499)
    })
  })
  describe('Promise pipe', () => {
    it('should return pipe value if no pipe is chained', () => {
      const pipe = F.pipe(Promise.resolve(2)).value()
      expect(pipe).resolves.toBe(2)
    })
    it('should return the result of chained pipes', () => {
      const pipe = F
        .pipe(2)
        .pipe(x => u.promise.add(x, 2))
        .pipe(x => u.promise.multiply(x, 2))
        .value()
      expect(pipe).resolves.toBe(8)
    })
    it('should return switch chain types based on the return type of the chained function', () => {
      const pipe = F
        .pipe('1000')
        .pipe(parseFloat)
        .pipe(x => u.promise.multiply(x, 2))
        .pipe(x => u.promise.divide(x, 4))
        .pipe(x => u.promise.subtract(x, 1))
        .value()
      expect(pipe).resolves.toBe(499)
    })
    it('should be interchangeable with simple pipe', () => {
      const add2 = (x: number) => u.add(x, 2)
      const multiply2 = (x: number) => u.multiply(x, 2)

      const pipe = F
        .pipe(2)
        .pipe(x => u.promise.add(x, 2))
        .pipe(multiply2)
        .pipe(add2)
        .value()
      expect(pipe).resolves.toBe(10)
    })
  })
})