import { Link } from '@tanstack/react-router'
import useAuth from '../../modules/auth/hooks/useAuth'
import './landing.css'

const VISION =
  'Ser un instrumento de Dios que proporcione ayuda constante al prójimo pero sobre todo ' +
  'crecimiento espiritual a todas aquellas personas que lo necesiten.'

const MISION =
  'Acompañar a las personas y familias en condición de vulnerabilidad para que puedan ' +
  'enfrentar las problemáticas de la vida, brindándoles alimentación, apoyo y un espacio ' +
  'de esperanza donde sentirse acogidas y fortalecidas.'

const VALORES = [
  { icon: 'fa-heart', titulo: 'Amor', texto: 'Servimos al prójimo con compasión y calidez humana.' },
  { icon: 'fa-people-group', titulo: 'Comunidad', texto: 'Construimos un puente de esperanza entre quienes dan y quienes reciben.' },
  { icon: 'fa-dove', titulo: 'Fe', texto: 'Trabajamos guiados por valores espirituales y de servicio.' },
  { icon: 'fa-seedling', titulo: 'Esperanza', texto: 'Sembramos crecimiento y bienestar en cada persona que acompañamos.' },
]

export default function LandingPage() {
  const { usuario, logout, tienePermiso, sesionIniciada } = useAuth()

  const puedeGestionarAcceso = tienePermiso('roles.gestionar') || tienePermiso('roles.asignar')
  const puedeDonar = tienePermiso('donaciones.crear')
  const puedeVerBeneficiarios = usuario?.rol === 'superusuario' || usuario?.rol === 'administrador'

  const modulos = [
    { to: '/donaciones', icon: 'fa-hand-holding-heart', titulo: 'Donaciones', texto: 'Registrar y gestionar donaciones', show: puedeDonar },
    { to: '/inventario', icon: 'fa-box-archive', titulo: 'Inventario', texto: 'Control de productos y existencias', show: sesionIniciada },
    { to: '/gastos', icon: 'fa-cart-shopping', titulo: 'Registro de Gastos', texto: 'Seguimiento de gastos de la asociación', show: sesionIniciada },
    { to: '/beneficiarios', icon: 'fa-people-group', titulo: 'Beneficiarios', texto: 'Gestión de beneficiarios y asistencia', show: puedeVerBeneficiarios },
    { to: '/acceso', icon: 'fa-user-shield', titulo: 'Gestión de Acceso', texto: 'Roles, permisos y usuarios', show: puedeGestionarAcceso },
  ].filter((m) => m.show)

  return (
    <div className="ac-landing">
      {/* ===================== NAVBAR ===================== */}
      <header className="ac-nav">
        <div className="ac-nav__inner">
          <a href="#inicio" className="ac-brand" aria-label="Alimentando Corazones - inicio">
            <img
              src="/landing/logo.png"
              alt="Logo de Alimentando Corazones"
              className="ac-brand__logo"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <span className="ac-brand__name">
              Alimentando Corazones
              <small>Un puente de esperanza</small>
            </span>
          </a>

          <nav className="ac-nav__links" aria-label="Navegación principal">
            <a href="#nosotros">Nosotros</a>
            <a href="#vision-mision">Visión y Misión</a>
            <a href="#ubicacion">Ubicación</a>
          </nav>

          <div className="ac-nav__actions">
            {sesionIniciada ? (
              <>
                <span className="ac-nav__hola">Hola, {usuario?.nombre?.split(' ')[0]}</span>
                <a href="#panel" className="ac-btn ac-btn--ghost">Panel</a>
                <button type="button" className="ac-btn ac-btn--ghost" onClick={logout}>
                  <i className="fas fa-right-from-bracket" aria-hidden="true" /> Salir
                </button>
              </>
            ) : (
              <Link to="/login" className="ac-btn ac-btn--ghost">Iniciar sesión</Link>
            )}
            <Link to="/donaciones" className="ac-btn ac-btn--primary">
              <i className="fas fa-hand-holding-heart" aria-hidden="true" /> Donar
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ===================== HERO ===================== */}
        <section className="ac-hero" id="inicio">
          <div className="ac-hero__overlay" />
          <div className="ac-hero__content">
            <p className="ac-eyebrow">Asociación sin fines de lucro</p>
            <h1 className="ac-hero__title">Alimentando Corazones</h1>
            <p className="ac-hero__tagline">Un puente de esperanza</p>
            <p className="ac-hero__text">
              Brindamos alimentación y acompañamiento a niños, niñas y familias de
              nuestra comunidad, llevando esperanza a quienes más lo necesitan.
            </p>
            <div className="ac-hero__cta">
              <Link to="/donaciones" className="ac-btn ac-btn--primary ac-btn--lg">
                <i className="fas fa-hand-holding-heart" aria-hidden="true" /> ¿Deseas donar?
              </Link>
              <a href="#nosotros" className="ac-btn ac-btn--light ac-btn--lg">Conócenos</a>
            </div>
          </div>
        </section>

        {/* ===================== NOSOTROS ===================== */}
        <section className="ac-section ac-about" id="nosotros">
          <div className="ac-about__grid">
            <div className="ac-about__media">
              <img
                src="/landing/comedor.jpg"
                alt="Familias y niños compartiendo una comida en el comedor"
                onError={(e) => {
                  e.currentTarget.closest('.ac-about__media').classList.add('ac-media--empty')
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
            <div className="ac-about__text">
              <p className="ac-eyebrow ac-eyebrow--dark">Quiénes somos</p>
              <h2>Un lugar donde nadie se queda sin un plato y sin esperanza</h2>
              <p>
                Alimentando Corazones es una asociación dedicada a servir al prójimo.
                Cada día abrimos nuestras puertas para ofrecer alimentación digna,
                cariño y apoyo a las familias de nuestra comunidad.
              </p>
              <p>
                Creemos que ayudar va más allá de un plato de comida: buscamos el
                bienestar y el crecimiento espiritual de cada persona que nos visita.
              </p>
            </div>
          </div>
        </section>

        {/* ===================== VISIÓN Y MISIÓN ===================== */}
        <section className="ac-section ac-vm" id="vision-mision">
          <div className="ac-vm__grid">
            <article className="ac-card ac-card--vision">
              <div className="ac-card__icon"><i className="fas fa-eye" aria-hidden="true" /></div>
              <h3>Visión</h3>
              <p>{VISION}</p>
            </article>
            <article className="ac-card ac-card--mision">
              <div className="ac-card__icon"><i className="fas fa-bullseye" aria-hidden="true" /></div>
              <h3>Misión</h3>
              <p>{MISION}</p>
            </article>
          </div>
        </section>

        {/* ===================== VALORES ===================== */}
        <section className="ac-section ac-valores">
          <div className="ac-section__head">
            <p className="ac-eyebrow ac-eyebrow--dark">Lo que nos mueve</p>
            <h2>Nuestros valores</h2>
          </div>
          <div className="ac-valores__grid">
            {VALORES.map((v) => (
              <div className="ac-valor" key={v.titulo}>
                <div className="ac-valor__icon"><i className={`fas ${v.icon}`} aria-hidden="true" /></div>
                <h4>{v.titulo}</h4>
                <p>{v.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== UBICACIÓN ===================== */}
        <section className="ac-section ac-ubicacion" id="ubicacion">
          <div className="ac-ubicacion__grid">
            <div className="ac-ubicacion__info">
              <p className="ac-eyebrow ac-eyebrow--dark">Visítanos</p>
              <h2>¿Dónde estamos?</h2>
              <p className="ac-ubicacion__dir">
                <i className="fas fa-location-dot" aria-hidden="true" />
                El Llanito, Tamarindo de Santa Cruz, Guanacaste, Costa Rica
              </p>
              <p>
                Nuestras puertas están abiertas para quienes necesitan apoyo y para
                quienes desean tender una mano. ¡Te esperamos!
              </p>
            </div>
            <div className="ac-ubicacion__map">
              <iframe
                title="Ubicación de Alimentando Corazones en Tamarindo de Santa Cruz"
                src="https://www.google.com/maps?q=Tamarindo,+Santa+Cruz,+Guanacaste,+Costa+Rica&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* ===================== CTA DONAR ===================== */}
        <section className="ac-donar">
          <div className="ac-donar__inner">
            <h2>Tu ayuda alimenta corazones</h2>
            <p>Con tu donación brindamos alimentación y esperanza a más familias.</p>
            <Link to="/donaciones" className="ac-btn ac-btn--primary ac-btn--lg">
              <i className="fas fa-hand-holding-heart" aria-hidden="true" /> ¿Deseas donar?
            </Link>
          </div>
        </section>

        {/* ===================== PANEL (solo con sesión) ===================== */}
        {sesionIniciada && modulos.length > 0 && (
          <section className="ac-section ac-panel" id="panel">
            <div className="ac-section__head">
              <p className="ac-eyebrow ac-eyebrow--dark">Acceso administrativo</p>
              <h2>Tus módulos</h2>
              <p className="ac-panel__sub">
                Accesos disponibles según tu rol: <strong>{usuario?.rol}</strong>
              </p>
            </div>
            <div className="ac-panel__grid">
              {modulos.map((m) => (
                <Link to={m.to} key={m.to} className="ac-modulo">
                  <div className="ac-modulo__icon"><i className={`fas ${m.icon}`} aria-hidden="true" /></div>
                  <div className="ac-modulo__body">
                    <h4>{m.titulo}</h4>
                    <p>{m.texto}</p>
                  </div>
                  <i className="fas fa-arrow-right ac-modulo__arrow" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="ac-footer">
        <div className="ac-footer__inner">
          <div className="ac-footer__brand">
            <img
              src="/landing/logo.png"
              alt="Logo de Alimentando Corazones"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <div>
              <strong>Alimentando Corazones</strong>
              <span>Un puente de esperanza</span>
            </div>
          </div>
          <p className="ac-footer__loc">
            <i className="fas fa-location-dot" aria-hidden="true" />
            El Llanito, Tamarindo de Santa Cruz, Guanacaste, Costa Rica
          </p>
        </div>
        <div className="ac-footer__bottom">
          © {new Date().getFullYear()} Alimentando Corazones · Sistema SIGAC
        </div>
      </footer>
    </div>
  )
}
