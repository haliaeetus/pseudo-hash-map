const PseudoHashMap = require('./index');

test('duplicate key', () => {
    const map = new PseudoHashMap(JSON.stringify);
    map.set([1, 1], 'water')
    map.set([4, 20], 'grass')
    map.set([13, 37], 'super epic sword')

    expect(map.size).toBe(3)
    expect(map.get([4, 20])).toEqual('grass')
    expect(map.get([13, 37])).toEqual('super epic sword')


    map.set([4, 20], 'plant')
    map.set([13, 37], 'super epic shield')
    map.set([900, 1], 'extremely powerful thing')

    expect(map.size).toBe(4)
    expect(map.get([4, 20])).toEqual('plant')
    expect(map.get([13, 37])).toEqual('super epic shield')

    map.delete([13, 37])

    expect(map.size).toBe(3)
    expect(map.has([13, 37])).toEqual(false)

    expect(map.size).toBe(3)
})

test('constructor - iterable', () => {
    const map = new PseudoHashMap(JSON.stringify, [
        [[1,2], 'sphinx'],
        [[4, 5], 'of'],
        [[2,-1], 'black'],
        [[4, 5], 'quartz']
    ])

    expect(map.size).toBe(3);
    expect([...map.entries()].sort()).toEqual([
        [[1,2], 'sphinx'],
        [[2,-1], 'black'],
        [[4, 5], 'quartz']
    ].sort())
})