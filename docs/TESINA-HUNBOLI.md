<!-- =================================================================== -->
<!-- PÁGINA 1 · PORTADA                                                   -->
<!-- Edita libremente todo lo que está [ENTRE CORCHETES]. El logo se      -->
<!-- puede arrastrar, centrar o redimensionar directamente en Word.       -->
<!-- =================================================================== -->

![](hunboli-logo.png){width=3.2cm}

**[NOMBRE DE LA UNIVERSIDAD / INSTITUCIÓN]**

**[Facultad de … · Carrera de …]**

&nbsp;

&nbsp;

<!-- Título principal (centrado). Para cambiar el texto, edita lo que está dentro de <w:t>…</w:t>. -->
```{=openxml}
<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="240" w:after="60"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="72"/></w:rPr><w:t>HUNBOLI</w:t></w:r></w:p>
<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>Stablecoin nacional respaldada por fiat como infraestructura digital de pagos para Bolivia</w:t></w:r></w:p>
```

_Tesina presentada como propuesta de infraestructura financiera digital de alcance nacional_

&nbsp;

&nbsp;

**Autor(es):** _[Nombre completo del autor / equipo]_

**Tutor / Asesor:** _[Nombre del tutor]_

**Carrera:** _[Ingeniería de Sistemas / Ingeniería Financiera / etc.]_

&nbsp;

&nbsp;

**La Paz — Estado Plurinacional de Bolivia**

**2026 · Versión 1.0**

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

<!-- =================================================================== -->
<!-- PÁGINA 2 · QUIÉNES SOMOS (presentación institucional)                -->
<!-- Esta página muestra que detrás del proyecto hay un equipo serio.     -->
<!-- Completa los datos reales del equipo, web y contacto.                -->
<!-- =================================================================== -->

![](hunboli-logo.png){width=2.2cm}

# Quiénes somos

**HUNBOLI** es un proyecto tecnológico boliviano dedicado al diseño y desarrollo de **infraestructura financiera digital de nueva generación**. Construimos una plataforma de moneda estable (*stablecoin*) respaldada por moneda fiduciaria, pensada desde su origen para operar **dentro del marco legal**, con los más altos estándares de seguridad, trazabilidad y cumplimiento regulatorio.

Somos un equipo multidisciplinario que combina **ingeniería de software, seguridad informática (blockchain), finanzas y cumplimiento normativo**. Hemos desarrollado un sistema funcional y verificable de extremo a extremo —contratos inteligentes, plataforma de gestión y aplicación de usuario— que demuestra que es posible llevar el dinero digital a Bolivia de forma soberana, segura y supervisable.

## Nuestra misión

Democratizar el acceso a servicios financieros digitales en Bolivia mediante una moneda estable respaldada, segura y trazable, que reduzca costos, amplíe la inclusión financiera y fortalezca la economía formal del país.

## Nuestra visión

Ser la infraestructura de pagos digitales de referencia del país: un puente confiable entre el sistema financiero tradicional y la economía digital, operando en alianza con las instituciones del Estado y bajo su supervisión.

## Nuestros valores

- **Cumplimiento primero:** la regulación y la protección al usuario son el punto de partida, no un añadido.
- **Transparencia:** cada operación es auditable y verificable.
- **Soberanía:** tecnología nacional al servicio del país.
- **Seguridad:** controles de grado institucional en cada capa del sistema.

## Qué hemos construido

- Un **contrato inteligente** (token BOBH) con controles regulatorios de grado institucional.
- Una **plataforma de gestión** con verificación de identidad (KYC), validación de operaciones y custodia con firma múltiple.
- Una **aplicación de usuario** para depósito, retiro, transferencia y consulta de saldo.

> _Todo el sistema descrito en este documento fue desarrollado y validado por nuestro equipo; no se trata de una idea conceptual, sino de un producto funcional._

## Nuestro equipo

| Nombre | Rol | Especialidad |
|--------|-----|--------------|
| _[Nombre y apellido]_ | _[Fundador / CEO]_ | _[Ej.: Blockchain / Arquitectura]_ |
| _[Nombre y apellido]_ | _[CTO / Líder técnico]_ | _[Ej.: Backend / Seguridad]_ |
| _[Nombre y apellido]_ | _[Cumplimiento / Finanzas]_ | _[Ej.: AML / Regulación]_ |
| _[Nombre y apellido]_ | _[Producto / Diseño]_ | _[Ej.: UX / Frontend]_ |

## Contacto

- **Sitio web:** _[www.hunboli.com]_
- **Correo electrónico:** _[contacto@hunboli.com]_
- **Teléfono / WhatsApp:** _[+591 …]_
- **Redes sociales:** _[LinkedIn · X · Instagram]_
- **Ciudad:** _[La Paz, Bolivia]_

## Por qué trabajar con nosotros

- **Producto real y funcional**, no una propuesta teórica.
- **Diseñado para el cumplimiento** y la supervisión del Estado desde el primer día.
- **Equipo técnico propio**, con capacidad de desarrollo, mantenimiento y evolución.
- **Soberanía tecnológica:** una solución nacional frente al uso no supervisado de stablecoins extranjeras.
- **Disposición a colaborar** con el Banco Central de Bolivia (BCB), la ASFI y demás instituciones bajo un esquema de piloto controlado (*sandbox* regulatorio).

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

