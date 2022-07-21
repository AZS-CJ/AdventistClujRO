import './NumberPagination.scss'

const NumberPagination = (props) => {
  const { totalPages, currentPage, setPage } = props
  const pages = Array.from({ length: totalPages }, (v, k) => k + 1)

  return (
    <div className="pagination">
      <div className={`arrow ${currentPage < 2 ? 'disabled' : ''}`} onClick={() => setPage(currentPage - 1)}>
        &#8249;
      </div>
      {pages.map((page) => (
        <div key={page} className={`page-number ${currentPage === page ? 'current' : ''}`} onClick={() => setPage(page)}>
          {page}
        </div>
      ))}
      <div className={`arrow ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => setPage(currentPage + 1)}>
        &#8250;
      </div>
    </div>
  )
}

export default NumberPagination
