export const LINKS = {
  YOUTUBE: 'https://www.youtube.com/c/AdventistCluj',
  YOUTUBE_LIVE: 'https://www.youtube.com/c/AdventistCluj/streams',
  FACEBOOK: 'https://www.facebook.com/BisericaSperantaCluj',
  INSTAGRAM: 'https://www.instagram.com/adventistcluj',
  ADVENTIST: 'https://adventist.ro',
  SEMNELE: 'https://semneletimpului.ro',
  RESPIRO: 'https://respiro.ro',
  SPERANTA: 'http://www.sperantatv.ro',
  RADIO: 'https://rvs.ro',
  ADRA: 'https://adra.ro',
  COOKIES: '',
  CONFIDENTIAL: ''
}

export enum InputType {
  TEXT,
  EMAIL,
  PHONE_NUMBER,
  LONG_TEXT
}

export const EMAIL_TEST_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const PHONE_TEST_REGEX = /^[\s()+-]*([0-9][\s()+-]*){10,16}$/

export const TEXTAREA_MAX_LENGTH = 90000
export const INPUT_MAX_LENGTH = 50
