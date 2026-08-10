function getClientIp(req) {
    return req.ip || req.socket?.remoteAddress || 'unknown'
}

export default function requestLogger(req, res, next) {
    const startTime = process.hrtime.bigint()

    res.on('finish', () => {
        const durationInMs = Number(process.hrtime.bigint() - startTime) / 1e6

        console.log({
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: Number(durationInMs.toFixed(2)),
            ip: getClientIp(req),
        })
    })

    next()
}
