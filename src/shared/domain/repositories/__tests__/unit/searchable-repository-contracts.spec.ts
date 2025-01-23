import {
  SearchParams,
  SearchResult,
} from '../../searchable-repository-contract'

describe('Searchable Repository unit tests', () => {
  describe('SearchParams tests', () => {
    it('page prop', () => {
      const sut = new SearchParams()
      expect(sut.page).toEqual(1)

      const params = [
        { page: null as any, expected: 1 },
        { page: undefined as any, expected: 1 },
        { page: '' as any, expected: 1 },
        { page: 'teste' as any, expected: 1 },
        { page: 0, expected: 1 },
        { page: -1, expected: 1 },
        { page: 4.3, expected: 1 },
        { page: true as any, expected: 1 },
        { page: false as any, expected: 1 },
        { page: {} as any, expected: 1 },
        { page: 1, expected: 1 },
        { page: 2, expected: 2 },
      ]

      params.forEach(i => {
        const sut = new SearchParams({ page: i.page })
        expect(sut.page).toBe(i.expected)
      })
    })

    it('perPage prop', () => {
      const sut = new SearchParams()
      expect(sut.perPage).toEqual(15)

      const params = [
        { perPage: null as any, expected: 15 },
        { perPage: undefined as any, expected: 15 },
        { perPage: '' as any, expected: 15 },
        { perPage: 'teste' as any, expected: 15 },
        { perPage: 0, expected: 15 },
        { perPage: -1, expected: 15 },
        { perPage: 4.3, expected: 15 },
        { perPage: true as any, expected: 15 },
        { perPage: false as any, expected: 15 },
        { perPage: {} as any, expected: 15 },
        { perPage: 1, expected: 1 },
        { perPage: 30, expected: 30 },
      ]

      params.forEach(i => {
        const sut = new SearchParams({ perPage: i.perPage })
        expect(sut.perPage).toEqual(i.expected)
      })
    })

    it('sort prop', () => {
      const sut = new SearchParams()
      expect(sut.sort).toBeNull()

      const params = [
        { sort: null as any, expected: null },
        { sort: undefined as any, expected: null },
        { sort: '' as any, expected: null },
        { sort: 'teste', expected: 'teste' },
        { sort: 0, expected: '0' },
        { sort: -1, expected: '-1' },
        { sort: 4.3, expected: '4.3' },
        { sort: true as any, expected: 'true' },
        { sort: false as any, expected: 'false' },
        { sort: {} as any, expected: '[object Object]' },
        { sort: 1, expected: '1' },
        { sort: 2, expected: '2' },
        { sort: 30, expected: '30' },
      ]

      params.forEach(i => {
        const sut = new SearchParams({ sort: i.sort })
        expect(sut.sort).toEqual(i.expected)
      })
    })

    it('sortDir prop', () => {
      let sut = new SearchParams()
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: null })
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: undefined })
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: '' })
      expect(sut.sortDir).toBeNull()

      const params = [
        { sortDir: null as any, expected: 'desc' },
        { sortDir: undefined as any, expected: 'desc' },
        { sortDir: '' as any, expected: 'desc' },
        { sortDir: 'test', expected: 'desc' },
        { sortDir: 0, expected: 'desc' },
        { sortDir: 'asc', expected: 'asc' },
        { sortDir: 'ASC', expected: 'asc' },
        { sortDir: 'desc', expected: 'desc' },
        { sortDir: 'DESC', expected: 'desc' },
      ]

      params.forEach(i => {
        const sut = new SearchParams({ sort: 'field', sortDir: i.sortDir })
        expect(sut.sortDir).toEqual(i.expected)
      })
    })

    it('filter prop', () => {
      const sut = new SearchParams()
      expect(sut.filter).toBeNull()

      const params = [
        { filter: null as any, expected: null },
        { filter: undefined as any, expected: null },
        { filter: '' as any, expected: null },
        { filter: 'teste', expected: 'teste' },
        { filter: 0, expected: '0' },
        { filter: -1, expected: '-1' },
        { filter: 4.3, expected: '4.3' },
        { filter: true as any, expected: 'true' },
        { filter: false as any, expected: 'false' },
        { filter: {} as any, expected: '[object Object]' },
        { filter: 1, expected: '1' },
        { filter: 2, expected: '2' },
        { filter: 30, expected: '30' },
      ]

      params.forEach(i => {
        const sut = new SearchParams({ filter: i.filter })
        expect(sut.filter).toEqual(i.expected)
      })
    })
  })

  describe('SearchResult tests', () => {
    it('construcotr props', () => {
      let sut = new SearchResult({
        items: ['test1', 'test2', 'test3', 'test4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      })
      expect(sut.toJSON()).toStrictEqual({
        items: ['test1', 'test2', 'test3', 'test4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      })

      sut = new SearchResult({
        items: ['test1', 'test2', 'test3', 'test4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test',
      })
      expect(sut.toJSON()).toStrictEqual({
        items: ['test1', 'test2', 'test3', 'test4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test',
      })

      // perPage > total
      sut = new SearchResult({
        items: ['test1', 'test2', 'test3', 'test4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 10,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test',
      })
      expect(sut.lastPage).toBe(1)

      // lastPage is multiple of perPage and total
      sut = new SearchResult({
        items: ['test1', 'test2', 'test3', 'test4'] as any,
        total: 54,
        currentPage: 1,
        perPage: 10,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test',
      })
      expect(sut.lastPage).toBe(6)
    })
  })
})
