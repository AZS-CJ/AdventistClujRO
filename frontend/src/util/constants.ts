export const LINKS = {
  YOUTUBE_LIVE: 'https://www.youtube.com/c/AdventistCluj/streams',
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
export const EVENT_CAROUSEL_LIMIT = 7
export const PAGE_SIZE = 5
