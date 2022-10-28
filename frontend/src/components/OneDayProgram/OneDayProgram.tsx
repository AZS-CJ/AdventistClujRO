import React from 'react'
import { formatTime, formatToLocalDate, formatToLocalDayName, getDayName, getNextDate, getSunsetForDay } from '../../util/functions'
import { ProgramType } from '../../data/program'

import './OneDayProgram.scss'

const OneDayProgram = (props: { programs: ProgramType[]; dayNumber: number }) => {
  const getProgramsForDay = (dayNumber) => {
    return props.programs.filter((p) => p.day === getDayName(dayNumber)).sort((p1, p2) => p1.time.localeCompare(p2.time))
  }

  const programsForDay = getProgramsForDay(props.dayNumber)

  if (!programsForDay.length) return null
  const day = getNextDate(props.dayNumber)

  const renderSunset = (dayNumber, day) => {
    if (dayNumber < 6) return ''
    return (
      <div className="sunset bold">
        <i className="bi bi-sunset fa-10x" /> Apusul soarelui - ora {getSunsetForDay(day)}
      </div>
    )
  }

  return (
    <div className="program-day">
      <span className="day-title bold">
        <span className="day-name">{formatToLocalDayName(day)}</span> {formatToLocalDate(day)}
      </span>
      {renderSunset(props.dayNumber, day)}
      {programsForDay.map((dayProgram) => (
        <div className="program-line" key={dayProgram.id}>
          <p>
            {formatTime(dayProgram.time)} {dayProgram.live ? ' (LIVE) ' : ''}
          </p>
          {dayProgram.name}
        </div>
      ))}
    </div>
  )
}

export default OneDayProgram
