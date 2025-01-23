import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contract'
import { PaginationOutputMapper } from '../../pagination-output'

describe('PaginationOutputMapper unit tests', () => {
  it('Should convert a SearchResult in Output ', () => {
    const result = new SearchResult({
      items: ['fake' as any],
      total: 1,
      currentPage: 1,
      perPage: 1,
      sort: '',
      sortDir: null,
      filter: 'fake',
    })
    const sut = PaginationOutputMapper.toOutput(result.items, result)
    expect(sut).toStrictEqual({
      items: ['fake'],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
    })
  })
})