<!-- =================================================================== -->
<!-- PÁGINA 3 · RESUMEN EJECUTIVO                                         -->
<!-- =================================================================== -->

# Resumen ejecutivo

> **HUNBOLI es dinero digital boliviano: una moneda estable respaldada 1:1 por bolivianos, trazable, auditable y supervisable por el Estado.**

Bolivia avanza hacia una economía cada vez más digital, pero lo hace en gran medida **fuera del control del Estado**: el uso de *stablecoins* extranjeras para remesas, comercio y ahorro crece de forma acelerada, sin supervisión, sin protección al usuario y con fuga del señoreaje hacia emisores foráneos. Al mismo tiempo, persisten brechas estructurales de inclusión financiera, alto uso de efectivo y costos elevados en las transferencias.

Ante este escenario —y tras la apertura normativa del **Banco Central de Bolivia** hacia los activos virtuales (2024)— el presente trabajo propone, diseña e implementa **HUNBOLI**, una *stablecoin* nacional respaldada de forma íntegra (**1:1**) por moneda fiduciaria, concebida como **infraestructura pública-privada de pagos digitales**: auditable, trazable y conforme a los estándares internacionales de prevención de lavado de activos (GAFI).

HUNBOLI se materializa en un token digital denominado **BOBH**, con paridad al boliviano (Bs), desarrollado sobre tecnología *blockchain* (estándar ERC-20) e integrado a una plataforma completa de tres capas:

1. **Contrato inteligente** con controles regulatorios de grado institucional: emisión y destrucción controladas por roles, lista de cuentas restringidas, confiscación por orden de autoridad competente y pausa de emergencia.
2. **Plataforma de gestión** (*backend*) con verificación de identidad obligatoria (KYC), validación de operaciones fiat, registro contable auditable y custodia mediante **firma múltiple** (*multisig*).
3. **Aplicación de usuario** para depósito, retiro, transferencia y consulta de saldo.

El aporte central de la propuesta es **conciliar la tecnología blockchain con la soberanía del Estado**: a diferencia de un criptoactivo descentralizado, HUNBOLI incorpora por diseño las facultades que un Estado requiere —congelar, confiscar y pausar—, sometidas a gobernanza compartida y a una pista de auditoría inmutable.

El trabajo demuestra la **viabilidad técnica y la pertinencia regulatoria** de emitir dinero digital respaldado en Bolivia. Se concluye que una *stablecoin* nacional, correctamente gobernada y supervisada, puede **reducir costos transaccionales, ampliar la inclusión financiera, formalizar flujos hoy informales y dotar al Estado de una trazabilidad fiscal y de cumplimiento sin precedentes**.

**Palabras clave:** stablecoin, dinero digital, blockchain, inclusión financiera, ERC-20, KYC/AML, Banco Central de Bolivia, infraestructura de pagos, criptoactivos respaldados, contratos inteligentes.

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

<!-- =================================================================== -->
<!-- ÍNDICE AUTOMÁTICO (campo TOC de Word).                              -->
<!-- Genera líneas de puntos y números de página reales.                -->
<!-- En Word se actualiza con: clic derecho → "Actualizar campos", o     -->
<!-- pestaña Referencias → "Actualizar tabla". Ya viene actualizado.     -->
<!-- =================================================================== -->
```{=openxml}
<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="32"/></w:rPr><w:t>ÍNDICE</w:t></w:r></w:p>
<w:sdt><w:sdtPr><w:docPartObj><w:docPartGallery w:val="Table of Contents"/><w:docPartUnique/></w:docPartObj></w:sdtPr><w:sdtContent><w:p><w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \o "1-3" \h \z \u </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t xml:space="preserve">Actualice el índice en Word: pestaña Referencias - Actualizar tabla (o clic derecho - Actualizar campos).</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:sdtContent></w:sdt>
```

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

# Capítulo 1. Introducción

## 1.1. Planteamiento del problema

Bolivia presenta uno de los niveles más altos de uso de efectivo y de informalidad de la región. Aunque la bancarización ha crecido, persisten brechas: poblaciones rurales y periurbanas sin acceso a servicios financieros formales, costos elevados y demoras en transferencias interbancarias e internacionales, y una creciente demanda ciudadana de instrumentos digitales de ahorro y pago estables frente a la volatilidad de los criptoactivos tradicionales.

De forma paralela, en los últimos años se ha producido en Bolivia un crecimiento espontáneo del uso de criptoactivos y *stablecoins* extranjeras (principalmente dólar-referenciadas) para remesas, comercio y refugio de valor. Este fenómeno ocurre **fuera del perímetro de supervisión del Estado**, lo que implica riesgos de evasión fiscal, lavado de activos, fraude al consumidor y fuga del señoreaje hacia emisores extranjeros.

Hasta 2024 el marco normativo boliviano prohibía el uso de criptoactivos. Con la apertura regulatoria del Banco Central de Bolivia (BCB) que habilitó operaciones con activos virtuales a través de canales electrónicos autorizados, se abre por primera vez la posibilidad de construir, **dentro del marco legal**, una solución soberana y supervisada.

El problema central, por tanto, no es si los bolivianos usarán dinero digital —ya lo hacen—, sino **si lo harán dentro o fuera del control del Estado**, y con qué garantías de respaldo, trazabilidad y protección al usuario.

## 1.2. Formulación del problema

