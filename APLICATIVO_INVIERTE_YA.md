# 📈 Invierte Ya - Aplicativo de Gestión de Fondos de Inversión

## 🎯 Descripción General

**Invierte Ya** es una plataforma digital para la gestión de fondos de inversión que permite a los usuarios:

- 👤 Registrarse y autenticarse en el sistema
- 💰 Depositar dinero en su cuenta personal
- 📊 Explorar y suscribirse a diferentes fondos de inversión
- 📈 Gestionar sus inversiones y suscripciones
- 📋 Consultar su historial de transacciones
- 🔔 Recibir notificaciones por email o SMS

## 🏗️ Arquitectura del Sistema

El aplicativo está construido con una arquitectura moderna que incluye:

### Frontend
- **React + TypeScript**: Interfaz de usuario moderna y tipada
- **Vite**: Herramienta de build rápida y eficiente
- **CSS moderno**: Estilos responsivos y atractivos

### Backend API
- **API RESTful**: Endpoints bien estructurados y documentados
- **Autenticación JWT**: Sistema seguro de tokens Bearer
- **Base de datos**: Almacenamiento persistente de usuarios, fondos y transacciones
- **Despliegue en AWS**: Infraestructura escalable en la nube

## 💼 Funcionalidades Principales

### 🔐 Sistema de Autenticación
- **Registro de usuarios**: Creación de cuentas con email y teléfono
- **Inicio de sesión**: Autenticación segura con JWT
- **Gestión de sesiones**: Tokens automáticos para requests autenticadas

### 💳 Gestión Financiera
- **Depósitos de dinero**: 
  - Monto mínimo: $10,000 COP
  - Monto máximo: $10,000,000 COP
  - Actualización automática del balance
- **Consulta de saldo**: Visualización en tiempo real del dinero disponible
- **Historial de transacciones**: Registro completo de movimientos

### 📊 Fondos de Inversión

#### Tipos de Fondos Disponibles:
1. **FPV (Fondos de Pensiones Voluntarias)**
   - Orientados al ahorro para pensión
   - Beneficios tributarios
   
2. **FIC (Fondos de Inversión Colectiva)**
   - Diversificación de inversiones
   - Gestión profesional de portafolios

#### Operaciones con Fondos:
- **Listar fondos**: Ver todos los fondos disponibles con sus características
- **Suscripción a fondos**: Invertir en fondos seleccionados
- **Cancelación de suscripciones**: Retirar inversiones cuando sea necesario
- **Consulta de suscripciones activas**: Ver el portafolio actual

### 👤 Gestión de Usuario
- **Perfil de usuario**: Información personal y preferencias
- **Preferencias de notificación**: Configuración de EMAIL o SMS
- **Historial completo**: Acceso a todas las transacciones realizadas

## 🛠️ Herramientas de Desarrollo

### 🧪 Testing con Bruno
El proyecto incluye una colección completa de Bruno para testing de la API:

#### Estructura de Tests:
```
bruno/
├── Auth/                    # Autenticación
│   ├── Login.bru           # Inicio de sesión
│   └── Register.bru        # Registro de usuarios
├── Funds/                   # Gestión de fondos
│   ├── List Funds.bru      # Listar fondos
│   ├── Subscribe to Fund.bru # Suscribirse
│   └── Cancel Subscription.bru # Cancelar
├── Users/                   # Gestión de usuarios
│   ├── Get User Info.bru   # Información del usuario
│   ├── Deposit Money.bru   # Depositar dinero
│   ├── Get User Subscriptions.bru # Ver suscripciones
│   └── Get User Transactions.bru # Historial
└── environments/            # Configuración de entornos
    ├── Local.bru           # Desarrollo local
    └── Production.bru      # Producción en AWS
```

#### Entornos Configurados:
- **Local**: `http://localhost:8000` (desarrollo)
- **Production**: `https://jwnazw2b41.execute-api.us-east-1.amazonaws.com/Prod`

### 🔄 Flujo de Testing Recomendado:

1. **Configuración inicial**:
   ```
   Initialize Funds → API Info → Health Check
   ```

2. **Autenticación**:
   ```
   Register → Login (obtiene token automáticamente)
   ```

3. **Gestión financiera**:
   ```
   Deposit Money → Get User Info (verificar balance)
   ```

4. **Inversiones**:
   ```
   List Funds → Subscribe to Fund → Get User Subscriptions
   ```

5. **Monitoreo**:
   ```
   Get User Transactions → Get User Info
   ```

## 🔒 Seguridad

### Autenticación y Autorización
- **JWT Tokens**: Autenticación stateless y segura
- **Bearer Authentication**: Estándar de la industria
- **Gestión automática de tokens**: Los tokens se guardan y usan automáticamente

### Validaciones
- **Montos de depósito**: Límites mínimos y máximos establecidos
- **Fondos suficientes**: Verificación antes de suscripciones
- **Datos de entrada**: Validación completa en frontend y backend

## 📱 Experiencia de Usuario

### Características UX/UI:
- **Interfaz moderna**: Diseño limpio y profesional
- **Responsive**: Adaptable a diferentes dispositivos
- **Feedback inmediato**: Confirmaciones y notificaciones en tiempo real
- **Navegación intuitiva**: Flujo lógico y fácil de seguir

### Notificaciones:
- **Email**: Confirmaciones y actualizaciones por correo
- **SMS**: Notificaciones importantes por mensaje de texto
- **Configurables**: El usuario elige su preferencia

## 🚀 Tecnologías Utilizadas

### Frontend:
- React 18+
- TypeScript
- Vite
- CSS3 moderno
- ESLint para calidad de código

### Backend:
- API RESTful
- JWT para autenticación
- Base de datos relacional
- AWS Lambda (serverless)
- API Gateway

### Testing:
- Bruno API Client
- Tests automatizados
- Entornos de desarrollo y producción

## 📈 Casos de Uso Principales

### 👨‍💼 Usuario Nuevo:
1. Se registra en la plataforma
2. Deposita dinero inicial
3. Explora fondos disponibles
4. Realiza su primera inversión
5. Monitorea su portafolio

### 👩‍💼 Usuario Experimentado:
1. Inicia sesión
2. Revisa su portafolio actual
3. Analiza nuevas oportunidades
4. Diversifica sus inversiones
5. Gestiona suscripciones existentes

### 🏢 Administrador:
1. Inicializa fondos de prueba
2. Monitorea la salud del sistema
3. Verifica transacciones
4. Gestiona la plataforma

## 🎯 Beneficios del Sistema

### Para Usuarios:
- **Acceso fácil**: Plataforma web accesible 24/7
- **Diversificación**: Múltiples opciones de inversión
- **Transparencia**: Información clara sobre fondos y transacciones
- **Control total**: Gestión completa de inversiones

### Para la Empresa:
- **Escalabilidad**: Arquitectura cloud-native
- **Mantenibilidad**: Código limpio y bien documentado
- **Testing robusto**: Cobertura completa de endpoints
- **Seguridad**: Implementación de mejores prácticas

## 🔮 Futuras Mejoras

- **Dashboard avanzado**: Gráficos y análisis de rendimiento
- **Notificaciones push**: Alertas en tiempo real
- **App móvil**: Aplicación nativa para iOS y Android
- **Integración bancaria**: Conexión directa con bancos
- **Asesoría automatizada**: Recomendaciones basadas en IA

---

*Invierte Ya - Haciendo las inversiones accesibles para todos* 🚀