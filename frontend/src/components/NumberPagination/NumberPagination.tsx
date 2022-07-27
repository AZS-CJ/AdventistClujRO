import { range } from '../../util/functions'

import './NumberPagination.scss'

const LEFT_PAGE = 'LEFT'
const RIGHT_PAGE = 'RIGHT'
const pageNeighbours = 1

const NumberPagination = (props) => {
  const { totalPages, currentPage, setPage } = props

  const buildPageNumbers = () => {
    const totalNumbers: number = pageNeighbours * 2 + 3
    const totalBlocks = totalNumbers + 2

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours)
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours)
      let pages: (number | string)[] = range(startPage, endPage)

      /**
       * hasLeftSpill: has hidden pages to the left
       * hasRightSpill: has hidden pages to the right
       * spillOffset: number of hidden pages either to the left or to the right
       */
      const hasLeftSpill = startPage > 2
      const hasRightSpill = totalPages - endPage > 1
      const spillOffset = totalNumbers - (pages.length + 1)

      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1)
          pages = [LEFT_PAGE, ...extraPages, ...pages]
          break
        }

        // handle: (1) {2 3} [4] {5 6} > (10)
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = range(endPage + 1, endPage + spillOffset)
          pages = [...pages, ...extraPages, RIGHT_PAGE]
          break
        }

        // handle: (1) < {4 5} [6] {7 8} > (10)
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE]
          break
        }
      }
      return [1, ...pages, totalPages]
    }
    return range(1, totalPages)
  }

  const handleMoveLeft = () => {
    setPage(currentPage - pageNeighbours * 2 - 1)
  }
  const handleMoveRight = () => {
    setPage(currentPage + pageNeighbours * 2 + 1)
  }

  return (
    <div className="pagination">
      {buildPageNumbers().map((page) => {
        if (page === LEFT_PAGE)
          return (
            <div key="prev" className="arrow" onClick={handleMoveLeft}>
              &laquo;
            </div>
          )
        if (page === RIGHT_PAGE)
          return (
            <div key="next" className="arrow" onClick={handleMoveRight}>
              &raquo;
            </div>
          )
        return (
          <div key={page} className={`page-number ${currentPage === page ? 'current' : ''}`} onClick={() => setPage(page)}>
            {page}
          </div>
        )
      })}
    </div>
  )
}

export default NumberPagination