> ¿Es técnica, económica y regulatoriamente viable diseñar e implementar una stablecoin nacional respaldada 1:1 por moneda fiduciaria, que opere dentro del marco legal boliviano y que mejore la inclusión financiera, la trazabilidad y la eficiencia de los pagos digitales?

**Preguntas específicas:**
- ¿Qué arquitectura tecnológica garantiza respaldo íntegro, trazabilidad total y controles de cumplimiento?
- ¿Cómo se concilia la inmutabilidad de la blockchain con las facultades regulatorias del Estado (congelamiento, confiscación, pausa)?
- ¿Qué modelo de gobernanza y custodia minimiza el riesgo de emisión indebida o fraude interno?
- ¿Qué impacto esperable tiene sobre costos, inclusión y formalización?

## 1.3. Objetivos

**Objetivo general.** Diseñar, desarrollar y validar HUNBOLI, una plataforma de stablecoin nacional respaldada por fiat, como propuesta de infraestructura digital de pagos para el Estado boliviano.

**Objetivos específicos.**
1. Desarrollar un contrato inteligente ERC-20 con controles regulatorios de grado institucional (emisión/destrucción por roles, lista de restricción, confiscación, pausa de emergencia y auditoría por eventos).
2. Construir un backend que gestione identidad (KYC), validación de depósitos y retiros fiat, y custodia mediante firma múltiple.
3. Implementar una aplicación de usuario para operaciones de depósito, retiro, transferencia y consulta.
4. Garantizar la paridad 1:1 mediante un modelo de emisión únicamente contra respaldo verificado.
5. Analizar la conformidad de la propuesta con el marco regulatorio boliviano y los estándares GAFI.
6. Evaluar el impacto económico y social esperado.

## 1.4. Justificación

- **Soberanía monetaria y tecnológica:** evita que el dinero digital usado por los ciudadanos sea emitido y controlado por terceros extranjeros.
- **Inclusión financiera:** una billetera digital accesible desde un teléfono móvil reduce las barreras de acceso.
- **Eficiencia:** transferencias casi instantáneas y de bajo costo frente al sistema tradicional.
- **Cumplimiento y trazabilidad:** cada operación queda registrada y es auditable, fortaleciendo la lucha contra el lavado de activos y la evasión.
- **Recaudación y formalización:** flujos hoy informales pueden integrarse a la economía formal.
- **Oportunidad regulatoria:** la reciente apertura del BCB hacia activos virtuales hace que la propuesta sea oportuna y pertinente.

## 1.5. Alcance y delimitación

La tesina abarca el **diseño y la implementación funcional (prototipo operativo / MVP)** de las tres capas del sistema, desplegado en redes de prueba (*testnet* Sepolia y entorno local Hardhat), con arquitectura preparada para migración a una red de producción (BNB Chain). Quedan fuera del alcance: la puesta en producción regulada, las auditorías de seguridad externas certificadas, la integración bancaria en vivo y la obtención efectiva de licencias, que se plantean como trabajo futuro y como condiciones para la operación real.

## 1.6. Hipótesis

> Es posible implementar una stablecoin nacional respaldada 1:1 que combine la trazabilidad y eficiencia de la tecnología blockchain con los controles de cumplimiento y supervisión exigidos por la regulación boliviana, conciliando la naturaleza descentralizada de la tecnología con las facultades soberanas del Estado.

---

# Capítulo 2. Marco teórico

## 2.1. El dinero y su evolución digital

El dinero cumple tres funciones clásicas: unidad de cuenta, medio de cambio y depósito de valor. Su evolución —del metálico al papel, del papel al dinero bancario electrónico— responde a una búsqueda constante de mayor eficiencia y menores costos de transacción. El dinero digital basado en libros distribuidos (*blockchain*) representa la última etapa de esta evolución: permite la transferencia de valor entre pares sin intermediarios, con liquidación casi inmediata y registro inmutable.

Se distingue entre: **CBDC** (moneda digital de banco central, pasivo directo del emisor estatal), **stablecoins** (emitidas por entidades, respaldadas por activos) y **criptoactivos volátiles** (sin respaldo, como Bitcoin). HUNBOLI se ubica como **stablecoin respaldada por fiat**, un modelo que puede operar como complemento privado-supervisado o como paso previo a una eventual CBDC.

## 2.2. Tecnología blockchain y contratos inteligentes

Una *blockchain* es un registro distribuido, replicado y criptográficamente encadenado, que garantiza integridad e inmutabilidad de las transacciones sin depender de una autoridad central única. Los **contratos inteligentes** (*smart contracts*) son programas que se ejecutan de forma determinista sobre la blockchain, automatizando reglas de negocio sin posibilidad de manipulación arbitraria.

El estándar **ERC-20** define la interfaz común de los *tokens* fungibles (transferencia, saldo, aprobación), garantizando interoperabilidad con billeteras y servicios del ecosistema. HUNBOLI implementa ERC-20 con **6 decimales**, configuración alineada con la representación de centavos y prácticas de stablecoins de pago.

## 2.3. Stablecoins: tipología y modelos de respaldo

| Tipo | Respaldo | Ejemplo | Riesgo principal |
|------|----------|---------|------------------|
| Respaldada por fiat | Reservas en moneda 1:1 | USDT, USDC | Custodia y transparencia de reservas |
| Respaldada por cripto | Sobrecolateral en criptoactivos | DAI | Volatilidad del colateral |
| Algorítmica | Reglas de oferta/demanda | (casos fallidos) | Pérdida de paridad (*depeg*) |

