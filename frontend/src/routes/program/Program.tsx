import React, { useEffect, useState } from 'react'
import getPrograms from '../../api/program'
import { ProgramType } from '../../data/program'
import OneDayProgram from '../../components/OneDayProgram/OneDayProgram'
import { useGeneralContext } from '../../contexts/generalState'
import { host } from '../../util/constants'

import './Program.scss'

interface ProgramState {
  programs: ProgramType[]
  loading: boolean
}

function Program() {
  const [programRequest, setProgramRequest] = useState<ProgramState>({ programs: [], loading: true })
  const { backgroundImages } = useGeneralContext()

  useEffect(() => {
    ;(async () => {
      getPrograms().then((programs) => setProgramRequest({ programs, loading: false }))
    })()
  }, [])

  const renderContent = () => {
    if (programRequest.loading) return <div className="spinner-border" role="status" />
    return (
      <div className="week default-container">
        <div className="column">
          <OneDayProgram dayNumber={6} programs={programRequest.programs} />
          <OneDayProgram dayNumber={7} programs={programRequest.programs} />
        </div>
        <div className="design-lines">
          <div className="shorter" />
          <div className="longer" />
        </div>
        <div className="column">
          <OneDayProgram dayNumber={1} programs={programRequest.programs} />
          <OneDayProgram dayNumber={2} programs={programRequest.programs} />
          <OneDayProgram dayNumber={3} programs={programRequest.programs} />
          <OneDayProgram dayNumber={4} programs={programRequest.programs} />
          <OneDayProgram dayNumber={5} programs={programRequest.programs} />
        </div>
      </div>
    )
  }
  return (
    <div className="program-page page-content" style={{ backgroundImage: `url(${host}${backgroundImages.program || backgroundImages.home})` }}>
      <div className="left-title-section with-margin">
        <span className="bold-title">Program</span>
      </div>
      {renderContent()}
    </div>
  )
}

export default Program
