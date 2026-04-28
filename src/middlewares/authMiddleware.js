import jwt from 'jsonwebtoken'

/*
   Verifica el token JWT del header Authorization.
   Si es válido, adjunta el payload decodificado en req.user.
*/
export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' })
  }

  const token = header.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

/*
   Permite el acceso solo a usuarios con rol 'admin'.
   Debe usarse después de verifyToken.
*/
export const requireAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Solo admin' })
  }
  next()
}