HUNBOLI adopta el modelo **respaldado por fiat 1:1**, el más robusto y comprensible para un regulador: por cada unidad BOBH en circulación existe el equivalente en bolivianos en reserva. La emisión (*mint*) ocurre únicamente cuando ingresa respaldo verificado, y la destrucción (*burn*) cuando el usuario retira fondos, manteniendo la igualdad **oferta = reserva**.

## 2.4. Identidad digital, KYC y prevención de lavado de activos (AML)

**KYC** (*Know Your Customer*, conoce a tu cliente) es el conjunto de procedimientos de verificación de identidad obligatorios en el sistema financiero. HUNBOLI integra KYC con verificación facial, prueba de vida (*liveness*) y comparación biométrica antes de habilitar operaciones. Esto, sumado a la trazabilidad on-chain, alinea el sistema con las **40 Recomendaciones del GAFI** (Grupo de Acción Financiera Internacional), en particular la "*Travel Rule*" y la debida diligencia del cliente.

## 2.5. Custodia institucional y firma múltiple (multisig)

La **firma múltiple** (*multisig*) exige que una operación crítica —como acuñar o destruir tokens— sea aprobada por varias partes independientes antes de ejecutarse. HUNBOLI emplea un esquema tipo **Safe** (anteriormente Gnosis Safe), de modo que ninguna persona individual puede emitir dinero unilateralmente. Esto es el equivalente digital del principio contable de **doble firma** y constituye un control de gobernanza esencial para la confianza institucional.

## 2.6. Contexto financiero boliviano

Hasta 2024, la normativa boliviana prohibía el uso de criptoactivos en el sistema financiero (BCB, Resolución de Directorio N.º 144/2020). El **25 de junio de 2024**, mediante la **Resolución de Directorio N.º 082/2024**, el Banco Central de Bolivia dejó sin efecto esa prohibición y habilitó el uso de Instrumentos Electrónicos de Pago para operaciones de compra y venta de activos virtuales a través de canales electrónicos autorizados. Posteriormente, la ASFI y la UIF emitieron normativa complementaria —incluido el Reglamento para Empresas de Tecnología Financiera (ETF) y el registro de Proveedores de Servicios de Activos Virtuales (PSAV)— que se detalla en el Capítulo 5. Este giro normativo es el fundamento de oportunidad de la presente propuesta.

---

# Capítulo 3. Marco metodológico

**Tipo de investigación:** aplicada, de carácter descriptivo-propositivo, con desarrollo de un artefacto tecnológico (investigación de diseño, *Design Science Research*).

**Metodología de desarrollo:** iterativa-incremental, con separación en tres capas (contrato, backend, frontend) y validación funcional sobre redes de prueba.

**Técnicas e instrumentos:**
- Revisión documental (normativa, literatura sobre stablecoins, estándares GAFI).
- Desarrollo y prueba de contratos inteligentes (Solidity, Foundry/Hardhat; pruebas de invariantes y *fork tests*).
- Desarrollo de servicios backend (NestJS, PostgreSQL/Prisma) y de la aplicación cliente (Next.js, React).
- Verificación de flujos extremo a extremo (depósito→emisión, retiro→destrucción).

**Stack tecnológico empleado (verificado en el código):**

| Capa | Tecnologías |
|------|-------------|
| Contrato | Solidity ^0.8.28, OpenZeppelin (ERC20, AccessControl, Pausable), Foundry/Hardhat |
| Backend | NestJS, PostgreSQL + Prisma ORM, integración Safe (multisig), *listener* de eventos on-chain, Cloudinary (comprobantes), proveedor de tasas (Binance P2P) |
| Frontend | Next.js 16, React 19, wagmi + RainbowKit + viem, TailwindCSS, React Query |
| Redes | Sepolia (testnet), Hardhat (local); destino BNB Chain |

---

# Capítulo 4. Propuesta y desarrollo del sistema HUNBOLI

## 4.1. Visión general de la arquitectura

HUNBOLI se compone de tres capas integradas:

```
┌──────────────────────────────────────────────────────────────┐
│  CAPA 3 — APLICACIÓN DE USUARIO (Next.js / React)              │
│  Landing institucional · Billetera · KYC · Paneles de admin    │
└───────────────────────────┬──────────────────────────────────┘
                            │ API REST (JWT, roles)
┌───────────────────────────▼──────────────────────────────────┐
│  CAPA 2 — BACKEND Y OPERACIONES (NestJS + PostgreSQL)          │
│  Identidad/KYC · Depósitos→Mint · Retiros→Burn ·               │
│  Custodia multifirma (Safe) · Listener de eventos · Tasas      │
└───────────────────────────┬──────────────────────────────────┘
                            │ JSON-RPC (viem / ethers)
┌───────────────────────────▼──────────────────────────────────┐
│  CAPA 1 — CONTRATO INTELIGENTE (Solidity, ERC-20 "BOBH")       │
│  Mint · Burn · Redención · Blacklist · Confiscación · Pausa    │
│  Eventos de auditoría inmutables                               │
└──────────────────────────────────────────────────────────────┘
```

**Principio de diseño rector:** la blockchain aporta *trazabilidad e integridad*; el backend aporta *control de cumplimiento y experiencia de usuario*; y la gobernanza multifirma aporta *confianza institucional*. La paridad 1:1 se preserva porque la emisión solo ocurre tras la validación de respaldo fiat.

