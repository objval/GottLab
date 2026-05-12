import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
)

export type UsuarioRol = 'admin' | 'empleado' | 'cliente'

export interface AuthTokenPayload {
  userId: number
  email: string
  role: UsuarioRol
  nombre?: string | null
  perfilId?: number
}

export async function signToken(payload: AuthTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    const { userId, email, role, nombre, perfilId } = payload as Record<string, unknown>

    if (typeof userId !== 'number' || typeof email !== 'string' || typeof role !== 'string') {
      return null
    }

    if (!['admin', 'empleado', 'cliente'].includes(role)) {
      return null
    }

    return {
      userId,
      email,
      role: role as UsuarioRol,
      nombre: typeof nombre === 'string' ? nombre : null,
      perfilId: typeof perfilId === 'number' ? perfilId : undefined,
    }
  } catch {
    return null
  }
}
