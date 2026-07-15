# Registro de cambios — SQUAD-AGENTES-IA

<!--
Mantenimiento (recomendaciones):
- Actualiza este archivo en el MISMO pull request / commit que el cambio funcional.
- Una entrada por cambio notable; evita listados enormes: agrupa lo menor bajo una sola viñeta.
- Usa [Unreleased] para trabajo ya en main pero sin etiqueta; al publicar, renombra a [X.Y.Z] con fecha ISO (YYYY-MM-DD).
- Sigue SemVer (MAJOR.MINOR.PATCH): rupturas → MAJOR; compatible hacia atrás → MINOR; solo correcciones → PATCH.
- Prefija viñetas con **Ámbito** (Núcleo, Docs, Tooling, Config) para que el changelog único siga siendo legible.
- Generadores (release-please, changesets, conventional changelog): pueden anteponerse a este formato; revisa que las categorías sigan alineadas.
- Para KIRO: en cada release, completa "Notas para migración a KIRO" solo si hay impacto (API, config, dependencias, flujos).
-->

Este documento registra cambios **relevantes** para todos los ámbitos versionados dentro del repositorio **SQUAD-AGENTES-IA** (núcleo de tests y scripts, documentación y herramientas). El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto adhiere al [Versionamiento semántico (SemVer)](https://semver.org/lang/es/).

## Ámbitos incluidos en este registro

| Ámbito | Descripción breve |
|--------|-------------------|
| **Núcleo** | Paquete raíz, Playwright, Vitest, scripts en `scripts/`, configuración de pruebas |
| **Docs** | Contenido en `docs/`, diagramas, onboarding |
| **Tooling** | Scripts en `tools/scripts/`, automatización y reportes |
| **Config** | Plantillas, `platforms.example.json`, reglas Cursor (cuando afecten uso del repo) |

El número de versión del changelog puede alinearse con `version` en `package.json` del núcleo o con etiquetas Git; documenta en cada release qué etiqueta corresponde.

## [Unreleased]

### Agregado

- **Docs** Se creó reporte ejecutivo para Presidencia (`docs/reporte-presidencia-julio-2026.html`): informe narrativo con KPIs, logros del primer semestre, proyectos en progreso, desafíos superados, riesgos activos y timeline del segundo semestre 2026

### Cambiado
- **Núcleo** Se refactorizó `scripts/generate-portfolio-v3.js` para obtener épicas en tiempo real desde la API de Jira en lugar de usar un array estático hardcodeado. Nueva regla de alcance: incluir TODAS las épicas hijas de iniciativas activas sin filtrar por duedate (2025 o 2026). Se agregó soporte multi-iniciativa para GD981 (3 padres: GD981-1007, GD981-1037, GD981-1705).

### Eliminado

- **Tooling** Se excluyó GD-976 (Ciber 5.0 SSE) del dashboard de portafolio — es tipo Excelencia Operativa (EO), no Proyecto

### Cambiado

- **Docs** Se actualizó `docs/diagnostico-backlog-portafolio.html` con datos del 14 de julio: GD-903 (épica cancelada, 2 pasaron a En Progreso), GD-981 (18 épicas, 4 nuevas descubiertas), alertas de vencimiento actualizadas
- **Tooling** Se mejoró `scripts/generate-portfolio-v3.js`: columna "Nombre del Proyecto" en tablas de Bloqueos y Aging, botones "Copiar para Sheets" en tablas de Alertas/Bloqueos/Aging, y función genérica `copyTable` que reemplaza `copyInconsTable`

### Agregado

- **Docs** Se generó reporte ejecutivo de portafolio de proyectos (`docs/portafolio-proyectos.html`): dashboard HTML con 16 proyectos de Gestión de la Demanda, KPIs, semáforo visual, tabla sortable y alertas de vencimiento
- **Núcleo** Se agregó MCP `pdf-mcp` al Knowledge Scout para lectura de documentos PDF con búsqueda semántica, OCR y extracción paginada

### Corregido

- **Tooling** Se actualizaron duedates de GD-903 según Jira: GD903-310 (2026-06-12), GD903-321 (2026-05-22), GD903-407 (2026-06-19), GD903-409 (2026-07-10); GD903-407 y GD903-409 pasaron de 'porhacer' a 'prog'
- **Config** Se corrigió el sistema de memoria de agentes y el Auditor que no funcionaban. Hooks `memory-commit-enforcer` (v3), `auditor-post-task` (v2) y `memory-write-guard` (v2) corregidos: cambiado trigger de `postTaskExecution` a `agentStop` para cubrir modo conversacional, y convertido formato YAML inválido a JSON válido.

### Agregado

- **Docs** Se documentó la Estrategia de LLMs Anti-Sesgo de Confirmación en `5-agents-functional-architecture.md` y `6-inventario-agentes.md`: decisión arquitectónica de usar Gemini para el Auditor vs Auto/Kiro para el resto del enjambre
- **Docs** Se documentó el Sistema de Memoria del Enjambre en ambos documentos de arquitectura: estructura de carpetas, reglas de acceso, hooks de enforcement y flujo memoria-auditoría
- **Config** Se registró reporte Power BI "INS - NPS" en `Workspace/config/platforms.json` como reporte transversal (scope: Todas las plataformas) en sección `shared.bi.powerbi`
- **Núcleo** Se agregó agente #18 Auditor (Quality Reviewer) al enjambre: modelo Gemini, audita calidad del trabajo de agentes, escribe en `Workspace/memory/auditor/`
- **Docs** Se registró Auditor en inventario (`6-inventario-agentes.md`), orquestador (`00-swarm-orchestrator.md`) y README
- **Núcleo** Se agregó hook `memory-write-guard` a la tabla de Calidad de código del inventario
- **Docs** Se agregó agente #16 Comms Analyst al inventario (`6-inventario-agentes.md`): especialista en comunicaciones Infobip (WhatsApp, SMS, Email, 2FA, People)
- **Docs** Se agregó hook `infobip-mcp-guard` a la sección de hooks de enforcement del inventario
- **Docs** Se agregó restricción MCP de Infobip en tabla del Orquestador (`00-swarm-orchestrator.md`)
- **Docs** Se creó plan de implementación de Agent Harness Engineering (`docs/plans/plan-agent-harness-engineering.md`): 4 fases para cubrir gaps de observabilidad, stop conditions, auto-evolución, context compaction y sandbox
- **Núcleo** Se creó agente #17 Harness Engineer (`agent-harness-engineer.md`): especialista en infraestructura interna del enjambre (scripts, hooks, telemetry, config)
- **Núcleo** Se implementó Fase 1.1 — Harness Telemetry Logger (`scripts/harness-telemetry/`): telemetry-store.js, telemetry-report.js, index.js
- **Núcleo** Se implementó Failure Pipeline (`scripts/harness-evolution/`): failure-classifier.js, improvement-proposer.js, analyze-failures.js, index.js — clasifica fallos de telemetría y genera propuestas de mejora del harness
- **Núcleo** Se implementó Fase 1.2 — Stop Conditions (`08-stop-conditions.md` + `stop-conditions-guard.kiro.hook`): límites de 50 tool calls, 3 errores consecutivos, checkpoints cada 20 acciones
- **Config** Se agregó script `npm run harness:report` para generar reporte de telemetry del harness
- **Núcleo** Se implementó Fase 2.1 — Failure Pipeline (`scripts/harness-evolution/`): failure-classifier.js, improvement-proposer.js, analyze-failures.js
- **Núcleo** Se implementó Fase 2.2 — Context Compaction Strategy (`09-context-compaction.md`): reglas de carga JIT, compaction en tareas largas, señales de saturación, anti-patrones
- **Config** Se agregó script `npm run harness:analyze` para analizar fallos y generar propuestas de mejora
- **Núcleo** Se implementó Fase 3 — Execution Boundaries: `filesystem-scope-guard.kiro.hook` (scope de escritura por agente) + `command-allowlist-guard.kiro.hook` (allowlist de comandos shell por agente)
- **Núcleo** Se implementó Fase 4 — Harness Dashboard (`tools/scripts/generate-harness-dashboard.js`): genera `docs/harness-dashboard.html` con métricas de actividad, enforcement, propuestas y dark theme
- **Config** Se agregó script `npm run harness:dashboard` para generar dashboard HTML del harness
- **Núcleo** Se implementó Fase 5 — Sistema de Memorias y Auditor: estructura `Workspace/memory/` (16 carpetas), Agente Auditor #18 (Gemini), hook `memory-write-guard`, steering `10-memory-audit-protocol.md`
- **Núcleo** Se creó agente #18 Auditor/Quality Reviewer (`agent-auditor.md`): modelo Gemini, revisa trabajo de todos los agentes, emite juicios de calidad, max 2 ciclos de corrección
- **Docs** Se creó plan de implementación del Ralph Loop para Kiro CLI (`docs/plans/plan-ralph-loop-kiro-cli.md`): patrón de ejecución autónoma con fresh context por iteración, integración con harness y auditor
- **Núcleo** Se implementó Ralph Loop: `scripts/ralph-loop/afk-ralph.sh` (loop principal), `ralph-once.sh` (debug), `ralph-prompt-template.md`, README
- **Núcleo** Se creó skill `ralph-loop` (`.kiro/skills/ralph-loop/SKILL.md`): ejecución autónoma de specs
- **Config** Se agregaron scripts `npm run ralph` y `npm run ralph:once`

### Cambiado

- **Núcleo** Se rediseñó skill `ralph-loop` como habilidad del Orquestador con delegación a especialistas (Chain-of-Thought → subagente → verificación → loop). Script bash se mantiene como fallback overnight.
- **Tooling** Se creó script `tools/scripts/generate-harness-dashboard.js`: genera HTML autocontenido con métricas del harness (eventos por agente/tool, tasas éxito/fallo, enforcement, propuestas)

### Cambiado

- **Docs** Se actualizó README: tabla de agentes ampliada de 9 a 16 agentes con nombres oficiales, hooks de 16 a 19, y tabla de steering files con los 16 agent steerings
- **Docs** Se corrigieron nombres de agentes en README (Scout→Knowledge Scout, Guardian→Test Engineer, GitHub Repos→Platform Analyst, Cloud Datadog→Cloud SRE)

### Agregado

- **Docs** Se actualiz&oacute; inventario funcional de MIA (`inventario-funcional-mia.html`) con datos descubiertos en repos: 12 agentes, 8 endpoints REST, microfrontend Angular (NX + Module Federation), stack actualizado (Gemini 2.5 Flash Lite, langgraph-supervisor/swarm, ReportLab, BeautifulSoup, Pinecone), Research Agent, y 5 integraciones nuevas (MongoDB, DuckDuckGo, AWS S3, Pinecone, AWS Cognito)

- **Docs** Se actualizó inventario funcional de MIA Agente IA (`Workspace/ciencuadras/MIA Agente IA/inventario-funcional-mia.html`) con información extraída de Jira: sección de equipo (5 personas core + soporte), infraestructura (n8n, AWS Lambda, Redis, Langfuse, Dapta), canal de Voz por Dapta, integraciones actualizadas (Salesforce Data Cloud, n8n como orquestador), épicas principales y pendientes refinados
- **Docs** Se generó reporte de levantamiento Jira (`Workspace/ciencuadras/MIA Agente IA/jira-mia-levantamiento.md`) con análisis de 2848+ issues del proyecto MIA

- **Núcleo** Se creó el agente #14 **BI Strategist** (Estratega de Inteligencia de Negocios) para análisis de cifras con conexión a Power BI y Looker
  - Steering: `.kiro/steering/agent-bi-strategist.md`
  - Hook de enforcement: `.kiro/hooks/bi-mcp-guard.kiro.hook`
  - Registrado en inventario (`docs/architecture/6-inventario-agentes.md`) y orquestador (`00-swarm-orchestrator.md`)

- **Config** Se integró MCP Langfuse al Squad de agentes. Se creó el agente **Prompt Ops** (#13) como especialista en gestión operativa de prompts de producción (consulta, auditoría e inventario vía Langfuse). Steering: `.kiro/steering/agent-prompt-ops.md`. Hook de guard: `.kiro/hooks/langfuse-mcp-guard.kiro.hook`. Actualizado orquestador e inventario.

- **Workspace** Se creó carpeta `Workspace/ciencuadras/MIA Agente IA/` con inventario funcional completo del agente MIA (Asistente Inmobiliaria IA de Ciencuadras). Incluye: (1) README con contexto general, (2) `arquitectura-mia.md` con arquitectura multi-agente documentada (46 prompts, 4 agentes core, 5+ outbound, 10+ tools, 6 integraciones), (3) `inventario-funcional-mia.html` — reporte interactivo HTML con 8 tabs (Negocio, Agentes, Flujos, Tools, Integraciones, Reglas, Métricas, Pendientes). Información extraída de Langfuse MCP (proyectos MIA_PROD/MIA_TEST) y ciencuadras.com.

- **Tooling** Se creó CLI interactivo de onboarding (`scripts/onboard-platform.js`) — wizard paso a paso que genera estructura de carpetas, `platforms.json`, README y steering para nuevas plataformas siguiendo jerarquía Tribu → Squad → Plataforma
- **Docs** Se creó formulario HTML de onboarding (`docs/onboarding/formulario-onboarding.html`) — alternativa visual para POs no técnicos que genera JSON descargable compatible con el enjambre de agentes
- **Config** Se actualizó template `docs/templates/platforms.example.json` con jerarquía Tribu/Squad, campos de Clarity, AWS, URLs de tableros de incidentes y metadata de onboarding

- **Docs** Se creó `Workspace/Migración Huella/investigacion-sa-web-portal-eli.md` — documento de investigación estructurado para desbloquear ADR-003 y ADR-007. Incluye: (1) análisis de SA Web (embebidos iFrame, funcionalidades, gaps críticos, preguntas técnicas, plan de investigación en 3 fases), (2) análisis de Portal ELI (protocolo de comunicación, capacidad de cambiar endpoint, regla 4-2-10, plan de cutover), (3) matriz de dependencias, (4) próximos pasos priorizados. Documento agnóstico, reutilizable para cualquier plataforma.

- **Docs** Se creó `Workspace/Migración Huella/profundizacion-business-rules-huella.md` — profundización de Business Rules con 3 tareas: (1) verificación de acceso al Service Console (URL funcional confirmada: `ellibertador.cfg`), (2) análisis del editor de reglas de Bitácora (limitación técnica: widget propietario no accesible via DOM/API), (3) confirmación de 10 objetos con reglas configurables. Incluye catálogo completo de Custom Objects (CO, CO1, Siniestro, CampanaSMS, etc.) y recomendaciones para completar extracción via Service Console nativo o export.

- **Docs** Se agregó pestaña "WS Core" al inventario funcional de Huella (`inventario-funcional-huella.html`) con análisis completo del repositorio `libertador-sai-huella-ws-core-wl`: resumen del servicio (Java 1.8 + Spring Boot 2.7.5), patrón de integración REST, catálogo de 23 objetos Oracle Service Cloud, 19 DTOs (~519 campos), base de datos local (26 tablas MIG_* + 20 vistas V_CRM_*), flujo de procesamiento asíncrono y 22 endpoints. Se actualizaron stat-cards del header y se copió a `docs/` para GitHub Pages.

- **Docs** Se creó `Workspace/Migración Huella/flujo-busqueda-siniestro.md` — documentación completa del flujo de búsqueda de siniestro vía UI (módulo Reportes), incluyendo ruta de navegación, 8 filtros disponibles, 14 columnas de resultado, acciones de barra de herramientas, 23 reportes relacionados, valores de dominio y consideraciones de migración. Volumetría: 789,717 siniestros. Evidencias capturadas en `evidencias/`.

- **Docs** Se creó `Workspace/Migración Huella/mapa-integraciones-huella.md` — mapa completo de 9 integraciones activas de Huella (SAI, Base de Terceros, Módulo Jurídico, Microservicio ImagineCX, SA Web embebidos, Proveedor SMS, Correo Oracle, ELI, Oracle Cloud) con arquitectura, flujos de datos, impacto en migración y decisiones arquitectónicas pendientes

- **Docs** Se creó plan de extracción de reglas de negocio para Migración Huella (`Workspace/Migración Huella/plan-extraccion-reglas-negocio.md`) — taxonomía de 8 tipos de reglas, estrategia en 4 fases, reglas inferidas del análisis de Custom Objects y riesgos identificados

- **Docs** Se publicó `inventario-funcional-huella.html` (versión completa con 4 tabs: Negocio, Operación, Arquitectura, Desarrollo) en GitHub Pages: https://carlospatinovelez19.github.io/inventario-huella/

- **Docs** Se agregó pestaña "Gaps & Plan" al inventario funcional de Huella con validación contra documentación oficial de Oracle B2C Service: 9 gaps críticos identificados, 10 objetos SC adicionales no documentados, 6 componentes del Agent Desktop faltantes, plan de levantamiento en 5 semanas con 13 acciones priorizadas y referencias a documentación oficial Oracle

- **Docs** Se definieron las 7 decisiones arquitectónicas de Migración Huella y se documentaron como ADRs en `docs/decisions/`: ADR-001 (Mantener bus on-premise), ADR-002 (Reescribir microservicio ImagineCX), ADR-003 (Replicar SA Web con UI propia), ADR-004 (SMS via Salesforce), ADR-005 (Correo via Salesforce), ADR-006 (AWS Step Functions como motor BPM), ADR-007 (Mantener Portal ELI). Se actualizó el inventario funcional HTML con tabla de decisiones resueltas y diagrama de arquitectura target

- **Config** Se creó steering agnóstico `07-validacion-inventarios.md` con 7 reglas transversales para validación de inventarios funcionales: cruce contra docs oficiales del vendor, lógica de negocio invisible, cruce código vs documentación, completitud por capas, búsqueda web como validación, modo validación del Orquestador, y formato de entregable de gaps

- **Docs:** Se creó `Workspace/Migración Huella/procesos-bpmn-huella-analisis.md` con análisis detallado de 5 diagramas BPMN (Desistimiento, Cobranza Jurídica, Cobranza Pre-Jurídica, Desocupación, Proceso General) incluyendo actores, flujos, reglas de negocio, Custom Objects involucrados, integraciones y gaps documentales
- **Docs:** Se actualizó `Workspace/Migración Huella/contexto-plataforma-huella.md` con referencia cruzada al nuevo análisis de procesos BPMN

- **Tooling** Se creó `explore-incident-ui.js` para exploración de siniestros via UI con Playwright. Resultado: login exitoso, búsqueda funcional, formulario requiere más tiempo de carga (Oracle JET async). Schema de incidents documentado por inferencia.
- **Docs** Se agregó sección "Detalle de Grupos" y "Estado de Incidents" al inventario API de Huella (`Workspace/Migración Huella/inventario-api-huella.md`) con resultados de extracción de grupos detallados y conclusiones sobre permisos de incidents

- **Docs** Se creó `Workspace/Migración Huella/levantamiento-pendiente-huella-qa.md` — levantamiento completo de Business Rules (10 objetos configurables, 7 reglas en Bitácora), catálogo de 173 objetos SC (37 estándar + 136 custom en 7 paquetes), validación de queries ROQL funcionales via API REST, y documentación de limitaciones de acceso para Workspace Rules y Guided Assistance

- **Docs** Se exportaron Business Rules de los 10 objetos de Oracle Service Cloud. Solo Bitácora (Incident) tiene reglas configuradas (9 reglas con condiciones IF/THEN completas). Se descubrió endpoint API interno para automatizar exports. Se verificó perfil Administrador (ID:3) y se documentó bloqueo de Admin Console (/ci/admin/) por falta de permiso "Customer Portal Administration"

- **Docs** Se creó `Workspace/Migración Huella/contratos-integracion-bus-sai.md` — consolidación de contratos de integración del bus de servicios SAI↔Huella. Hallazgos: (1) bus confirmado como Oracle Service Bus (OSB) con 6 nodos, (2) endpoint principal SOAP descubierto (`MigracionPS`), (3) 23 endpoints REST del middleware ws-core documentados con mapeo a Custom Objects, (4) flujo completo SAI→OSB→ws-core→Huella confirmado, (5) 8 repos del ecosistema identificados en GitHub, (6) equipo Capa Media (`cmedia`) identificado como responsable del OSB. Gaps: WSDL completo, transformaciones del OSB, estructura de tabla `Mig_Movimientos_Crm`, adjuntos de GD890-54 (Arquitectura.PNG + Postman collection)

- **Docs** Se agregó pestaña "Business Rules" al inventario funcional HTML (`docs/inventario-funcional-huella.html`) con: estado de reglas por objeto, flujo de estados, detalle de 9 reglas (5 activas + 4 disabled), tabla de accesibilidad Workspace Rules/Guided Assistance, endpoint API descubierto e implicaciones para migración
- **Docs** Se actualizó sección "Próximos pasos" del inventario API de Huella reflejando progreso completado (COs, relaciones, datos de muestra) y nuevos pasos pendientes

- **Workspace/Mercadeo & Relacionamiento Contextual:** Se creó carpeta `personalization-salesforce/` para la iniciativa de Salesforce Personalization (Evergage) en Ciencuadras. Incluye README y análisis técnico de rendimiento del script (`analisis-rendimiento-script-evergage.md`) con diagnóstico del problema actual, comparación de scripts, recomendación de uso de `defer` + `preconnect`, y mejoras adicionales de performance.

- **Docs** Se creó `Workspace/Migración Huella/schemas-custom-objects-huella.md` con documentación completa de los 13 Custom Objects extraídos via API REST: tablas de campos (326 campos totales), tipos, FKs, modelo de relaciones, consideraciones de migración a PostgreSQL y patrones transversales identificados.
- **Docs** Se creó `Workspace/Migración Huella/inventario-api-huella.md` con inventario completo de datos extraídos via API REST (13 Custom Objects, 40 grupos, 192 recursos API)
- **Docs** Se actualizó `contexto-plataforma-huella.md` con sección "Datos Extraídos via API (Mayo 2026)"
- **Docs** Se actualizó `inventario-navegacion-huella-qa.md` con complemento de datos API (6 grupos nuevos, 13 COs)

- **Config** Se implementó modelo de gestión de credenciales multi-aplicación para agentes: template `docs/templates/credentials.example.json`, helper `scripts/get-credentials.js` y exclusión en `.gitignore`. Permite a los agentes acceder a credenciales de forma segura para tests E2E, APIs y login web en ambientes local/QA/staging sin hardcodear secretos.

- **Docs** Se creó inventario completo de perfiles de la plataforma Huella (`Workspace/Migración Huella/inventario-perfiles-huella.md`) con 40 perfiles identificados, clasificación funcional, estructura de permisos y recomendaciones para migración
- **Docs** Se reconstruyó `Workspace/Migración Huella/inventario-funcional-huella.html` — HTML interactivo autocontenido (990 líneas) con 4 vistas por audiencia (Negocio, Operación, Arquitectura, Desarrollo), 19 módulos colapsables, 155+ funcionalidades con checkboxes, persistencia localStorage, búsqueda de schemas, modelo de relaciones, propuesta PostgreSQL, estrategia de migración en 6 fases, contador flotante de progreso y diseño responsive.
- **Docs** Se extrajo contenido completo de la sesión de Reportes Parte 2 Huella (2025-07-24) desde Google Drive (ID: `1LBer8d12tczqAx81EwqOrL5J6NYMH7wgFOh88q3ZXBc`) y se guardó en `Workspace/Migración Huella/sesiones/2025-07-24-reportes-parte-2-huella.md` con notas de Gemini y transcripción. Reemplaza el placeholder anterior.
- **Docs** Se extrajo contenido completo de la sesión de Reglas de Negocio Huella (2025-07-29) desde Google Drive y se guardó en `Workspace/Migración Huella/sesiones/2025-07-29-reglas-negocio-huella.md` con encabezado, notas de Gemini (resumen + detalles), transcripción íntegra y fuente con ID de Drive.
- **Docs** Se extrajo contenido completo de la sesión de Integraciones Huella (2025-07-28) desde Google Drive y se guardó en `Workspace/Migración Huella/sesiones/2025-07-28-integraciones-huella.md` con notas de Gemini y transcripción íntegra.
- **Docs** Se creó estructura `Workspace/Migración Huella/sesiones/` con 16 archivos markdown placeholder para las Notas de Gemini de sesiones de capacitación de Huella (julio-agosto 2025). Los archivos incluyen metadata (fecha, hora, participantes, IDs de Drive) y están pendientes de extracción manual del contenido — los shortcuts de Google Drive apuntan a documentos de Google Meet/Gemini inaccesibles vía API.
- **Config** Se configuró MCP server oficial de Google Drive (`drivemcp.googleapis.com`) usando `mcp-remote` como proxy OAuth en `~/.kiro/settings/mcp.json`. Tools habilitadas: `search_files`, `read_file_content`, `list_recent_files`, `get_file_metadata`, `get_file_permissions`.
- **Config** Se creó Service Account `kiro-drive-reader` en GCP para acceso a Google Drive sin OAuth interactivo (bypass de restricciones corporativas).
- **Config** Se redistribuyeron capacidades del enjambre de agentes (v2): Scout → Knowledge Scout (Jira + Confluence + Google Drive + AWS Docs), GitHub Repos → Platform Analyst, Angular Developer + Figma Power, Cloud SRE/Infra + AWS Docs.
- **Config** Se creó hook `google-drive-guard` para restringir uso del MCP Google Drive al Knowledge Scout.
- **Config** Se actualizaron agentes CLI: `scout.json` → `knowledge-scout.json` (con MCPs google-drive y aws-docs), `github-repos.json` → `platform-analyst.json`.

### Cambiado
- **Docs** Se actualizaron steering files del orquestador, Knowledge Scout, Platform Analyst, Angular Developer, Cloud SRE y Cloud Infra con nuevos MCPs y nombres.
- **Docs** Se actualizaron hooks `swarm-delegation-enforcer` y `github-mcp-guard` con nombres de agentes actualizados.
- **Workspace/Migración Huella:** Se movieron `huella-perfil-administrador.png` y `huella-perfiles-tab.png` de la raíz del proyecto a `Workspace/Migración Huella/` para mantener la organización del workspace

### Corregido

- **Config:** Se refactorizó `pagespeed-daily-audit.kiro.hook` (v1→v2) para eliminar URLs hardcodeadas de Ciencuadras y hacerlo agnóstico. Ahora lee URLs desde `platforms[].auditZones` y `platforms[].urls.app` en `platforms.json`, reutilizable para cualquier plataforma.
- **Config:** Se reconfiguró MCP Google Drive de OAuth interactivo (`mcp-remote` + `drivemcp.googleapis.com`) a Service Account local (`scripts/mcp-gdrive-sa.cjs`). Fix definitivo para `ERR_CONNECTION_REFUSED localhost:27844` causado por proxy/firewall corporativo. Documentación en `docs/config/mcp-google-drive-setup.md`.

### Cambiado

- **Workspace/El Libertador:** Se actualizó el reporte de performance (`analisis-performance-libertador.md`) con las URLs completas y tamaños de los 38 assets multimedia (5 videos, 14 imágenes PNG/JPG, 15 SVGs iconos, 4 SVGs decorativos) capturados desde la red del sitio en producción. Se descubrió que los 3 videos de testimoniales suman 192.3 MB sin comprimir.

### Added

- **Workspace** Se creó `Workspace/Informe Seguimiento El Libertador/` con informe HTML ejecutivo de seguimiento para VP Sponsor (4 carriles: Apificación, Experiencia Digital, Autogestión, Victoria)

- **Config** Se creó workspace `Workspace/Venta-Soat-Proyectiva/` con estructura de proyecto (config/platforms.json, plans/, README.md) vinculado al tablero Jira GD1137/board 6692

- **Tooling** Se creó `Workspace/Migración Huella/scripts/huella-cli/` — CLI con Playwright para explorar la plataforma Huella (Oracle Service Cloud). Comandos: login, explore, screenshot, extract-grid, extract-menu, extract-forms, full-scan. Node.js 20+ ESM, dependencias pinned (playwright 1.44.1, commander 12.1.0), manejo de frames/iframes, múltiples estrategias de extracción de datos, output con colores.

- **Docs** Se actualizó `docs/inventario-funcional-huella.html` con nueva pestaña WS Core — análisis completo del repositorio `libertador-sai-huella-ws-core-wl` (23 objetos Oracle SC, 519 campos DTO, patrón de integración, endpoints, BD local)
- **Config:** 16 Agent Hooks en `.kiro/hooks/` para enforcement de segregación de funciones del enjambre de agentes:
  - 7 guards de control de acceso MCP (preToolUse): `atlassian-write-guard`, `clarity-mcp-guard`, `datadog-mcp-guard`, `chrome-devtools-guard`, `playwright-mcp-guard`, `github-mcp-guard`, `drawio-mcp-guard`
  - 3 guards de seguridad (preToolUse): `secrets-guard`, `git-safety-guard`, `jira-metadata-check`
  - 1 hook de delegación (promptSubmit): `swarm-delegation-enforcer`
  - 5 hooks de calidad (fileEdited/fileCreated/postToolUse/postTaskExecution): `hardcoded-data-validator`, `doc-updater-reminder`, `agnostico-particular-check`, `lint-on-save`, `post-task-tests`

### Changed

- **Docs:** Actualizado `README.md` — sección Hooks de Agentes refleja los 16 hooks reales; corregido agente autorizado de Draw.io MCP (Doc Updater, no Orquestador).

### Agregado

- **Jira:** Se creó Historia de Usuario GD1137-851 — "Correcciones de errores identificados en el Portal Web Libertador — Iteración 5" con 17 criterios de aceptación en formato ADF, asociada a épica GD1137-4, fixVersion Iteración 5.
- **Docs:** Actualizado `docs/architecture/6-inventario-agentes.md` — sección Hooks de enforcement con archivos, categorías y propósitos reales.

### Agregado

- **Workspace/Proyectiva & El Libertador:** Se generó reporte completo de análisis de performance para https://www.libertador.com/ con auditorías Lighthouse (desktop/mobile), Performance Trace, Core Web Vitals y 9 recomendaciones priorizadas (`reports/analisis-performance-libertador.md`)
- **Workspace/Proyectiva & El Libertador:** Se capturaron 3 evidencias gráficas: screenshot desktop full-page, screenshot mobile (375x812), screenshot viewport desktop (`evidencias/`)

### Deprecated

### Removed

### Fixed

- **Docs:** Eliminadas referencias a hooks inexistentes en README (`devtools-mcp-guard`, `agnostic-write-validator`, `readme-auto-updater`).

### Security

- **Config:** Hook `secrets-guard` previene escritura de credenciales hardcodeadas en código fuente.
- **Config:** Hook `git-safety-guard` exige dry-run o stash antes de operaciones git destructivas (basado en incidente real).

### Notas para migración a KIRO

- Los 16 hooks en `.kiro/hooks/` se versionan con el repo y se cargan automáticamente en Kiro al clonar. No requieren configuración manual por usuario.

---

## [1.0.0] — 2026-03-28

Versión de referencia inicial alineada con el núcleo publicado como `1.0.0` en `package.json`. Los datos de ejemplo siguientes son **ilustrativos**; sustitúyelos por tu historial real al adoptar el archivo.

### Added

- **Núcleo:** Proyecto Playwright con smoke agnóstico y artefactos bajo `tests/`.
- **Núcleo:** Scripts npm para auditoría de consola (`audit`) y Lighthouse opcional (`audit:lighthouse`).
- **Docs:** Guía de primera interacción y arquitectura de workspace en `docs/`.
- **Tooling:** Generador de reporte HTML de ciclo y despliegue asistido a GitHub Pages.
- **Config:** Plantilla `platforms.example.json` para configuración por plataforma.

### Changed

- **Núcleo:** Configuración de `baseURL` y rutas de informes mediante variables de entorno y `platforms.json` (sin URLs fijas en código).
- **Docs:** Estructura de documentación alineada con enfoque agnóstico por plataforma.

### Deprecated

- **Núcleo:** *(ejemplo)* Uso directo de `LEGACY_REPORT_PATH`; sustituir por `WORKSPACE_ROOT`-aware paths en próximas minor.

### Removed

- *(ejemplo ficticio)* **Tooling:** Script experimental `tools/scripts/old-migrate-paths.cjs` retirado tras estabilizar `workspace-root.js`.

### Fixed

- **Núcleo:** *(ejemplo)* Manejo de timeouts en smoke cuando el `baseURL` devolvía redirecciones encadenadas.
- **Docs:** Enlaces rotos en diagramas exportados a HTML.

### Security

- **Config:** *(ejemplo)* Documentación actualizada para no incluir secretos en `platforms.json` versionado; usar variables de entorno o secret manager.

### Notas para migración a KIRO

Relevancia para una futura migración a **KIRO** (personalizar según tu definición de KIRO: producto, plataforma interna, o estándar de referencia):

| Tema | Relevancia |
|------|------------|
| **Compatibilidad de runtime** | Node.js 18+ requerido; validar equivalente en el entorno KIRO. |
| **Contratos de configuración** | Lectura centralizada desde `WORKSPACE_ROOT` y `platforms.json`; cualquier adaptador KIRO debe mapear estas rutas y variables. |
| **Dependencias** | `playwright`, `vitest`, `eslint`, `prettier` en versiones fijadas en el lockfile; revisar políticas de aprobación en KIRO. |
| **Breaking changes** | Ninguno declarado en 1.0.0 de ejemplo; en releases futuros, lista aquí APIs o env vars eliminadas. |

---

## Plantilla rápida por versión (copiar al publicar)

<!--
Al crear [X.Y.Z], pega y completa:

## [X.Y.Z] — YYYY-MM-DD

### Added
- **Ámbito:** …

### Changed
- …

### Deprecated
- …

### Removed
- …

### Fixed
- …

### Security
- …

### Notas para migración a KIRO
- …
-->

<!--
Enlaces tipo Keep a Changelog (opcional). Sustituye OWNER/REPO por tu remoto:
[Unreleased]: https://github.com/OWNER/REPO/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/OWNER/REPO/releases/tag/v1.0.0
-->