## 4.2. Capa de contrato inteligente (token BOBH)

El contrato `MyStableCoin` (nombre comercial **HUNBOLI**, símbolo **BOBH**) hereda de los módulos auditados de OpenZeppelin: `ERC20`, `AccessControl` y `Pausable`.

**Características técnicas verificadas:**

- **Decimales: 6** (requerimiento del modelo de pago).
- **Suministro máximo (`MAX_SUPPLY`) inmutable**, fijado en el despliegue: techo de emisión que no puede alterarse, garantía anti-inflación.
- **Separación de roles (control de acceso):**
  - `MINTER_ROLE` — autoriza la emisión.
  - `BURNER_ROLE` — autoriza la destrucción / finalización de redenciones.
  - `PAUSER_ROLE` — pausa/reanuda el sistema.
  - `BLACKLIST_MANAGER_ROLE` — gestiona la lista de restricción y la confiscación.
  - `DEFAULT_ADMIN_ROLE` — administración general.

**Funciones regulatorias clave:**

1. **Emisión controlada** (`mint`, `mintBatch`): solo direcciones con `MINTER_ROLE`; valida que no se exceda `MAX_SUPPLY`; emite evento `Minted`. El *batch* permite emisiones masivas eficientes en gas.
2. **Flujo de redención formal:**
   - `requestRedemption` — el usuario bloquea sus tokens en custodia del contrato (evento `RedemptionRequested`).
   - `finalizeRedemption` — la entidad destruye los tokens tras pagar el fiat (eventos `RedemptionFinalized` + `Burned`).
   - `rejectRedemption` — devuelve los tokens al usuario si la operación no procede.
3. **Lista de restricción (blacklist):** `addToBlacklist` / `removeFromBlacklist`. Las cuentas restringidas no pueden transferir ni recibir, con excepciones controladas para acciones del sistema (devoluciones legítimas). Equivale al **congelamiento de cuentas** por orden de autoridad competente.
4. **Confiscación** (`confiscate`): permite, sobre una cuenta previamente restringida, destruir el saldo y las redenciones pendientes, dejando registro inmutable (`Confiscated`). Es el mecanismo digital para cumplir **órdenes judiciales o administrativas** de incautación.
5. **Pausa de emergencia** (`pause` / `unpause`): detiene todas las transferencias ante un incidente de seguridad o instrucción regulatoria.
6. **Recuperación de tokens enviados por error** (`recoverERC20`): protección al usuario, sin poder tocar el propio token BOBH.

**Auditoría por eventos:** cada operación sensible emite un evento inmutable (`Minted`, `Burned`, `RedemptionRequested/Finalized/Rejected`, `Confiscated`, `SystemPaused/Unpaused`, `AddedToBlacklist/RemovedFromBlacklist`, `TokensRecovered`). Estos eventos constituyen una **pista de auditoría pública y verificable** por el regulador en todo momento.

> **Conciliación clave inmutabilidad ↔ soberanía:** a diferencia de un criptoactivo descentralizado puro, HUNBOLI incorpora *por diseño* las facultades que un Estado requiere (congelar, confiscar, pausar), pero las somete a control de acceso por roles y a gobernanza multifirma, de modo que su uso queda registrado y es auditable. Se obtiene así lo mejor de ambos mundos: integridad técnica y supervisión soberana.

## 4.3. Capa de backend y operaciones

Implementada en **NestJS** con base de datos **PostgreSQL** (ORM Prisma). Módulos principales (verificados):

- **Autenticación y usuarios:** registro, inicio de sesión (JWT), cuenta Google, recuperación de contraseña, roles (`USER`, `ADMIN`, `OPERATOR_BO`, `OPERATOR_PE`).
- **KYC e identidad:** verificación con proveedor externo (similitud facial, *liveness*), estados (`UNVERIFIED`, `PENDING`, `VERIFIED`, `REJECTED`, `NEED_CORRECTION`, `BLACKLISTED`); *webhook* de resultados.
- **Depósitos (fiat → emisión):** el usuario registra un depósito, sube comprobante (almacenado en Cloudinary); un operador lo valida; se genera una **propuesta de emisión vía Safe (multifirma)**; al confirmarse on-chain se registra el hash de la transacción de *mint*.
- **Retiros (destrucción → pago bancario):** se descuenta/destruye BOBH y se ejecuta el pago a la cuenta bancaria del usuario, con comprobante.
- **Custodia multifirma (módulo Safe):** orquesta las propuestas y confirmaciones de las operaciones críticas (mint/burn/confiscación), garantizando control dual.
- **Listener de eventos on-chain:** escucha el contrato y **registra cada evento en la base de datos** (`event_logs`), evitando duplicados; sincroniza el estado off-chain con la verdad on-chain.
- **Tasas de cambio:** módulo de tipo de cambio con proveedor de referencia (Binance P2P) y registro de la tasa usada, fuente y vigencia por operación.
- **Cuentas bancarias por país** (Bolivia/Perú) y cuentas de la empresa por moneda (BOB/PEN), con QR de pago.

