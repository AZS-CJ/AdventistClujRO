export const LINKS = {
  youtube: 'https://www.youtube.com/c/AdventistCluj',
  facebook: 'https://www.facebook.com/BisericaSperantaCluj',
  instagram: 'https://www.instagram.com/adventistcluj',
  adventist: 'https://adventist.ro',
  semnele: 'https://semneletimpului.ro',
  respiro: 'https://respiro.ro',
  speranta: 'http://www.sperantatv.ro',
  radio: 'https://rvs.ro',
  adra: 'https://adra.ro',
  cookies: '',
  confidential: ''
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
