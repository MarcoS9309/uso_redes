# Security Policy

## Supported Versions

Actualmente soportamos las siguientes versiones con actualizaciones de seguridad:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Reporting a Vulnerability

La seguridad es importante para nosotros. Si descubres una vulnerabilidad de seguridad, por favor repórtala de manera responsable.

### Cómo Reportar

1. **NO** abras un issue público para vulnerabilidades de seguridad
2. Envía un email a [maintainer email] con los detalles
3. Incluye la siguiente información:
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir el problema
   - Impacto potencial
   - Cualquier mitigación temporal que conozcas

### Qué Esperar

- **Confirmación**: Responderemos a tu reporte dentro de 48 horas
- **Investigación**: Investigaremos y verificaremos la vulnerabilidad
- **Resolución**: Trabajaremos en una solución lo más rápido posible
- **Divulgación**: Te mantendremos informado sobre el progreso

### Divulgación Responsable

- Te daremos crédito por el descubrimiento (si lo deseas)
- Coordinaremos la divulgación pública después de que se lance la corrección
- No divulgaremos detalles hasta que esté disponible una solución

## Security Best Practices

### Para Usuarios

- Mantén tu navegador actualizado
- Usa HTTPS cuando sea posible
- No compartas información sensible a través de la aplicación
- Reporta cualquier comportamiento sospechoso

### Para Desarrolladores

- Valida todas las entradas de usuario
- Usa Content Security Policy (CSP)
- Mantén las dependencias actualizadas
- Sigue las prácticas de codificación segura

## Content Security Policy

Este proyecto implementa las siguientes políticas de seguridad:

```
default-src 'self';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
script-src 'self' 'unsafe-inline';
img-src 'self' data:;
```

## Privacy

- No recopilamos datos personales
- No usamos cookies de seguimiento
- Toda la funcionalidad es local al navegador
- No enviamos datos a servidores externos (excepto fuentes de Google)

---

Gracias por ayudar a mantener seguro el proyecto Redes Sociales Responsables.