**Modelo de datos (entidades principales):** `User`, `FiatOperation` (con `DepositDetail` y `WithdrawalDetail`), `BankAccount`, `Banks`, `CompanyBankAccount`, `EventLog`, `BlacklistEntry`, `verification_requests`. El registro de cada operación fiat incluye monto, comisión, tasa usada, código de referencia único y estado, lo que constituye **contabilidad auditable de extremo a extremo**.

## 4.4. Capa de aplicación de usuario

Desarrollada en **Next.js 16 / React 19**, con conexión a billeteras vía **wagmi + RainbowKit + viem**. Componentes:

- **Sitio institucional** (landing) con presentación del proyecto, características y estadísticas.
- **Billetera / dashboard:** tarjeta de saldo, y operaciones de **Depositar**, **Retirar** y **Transferir**, con actividad reciente.
- **Onboarding y KYC** obligatorios: la aplicación bloquea las operaciones hasta que el usuario está verificado, con KYC aprobado y onboarding completo (control verificado en el código de la pantalla principal).
- **Paneles de administración:** aprobación de emisiones (*mints*), gestión de retiros y revisión de verificaciones, segmentados por rol de operador.

## 4.5. Flujos operativos completos

**A. Depósito (compra de BOBH):**
1. Usuario verificado realiza una transferencia bancaria a la cuenta de la entidad y registra el depósito subiendo el comprobante.
2. Un operador valida el comprobante contra el ingreso real de fondos.
3. Se crea una propuesta de emisión en el Safe (multifirma); al alcanzar las firmas requeridas se ejecuta `mint` on-chain.
4. El listener detecta el evento `Minted` y acredita el saldo en la billetera del usuario.
   *Resultado: BOBH emitido = fiat recibido (paridad 1:1).*

**B. Transferencia entre usuarios:** operación on-chain directa (ERC-20), sujeta a que ninguna de las partes esté restringida; registrada como evento `TRANSFER`.

**C. Retiro (venta de BOBH):**
1. El usuario solicita el retiro; sus tokens pasan a custodia (`requestRedemption`).
2. La entidad realiza el pago bancario al usuario y sube el comprobante.
3. Se ejecuta `finalizeRedemption` (destrucción de los tokens) o `rejectRedemption` (devolución) según corresponda.
   *Resultado: BOBH destruido = fiat entregado (la reserva se reduce en igual proporción).*

**D. Cumplimiento (a requerimiento de autoridad competente):** restricción de cuenta (`addToBlacklist`), y de ser necesario `confiscate`, todo con registro inmutable y respaldo en `BlacklistEntry` (motivo, responsable, montos).

## 4.6. Modelo económico (paridad y respaldo)

- **Invariante de respaldo:** `Suministro en circulación (BOBH) = Reservas fiat en custodia (Bs)`. La emisión solo procede contra respaldo verificado, y la destrucción libera reservas. Por construcción, el sistema no puede crear dinero sin respaldo.
- **Comisiones (*fee*):** cada operación fiat registra una comisión de servicio y la tasa aplicada, fuente de sostenibilidad del modelo.
- **Tope de emisión:** `MAX_SUPPLY` inmutable como salvaguarda anti-inflacionaria.
- **Transparencia de reservas (recomendado):** publicación periódica de prueba de reservas (*proof of reserves*) auditada, comparando reservas bancarias con el suministro on-chain (que es público y verificable en todo momento).

---

# Capítulo 5. Marco regulatorio y de cumplimiento

**Principio:** HUNBOLI está diseñado para operar *dentro* del marco legal, no al margen de él. Bolivia transitó, en poco más de un año, de la prohibición a un marco habilitante y supervisado para los activos virtuales, lo que hace que esta propuesta sea oportuna y pertinente.

### 5.1. Evolución normativa de los activos virtuales en Bolivia

| Norma | Fecha | Contenido |
|-------|-------|-----------|
| **BCB — Resolución de Directorio N.º 144/2020** | 15/12/2020 | Prohibía a las entidades del sistema financiero el uso de criptoactivos (marco anterior). |
| **BCB — Resolución de Directorio N.º 082/2024** | 25/06/2024 | **Deja sin efecto la RD 144/2020** y habilita el uso de canales e Instrumentos Electrónicos de Pago (IEP) para operaciones de compra y venta de activos virtuales. Emitida en coordinación con ASFI y UIF, en el marco de la Evaluación Mutua de GAFILAT 2024. |
| **ASFI — modificación al Reglamento para la Emisión y Administración de Instrumentos Electrónicos de Pago** | 01/07/2024 (modif. complementaria mediante Resolución ASFI/1099/2024 de 31/10/2024) | Incorpora las operaciones relacionadas con activos virtuales, estableciendo que las transacciones se realizan **a riesgo del consumidor**. |
| **ASFI — Circular ASFI/10881/2024** | 24/07/2024 | Obliga a las entidades financieras a **reportar los flujos** de operaciones con activos virtuales. |
| **UIF — Resolución Administrativa N.º 019/2025** | 16/04/2025 | Crea el **Registro de Sujetos Obligados — Proveedores de Servicios de Activos Virtuales (PSAV)**; obliga a registrarse a quienes realizan actividad comercial con activos virtuales. |
| **Decreto Supremo N.º 5384** | mayo 2025 | Da el marco para la regulación de las Empresas de Tecnología Financiera (FinTech). |
| **ASFI — Reglamento para Empresas de Tecnología Financiera (ETF)** (Resolución ASFI N.º 540/2025; difundido por Circular ASFI/885/2025) | 03/07/2025 | Regula a las empresas que desarrollan **soluciones blockchain, activos tokenizados, activos virtuales y/o prestación de servicios como PSAV**; exige **licencia de funcionamiento**, con plazo de adecuación hasta el **31/12/2025**. |

