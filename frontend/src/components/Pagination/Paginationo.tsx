import './Pagination.scss'

const Pagination = (props) => {
  const { totalPages, currentPage, setPage } = props
  const pages = Array.from({ length: totalPages }, (v, k) => k + 1)
  return (
    <div className="pagination">
      <div className={currentPage < 2 ? 'disabled' : ''} onClick={() => setPage(currentPage - 1)}>
        &laquo;
      </div>
      {pages.map((page) => (
        <div key={page} className={'page-number' + (currentPage === page ? ' current' : '')} onClick={() => setPage(page)}>
          {page}
        </div>
      ))}
      <div className={currentPage === totalPages ? 'disabled' : ''} onClick={() => setPage(currentPage + 1)}>
        &raquo;
      </div>
    </div>
  )
}

export default Pagination
