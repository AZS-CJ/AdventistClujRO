import React, { useState } from 'react'
import SunCalc from 'suncalc'
import { formatToLocalDate, getNextDate } from '../../util/functions'

import './Program.scss'

function Program() {
  const getSunsets = () => {
    const timesFriday = SunCalc.getTimes(getNextDate(5), 46.763, 23.58)
    const timesSaturday = SunCalc.getTimes(getNextDate(6), 46.763, 23.58)

    const sunsetFriday = `${timesFriday.sunset.getHours()}:${timesFriday.sunset.getMinutes()}`
    const sunsetSaturday = `${timesSaturday.sunset.getHours()}:${timesSaturday.sunset.getMinutes()}`
    return { friday: sunsetFriday, saturday: sunsetSaturday }
  }

  const [sunsets] = useState<{ friday: string; saturday: string }>(() => getSunsets())

  return (
    <div className="program-page">
      Program: <i className="bi bi-sunset fa-10x" /> {formatToLocalDate(getNextDate(5))}: {sunsets.friday} , {formatToLocalDate(getNextDate(6))}: {sunsets.saturday}
    </div>
  )
}

export default Program
