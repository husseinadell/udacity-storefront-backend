import { Application, ErrorRequestHandler } from 'express'

const errorLogger: ErrorRequestHandler = (error, _req, _res, next) => {
  // for logging errors
  console.error(error) // or using any fancy logging library
  next(error) // forward to next middleware
}

const errorResponder: ErrorRequestHandler = (error, _req, res, next) => {
  // responding to client
  if (error.type == 'redirect') res.redirect('/error')
  else if (error.type == 'time-out')
    // arbitrary condition check
    res.status(408).send(error)
  else next(error) // forwarding exceptional case to fail-safe middleware
}

const failSafeHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  // generic handler
  res.status(500).send(error)
}

export const registerErrorHandlers = (app: Application) => {
  app.use(errorLogger)
  app.use(errorResponder)
  app.use(failSafeHandler)
}