> _Nota: los números de resolución provienen de fuentes oficiales (BCB) y de análisis legales especializados; algunos números difieren entre fuentes secundarias (p. ej., circular vs. resolución). Antes de la presentación formal, verificar cada número y fecha directamente en los repositorios oficiales del BCB, la ASFI y la UIF._

### 5.2. Encaje de HUNBOLI en el marco vigente

1. **Habilitación normativa (BCB):** la propuesta se apoya en la **Resolución de Directorio del BCB N.º 082/2024, de 25 de junio de 2024**, que dejó sin efecto la RD N.º 144/2020 y habilitó el uso de Instrumentos Electrónicos de Pago para operaciones de compra y venta de activos virtuales a través de canales electrónicos autorizados.
2. **Licenciamiento como ETF/PSAV (ASFI):** HUNBOLI se enmarca en el **Reglamento para Empresas de Tecnología Financiera (ETF)** de la ASFI, que regula expresamente las soluciones blockchain, los activos virtuales y a los Proveedores de Servicios de Activos Virtuales (PSAV). El proyecto contempla obtener la **licencia de funcionamiento** correspondiente y cumplir los plazos de adecuación.
3. **Supervisión prudencial (ASFI):** el modelo es compatible con un rol supervisor de la Autoridad de Supervisión del Sistema Financiero sobre el emisor, las reservas y la conducta de mercado, incluyendo el reporte de flujos exigido por la Circular ASFI/10881/2024.
4. **Prevención de lavado de activos (UIF / GAFI):** KYC obligatorio, trazabilidad total on-chain, capacidad de congelamiento y confiscación, y reportes de operaciones sospechosas. El emisor se inscribiría en el **Registro de PSAV de la UIF (R.A. 019/2025)**. Alineación con las 40 Recomendaciones del GAFI y con las observaciones de GAFILAT.
5. **Protección al consumidor financiero:** respaldo 1:1 verificable, comprobantes, recuperación de fondos enviados por error y reglas claras de redención.
6. **Gobernanza:** custodia multifirma y separación de roles que impiden la emisión unilateral o el abuso interno.

**Propuesta de gobernanza institucional:** se recomienda que las llaves de los roles críticos (`MINTER`, `BURNER`, `PAUSER`, `BLACKLIST_MANAGER`) se distribuyan entre la entidad emisora y, opcionalmente, un observador del regulador, bajo esquema multifirma, dando al Estado **visibilidad y, si se decide, co-control** sobre la emisión.

---

# Capítulo 6. Análisis de impacto y resultados esperados

| Dimensión | Situación actual | Con HUNBOLI |
|-----------|------------------|-------------|
| Inclusión financiera | Acceso limitado, alto uso de efectivo | Billetera desde el móvil con KYC |
| Costo de transferencia | Comisiones y demoras interbancarias | Transferencia casi instantánea de bajo costo |
| Trazabilidad | Flujos informales opacos | Registro inmutable y auditable por operación |
| Soberanía | Uso de stablecoins extranjeras | Instrumento nacional respaldado en Bs |
| Recaudación / formalización | Economía informal amplia | Flujos integrables a la economía formal |
| Supervisión | Difícil sobre cripto extranjero | Congelamiento/confiscación/pausa por diseño |

**Resultados técnicos alcanzados (MVP):** contrato funcional con todos los controles descritos, desplegable en testnet; backend operativo con KYC, validación de depósitos/retiros, custodia multifirma e indexación de eventos; aplicación de usuario funcional para las operaciones principales.

---

# Capítulo 7. Análisis de riesgos y mitigaciones

| Riesgo | Mitigación implementada / recomendada |
|--------|---------------------------------------|
| Emisión sin respaldo / fraude interno | Custodia multifirma (Safe) + separación de roles + emisión solo contra depósito validado |
| Vulnerabilidad en el contrato | Uso de OpenZeppelin auditado; recomendación de auditoría externa certificada antes de producción |
| Pérdida de paridad (*depeg*) | Respaldo 1:1 estricto + tope de suministro + prueba de reservas |
| Uso ilícito (lavado, fraude) | KYC obligatorio + trazabilidad + blacklist + confiscación + reportes |
| Incidente de seguridad operativo | Pausa de emergencia del sistema |
| Custodia de reservas fiat | Cuentas bancarias segregadas y supervisadas; auditoría periódica |
| Dependencia tecnológica de la red | Arquitectura portable (testnet → BNB Chain); posibilidad de red propia/permisionada |

---

# Capítulo 8. Conclusiones y recomendaciones

**Conclusiones.**
1. Se demostró la **viabilidad técnica** de una stablecoin nacional respaldada 1:1, mediante un sistema funcional de tres capas.
2. Es posible **conciliar la tecnología blockchain con la soberanía del Estado**: HUNBOLI incorpora por diseño las facultades de congelar, confiscar y pausar, bajo gobernanza multifirma y auditoría por eventos.
3. El modelo es **pertinente y oportuno** dado el cambio normativo boliviano de 2024 y el uso creciente —pero no supervisado— de stablecoins extranjeras.
4. La propuesta ofrece beneficios concretos en **inclusión, eficiencia, trazabilidad, soberanía y formalización**.

**Recomendaciones.**
- Realizar **auditoría de seguridad externa certificada** del contrato antes de cualquier despliegue en producción.
- Constituir un **esquema de custodia de reservas segregadas** con auditoría independiente y publicación de prueba de reservas.
- Diseñar el **modelo de gobernanza institucional** (distribución de llaves, participación del regulador).
- Iniciar un **piloto controlado (sandbox regulatorio)** con el BCB/ASFI.
- Definir el **marco contractual y de protección al usuario**.

---

# Capítulo 9. Bibliografía

> _Lista preliminar — completar con formato APA 7.ª edición y verificar cada fuente._

- Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System.*
- Buterin, V. (2014). *Ethereum White Paper.*
- Grupo de Acción Financiera Internacional (GAFI). *Las 40 Recomendaciones.*
- Banco de Pagos Internacionales (BIS). Informes sobre stablecoins y CBDC.
- Banco Central de Bolivia (BCB). (2024). *Resolución de Directorio N.º 082/2024*, de 25 de junio de 2024 (deja sin efecto la RD N.º 144/2020). Recuperado de https://www.bcb.gob.bo/webdocs/01_resoluciones/RD%20082%202024.pdf
- Banco Central de Bolivia (BCB). (2024). *Comunicado de Prensa CP35/2024 — Normativa de Activos Virtuales*, 26 de junio de 2024.
- Autoridad de Supervisión del Sistema Financiero (ASFI). (2024). *Modificación al Reglamento para la Emisión y Administración de Instrumentos Electrónicos de Pago* (Resolución ASFI/1099/2024) y *Circular ASFI/10881/2024*.
- Autoridad de Supervisión del Sistema Financiero (ASFI). (2025). *Reglamento para Empresas de Tecnología Financiera (ETF)* (Resolución ASFI N.º 540/2025; Circular ASFI/885/2025), en el marco del Decreto Supremo N.º 5384.
- Unidad de Investigaciones Financieras (UIF). (2025). *Resolución Administrativa N.º 019/2025* — Registro de Proveedores de Servicios de Activos Virtuales (PSAV), 16 de abril de 2025.
- Autoridad de Supervisión del Sistema Financiero (ASFI). Normativa aplicable.
- OpenZeppelin. *Contracts Documentation.*
- Ethereum Foundation. *ERC-20 Token Standard (EIP-20).*

---

# Capítulo 10. Anexos

## Anexo A — Glosario

- **Stablecoin:** moneda digital diseñada para mantener un valor estable, usualmente respaldada por activos.
- **BOBH:** símbolo del token HUNBOLI, con paridad al boliviano.
- **ERC-20:** estándar de tokens fungibles interoperables.
- **Mint / Burn:** emisión / destrucción de tokens.
- **KYC / AML:** verificación de identidad / prevención de lavado de activos.
- **Multisig (Safe):** firma múltiple para autorizar operaciones críticas.
- **Blacklist / Confiscación:** restricción y, en su caso, incautación de fondos por orden competente.
- **Testnet / Mainnet:** red de pruebas / red de producción.
- **Proof of Reserves:** prueba auditable de que las reservas respaldan el suministro.

## Anexo B — Eventos auditables del contrato

`Minted`, `Burned`, `RedemptionRequested`, `RedemptionFinalized`, `RedemptionRejected`, `Confiscated`, `SystemPaused`, `SystemUnpaused`, `AddedToBlacklist`, `RemovedFromBlacklist`, `TokensRecovered`, `Transfer`.

## Anexo C — Diagrama del flujo depósito → emisión (texto)

```
Usuario (KYC OK) ─▶ Transferencia bancaria ─▶ Registro de depósito + comprobante
        │
        ▼
 Operador valida ─▶ Propuesta de mint en Safe ─▶ Firmas (multisig) ─▶ mint() on-chain
        │
        ▼
 Listener capta "Minted" ─▶ Acredita saldo BOBH al usuario   (BOBH = Bs depositados)
```

---

## ⚠️ Advertencias y siguientes pasos (no forman parte del documento académico)

1. **Citas normativas ya incorporadas (Capítulo 5):** BCB RD N.º 082/2024 (25/06/2024), ASFI (Reglamento de IEP modificado, Circular 10881/2024, Reglamento ETF / Resolución ASFI N.º 540/2025) y UIF R.A. N.º 019/2025. **Aun así, confirma cada número y fecha en los repositorios oficiales del BCB, ASFI y UIF** antes de la presentación formal, ya que algunos números varían entre fuentes secundarias (circular vs. resolución).
2. **Completar los datos institucionales** marcados con `[…]` (autor, tutor, universidad, carrera).
3. **Confirmar la paridad de BOBH:** el código sugiere paridad con el boliviano (sufijo BOB) y expansión a PEN; confirmar el diseño monetario definitivo.
4. **Datos cuantitativos:** las tablas de impacto son cualitativas; si tienes cifras reales (usuarios, montos, costos comparados) conviene incorporarlas para fortalecer la sustentación.
5. **Exportación:** este archivo Markdown puede convertirse a Word/PDF (por ejemplo con Pandoc) manteniendo el formato.

---

_Documento elaborado a partir del análisis directo del código fuente del proyecto HUNBOLI (contratos Solidity, backend NestJS/Prisma y frontend Next.js)._
